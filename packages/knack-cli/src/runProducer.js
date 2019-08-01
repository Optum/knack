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

const main = async (keyFilePath, valuefilePath, topic, count, producerConfigPath) => {
	const key = await resolveContent(keyFilePath);
	const value = await resolveContent(valuefilePath);

	let producer;

	if (producerConfigPath) {
		const producerConfig = await resolveContent(producerConfigPath);
		producer = await KnackProducerClient.resolveInstance({producerConfig});
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

