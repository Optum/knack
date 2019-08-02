#!/usr/bin/env node
'use strict';
const meow = require('meow');
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
	try {
		const result = await executeCmd(halpValidate(cli, meowOptions));

		if (result.error) {
			showError(result.errorMessage || result.error.message, result.error);
			process.exit(1);
		} else {
			showResult(result);
			if (!result.noExit) {
				process.exit(0);
			}
		}
	} catch (error) {
		showError('there was an error running knack-cli', error);
		process.exit(1);
	}
};

module.exports = main();
