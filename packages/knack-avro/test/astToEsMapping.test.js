const test = require('ava');
const {astToEsMappings} = require('..');

test('astToEsMapping should throw because it is no longer used', t => {
	t.throws(astToEsMappings);
});
