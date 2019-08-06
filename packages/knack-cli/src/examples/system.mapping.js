module.exports = {
	mappings: {
		properties: {
			// treated as unique identifier
			domain: {type: 'keyword'},
			name: {type: 'keyword'},
			status: {type: 'keyword'},
			// markdown renderedable content
			description: {type: 'text'},
			// array of objects
			// mono schema for all asset types
			assets: {
				type: 'nested',
				properties: {
					// s3, embedded, static
					type: {type: 'keyword'},
					bucket: {type: 'keyword'},
					key: {type: 'keyword'},
					slug: {type: 'keyword'},
					name: {type: 'keyword'},
					url: {type: 'keyword'},
					// markdown renderedable content
					description: {type: 'text'},
					fileName: {type: 'keyword'},
					fileExt: {type: 'keyword'},
					contentType: {type: 'keyword'},
					contentLength: {type: 'keyword'},
					duration: {type: 'long'}
				}
			},
			// array of objects
			// mono schema for all component types
			components: {
				type: 'nested',
				properties: {
					// webapp, api, daemon
					type: {type: 'keyword'},
					name: {type: 'keyword'},
					url: {type: 'keyword'}
				}
			},
			// array of objects
			// mono schema for all dependency types
			dependencies: {
				type: 'nested',
				properties: {
					// database, object-storage
					type: {type: 'keyword'},
					name: {type: 'keyword'},
					uri: {type: 'keyword'},
					// mono schema for all metadata
					metadata: {
						type: 'nested'
					}
				}
			},
			updatedAt: {
				type: 'date',
				format: 'epoch_millis'
			}
		}
	}
};
