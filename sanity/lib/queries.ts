import { defineQuery } from 'next-sanity';

export const EVENTS_QUERY = defineQuery(
  `*[_type == 'event' && defined(slug.current) && !defined($search) || title match $search || category match $search || author->name match $search ] | order(_createdAt desc) {
    _id, 
    title, 
    slug,
    _createdAt,
    author -> {
      _id, 
      name, 
      image, 
      bio
    }, 
    views, 
    description,
    category,
    image
}`,
);

export const EVENT_BY_ID_QUERY = defineQuery(`*[_type == 'event' && _id == $id][0]{
    _id, 
    title, 
    slug,
    _createdAt,
    author -> {
      _id, name, image, bio
    }, 
    views, 
    description,
    category,
    image,
    pitch
}`);
