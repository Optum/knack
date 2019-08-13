const {join} = require('path');
const test = require('ava');
const fs = require('fs-extra');
const {avscToAst} = require('..');

const testAvscFilePath = join(__dirname, 'testAvsc.json');
const testAstFilePath = join(__dirname, 'testAst.json');

test('create ast from avsc as expected', async t => {
	const avscSchemaJson = await fs.readJson(testAvscFilePath);
	const ast = avscToAst(avscSchemaJson);
	const testAst = await fs.readJson(testAstFilePath);
	t.is(JSON.stringify(ast), JSON.stringify(testAst), 'result ast did not equal test ast');
});
