function sendOwnerNotification_(row) {
  const owner = row[6];
  if (!owner) return;
  MailApp.sendEmail({
    to: owner,
    subject: 'New request ' + row[0] + ' - ' + row[4],
    body: 'A new ' + row[5] + ' priority request was assigned to you.\n\nRequest: ' + row[0] + '\nDue: ' + row[8] + '\nNotes: ' + row[11]
  });
}

function sendOverdueDigest_(rows) {
  const grouped = {};
  rows.forEach(function(row) {
    const owner = row[6];
    if (!owner) return;
    if (!grouped[owner]) grouped[owner] = [];
    grouped[owner].push(row);
  });

  Object.keys(grouped).forEach(function(owner) {
    const body = grouped[owner].map(function(row) {
      return row[0] + ' | ' + row[4] + ' | ' + row[5] + ' | due ' + row[8];
    }).join('\n');
    MailApp.sendEmail({
      to: owner,
      subject: 'Overdue request digest (' + grouped[owner].length + ')',
      body: body
    });
  });
}
