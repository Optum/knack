const chalk = require('chalk');
const cleanStack = require('clean-stack');
const {registerAvroSchema, runConsumer, runProducer, verifyAvroSchema} = require('./cmds');

const defaultCount = 1;
const defaultTopic = 'test-client-topic-v1';

const buildCliOptions = () => {
	return {
		flags: {
			avsc: {
				type: 'string',
				alias: 'a'
			},
			data: {
				type: 'string',
				alias: 'd'
			},
			topic: {
				type: 'string',
				alias: 't'
			},
			type: {
				type: 'string',
				alias: 'ty'
			},
			key: {
				type: 'string',
				alias: 'k'
			},
			value: {
				type: 'string',
				alias: 'v'
			},
			count: {
				type: 'number',
				alias: 'c'
			},
			show: {
				type: 'boolean',
				alias: 's'
			}
		}
	};
};

const buildHelpContent = () => {
	let knackBanner = ' _   __ _   _   ___   _____  _   __\n';
	knackBanner += '| | / /| \\ | | / _ \\ /  __ \\| | / /\n';
	knackBanner += '| |/ / |  \\| |/ /_\\ \\| /  \\/| |/ / \n';
	knackBanner += '|    \\ | . ` ||  _  || |    |    \\ \n';
	knackBanner += '| |\\  \\| |\\  || | | || \\__/\\| |\\  \\ \n';
	knackBanner += '\\_| \\_/\\_| \\_/\\_| |_/ \\____/\\_| \\_/\n';

	// knack: verify-avro-schema
	let helpContent = chalk.whiteBright('-------------------------------------\n');
	helpContent += chalk.whiteBright(knackBanner);
	helpContent += chalk.whiteBright('-------------------------------------\n');
	helpContent += chalk.whiteBright('\nUsage\n');
	helpContent += chalk.blueBright('$ knack [command] [options]\n\n');
	helpContent += chalk.whiteBright('Command\n');
	helpContent += chalk.blueBright('verify-avro-schema    validate an avro schema against json data\n\n');
	helpContent += chalk.whiteBright('Options\n');
	helpContent += chalk.blueBright('--avsc    file path to avro schema\n');
	helpContent += chalk.blueBright('--data    file path to json data to validate\n');
	helpContent += chalk.blueBright('--show    flag indicating to show data after it is encoded then decoded\n\n');
	helpContent += chalk.whiteBright('Examples\n');
	helpContent += chalk.blueBright('$ knack verify-avro-schema --avsc /path/to/schema.avsc --data /path/to/data.json\n');
	helpContent += chalk.greenBright('validated data with a resulting buffer length of 18\n');

	// knack: register-avro-schema
	helpContent += chalk.whiteBright('\n\n');
	helpContent += chalk.whiteBright('Command\n');
	helpContent += chalk.blueBright('register-avro-schema    register a schema via the topic and type (i.e. key or value)\n\n');
	helpContent += chalk.whiteBright('Options\n');
	helpContent += chalk.blueBright('--avsc    file path to avro schema\n');
	helpContent += chalk.blueBright('--topic   topic to register schema under\n');
	helpContent += chalk.blueBright('--type    subject type (i.e. key or value)\n\n');
	helpContent += chalk.whiteBright('Examples\n');
	helpContent += chalk.blueBright('$ knack register-avro-schema --avsc /path/to/schema.avsc --topic test-client-topic-v1 --type value\n');
	helpContent += chalk.greenBright('test-client-topic-v1-value registered\n');

	// knack: produce
	helpContent += chalk.whiteBright('\n\n');
	helpContent += chalk.whiteBright('Command\n');
	helpContent += chalk.blueBright('produce    produce a Kafka record (formats: string, json, avro)\n\n');
	helpContent += chalk.whiteBright('Options\n');
	helpContent += chalk.blueBright('--key      file path to key message\n');
	helpContent += chalk.blueBright('--value    file path to value message\n');
	helpContent += chalk.blueBright('--topic    publish record to this topic\n');
	helpContent += chalk.blueBright('--count    number of record to publish\n');
	helpContent += chalk.whiteBright('Examples\n');
	helpContent += chalk.blueBright('$ knack produce --topic test-client-topic-v1 --key /path/to/message-key.json --value /path/to/message-value.json\n');
	helpContent += chalk.greenBright('1 message(s) sent to test-client-topic-v1\n');

	// knack: consume
	helpContent += chalk.whiteBright('\n\n');
	helpContent += chalk.whiteBright('Command\n');
	helpContent += chalk.blueBright('consume    consume a Kafka topic\n\n');
	helpContent += chalk.whiteBright('Options\n');
	helpContent += chalk.blueBright('--topic    consume records from this topic\n');
	helpContent += chalk.whiteBright('Examples\n');
	helpContent += chalk.blueBright('$ knack consume --topic test-client-topic-v1\n');
	helpContent += chalk.greenBright('consumer connected to test-client-topic-v1\n');

	return helpContent;
};

const executeCmd = async cli => {
	const action = cli.input[0];
	const {flags} = cli;

	let result = {};

	switch (action) {
		case 'verify-avro-schema':
			result = await verifyAvroSchema(
				flags.avsc,
				flags.data,
				flags.show
			);
			break;
		case 'register-avro-schema':
			result = await registerAvroSchema(
				`${flags.topic || defaultTopic}-${flags.type || 'value'}`,
				flags.avsc
			);
			break;
		case 'produce':
			result = await runProducer(
				flags.key,
				flags.value,
				flags.topic || defaultTopic,
				flags.count || defaultCount
			);
			break;
		case 'consume':
			result = await runConsumer(
				flags.topic || defaultTopic
			);
			break;
		default:
			result.errorMessage = `unknown action: ${action}`;
			break;
	}

	return result;
};

const showError = (message, error) => {
	console.log(chalk.red(message));
	if (error) {
		console.log(chalk.redBright(error.stack ? cleanStack(error.stack) : error));
	}
};

const showResult = ({message} = {}) => {
	console.log(chalk.greenBright(message || 'done'));
};

module.exports = {
	buildCliOptions,
	buildHelpContent,
	executeCmd,
	showError,
	showResult
};
