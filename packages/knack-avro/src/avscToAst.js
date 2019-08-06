const avro = require('avsc');
// const {assoc, pipe} = require('ramda');

/*
 	Primitive Avro Types
*/

// // no value
// const AVRO_TYPE_NULL = 'null';
// // a binary value
// const AVRO_TYPE_BOOLEAN = 'boolean';
// // 32-bit signed integer
// const AVRO_TYPE_INT = 'int';
// // 64-bit signed integer
// const AVRO_TYPE_LONG = 'long';
// // single precision (32-bit) IEEE 754 floating-point number
// const AVRO_TYPE_FLOAT = 'float';
// // double precision (64-bit) IEEE 754 floating-point number
// const AVRO_TYPE_DOUBLE = 'double';
// // sequence of 8-bit unsigned bytes
// const AVRO_TYPE_BYTES = 'bytes';
// // unicode character sequence
// const AVRO_TYPE_STRING = 'string';

/*
 	COMPLEX Avro Types
*/

const AVRO_TYPE_RECORD = 'record';
const AVRO_TYPE_ENUM = 'enum';
const AVRO_TYPE_ARRAY = 'array';
// const AVRO_TYPE_MAP = 'map';
const AVRO_TYPE_UNION = 'union';
// const AVRO_TYPE_FIXED = 'fixed';

class Ast {
	constructor(avscType) {
		this.avscType = avscType;
		this.state = {
			parents: new Set(),
			astTypes: {}
		};
	}

	static fromAvroSchema(avroSchema) {
		const avscType = avro.Type.forSchema(avroSchema);
		const ast = new Ast(avscType);
		ast.build();
		return ast;
	}

	getLast(items) {
		return items ? items[items.length - 1] : {};
	}

	transformToMap(array) {
		const map = {};
		for (const item of array) {
			map[item.name] = item;
		}

		return map;
	}

	toAst(avscType) {
		const {name, typeName, branchName, avroTypeName, parsedFields, types, namespace} = avscType;
		const isUnion = avroTypeName === AVRO_TYPE_UNION;
		let astTypeName = typeName;
		let astItemType;
		let astItemAvroType;
		let astAvscTypeRef;

		if (isUnion) {
			astTypeName = this.getLast(types).typeName || typeName;
		}

		if (astTypeName === AVRO_TYPE_ARRAY) {
			astAvscTypeRef = this.getLast(types).itemsType;
			astItemType = astAvscTypeRef.name;
			astItemAvroType = astAvscTypeRef.typeName;
		} else if (astTypeName === AVRO_TYPE_RECORD) {
			astAvscTypeRef = this.getLast(types);
			astItemType = astAvscTypeRef.name;
			astItemAvroType = astAvscTypeRef.typeName;
		}

		const ast = {
			name,
			typeName: astTypeName,
			itemTypeName: astItemType,
			branchName,
			avroTypeName,
			namespace,
			avroItemTypeName: astItemAvroType,
			// assumes union is always used to default something optional
			required: !isUnion,
			fields: parsedFields,
			fieldsMap: parsedFields ? this.transformToMap(parsedFields) : parsedFields
		};

		if ((astTypeName === AVRO_TYPE_ARRAY) ||
				(astTypeName === AVRO_TYPE_RECORD) ||
				(astTypeName === AVRO_TYPE_ENUM)) {
			this.state.astTypes[ast.name] = ast;
		}

		return ast;
	}

	parseField(field) {
		const {type, name, branchName} = field;
		const avroTypeName = type.typeName ? type.typeName.split(':')[0] : name;
		return this.toAst({...type, name, branchName, avroTypeName});
	}

	parseType(avscType) {
		const {typeName} = avscType;
		const avscTypeFields = avscType.getFields ? avscType.getFields() : [];
		const parsedFields = [];
		const avroTypeName = typeName ? typeName.split(':')[0] : typeName;

		for (const avscTypeField of avscTypeFields) {
			parsedFields.push(this.parseField(avscTypeField));
		}

		return this.toAst({...avscType, avroTypeName, parsedFields});
	}

	traverseFieldTypes({avscType, astField, parseTypeKey}) {
		const avscField = avscType.getField(astField.name);
		const avscFieldType = avscField.type;
		let avscTypeToParse = avscFieldType;

		if (Array.isArray(avscTypeToParse.types)) {
			avscTypeToParse = this.getLast(avscTypeToParse.types);
		}

		if (parseTypeKey) {
			avscTypeToParse = avscTypeToParse[parseTypeKey];
		}

		if (!this.state.parents.has(astField.itemTypeName)) {
			this.state.parents.add(astField.itemTypeName);
			const astParsed = this.traverseTypes(avscTypeToParse);

			astField.fields = astParsed.fields;
			astField.fieldsMap = this.transformToMap(astParsed.fields);
		}
	}

	traverseTypes(avscType) {
		const astType = this.parseType(avscType);
		const {fields: astFields} = astType;

		if (Array.isArray(astFields)) {
			for (const astField of astFields) {
				if ((astField.typeName || astField.avroTypeName) === AVRO_TYPE_ARRAY) {
					this.traverseFieldTypes({avscType, astField, parseTypeKey: 'itemsType'});
				} else if ((astField.typeName || astField.avroTypeName) === AVRO_TYPE_RECORD) {
					this.traverseFieldTypes({avscType, astField});
				}
			}
		}

		return astType;
	}

	build() {
		this.ast = this.traverseTypes(this.avscType);
	}

	getAstType(name) {
		return this.state.astTypes[name];
	}

	getAstTypes() {
		return this.state.astTypes;
	}
}

const main = avroSchema => Ast.fromAvroSchema(avroSchema);

module.exports = main;
