const test = require('ava');
const {avscToAst} = require('..');

test('avscToAst should throw because it is no longer used', t => {
	t.throws(avscToAst);
});
