const path = require('path');
const execa = require('execa');

const packages = [
	'knack-avro',
	'knack-consumer-client',
	'knack-consumer',
	'knack-producer-client',
	'knack-producer',
	'knack-sr'
];

(async () => {
	let hasError = false;
	for (const packageName of packages) {
		try {
			console.log(`running tests for ${packageName}`);
			// eslint-disable-next-line no-await-in-loop
			const {stdout} = await execa('npm', ['test', '--silent'], {
				cwd: path.resolve(__dirname, '../packages/' + packageName)
			});
			console.log(stdout);
		} catch (error) {
			hasError = true;
			console.error(error.all);
		}
	}

	if (hasError) {
		// eslint-disable-next-line unicorn/no-process-exit
		process.exit(1);
	}
})();
