const got = require('got');

const defaultOptions = {
	scheme: 'http',
	domain: 'localhost:8081'
};

class SchemaRegistry {
	constructor(options = defaultOptions) {
		const {scheme, domain, url} = options;
		if (url) {
			this._baseUri = url;
		} else {
			this._baseUri = `${scheme}://${domain}`;
		}
	}

	get baseUri() {
		return this._baseUri;
	}

	async getSchemaById(schemaId) {
		const url = `${this.baseUri}/schemas/ids/${schemaId}`;
		const {body} = await got(url, {
			json: true
		});
		return body;
	}

	async getSchemaBySubject(subject) {
		const url = `${this.baseUri}/subjects/${subject}/versions/latest`;
		const {body} = await got(url, {
			json: true
		});
		return body;
	}

	async registerSchema({subject, schema}) {
		let strSchema = schema;
		if (typeof schema !== 'string') {
			strSchema = JSON.stringify(schema);
		}

		const options = {
			headers: {
				'Content-Type': 'application/vnd.schemaregistry.v1+json'
			},
			body: {
				schema: strSchema
			},
			json: true
		};

		const url = `${this.baseUri}/subjects/${subject}/versions`;
		const {body} = await got.post(url, options);
		return body;
	}
}

module.exports = SchemaRegistry;
