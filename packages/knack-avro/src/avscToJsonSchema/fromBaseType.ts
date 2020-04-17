import slugify from '@sindresorhus/slugify'
import {JsonSchemaType, TypeWithAltDoc} from '../types'

export const fromBaseType = (
    typeWithAltDoc: TypeWithAltDoc,
    typeName?: string
): JsonSchemaType => {
    const {type} = typeWithAltDoc
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
        description: type.doc ?? typeWithAltDoc.altDoc ?? ''
    }
}
