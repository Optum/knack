const {join} = require('path');
const test = require('ava');
const fs = require('fs-extra');
const avsc = require('avsc');
const {toJsonSchema} = require('..');

const testAvscFilePath = join(__dirname, 'testAvsc.json');
const testJsonSchemaFilePath = join(__dirname, 'testJsonSchema.json');

test('create json schema from avsc type as expected', async t => {
	const avscTypeJson = await fs.readJson(testAvscFilePath);
	const avscType = avsc.Type.forSchema(avscTypeJson);

	const jsonSchema = toJsonSchema(avscType);

	const testJsonSchema = await fs.readJson(testJsonSchemaFilePath);
	t.is(JSON.stringify(jsonSchema), JSON.stringify(testJsonSchema), 'result json schema did not equal test json schema');
});
