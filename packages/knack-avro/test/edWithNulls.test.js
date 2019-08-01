const {join} = require('path');
const test = require('ava');
const fs = require('fs-extra');
const {fromAvroBuffer, toAvroBuffer} = require('..');

const testAvscFilePath = join(__dirname, 'testAvsc.json');
const testDataWithNullsFilePath = join(__dirname, 'testDataWithNulls.json');

test('encode decode data with null defaults', async t => {
	const avscSchemaJson = await fs.readJson(testAvscFilePath);
	const dataJson = await fs.readJson(testDataWithNullsFilePath);
	const placeHolderSchemaId = 123;

	const msgBuffer = toAvroBuffer(dataJson, avscSchemaJson, placeHolderSchemaId);
	t.true(msgBuffer.length > 0, 'expected buffer size range to meet');

	const {value} = fromAvroBuffer(avscSchemaJson, msgBuffer);
	t.truthy(value, 'value must be defined');

	t.is(value.content, dataJson.content, 'input did not matchout output');
	t.is(value.channel, null, 'input did not matchout output');
});
