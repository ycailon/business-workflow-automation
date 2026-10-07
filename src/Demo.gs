function seedDemoData() {
  const examples = [
    { requester_name: 'Ana Reyes', requester_email: 'ana@example.com', request_type: 'Finance', priority: 'High', notes: 'Review invoice exception' },
    { requester_name: 'Miguel Santos', requester_email: 'miguel@example.com', request_type: 'Operations', priority: 'Normal', notes: 'Update supplier details' },
    { requester_name: 'Lia Cruz', requester_email: 'lia@example.com', request_type: 'Finance', priority: 'Urgent', notes: 'Payment posting issue' }
  ];
  examples.forEach(function(item) { createRequest_(normalizeRequest(item), new Date()); });
  refreshDashboard();
}
