const KafkaConsumerClient = require('knack-consumer-client');
const KafkaProducerClient = require('knack-producer-client');

// Convenient wrap up package if an app needs all things Kafka
module.exports = {
	KafkaConsumerClient,
	KafkaProducerClient
};
