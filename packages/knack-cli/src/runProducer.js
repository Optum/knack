const fs = require('fs-extra');
const KnackProducerClient = require('@optum/knack-producer-client');

const tryParse = str => {
	try {
		return JSON.parse(str);
	} catch (_) {
		return str;
	}
};

const resolveContent = async filePath => {
	if (filePath) {
		return tryParse(await fs.readFile(filePath));
	}
};

const main = async ({
	key: keyFilePath,
	value: valuefilePath,
	topic,
	count,
	producerConfig: producerConfigPath,
	srUrl
}) => {
	const key = await resolveContent(keyFilePath);
	const value = await resolveContent(valuefilePath);

	let producer;
	let knackProducerConfig;

	if (producerConfigPath) {
		const producerConfig = await resolveContent(producerConfigPath);
		knackProducerConfig = {producerConfig};
		producer = await KnackProducerClient.resolveInstance({producerConfig});
	} else {
		producer = await KnackProducerClient.resolveInstance();
	}

	if (srUrl) {
		knackProducerConfig.srOptions = {
			url: srUrl
		};
	}

	if (knackProducerConfig) {
		producer = await KnackProducerClient.resolveInstance(knackProducerConfig);
	} else {
		producer = await KnackProducerClient.resolveInstance();
	}

	const tasks = [];

	for (let i = 1; i <= count; i++) {
		tasks.push(producer.publish({
			topic,
			key,
			value
		}));
	}

	await Promise.all(tasks);

	await KnackProducerClient.disconnectInstances();

	return {
		message: `${tasks.length} message(s) sent to ${topic}`
	};
};

module.exports = main;

