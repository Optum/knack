# Archived Repository

Thanks for your interest in Optum’s knack project! Unfortunately, we have moved on and this project is no longer actively maintained or monitored by our Open Source Program Office. This copy is provided for reference only. Please fork the code if you are interested in further development. The project and all artifacts including code and documentation remain subject to use and reference under the terms and conditions of the open source license indicated. All copyrights reserved.


<p align="center">
  <a href="https://kafka.apache.org/">
    <img alt="knack" src=".github/assets/knack-banner.png">
  </a>
</p>

<p align="center">
  A streamlined wrapper around <a href="https://github.com/Blizzard/node-rdkafka">node-rdkafka</a> made with independent composable parts.
</p>

<p align="center">
  <a href="https://circleci.com/gh/Optum/knack"><img src="https://circleci.com/gh/Optum/knack.svg?style=svg"></a>&nbsp;<a href="https://codecov.io/gh/Optum/knack"><img src="https://codecov.io/gh/Optum/knack/branch/master/graph/badge.svg" /></a>&nbsp;<a href="https://github.com/xojs/xo"><img src="https://img.shields.io/badge/code_style-XO-5ed9c7.svg"></a>
  <a href="https://lerna.js.org/"><img src="https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg"></a>
</p>

## Packages

This repository is a monorepo that we manage using [Lerna](https://github.com/lerna/lerna). That means that we actually publish [several packages](/packages) to npm from the same codebase, including:

| name                                                                           | version                                                                                                                                                   |
| ------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [<b>`knack-avro`</b>](packages/knack-avro)                                     | <a href="https://www.npmjs.com/package/@optum/knack-avro"><img src="https://img.shields.io/npm/v/@optum/knack-avro?color=blue"></a>                       |
| A module for encoding and decoding avro with Kafka.                            |
| [<b>`knack-consumer`</b>](packages/knack-consumer)                             | <a href="https://www.npmjs.com/package/@optum/knack-consumer"><img src="https://img.shields.io/npm/v/@optum/knack-consumer?color=blue"></a>               |
| A module for consuming messages from Apache Kafka.                             |
| [<b>`knack-consumer-client`</b>](packages/knack-consumer-client)               | <a href="https://www.npmjs.com/package/@optum/knack-consumer-client"><img src="https://img.shields.io/npm/v/@optum/knack-consumer-client?color=blue"></a> |
| A module for consuming records from Apache Kafka with integrated avro support. |
| [<b>`knack-producer`</b>](packages/knack-producer)                             | <a href="https://www.npmjs.com/package/@optum/knack-producer"><img src="https://img.shields.io/npm/v/@optum/knack-producer?color=blue"></a>               |
| A module for publishing to Apache Kafka.                                       |
| [<b>`knack-producer-client`</b>](packages/knack-producer-client)               | <a href="https://www.npmjs.com/package/@optum/knack-producer-client"><img src="https://img.shields.io/npm/v/@optum/knack-producer-client?color=blue"></a> |
| A module for publishing records to Apache Kafka with integrated avro support.  |
| [<b>`knack-sr`</b>](packages/knack-sr)                                         | <a href="https://www.npmjs.com/package/@optum/knack-sr"><img src="https://img.shields.io/npm/v/@optum/knack-sr?color=blue"></a>                           |
| A module for interacting with the Kafka Schema Registry.                       |
| [<b>`knack-cli`</b>](packages/knack-cli)                                       | <a href="https://www.npmjs.com/package/@optum/knack-cli"><img src="https://img.shields.io/npm/v/@optum/knack-cli?color=blue"></a>                         |
| A cli for working with Apache Kafka development.                               |

## Development

initialize lerna for all packages

```shell
$ lerna init
$ lerna bootstrap --hoist
```

run tests

```shell
$ npm test
```

### Editors

#### VS Code

> extensions

- [Linter for XO](https://marketplace.visualstudio.com/items?itemName=samverschueren.linter-xo)
- [Prettier - Code formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

> settings.json

```json
{
	"xo.enable": true,
	"xo.format.enable": true,
	"javascript.format.enable": false,
	"javascript.validate.enable": false,
	"prettier.tabWidth": 4,
	"prettier.useTabs": true,
	"prettier.semi": false,
	"prettier.singleQuote": true,
	"[json]": {
		"editor.formatOnSave": true,
		"editor.defaultFormatter": "esbenp.prettier-vscode"
	},
	"[javascript]": {
		"editor.formatOnSave": true,
		"editor.defaultFormatter": "samverschueren.linter-xo"
	}
}
```

## Examples

Initial working code examples can be found in the [<b>`knack-cli/src`</b>](packages/knack-cli/src) folder.

## Contributing to the Project

The Knack team is open to contributions to our project. For more details, see our [Contribution Guide](.github/CONTRIBUTING.md).

© Optum 2019
