import {fromBaseType} from './fromBaseType'
import {ElasticMappingType} from '../types'

export const fromBooleanType = (): ElasticMappingType => {
    return fromBaseType('boolean')
}

export const fromLongType = (): ElasticMappingType => {
    return fromBaseType('long')
}

export const fromDoubleType = (): ElasticMappingType => {
    return fromBaseType('double')
}

export const fromFloatType = (): ElasticMappingType => {
    return fromBaseType('float')
}

export const fromIntType = (): ElasticMappingType => {
    return fromBaseType('integer')
}

export const fromStringType = (): ElasticMappingType => {
    return fromBaseType('keyword')
}

export const fromNullType = (): ElasticMappingType => {
    return fromBaseType('null')
}

// const fromFixedType = (type: avsc.types.FixedType): JsonType => {
// }
// const fromLogicalType = (type: avsc.types.LogicalType): JsonType => {
// }
// const fromMapType = (type: avsc.types.MapType): JsonObject => {
// }

export const fromEnumType = (): ElasticMappingType => {
    return fromBaseType('keyword')
}
