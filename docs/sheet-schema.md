# Sheet schema

## Requests

The operational queue stores request ID, submitted time, requester, request type, priority, owner, status, SLA due time/status, completion time, notes and last-updated timestamp.

## Config

Three-column configuration table:

- `SLA | <priority> | <hours>`
- `OWNER | <request type> | <email>`
- `SETTING | <setting name> | <value>`

## Audit_Log

Stores timestamp, request ID, event, previous value, new value and actor.

## Dashboard

Generated summary of request counts by workflow/SLA status.

## Errors

Trigger/runtime failures with timestamp, function name, error and stack trace.
