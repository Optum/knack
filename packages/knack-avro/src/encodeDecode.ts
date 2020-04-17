import avro, {Type, Schema} from 'avsc'
import {
    JsonType,
    Decoded,
    MappedDecoded,
    EncodeDecodeOptions,
    TypeStore
} from './types'

const MAGIC_BYTE = 0

const DISABLE_BETTER_ERROR_MESSAGES =
    process.env.KNACK_DISABLE_BETTER_ERROR_MESSAGES

const typeStore: TypeStore = {}

export const options: EncodeDecodeOptions = {
    resolveType: undefined,
    mapDecoded: undefined
}

const collectInvalidPaths = (type: Type, value: any) => {
    const paths: string[] = []
    type.isValid(value, {
        errorHook(path: string[], value_: any) {
            paths.push(`${path.join(':')} is ${value_ as string}`)
        }
    })
    return paths
}

const mapDecoded = (
    decoded: Decoded,
    schemaId: number
): MappedDecoded | JsonType => {
    if (options.mapDecoded) {
        return options.mapDecoded(decoded, schemaId)
    }

    return {
        value: decoded.value,
        schemaId
    }
}

const resolveType = (schema: Schema): Type => {
    if (typeof options.resolveType === 'function') {
        return options.resolveType(schema)
    }

    let avroSchema = schema
    if (typeof schema === 'string') {
        avroSchema = JSON.parse(schema)
    }

    let storeKey = schema
    if (typeof schema === 'object') {
        storeKey = JSON.stringify(schema)
    }

    const _storeKey = storeKey as string

    let type = typeStore[_storeKey]
    if (!type) {
        type = avro.Type.forSchema(avroSchema)
        typeStore[_storeKey] = type
    }

    return type
}

export const toAvroBuffer = (
    value: JsonType,
    schema: Schema,
    schemaId: number,
    optLength?: number
): Buffer => {
    const length = optLength ?? 1024
    const buf = Buffer.alloc(length)

    const type = resolveType(schema)

    buf[0] = MAGIC_BYTE
    buf.writeInt32BE(schemaId, 1)

    if (!DISABLE_BETTER_ERROR_MESSAGES) {
        const invalidPaths = collectInvalidPaths(type, value)
        if (invalidPaths.length > 0) {
            throw new TypeError(
                'invalid path(s) in object: ' + invalidPaths.join(', ')
            )
        }
    }

    const pos = type.encode(value, buf, 5)

    if (pos < 0) {
        return toAvroBuffer(value, type, schemaId, length - pos)
    }

    return buf.slice(0, pos)
}

export const fromAvroBuffer = (
    schema: Schema,
    encodedBuffer: Buffer
): MappedDecoded | JsonType => {
    if (encodedBuffer[0] !== MAGIC_BYTE) {
        throw new TypeError('message not serialized with magic byte')
    }

    const type = resolveType(schema)

    const schemaId = encodedBuffer.readInt32BE(1)
    const decoded = type.decode(encodedBuffer, 5)

    return mapDecoded(decoded, schemaId)
}
