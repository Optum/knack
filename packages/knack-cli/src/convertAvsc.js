const fsExtra = require('fs-extra');
const {streams} = require('@optum/knack-avro');

const {avscToEsMappings, avscToJsonSchema, avscToJoiObject} = streams;

const formats = {
	es: {
		converter: avscToEsMappings
	},
	json: {
		converter: avscToJsonSchema
	},
	joi: {
		converter: avscToJoiObject
	}
};

const main = async ({avsc: avscPath, format, output: outputPath}) => {
	if (!formats[format]) {
		return {
			errorMessage: `unsupported format: ${format}`
		};
	}

	const avroSchema = await fsExtra.readJson(avscPath);

	const content = formats[format].converter(avroSchema);

	await fsExtra.outputJson(outputPath, content);

	return {
		message: `avsc converted to ${format} & output to ${outputPath}`
	};
};

module.exports = main;
