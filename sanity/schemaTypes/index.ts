import { type SchemaTypeDefinition } from 'sanity';
import { author } from './author';
import { event } from './event';
import { playlist } from './playlist';

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [author, event, playlist],
};
