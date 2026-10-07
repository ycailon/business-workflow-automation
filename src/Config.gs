const WORKFLOW = {
  sheets: {
    requests: 'Requests',
    config: 'Config',
    audit: 'Audit_Log',
    dashboard: 'Dashboard',
    errors: 'Errors'
  },
  requestHeaders: [
    'Request ID', 'Submitted At', 'Requester Name', 'Requester Email', 'Request Type',
    'Priority', 'Owner', 'Status', 'Due At', 'SLA Status', 'Completed At', 'Notes', 'Last Updated'
  ],
  configHeaders: ['Type', 'Key', 'Value'],
  auditHeaders: ['Timestamp', 'Request ID', 'Event', 'Previous Value', 'New Value', 'Actor'],
  errorHeaders: ['Timestamp', 'Function', 'Error', 'Stack'],
  statusColumn: 8,
  slaStatusColumn: 10,
  completedAtColumn: 11,
  lastUpdatedColumn: 13
};
