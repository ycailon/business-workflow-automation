function checkSlaStatuses() {
  try {
    const sheet = SpreadsheetApp.getActive().getSheetByName(WORKFLOW.sheets.requests);
    if (!sheet || sheet.getLastRow() < 2) return;
    const settings = getSettings_();
    const range = sheet.getRange(2, 1, sheet.getLastRow() - 1, WORKFLOW.requestHeaders.length);
    const values = range.getValues();
    const now = new Date();
    const slaValues = [];
    const overdue = [];
    values.forEach(function(row) {
      const status = getSlaStatus(now, row[8], row[7], settings.dueSoonHours);
      slaValues.push([status]);
      if (status === 'Overdue') overdue.push(row);
    });
    sheet.getRange(2, WORKFLOW.slaStatusColumn, slaValues.length, 1).setValues(slaValues);
    if (settings.notificationsEnabled) sendOverdueDigest_(overdue);
    refreshDashboard();
  } catch (error) {
    logError_('checkSlaStatuses', error);
  }
}
