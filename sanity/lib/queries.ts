import { defineQuery } from 'next-sanity';

export const EVENTS_QUERY = defineQuery(
  `*[_type == 'event' && defined(slug.current)] | order(_createdAt desc) {
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
