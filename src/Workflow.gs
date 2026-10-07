function nextRequestId_(timestamp) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const properties = PropertiesService.getScriptProperties();
    const date = Utilities.formatDate(new Date(timestamp), Session.getScriptTimeZone(), 'yyyyMMdd');
    const propertyKey = 'request_sequence_' + date;
    const next = Number(properties.getProperty(propertyKey) || '0') + 1;
    properties.setProperty(propertyKey, String(next));
    return makeRequestId(timestamp, next);
  } finally {
    lock.releaseLock();
  }
}

function requestFromNamedValues_(namedValues) {
  function first(name) { const value = namedValues[name]; return Array.isArray(value) ? value[0] : value; }
  return normalizeRequest({
    requester_name: first('Requester Name') || first('Name'),
    requester_email: first('Requester Email') || first('Email'),
    request_type: first('Request Type') || first('Type'),
    priority: first('Priority'),
    notes: first('Notes') || first('Description')
  });
}

function createRequest_(request, timestamp) {
  const settings = getSettings_();
  const submittedAt = timestamp || new Date();
  const dueAt = calculateDueAt(submittedAt, request.priority, settings.slaHours);
  const owner = getOwnerForType_(request.request_type, settings);
  const requestId = nextRequestId_(submittedAt);
  const slaStatus = getSlaStatus(new Date(), dueAt, 'New', settings.dueSoonHours);
  const row = [requestId, submittedAt, request.requester_name, request.requester_email, request.request_type, request.priority, owner, 'New', dueAt, slaStatus, '', request.notes, new Date()];
  const sheet = SpreadsheetApp.getActive().getSheetByName(WORKFLOW.sheets.requests);
  sheet.appendRow(row);
  appendAudit_(requestId, 'request_created', '', 'New', request.requester_email);
  if (settings.notificationsEnabled && owner) sendOwnerNotification_(row);
  return requestId;
}

function handleFormSubmit(e) {
  try {
    if (!e || !e.namedValues) throw new Error('Form submit event did not include namedValues.');
    const request = requestFromNamedValues_(e.namedValues);
    createRequest_(request, e.values && e.values[0] ? new Date(e.values[0]) : new Date());
    refreshDashboard();
  } catch (error) {
    logError_('handleFormSubmit', error);
    throw error;
  }
}

function handleRequestEdit(e) {
  try {
    if (!e || !e.range) return;
    const sheet = e.range.getSheet();
    if (sheet.getName() !== WORKFLOW.sheets.requests || e.range.getRow() === 1) return;
    const row = e.range.getRow();
    const column = e.range.getColumn();
    const requestId = sheet.getRange(row, 1).getValue();
    if (column === WORKFLOW.statusColumn) {
      const oldStatus = e.oldValue || 'New';
      const newStatus = e.value || 'New';
      if (!isValidStatusTransition(oldStatus, newStatus)) {
        sheet.getRange(row, column).setValue(oldStatus);
        SpreadsheetApp.getActive().toast('Invalid status transition: ' + oldStatus + ' -> ' + newStatus);
        return;
      }
      if (normalizeStatus(newStatus) === 'Completed') sheet.getRange(row, WORKFLOW.completedAtColumn).setValue(new Date());
      appendAudit_(requestId, 'status_changed', oldStatus, newStatus, Session.getActiveUser().getEmail());
    }
    sheet.getRange(row, WORKFLOW.lastUpdatedColumn).setValue(new Date());
    refreshDashboard();
  } catch (error) {
    logError_('handleRequestEdit', error);
  }
}
