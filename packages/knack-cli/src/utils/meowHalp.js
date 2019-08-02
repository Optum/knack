const assert = require('assert');
const chalk = require('chalk');

const defaultCmd = '<command>';

const parseCmdGrps = flags => {
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
				if (!cmdGrps[cmd]) {
					cmdGrps[cmd] = [];
				}

				cmdGrps[cmd].push({
					command: cmd,
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

	return cmdGrps;
};

const halpValidate = (cli, options) => {
	const command = cli.input[0];
	const cmdGrps = parseCmdGrps(options.flags);

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
			const {required} = flag;
			if (required) {
				assert.ok(cli.flags[flagKey] !== undefined, `--${flagKey} is required`);
			}
		}
	}

	return cli;
};

const optionsTextFormatter = ({flagKey, alias, type, description, required}) => {
	const aliasText = alias && `alias --${alias}`;
	let typeText = type && 'string';

	if (required) {
		typeText = chalk.bold(typeText);
	} else {
		typeText = `[${typeText}]`;
	}

	const optionText = `--${flagKey} ${aliasText} ${typeText} ${description || ''}`;

	return optionText;
};

const halpText = ({flags}, bannerText = '') => {
	const cmdGrps = parseCmdGrps(flags);

	const halps = [];

	for (const cmdGrpKey of Object.keys(cmdGrps)) {
		const cmdGrp = cmdGrps[cmdGrpKey];

		let halp = chalk.whiteBright('command') + chalk.whiteBright.bold(` ${cmdGrpKey}\n`);
		halp += chalk.magentaBright('    options\n');

		for (const flagInfoKey of Object.keys(cmdGrp)) {
			const {flag, flagKey} = cmdGrp[flagInfoKey];
			const optionText = optionsTextFormatter({
				...flag,
				flagKey
			});
			halp += chalk.greenBright(`    ${optionText}\n`);
		}

		halps.push(halp);
	}

	return [`${bannerText}\n`, ...halps].join('\n');
};

module.exports = {
	halpText,
	halpValidate
};

