import {AvroSchemaType, JsonSchemaType, JsonSchemaExtra} from '../types'

export const fromBaseType = (
    jsonSchemaType: JsonSchemaType,
    typeName: string,
    extra: JsonSchemaExtra
): AvroSchemaType => {
    const avro: AvroSchemaType = {
        type: typeName,
        name: extra.name ?? jsonSchemaType.title,
        doc: jsonSchemaType.description
    }

    if (extra.required && extra.required.length !== 0) {
        if (!extra.required.includes(avro.name)) {
            avro.type = ['null', avro.type as string]
            avro.default = null
        }
    }

    return avro
}
