#!/usr/bin/env node
'use strict';
const meow = require('meow');
const {buildCliOptions, buildHelpContent, executeCmd, showError, showResult} = require('.');

const cli = meow(buildHelpContent(), buildCliOptions());

const main = async () => {
	try {
		const result = await executeCmd(cli);

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
