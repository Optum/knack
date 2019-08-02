const fsExtra = require('fs-extra');
const createStream = require('p-pipe');

const {avscToAst, astToEsMapping} = require('./converters');

const formats = {
	es: {
		converter: createStream(avscToAst, astToEsMapping)
	}
};

const main = async ({avsc: avscPath, format, output: outputPath}) => {
	if (!formats[format]) {
		return {
			errorMessage: `unsupported format: ${format}`
		};
	}

	const avroSchema = await fsExtra.readJson(avscPath);

	const content = await formats[format].converter(avroSchema);

	await fsExtra.outputJson(outputPath, content);

	return {
		message: `avsc converted to ${format} & output to ${outputPath}`
	};
};

module.exports = main;
