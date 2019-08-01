const test = require('ava');
const nock = require('nock');
const KnackSr = require('..');

test.before('setup test', t => {
	t.context.stringAvroSchema = {
		id: 123,
		schema: '{"type": "string"}'
	};

	t.context.nockScopeKey = nock('http://localhost:8081')
		.get(`/schemas/ids/${t.context.stringAvroSchema.id}`)
		.reply(200, t.context.stringAvroSchema);

	t.pass();
});

test('get schema by schema id', async t => {
	const sr = new KnackSr();
	const schemaResponse = await sr.getSchemaById(t.context.stringAvroSchema.id);
	t.deepEqual(schemaResponse, t.context.stringAvroSchema);
});
