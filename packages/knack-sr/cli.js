#!/usr/bin/env node
const assert = require('assert').strict;
const SchemaRegistry = require('.');

const exampleSubject1 = 'test-client-topic-v1-key';
const exampleSchema1 = '{"type":"record","namespace":"example.io","name":"MessageKey","fields":[{"name":"id","type":"string"}]}';

const exampleSubject2 = 'test-client-topic-v1-value';
const exampleSchema2 = '{"type":"record","namespace":"example.io","name":"Message","fields":[{"name":"text","type":"string"}]}';

const main = async (exampleSubject, exampleSchema) => {
	const sr = new SchemaRegistry();

	const schema = await sr.registerSchema({
		subject: exampleSubject,
		schema: exampleSchema
	});

	let rSchema = await sr.getSchemaById(schema.id);

	assert.deepEqual(JSON.parse(rSchema.schema), JSON.parse(exampleSchema));

	rSchema = await sr.getSchemaBySubject(exampleSubject);

	assert.deepEqual(JSON.parse(rSchema.schema), JSON.parse(exampleSchema));

	console.log(`${exampleSubject} is registered`);

	return schema;
};

main(exampleSubject1, exampleSchema1)
	.then(() => main(exampleSubject2, exampleSchema2));
