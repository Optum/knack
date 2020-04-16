const fsExtra = require('fs-extra');
const streams = require('@optum/knack-avro');

const {avscToEsMappings, avscToJsonSchema} = streams;

const formats = {
	es: {
		converter: avscToEsMappings
	},
	json: {
		converter: avscToJsonSchema
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

	await fsExtra.outputJson(outputPath, content, {
        spaces: 4
    });

	return {
		message: `avsc converted to ${format} & output to ${outputPath}`
	};
};

module.exports = main;
