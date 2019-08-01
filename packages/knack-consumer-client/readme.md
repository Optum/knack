<h2 align="center">
  knack-consumer-client
</h2>

<p align="center">
  A module for consuming records from Apache Kafka with integrated avro support.
</p>

<p align="center">
  <a href="https://github.com/xojs/xo"><img src="https://img.shields.io/badge/code_style-XO-5ed9c7.svg"></a>
</p>

## Usage

<b>first things first...</b>

```shell
$ npm i @optum/knack-consumer-client
```

<b>options</b>

- subscriptions: `Array` array of subscription objects
    + subscription: `[Object]` consumer subscription info
        * topic: `[String]` name of topic
        * handler: `[Function]` handler for each record consumed
- consumerConfig: `[Object]` librd consumer config
- topicConfig: `[Object]` librd topic config
- flowMode: `[Boolean]`  run flow mode or control message intake cadence
- logger: `[Object]`  logger object with trace, debug, info, error methods
- srOptions: `[Object]`: options to pass to knack-sr

## Examples

```js
const knackConsumerClient = require('@optum/knack-consumer-client');

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
const testConsumer = await knackConsumerClient.connect({
    subscriptions: [{
        topic,
        handler
    }],
    consumerConfig,
    topicConfig,
    srOptions: {
        url: 'http://localhost:8081'
    }
});

process.on('SIGINT', async () => {
    await knackConsumerClient.disconnect();
});
```



