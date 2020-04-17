const fsExtra = require('fs-extra');
const streams = require('@optum/knack-avro');

const {jsonSchemaToAvsc} = streams;

const main = async ({json: jsonSchemaPath, output: outputPath}) => {
	const jsonSchema = await fsExtra.readJson(jsonSchemaPath);

	const content = jsonSchemaToAvsc(jsonSchema);

	await fsExtra.outputJson(outputPath, content, {
		spaces: 4
	});

	return {
		message: `json schema converted to avro & output to ${outputPath}`
	};
};

module.exports = main;
