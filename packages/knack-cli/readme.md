<h2 align="center">
  knack-cli
</h2>

<p align="center">
  A cli for working with Apache Kafka development.
</p>

<p align="center">
  <a href="https://github.com/xojs/xo"><img src="https://img.shields.io/badge/code_style-XO-5ed9c7.svg"></a>
</p>

## Usage

<b>first things first...</b>

```shell
$ npm i -g knack-cli
```

### Help Menu

```shell
$ knack --help
  A cli for working with Apache Kafka development.

  -------------------------------------
   _   __ _   _   ___   _____  _   __
  | | / /| \ | | / _ \ /  __ \| | / /
  | |/ / |  \| |/ /_\ \| /  \/| |/ / 
  |    \ | . ` ||  _  || |    |    \ 
  | |\  \| |\  || | | || \__/\| |\  \ 
  \_| \_/\_| \_/\_| |_/ \____/\_| \_/
  -------------------------------------
  
  Usage
  $ knack [command] [options]
  
  Command
  verify-avro-schema    validate an avro schema against json data
  
  Options
  --avsc    file path to avro schema
  --data    file path to json data to validate
  --show    flag indicating to show data after it is encoded then decoded
  
  Examples
  $ knack verify-avro-schema --avsc /path/to/schema.avsc --data /path/to/data.json
  validated data with a resulting buffer length of 18
  
  
  Command
  register-avro-schema    register a schema via the topic and type (i.e. key or value)
  
  Options
  --avsc    file path to avro schema
  --topic   topic to register schema under
  --type    subject type (i.e. key or value)
  
  Examples
  $ knack register-avro-schema --avsc /path/to/schema.avsc --topic test-client-topic-v1 --type value
  test-client-topic-v1-value registered
  
  
  Command
  produce    produce a Kafka record (formats: string, json, avro)
  
  Options
  --key      file path to key message
  --value    file path to value message
  --topic    publish record to this topic
  --count    number of record to publish
  Examples
  $ knack produce --topic test-client-topic-v1 --key /path/to/message-key.json --value /path/to/message-value.json
  1 messages sent to test-client-topic-v1
  
  
  Command
  consume    consume a Kafka topic
  
  Options
  --topic    consume records from this topic
  Examples
  $ knack consume --topic test-client-topic-v1
  consumer connected to test-client-topic-v1
```

### Options

```json
{
  "avsc": {
    "type": 'string',
    "alias": 'a'
  },
  "data": {
    "type": 'string',
    "alias": 'd'
  },
  "topic": {
    "type": 'string',
    "alias": 't'
  },
  "type": {
    "type": 'string',
    "alias": 'ty'
  },
  "key": {
    "type": 'string',
    "alias": 'k'
  },
  "value": {
    "type": 'string',
    "alias": 'v'
  },
  "count": {
    "type": 'number',
    "alias": 'c'
  },
  "show": {
    "type": 'boolean',
    "alias": 's'
  }
}
```
