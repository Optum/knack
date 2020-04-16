import {Type} from 'avsc'
import {toElasticMappingType} from './toElasticMappingType'
import {ElasticMappingType} from '../types'

export const fromAvscType = (avscType: Type): ElasticMappingType => {
    const elasticMappingType = toElasticMappingType(avscType)
    return JSON.parse(JSON.stringify(elasticMappingType)) as ElasticMappingType
}
