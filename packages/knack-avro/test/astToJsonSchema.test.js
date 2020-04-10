const test = require('ava');
const {astToJsonSchema} = require('..');

test('astToJsonSchema should throw because it is no longer used', t => {
	t.throws(astToJsonSchema);
});
