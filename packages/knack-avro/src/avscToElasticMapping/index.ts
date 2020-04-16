import {Type} from 'avsc'
import {fromAvscType} from './fromAvscType'
import {ElasticMappingType, ElasticMappingWrapperType} from '../types'

const toWrapper = (
    elasticMapping: ElasticMappingType
): ElasticMappingWrapperType => {
    delete elasticMapping.type
    return {
        mappings: elasticMapping
    }
}

export const toElasticMapping = (avscType: Type): ElasticMappingWrapperType => {
    const elasticMapping = fromAvscType(avscType)
    return toWrapper(elasticMapping)
}
