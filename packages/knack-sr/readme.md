<h2 align="center">
  knack-sr
</h2>

<p align="center">
  A module for interacting with the Kafka Schema Registry.
</p>

<p align="center">
  <a href="https://github.com/xojs/xo"><img src="https://img.shields.io/badge/code_style-XO-5ed9c7.svg"></a>
</p>

## Usage

<b>first things first...</b>

```shell
$ npm i @optum/knack-sr
```

<b>options</b>

- domain: `[String]` (default: localhost)
- schema: `[String]` (default: http)
- url: `[String]`  overrides all other options

## Examples

<p>
    read schema by id
</p>

```js
const KnackSr = require('@optum/knack-sr');

const options = {
    url: 'http://localhost:8081'
};

const schemaId = 123;

const sr = new KnackSr(options);

const schemaResponse = await sr.getSchemaById(schemaId);

console.log(schemaResponse);
```

<p>
    read schema by subject
</p>

```js
const KnackSr = require('@optum/knack-sr');

const options = {
    url: 'http://localhost:8081'
};

const topic = 'knack-test-topic-v1';

const sr = new KnackSr(options);

const keySubject = `${topic}-${key}`;
const keySchemaResponse = await sr.getSchemaBySubject(keySubject);

const valueSubject = `${topic}-${value}`;
const valueSchemaResponse = await sr.getSchemaBySubject(valueSubject);

console.log(keySchemaResponse);
console.log(valueSchemaResponse);
```

<p>
    register schema
</p>

```js
const KnackSr = require('@optum/knack-sr');

const topic = 'knack-test-topic-v1';

// can be string or json
const avroSchema = {
    "type": "record",
    "name": "messageInfo",
    "namespace": "io.knack.schemas.avro",
    "fields": [
     {
        "name": "content",
        "type": "string"
    },
    {
        "name": "channel",
        "type": ["null", "string"],
        "default": null
    }
  ]
};

// example of using default options
const sr = new KnackSr();

const valueSubject = `${topic}-${value}`;
const registration = await sr.registerSchema({
    schema: avroSchema,
    subject: valueSubject
});
```
