const {join} = require('path');
const test = require('ava');
const fs = require('fs-extra');
const {avscToAst, astToEsMappings} = require('..');

const testAvscFilePath = join(__dirname, 'testAvsc.json');
const testEsMappingsFilePath = join(__dirname, 'testEsMapping.json');

test('create es mapping from ast as expected', async t => {
	const avscSchemaJson = await fs.readJson(testAvscFilePath);
	const ast = avscToAst(avscSchemaJson);
	const esMappings = astToEsMappings(ast);
	const testEsMappings = await fs.readJson(testEsMappingsFilePath);
	t.is(JSON.stringify(esMappings), JSON.stringify(testEsMappings), 'result es mapping did not equal test es mapping');
});
