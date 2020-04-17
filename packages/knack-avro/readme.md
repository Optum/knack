<h2 align="center">
  knack-avro
</h2>

<p align="center">
  A module for encoding and decoding avro with Kafka.
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@optum/knack-avro"><img src="https://img.shields.io/npm/v/@optum/knack-avro?color=blue"></a>
  <a href="https://github.com/xojs/xo"><img src="https://img.shields.io/badge/code_style-XO-5ed9c7.svg"></a>
</p>

<b>first things first...</b>

```shell
$ npm i @optum/knack-avro
```

<b>methods</b>

- toAvroBuffer: (data, schema, schemaId)
  - get avro encoded buffer from json
    - data: `Object` json object to encode
    - schema: `Object or String` schema to use when encoding the data
    - schemaId: `Number` schemaId of the schema from the schema registry
- fromAvroBuffer: (schema, buffer)
  - get json from avro buffer and schema
    - schema: `Object or String` overrides all other options
    - buffer: `Buffer` avro encoded buffer

## Examples

```js
const {fromAvroBuffer, toAvroBuffer} = require("@optum/knack-avro");

// can be string or json
const avroSchema = {
	type: "record",
	name: "messageInfo",
	namespace: "io.knack.schemas.avro",
	fields: [
		{
			name: "content",
			type: "string"
		},
		{
			name: "channel",
			type: ["null", "string"],
			default: null
		}
	]
};

// example message
const messageInfo = {
	content: "test content"
};

// the schemaId of the avroSchema from the schema registry
const schemaId = 123;

// encode messageInfo to Avro buffer
const msgBuffer = toAvroBuffer(messageInfo, avroSchema, schemaId);

// decode msgBuffer to json based on avroSchema
const {value, schemaId} = fromAvroBuffer(avroSchema, msgBuffer);

console.log(schemaId);
/**
123
*/
console.log(value);
/**
{
    "content": "test content",
    "channel": null
}
*/
```

### Convert Avro Schema to Elastic Mapping

<b>methods</b>

- streams.avscToEsMappings: (avroSchema)
  - convert avro schema to es mapping
    - avroSchema: `avsc.Type` a [`Type`](https://github.com/mtth/avsc/wiki/API#class-type) from the [avsc](https://github.com/mtth/avsc) module

```js
const fsExtra = require("fs-extra");
const {streams} = require("@optum/knack-avro");

const {avscToEsMappings} = streams;

const main = async () => {
	const avscPath = "~/path/to/mySchema.avsc";
	const outputPath = "~/path/to/outputEsMapping.json";

	const avroSchema = await fsExtra.readJson(avscPath);
	const content = avscToJsonSchema(avroSchema);

	await fsExtra.outputJson(outputPath, content);
};
```

### Convert Avro Schema to JSON Schema

<b>methods</b>

- streams.avscToJsonSchema: (avroSchema)
  - convert avro schema to json schema
    - avroSchema: `avsc.Type` a [`Type`](https://github.com/mtth/avsc/wiki/API#class-type) from the [avsc](https://github.com/mtth/avsc) module

```js
const fsExtra = require("fs-extra");
const {streams} = require("@optum/knack-avro");

const {avscToJsonSchema} = streams;

const main = async () => {
	const avscPath = "~/path/to/mySchema.avsc";
	const outputPath = "~/path/to/outputJsonSchema.json";

	const avroSchema = await fsExtra.readJson(avscPath);
	const content = avscToJsonSchema(avroSchema);

	await fsExtra.outputJson(outputPath, content);
};
```

### Convert JSON Schema to Avro Schema

<b>methods</b>

- streams.jsonSchemaToAvsc: (jsonSchema)
  - convert json schema to avro schema
    - jsonSchema: `Object` json object representation of avro schema

```js
const fsExtra = require("fs-extra");
const {streams} = require("@optum/knack-avro");

const {jsonSchemaToAvsc} = streams;

const main = async () => {
	const jsonSchemaPath = "~/path/to/myJsonSchema.json";
	const outputPath = "~/path/to/mySchema.avsc";

	const jsonSchema = await fsExtra.readJson(jsonSchemaPath);
	const content = jsonSchemaToAvsc(jsonSchema);

	await fsExtra.outputJson(outputPath, content);
};
```
