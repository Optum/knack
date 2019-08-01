const {join} = require('path');
const test = require('ava');
const fs = require('fs-extra');
const {fromAvroBuffer, toAvroBuffer} = require('..');

const testAvscFilePath = join(__dirname, 'testAvsc.json');
const testDataFilePath = join(__dirname, 'testData.json');

test('encode decode data with no nulls', async t => {
	const avscSchemaJson = await fs.readJson(testAvscFilePath);
	const dataJson = await fs.readJson(testDataFilePath);
	const placeHolderSchemaId = 123;

	const msgBuffer = toAvroBuffer(dataJson, avscSchemaJson, placeHolderSchemaId);
	t.true(msgBuffer.length > 0, 'expected buffer size range to meet');

	const {value} = fromAvroBuffer(avscSchemaJson, msgBuffer);
	t.truthy(value, 'value must be defined');

	t.is(value.content, dataJson.content, 'input did not matchout output');
	t.is(!value.channel, !dataJson.channel, 'input did not matchout output');
});
