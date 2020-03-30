<h2 align="center">
  knack-producer-client
</h2>

<p align="center">
  A module for publishing records to Apache Kafka with integrated avro support.
</p>

<p align="center">
 <a href="https://www.npmjs.com/package/@optum/knack-producer-client"><img src="https://img.shields.io/npm/v/@optum/knack-producer-client?color=blue"></a>
  <a href="https://github.com/xojs/xo"><img src="https://img.shields.io/badge/code_style-XO-5ed9c7.svg"></a>
</p>

## Usage

<b>first things first...</b>

```shell
$ npm i @optum/knack-producer-client node-rdkafka@2.7
```

<b>options</b>

- useHighLevelProducer: `[Boolean]` flag indicating to use the highlevel producer over the standard one
- producerConfig: `[Object]` librd producer config
- srOptions: `[Object]`: options to pass to knack-sr

## Examples

<b>simple</b>

```js
const KnackProducerClient = require("@optum/knack-producer-client");

const options = {
	producerConfig: {
		"metadata.broker.list": ["localhost:9092"]
	},
	srOptions: {
		url: "http://localhost:8081"
	}
};

const topic = "knack-test-topic-v1";
const key = { id: "1234" };
const value = { content: "from knack producer client" };

// await getting the producer so it lazy loads a connection the first time a message goes through
const producer = await KnackProducerClient.resolveInstance(options);

producer.publish({
	topic,
	key,
	value
});

// calling for an instance with the same options with give back the same producer, so it will manage different connections for you
const queued = KnackProducerClient.resolveInstance(options).publish({
	topic,
	key,
	value
});
```

<b>also simple, but one more step</b>

```js
const KnackProducerClient = require("@optum/knack-producer-client");

const options = {
	producerConfig: {
		"metadata.broker.list": ["localhost:9092"]
	},
	srOptions: {
		url: "http://localhost:8081"
	}
};

const topic = "knack-test-topic-v1";
const key = { id: "1234" };
const value = { content: "from knack producer client" };

// connect at app start up or whenever
await KnackProducerClient.connectInstance(options);

// grab the producer through the instance method without needing to await it
const producer = KnackProducerClient.instance(options);

producer.publish({
	topic,
	key,
	value
});
```
