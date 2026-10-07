# Setup

1. Create a blank Google Sheet.
2. Open **Extensions -> Apps Script**.
3. Add each file from `src/` to the Apps Script project, including `appsscript.json`.
4. Run `setupWorkbook()` once and approve the requested permissions.
5. Review the generated `Config` sheet and replace example owner addresses.
6. Keep `notifications_enabled` set to `false` while testing.
7. Run `seedDemoData()` if you want sample requests without a Google Form.
8. Run `installWorkflowTriggers()` when you are ready for automatic form/edit/SLA processing.
9. Only enable notifications after owner routing is correct.

For local source synchronization, copy `.clasp.example.json` to `.clasp.json`, add the Apps Script project ID, install `@google/clasp`, authenticate, and use `clasp push`/`clasp pull`.
