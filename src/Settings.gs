function getSettings_() {
  const sheet = SpreadsheetApp.getActive().getSheetByName(WORKFLOW.sheets.config);
  const values = sheet.getDataRange().getValues();
  const slaHours = { Low: 72, Normal: 48, High: 24, Urgent: 8 };
  const owners = {};
  let notificationsEnabled = false;
  let dueSoonHours = 4;

  values.slice(1).forEach(function(row) {
    const type = normalizeText(row[0]).toUpperCase();
    const key = normalizeText(row[1]);
    const value = row[2];
    if (type === 'SLA') slaHours[normalizePriority(key)] = Number(value);
    if (type === 'OWNER') owners[key] = normalizeText(value);
    if (type === 'SETTING' && key === 'notifications_enabled') notificationsEnabled = String(value).toLowerCase() === 'true';
    if (type === 'SETTING' && key === 'due_soon_hours') dueSoonHours = Number(value) || 4;
  });

  return { slaHours: slaHours, owners: owners, notificationsEnabled: notificationsEnabled, dueSoonHours: dueSoonHours };
}

function getOwnerForType_(requestType, settings) {
  return settings.owners[requestType] || settings.owners.DEFAULT || '';
}
