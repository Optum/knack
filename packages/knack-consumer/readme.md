<h2 align="center">
  knack-consumer
</h2>

<p align="center">
  A module for consuming messages from Apache Kafka.
</p>

<p align="center">
    <a href="https://www.npmjs.com/package/@optum/knack-consumer"><img src="https://img.shields.io/npm/v/@optum/knack-consumer?color=blue"></a>
  <a href="https://github.com/xojs/xo"><img src="https://img.shields.io/badge/code_style-XO-5ed9c7.svg"></a>
</p>

## Usage

<b>first things first...</b>

```shell
$ npm i @optum/knack-consumer
```

<b>options</b>

- topics: `[Array]` array of topics to subscribe
- consumerConfig: `[Object]` librd consumer config
- topicConfig: `[Object]` librd topic config
- flowMode: `[Boolean]`  run flow mode or control message intake cadence
- logger: `[Object]`  logger object with trace, debug, info, error methods
- onData: `Function` handler for each record consumed

## Examples

```js
const knackConsumer = require('@optum/knack-consumer');

const consumerConfig = {
    'client.id': 'my-kafka-client-v1',
    'group.id': 'my-kafka-group-v1',
    'metadata.broker.list': 'localhost:9092',
    'socket.keepalive.enable': true,
    'enable.auto.commit': true
};

const topicConfig = {
    'auto.offset.reset': 'earliest',
    // eslint-disable-next-line camelcase
    event_cb: () => {}
};

const topic = 'knack-test-topic-v1';

const handler = ({key, value, topic, timestamp}) => {
    // do stuff with record
};

// connect consumer with options
const testConsumer = await knackConsumer.connect({
    topics: [topic],
    consumerConfig,
    topicConfig,
    onData: handler
});

process.on('SIGINT', async () => {
    await knackConsumer.disconnect();
});
```

