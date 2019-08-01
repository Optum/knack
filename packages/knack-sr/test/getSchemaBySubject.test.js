const test = require('ava');
const nock = require('nock');
const KnackSr = require('..');

test.before('setup test', t => {
	t.context.testSubject = 'unit-test-subject';

	t.context.stringAvroSchema = {
		id: 123,
		schema: '{"type": "string"}'
	};

	t.context.nockScopeKey = nock('http://localhost:8081')
		.get(`/subjects/${t.context.testSubject}/versions/latest`)
		.reply(200, t.context.stringAvroSchema);

	t.pass();
});

test('get schema by subject', async t => {
	const sr = new KnackSr();
	const schemaResponse = await sr.getSchemaBySubject(t.context.testSubject);
	t.deepEqual(schemaResponse, t.context.stringAvroSchema);
});
