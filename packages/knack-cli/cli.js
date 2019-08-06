#!/usr/bin/env node
'use strict';
const meow = require('meow');
const ora = require('ora');
const {meowOptions, executeCmd, showError, showResult, meowHalp} = require('./src');

let knackBanner = ' _   __ _   _   ___   _____  _   __\n';
knackBanner += '| | / /| \\ | | / _ \\ /  __ \\| | / /\n';
knackBanner += '| |/ / |  \\| |/ /_\\ \\| /  \\/| |/ / \n';
knackBanner += '|    \\ | . ` ||  _  || |    |    \\ \n';
knackBanner += '| |\\  \\| |\\  || | | || \\__/\\| |\\  \\ \n';
knackBanner += '\\_| \\_/\\_| \\_/\\_| |_/ \\____/\\_| \\_/\n';

const {halpText, halpValidate} = meowHalp;
const cli = meow(halpText(meowOptions, knackBanner), meowOptions);

const main = async () => {
	const display = ora(`running ${cli.input[0]}`).start();
	try {
		const result = await executeCmd(halpValidate(cli, meowOptions));

		if (result.error) {
			display.fail(showError(result.errorMessage || result.error.message, result.error)).stop();
			process.exit(1);
		} else {
			display.succeed(showResult(result)).stop();
			if (!result.noExit) {
				process.exit(0);
			}
		}
	} catch (error) {
		display.fail(showError('there was an error running knack-cli', error)).stop();
		process.exit(1);
	}
};

module.exports = main();
