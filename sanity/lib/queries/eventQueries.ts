import { defineQuery } from 'next-sanity';

export const EVENTS_QUERY = defineQuery(
  `*[_type == 'event' && defined(slug.current) && (
  !defined($search) || 
  title match $search || 
  category match $search || 
  user->name match $search ] || 
  lake match $search ||
  lake.name match $search
  )
] | order(_createdAt desc) {
    _id, 
    title, 
    slug,
    _createdAt,
    user -> {
      _id, 
      name,
      username, 
      image, 
      bio
    }, 
    views, 
    description,
    category,
    lake,
    image
}`,
);

export const EVENT_BY_ID_QUERY = defineQuery(`
  *[_type == 'event' && _id == $id][0]{
    _id, 
    title, 
    slug,
    _createdAt,
    user -> {
      _id, name, username, image, bio
    }, 
    views, 
    description,
    category,
    lake,
    image,
    pitch
// }`);

export const EVENT_VIEWS_BY_ID_QUERY = defineQuery(`
    *[_type == 'event' && _id == $id][0]{
      _id, views
    }
  `);

export const EVENTS_BY_USER_ID_QUERY = defineQuery(
  `*[_type == 'event' && user._ref == $id] | order(_createdAt desc) {
    _id, 
    title, 
    slug,
    _createdAt,
    user -> {
      _id, 
      name,
      username, 
      image, 
      bio
    }, 
    views, 
    description,
    category,
    lake,
    image
}`,
);

export const EVENT_PITCH_BY_EVENT_ID_QUERY = defineQuery(`
  *[_type == 'event' && _id == $id][0]{
    pitch
  }
`);

export const EVENT_BY_SLUG_QUERY = `
  *[_type == "event" && slug.current == $slug][0] {
    _id, 
    title, 
    slug,
    _createdAt,
    user -> {
      _id, name, username, image, bio
    }, 
    views, 
    description,
    category,
    lake,
    image,
    pitch
  }
`;

export const EVENT_COUNT_QUERY = defineQuery(`
  count(
    *[_type == 'event' && defined(slug.current) && 
      (!defined($search) || title match $search || category match $search || lake match $search || user->name match $search)
    ]
  )
`);

export const PAGINATED_EVENTS_QUERY = defineQuery(`
  *[_type == 'event' && defined(slug.current) && (
  !defined($search) ||
   title match $search || 
   category match $search || 
   user->name match $search ||
   lake match $search ||
   lake.name match $search
   )
  ] | order(_createdAt desc) [$start..$end] {
    _id, 
    title, 
    slug,
    _createdAt,
    user -> {
      _id, 
      name,
      username, 
      image, 
      bio
    }, 
    views, 
    description,
    category,
    lake,
    image
}
`);
