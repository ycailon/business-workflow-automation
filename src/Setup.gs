function ensureSheet_(name, headers) {
  const ss = SpreadsheetApp.getActive();
  let sheet = ss.getSheetByName(name);
  if (!sheet) sheet = ss.insertSheet(name);
  if (headers && headers.length) {
    const current = sheet.getRange(1, 1, 1, headers.length).getValues()[0];
    if (current.join('|') !== headers.join('|')) {
      sheet.clear();
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      sheet.setFrozenRows(1);
    }
  }
  return sheet;
}

function setupWorkbook() {
  ensureSheet_(WORKFLOW.sheets.requests, WORKFLOW.requestHeaders);
  const configSheet = ensureSheet_(WORKFLOW.sheets.config, WORKFLOW.configHeaders);
  ensureSheet_(WORKFLOW.sheets.audit, WORKFLOW.auditHeaders);
  ensureSheet_(WORKFLOW.sheets.dashboard, []);
  ensureSheet_(WORKFLOW.sheets.errors, WORKFLOW.errorHeaders);

  if (configSheet.getLastRow() === 1) {
    configSheet.getRange(2, 1, 9, 3).setValues([
      ['SLA', 'Low', '72'], ['SLA', 'Normal', '48'], ['SLA', 'High', '24'], ['SLA', 'Urgent', '8'],
      ['OWNER', 'Finance', 'finance@example.com'], ['OWNER', 'Operations', 'operations@example.com'],
      ['OWNER', 'DEFAULT', 'admin@example.com'], ['SETTING', 'notifications_enabled', 'false'], ['SETTING', 'due_soon_hours', '4']
    ]);
  }

  formatRequestsSheet_();
  refreshDashboard();
  SpreadsheetApp.getActive().toast('Workflow sheets are ready.');
}

function formatRequestsSheet_() {
  const sheet = SpreadsheetApp.getActive().getSheetByName(WORKFLOW.sheets.requests);
  const statusRule = SpreadsheetApp.newDataValidation().requireValueInList(['New', 'In Progress', 'Waiting', 'Completed', 'Cancelled'], true).setAllowInvalid(false).build();
  sheet.getRange(2, WORKFLOW.statusColumn, Math.max(sheet.getMaxRows() - 1, 1), 1).setDataValidation(statusRule);
}

function installWorkflowTriggers() {
  const spreadsheet = SpreadsheetApp.getActive();
  ScriptApp.getProjectTriggers().forEach(function(trigger) {
    if (['handleFormSubmit', 'handleRequestEdit', 'checkSlaStatuses'].indexOf(trigger.getHandlerFunction()) !== -1) ScriptApp.deleteTrigger(trigger);
  });
  ScriptApp.newTrigger('handleFormSubmit').forSpreadsheet(spreadsheet).onFormSubmit().create();
  ScriptApp.newTrigger('handleRequestEdit').forSpreadsheet(spreadsheet).onEdit().create();
  ScriptApp.newTrigger('checkSlaStatuses').timeBased().everyHours(1).create();
  SpreadsheetApp.getActive().toast('Workflow triggers installed.');
}
