const fs = require('fs');
const path = require('path');
const vm = require('vm');
const assert = require('assert');

const context = { console, Date, Number, String, Array, Object, Math, Error };
vm.createContext(context);
const core = fs.readFileSync(path.join(__dirname, '..', 'src', 'Core.gs'), 'utf8');
vm.runInContext(core, context);

let passed = 0;
function test(name, fn) {
  try { fn(); passed += 1; console.log('PASS', name); }
  catch (error) { console.error('FAIL', name); throw error; }
}

test('normalizes priority aliases', () => {
  assert.strictEqual(context.normalizePriority(' medium '), 'Normal');
  assert.strictEqual(context.normalizePriority('URGENT'), 'Urgent');
});

test('builds request ids', () => {
  assert.strictEqual(context.makeRequestId('2026-10-07T00:00:00Z', 12), 'REQ-20261007-0012');
});

test('calculates SLA due date', () => {
  const due = context.calculateDueAt('2026-10-07T00:00:00Z', 'High', {Low:72, Normal:48, High:24, Urgent:8});
  assert.strictEqual(due.toISOString(), '2026-10-08T00:00:00.000Z');
});

test('classifies SLA status', () => {
  assert.strictEqual(context.getSlaStatus('2026-10-07T10:00:00Z', '2026-10-07T12:00:00Z', 'New', 4), 'Due Soon');
  assert.strictEqual(context.getSlaStatus('2026-10-07T13:00:00Z', '2026-10-07T12:00:00Z', 'In Progress', 4), 'Overdue');
  assert.strictEqual(context.getSlaStatus('2026-10-07T13:00:00Z', '2026-10-07T12:00:00Z', 'Completed', 4), 'Completed');
});

test('enforces status transitions', () => {
  assert.strictEqual(context.isValidStatusTransition('New', 'In Progress'), true);
  assert.strictEqual(context.isValidStatusTransition('New', 'Completed'), false);
  assert.strictEqual(context.isValidStatusTransition('Completed', 'In Progress'), false);
});

test('normalizes request fields', () => {
  const request = context.normalizeRequest({requester_name:'  Maria   Santos ',requester_email:' MARIA@EXAMPLE.COM ',request_type:' Finance ',priority:'high',notes:'  invoice   issue '});
  assert.deepStrictEqual(JSON.parse(JSON.stringify(request)), {requester_name:'Maria Santos',requester_email:'maria@example.com',request_type:'Finance',priority:'High',notes:'invoice issue'});
});

console.log(`\n${passed} tests passed`);
