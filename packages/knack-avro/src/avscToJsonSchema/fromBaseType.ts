import {Type} from 'avsc'
import slugify from '@sindresorhus/slugify'
import {JsonSchemaType} from '../types'

export const fromBaseType = (
    type: Type,
    typeName?: string,
    defaultValue?: any
): JsonSchemaType => {
    const nTypeName =
        type.name && type.name.includes('.')
            ? type.name.split('.')[type.name.split('.').length - 1]
            : type.typeName
    return {
        $id: `#/${slugify(`${type.name ?? type.typeName}`, {
            separator: '/',
            lowercase: true
        })}`,
        type: typeName ?? 'string',
        title: `${nTypeName}`,
        description: type.doc ?? '',
        default: defaultValue
    }
}
