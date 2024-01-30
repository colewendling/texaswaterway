import { type SchemaTypeDefinition } from 'sanity'
import { author } from './author'
import { event } from './event'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [author, event],
}
