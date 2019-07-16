<p align="center">
  <a href="https://kafka.apache.org/">
    <img alt="knack" src=".github/assets/knack-banner.png">
  </a>
</p>

<p align="center">
  A streamlined wrapper around <a href="https://github.com/Blizzard/node-rdkafka">node-rdkafka</a> made with independent composable parts.
</p>

<p align="center">
  <a href="https://github.com/xojs/xo"><img src="https://img.shields.io/badge/code_style-XO-5ed9c7.svg"></a>
  <a href="https://lerna.js.org/"><img src="https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg"></a>
</p>

## Packages

This repository is a monorepo that we manage using [Lerna](https://github.com/lerna/lerna). That means that we actually publish [several packages](/packages) to npm from the same codebase, including:

| name  |  version |
|---|---|
| [<b>`knack-avro`</b>](packages/knack-avro) | 1.0.0 |
|A module for encoding and decoding avro with Kafka.|
| [<b>`knack-client`</b>](packages/knack-client) |  1.0.0 |
|A module for interacting with Apache Kafka.|
| [<b>`knack-consumer`</b>](packages/knack-consumer) | 1.0.0 |
|A module for consuming messages from Apache Kafka.|
| [<b>`knack-consumer-client`</b>](packages/knack-consumer-client) | 1.0.0 |
|A module for consuming records with Apache Kafka.|
| [<b>`knack-producer`</b>](packages/knack-producer) | 1.0.0 |
|A module for publishing to Apache Kafka.|
| [<b>`knack-producer-client`</b>](packages/knack-producer-client) | 1.0.0 |
|A module for producing records with Apache Kafka.|
| [<b>`knack-sr`</b>](packages/knack-sr) | 1.0.0 |
|A module for interacting with the Kafka Schema Registry.|
| [<b>`knack-cli`</b>](packages/knack-cli) | 1.0.0 |
|A cli for working with Apache Kafka development.|

## Development

initialize lerna for all packages

```shell
$ lerna init
$ lerna bootstrap
```
## Contributing to the Project

The Knack team is open to contributions to our project. For more details, see our [Contribution Guide](.github/CONTRIBUTING.md).

© Optum 2019
