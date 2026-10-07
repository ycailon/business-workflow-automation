# Engineering decisions

## Installable triggers for real workflow actions

The menu uses a simple `onOpen`, but form submission, editing and scheduled SLA checks use installable triggers because they can use services that require authorization.

## Script Properties for counters, not hidden cells

Daily request-number state belongs to the script rather than a user-editable cell.

## Lock request-ID generation

Multiple users or trigger executions can arrive close together. `LockService.getScriptLock()` protects the sequence update so two executions do not issue the same request ID.

## Notifications are opt-in

Email is disabled until an operator explicitly enables it in configuration.

## Keep an audit log

Operational state changes should be recoverable outside the current cell value.
