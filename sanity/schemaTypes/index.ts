import { type SchemaTypeDefinition } from 'sanity';
import { user } from './user';
import { event } from './event';
import { playlist } from './playlist';

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [user, event, playlist],
};
