<h2 align="center">
  knack-producer
</h2>

<p align="center">
  A module for publishing to Apache Kafka.
</p>

<p align="center">
     <a href="https://www.npmjs.com/package/@optum/knack-producer"><img src="https://img.shields.io/npm/v/@optum/knack-producer?color=blue"></a>
  <a href="https://github.com/xojs/xo"><img src="https://img.shields.io/badge/code_style-XO-5ed9c7.svg"></a>
</p>

## Usage

<b>first things first...</b>

```shell
$ npm i @optum/knack-producer node-rdkafka@2.7
```

`node-rdkafka` is now a peer dependency to give flexibility in versions

<b>options</b>

- producerConfig: `[Object]` librd producer config

## Examples

```js
const {
	KnackProducer,
	KnackHighLevelProducer
} = require("@optum/knack-producer");

const options = {
	producerConfig: {
		"metadata.broker.list": ["localhost:9092"]
	}
};

// example data
const topic = "knack-test-topic-v1";
const key = Buffer.from("key-001");
const value = Buffer.from("hello from knack producer");

// use standard producer
const knackProducer = new KnackProducer(options);
await knackProducer.connect();

knackProducer.produce(topic, null, value, key, Date.now());

// use high level producer
const knackHighLevelProducer = new KnackHighLevelProducer(options);
await knackHighLevelProducer.connect();

producer.produceAsync(topic, null, value, key);

knackHighLevelProducer.produce(
	topic,
	null,
	value,
	key,
	Date.now(),
	(err, offset) => {
		// The offset if our acknowledgement level allows us to receive delivery offsets
		console.log(offset);
	}
);
```
