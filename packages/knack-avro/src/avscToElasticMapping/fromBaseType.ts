import {ElasticMappingType} from '../types'

export const fromBaseType = (typeName?: string): ElasticMappingType => {
    return {
        type: typeName ?? 'text'
    }
}
