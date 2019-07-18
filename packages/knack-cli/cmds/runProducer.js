const fs = require('fs-extra');
const KnackProducerClient = require('knack-producer-client');

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

const main = async (keyFilePath, valuefilePath, topic, count) => {
	const key = await resolveContent(keyFilePath);
	const value = await resolveContent(valuefilePath);

	// TODO: make producer and topic config configurable
	await KnackProducerClient.connectInstance();

	const producer = KnackProducerClient.instance();

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

