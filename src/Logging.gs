function appendAudit_(requestId, eventName, previousValue, newValue, actor) {
  const sheet = SpreadsheetApp.getActive().getSheetByName(WORKFLOW.sheets.audit);
  sheet.appendRow([new Date(), requestId, eventName, previousValue || '', newValue || '', actor || 'system']);
}

function logError_(functionName, error) {
  const sheet = SpreadsheetApp.getActive().getSheetByName(WORKFLOW.sheets.errors);
  if (!sheet) return;
  sheet.appendRow([new Date(), functionName, String(error), error && error.stack ? error.stack : '']);
}
