const {join} = require('path');
const test = require('ava');
const fs = require('fs-extra');
const {avscToAst, astToJsonSchema} = require('..');

const testAvscFilePath = join(__dirname, 'testAvsc.json');
const testJsonSchemaFilePath = join(__dirname, 'testJsonSchema.json');

test('create json schema from ast as expected', async t => {
	const avscSchemaJson = await fs.readJson(testAvscFilePath);
	const ast = avscToAst(avscSchemaJson);
	const jsonSchema = astToJsonSchema(ast);
	const testJsonSchema = await fs.readJson(testJsonSchemaFilePath);
	t.is(JSON.stringify(jsonSchema), JSON.stringify(testJsonSchema), 'result json schema did not equal test json schema');
});
