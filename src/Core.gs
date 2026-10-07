function normalizeText(value) {
  return String(value == null ? '' : value).trim().replace(/\s+/g, ' ');
}

function normalizePriority(value) {
  const cleaned = normalizeText(value).toLowerCase();
  const aliases = { low: 'Low', normal: 'Normal', medium: 'Normal', high: 'High', urgent: 'Urgent' };
  return aliases[cleaned] || 'Normal';
}

function normalizeStatus(value) {
  const cleaned = normalizeText(value).toLowerCase();
  const values = {
    'new': 'New',
    'in progress': 'In Progress',
    'waiting': 'Waiting',
    'completed': 'Completed',
    'cancelled': 'Cancelled'
  };
  return values[cleaned] || 'New';
}

function makeRequestId(timestamp, sequence) {
  const date = new Date(timestamp);
  const yyyy = date.getUTCFullYear();
  const mm = String(date.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(date.getUTCDate()).padStart(2, '0');
  return `REQ-${yyyy}${mm}${dd}-${String(sequence).padStart(4, '0')}`;
}

function calculateDueAt(submittedAt, priority, slaHours) {
  const hours = Number(slaHours[normalizePriority(priority)] || slaHours.Normal || 48);
  return new Date(new Date(submittedAt).getTime() + hours * 60 * 60 * 1000);
}

function getSlaStatus(now, dueAt, requestStatus, dueSoonHours) {
  const status = normalizeStatus(requestStatus);
  if (status === 'Completed') return 'Completed';
  if (status === 'Cancelled') return 'Cancelled';
  const remaining = new Date(dueAt).getTime() - new Date(now).getTime();
  if (remaining < 0) return 'Overdue';
  if (remaining <= Number(dueSoonHours || 4) * 60 * 60 * 1000) return 'Due Soon';
  return 'On Track';
}

function isValidStatusTransition(fromStatus, toStatus) {
  const from = normalizeStatus(fromStatus);
  const to = normalizeStatus(toStatus);
  const allowed = {
    'New': ['New', 'In Progress', 'Cancelled'],
    'In Progress': ['In Progress', 'Waiting', 'Completed', 'Cancelled'],
    'Waiting': ['Waiting', 'In Progress', 'Completed', 'Cancelled'],
    'Completed': ['Completed'],
    'Cancelled': ['Cancelled']
  };
  return allowed[from].indexOf(to) !== -1;
}

function normalizeRequest(input) {
  return {
    requester_name: normalizeText(input.requester_name),
    requester_email: normalizeText(input.requester_email).toLowerCase(),
    request_type: normalizeText(input.request_type),
    priority: normalizePriority(input.priority),
    notes: normalizeText(input.notes)
  };
}
