const assert = require('assert').strict;
const fs = require('fs-extra');
const KnackSr = require('@optum/knack-sr');

const main = async ({topic, type, avsc: avscPath}) => {
	const subject = `${topic}-${type}`;
	const sr = new KnackSr();
	const avroSchema = await fs.readJson(avscPath);

	const schema = await sr.registerSchema({
		subject,
		schema: avroSchema
	});

	let rSchema = await sr.getSchemaById(schema.id);

	assert.deepEqual(JSON.parse(rSchema.schema), avroSchema);

	rSchema = await sr.getSchemaBySubject(subject);

	assert.deepEqual(JSON.parse(rSchema.schema), avroSchema);

	return {
		message: `${subject} registered`
	};
};

module.exports = main;
