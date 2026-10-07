function refreshDashboard() {
  const ss = SpreadsheetApp.getActive();
  const requests = ss.getSheetByName(WORKFLOW.sheets.requests);
  const dashboard = ss.getSheetByName(WORKFLOW.sheets.dashboard);
  dashboard.clear();
  dashboard.getRange(1, 1, 1, 2).setValues([['Metric', 'Count']]);

  if (!requests || requests.getLastRow() < 2) {
    dashboard.getRange(2, 1, 1, 2).setValues([['Total Requests', 0]]);
    return;
  }

  const rows = requests.getRange(2, 1, requests.getLastRow() - 1, WORKFLOW.requestHeaders.length).getValues();
  const counts = { total: rows.length, open: 0, completed: 0, overdue: 0, dueSoon: 0 };
  rows.forEach(function(row) {
    const status = normalizeStatus(row[7]);
    if (status === 'Completed') counts.completed += 1;
    if (status !== 'Completed' && status !== 'Cancelled') counts.open += 1;
    if (row[9] === 'Overdue') counts.overdue += 1;
    if (row[9] === 'Due Soon') counts.dueSoon += 1;
  });

  dashboard.getRange(2, 1, 5, 2).setValues([
    ['Total Requests', counts.total],
    ['Open Requests', counts.open],
    ['Completed', counts.completed],
    ['Overdue', counts.overdue],
    ['Due Soon', counts.dueSoon]
  ]);
}
