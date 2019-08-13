const {KnackProducer} = require('@optum/knack-producer');

const main = async ({brokers}) => {
	try {
		const config = {
			producerConfig: {
				'metadata.broker.list': brokers
			}
		};

		const checks = {
			connected: false,
			gotMetadata: false,
			brokers: []
		};

		const knackProducer = new KnackProducer(config);

		await knackProducer.connect();
		checks.connected = true;

		const metadata = await knackProducer.readMetadata();
		checks.gotMetadata = true;
		checks.brokers = metadata.brokers;

		await knackProducer.disconnect();

		return {
			message: JSON.stringify(checks, null, 2)
		};
	} catch (error) {
		return {
			errorMessage: `Error running check-kafka. brokers: ${brokers.join(',')}`,
			error
		};
	}
};

module.exports = main;
