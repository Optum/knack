const chalk = require('chalk');
const cleanStack = require('clean-stack');
const registerAvroSchema = require('./registerAvroSchema');
const runConsumer = require('./runConsumer');
const runProducer = require('./runProducer');
const verifyAvroSchema = require('./verifyAvroSchema');
const checkKafka = require('./checkKafka');
const convertAvsc = require('./convertAvsc');
const convertJson = require('./convertJson');
const {meowHalp} = require('./utils');

const defaultCount = 1;
const defaultTopic = process.env.KNACK_DEFAULT_TOPIC || 'knack-test-topic-v1';
const defaultBrokers = ['localhost:9092'];

const getBrokers = ({brokers}) => {
	if (!brokers) {
		return defaultBrokers;
	}

	return {brokers: brokers.split(',')};
};

const defaultParser = flags => {
	if (!flags.topic) {
		flags.topic = defaultTopic;
	}

	if (!flags.count) {
		flags.count = defaultCount;
	}

	return flags;
};

const meowOptions = {
	flags: {
		avsc: {
			commands: ['register-avro-schema', 'verify-avro-schema', 'convert-avsc'],
			type: 'string',
			alias: 'a',
			required: true,
			description: 'avro schema input'
		},
		json: {
			commands: ['convert-json'],
			type: 'string',
			alias: 'j',
			required: true,
			description: 'json schema input'
		},
		consumerConfig: {
			command: 'consume',
			type: 'string',
			alias: 'cc',
			description: 'path to json file containing librd consumer settings'
		},
		topicConfig: {
			command: 'consume',
			type: 'string',
			alias: 'tc',
			description: 'path to json file containing librd topic settings'
		},
		producerConfig: {
			command: 'produce',
			type: 'string',
			alias: 'pc',
			description: 'path to json file containing librd producer settings'
		},
		data: {
			command: 'verify-avro-schema',
			type: 'string',
			alias: 'd',
			required: true,
			description: 'path to json file containing data'
		},
		topic: {
			commands: ['register-avro-schema', 'produce'],
			type: 'string',
			alias: 't'
		},
		type: {
			command: 'register-avro-schema',
			type: 'string',
			alias: 'ty',
			required: true,
			description: 'subject type (i.e. key or value)'
		},
		key: {
			command: 'produce',
			type: 'string',
			alias: 'k',
			description: 'path to json file containing key data'
		},
		value: {
			command: 'produce',
			type: 'string',
			alias: 'v',
			required: true,
			description: 'path to json file containing value data'
		},
		count: {
			command: 'produce',
			type: 'number',
			alias: 'c',
			description: 'number of times to run the action'
		},
		show: {
			command: 'verify-avro-schema',
			type: 'boolean',
			alias: 's',
			description: 'show data after encode -> decode'
		},
		brokers: {
			command: 'check-kafka',
			type: 'string',
			alias: 'b',
			description: 'comma separated list of brokers'
		},
		format: {
			command: 'convert-avsc',
			type: 'string',
			alias: 'f',
			required: true,
			description: 'target format: es (elastic mapping), json (json schema)'
		},
		output: {
			commands: ['convert-avsc', 'convert-json'],
			type: 'string',
			alias: 'o',
			required: true,
			description: 'file output path'
		}
	},
	commands: {
		'check-kafka': {
			action: checkKafka,
			parser: getBrokers
		},
		'verify-avro-schema': {
			action: verifyAvroSchema,
			parser: defaultParser
		},
		'register-avro-schema': {
			action: registerAvroSchema,
			parser: defaultParser
		},
		produce: {
			action: runProducer,
			parser: defaultParser
		},
		consume: {
			action: runConsumer,
			parser: defaultParser
		},
		'convert-avsc': {
			action: convertAvsc,
			description: 'convert an avsc to other formats'
		},
		'convert-json': {
			action: convertJson,
			description: 'convert a json schema to avro'
		}
	}
};

const executeCmd = async cli => {
	const command = cli.input[0];
	const {flags} = cli;

	let result = {};

	const cmdInfo = meowOptions.commands[command];

	if (!cmdInfo) {
		result.errorMessage = `unknown command: ${command}`;
		return result;
	}

	const args = cmdInfo.parser ? cmdInfo.parser(flags) : flags;

	result = await cmdInfo.action(args);

	return result;
};

const showError = (message, error) => {
	const errorText = chalk.redBright(error.stack ? cleanStack(error.stack) : error);
	return `${chalk.red(message)}\n${errorText}`;
};

const showResult = ({message} = {}) => {
	return chalk.greenBright(message || 'done');
};

module.exports = {
	meowHalp,
	meowOptions,
	executeCmd,
	showError,
	showResult,
	registerAvroSchema,
	runConsumer,
	runProducer,
	verifyAvroSchema,
	checkKafka,
	convertAvsc,
	convertJson
};
