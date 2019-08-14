<h2 align="center">
  knack-cli
</h2>

<p align="center">
  A cli for working with Apache Kafka development.
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@optum/knack-cli"><img src="https://img.shields.io/npm/v/@optum/knack-cli?color=blue"></a>
  <a href="https://github.com/xojs/xo"><img src="https://img.shields.io/badge/code_style-XO-5ed9c7.svg"></a>
</p>

## Usage

<b>first things first...</b>

```shell
$ npm i -g @optum/knack-cli
```

### Help Menu

```shell
$ knack --help

  A cli for working with Apache Kafka development.

   _   __ _   _   ___   _____  _   __
  | | / /| \ | | / _ \ /  __ \| | / /
  | |/ / |  \| |/ /_\ \| /  \/| |/ / 
  |    \ | . ` ||  _  || |    |    \ 
  | |\  \| |\  || | | || \__/\| |\  \ 
  \_| \_/\_| \_/\_| |_/ \____/\_| \_/


  command register-avro-schema
      options
      --avsc alias --a string 
      --topic alias --t [string] 
      --type alias --ty string subject type (i.e. key or value)
  
  command verify-avro-schema
      options
      --avsc alias --a string 
      --data alias --d string path to json file containing data
      --show alias --s [string] show data after encode -> decode
  
  command convert-avsc
      options
      --avsc alias --a string 
      --format alias --f string target format
      --output alias --o string file output path
  
  command consume
      options
      --consumerConfig alias --cc [string] path to json file containing librd consumer settings
      --topicConfig alias --tc [string] path to json file containing librd topic settings
  
  command produce
      options
      --producerConfig alias --pc [string] path to json file containing librd producer settings
      --topic alias --t [string] 
      --key alias --k [string] path to json file containing key data
      --value alias --v string path to json file containing value data
      --count alias --c [string] number of times to run the action
  
  command check-kafka
      options
      --brokers alias --b [string] comma separated list of brokers
```
