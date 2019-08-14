const assert = require('assert');
const chalk = require('chalk');

const defaultCmd = '<command>';

const parseCmdGrps = ({flags, commands: commandOptions}) => {
	const cmdGrps = {};

	for (const flagKey of Object.keys(flags)) {
		const flag = flags[flagKey];
		const {command, commands} = flag;
		if (command) {
			if (!cmdGrps[command]) {
				cmdGrps[command] = [];
			}

			cmdGrps[command].push({
				command,
				flag,
				flagKey
			});
		} else if (commands) {
			for (const cmd of commands) {
				let cmdKey = cmd;

				if (cmd.name) {
					cmdKey = cmd.name;
				}

				if (!cmdGrps[cmdKey]) {
					cmdGrps[cmdKey] = [];
				}

				cmdGrps[cmdKey].push({
					command: cmdKey,
					flag,
					flagKey
				});
			}
		} else {
			if (!cmdGrps[defaultCmd]) {
				cmdGrps[defaultCmd] = [];
			}

			cmdGrps[defaultCmd].push({
				command: defaultCmd,
				flag,
				flagKey
			});
		}
	}

	if (commandOptions) {
		for (const cmdOptionKey of Object.keys(commandOptions)) {
			if (!cmdGrps[cmdOptionKey]) {
				cmdGrps[cmdOptionKey] = {
					command: cmdOptionKey
				};
			}
		}
	}

	return cmdGrps;
};

const halpValidate = (cli, options) => {
	const command = cli.input[0];
	const cmdGrps = parseCmdGrps({...cli, commands: options.commands});

	let cmdGrp;

	for (const cmdGrpKey of Object.keys(cmdGrps)) {
		if (cmdGrpKey === command) {
			cmdGrp = cmdGrps[cmdGrpKey];
			break;
		}
	}

	if (cmdGrp) {
		for (const flagInfoKey of Object.keys(cmdGrp)) {
			const flagInfo = cmdGrp[flagInfoKey];
			const {flag, flagKey} = flagInfo;
			if (flag && flagKey) {
				const {required} = flag;
				if (required) {
					assert.ok(cli.flags[flagKey] !== undefined, `--${flagKey} is required`);
				}
			}
		}
	}

	return cli;
};

const optionsTextFormatter = ({flagKey, alias, type, description, required, cmdGrpKey, commands}) => {
	const aliasText = alias && `alias --${alias}`;
	let typeText = type && 'string';
	let _required = required;
	let _description = description;

	if (Array.isArray(commands)) {
		const innerOptions = commands.find(c => c.name === cmdGrpKey);
		if (innerOptions) {
			_required = innerOptions.required;
			_description = innerOptions.description;
		}
	}

	if (_required) {
		typeText = chalk.bold(typeText);
	} else {
		typeText = `[${typeText}]`;
	}

	const optionText = `--${flagKey} ${aliasText} ${typeText} ${_description || ''}`;

	return optionText;
};

const halpText = ({flags, commands}, bannerText = '') => {
	const cmdGrps = parseCmdGrps({flags, commands});

	const halps = [];

	for (const cmdGrpKey of Object.keys(cmdGrps)) {
		const cmdGrp = cmdGrps[cmdGrpKey];

		let halp = chalk.whiteBright('command') + chalk.whiteBright.bold(` ${cmdGrpKey}\n`);
		halp += chalk.blueBright(commands[cmdGrpKey].description ? `${commands[cmdGrpKey].description}\n` : '');
		halp += chalk.magentaBright('    options\n');

		for (const flagInfoKey of Object.keys(cmdGrp)) {
			const {flag, flagKey} = cmdGrp[flagInfoKey];
			if (flag && flagKey) {
				const optionText = optionsTextFormatter({
					...flag,
					flagKey,
					cmdGrpKey
				});
				halp += chalk.greenBright(`    ${optionText}\n`);
			}
		}

		halps.push(halp);
	}

	return [`${bannerText}\n`, ...halps].join('\n');
};

module.exports = {
	halpText,
	halpValidate
};
