import { defineQuery } from 'next-sanity';

// export const EVENTS_QUERY = defineQuery(
//   `*[_type == 'event' && defined(slug.current) && !defined($search) || title match $search || category match $search || user->name match $search ] | order(_createdAt desc) {
//     _id, 
//     title, 
//     slug,
//     _createdAt,
//     user -> {
//       _id, 
//       name,
//       username, 
//       image, 
//       bio
//     }, 
//     views, 
//     description,
//     category,
//     image
// }`,
// );

// export const EVENT_BY_ID_QUERY = defineQuery(`
//   *[_type == 'event' && _id == $id][0]{
//     _id, 
//     title, 
//     slug,
//     _createdAt,
//     user -> {
//       _id, name, username, image, bio
//     }, 
//     views, 
//     description,
//     category,
//     image,
//     pitch
// }`);

// export const EVENT_VIEWS_QUERY = defineQuery(`
//     *[_type == 'event' && _id == $id][0]{
//       _id, views
//     }
//   `);

// export const USER_BY_GITHUB_ID_QUERY = defineQuery(`
//     *[_type == 'user' && id == $id][0]{
//     _id,
//     id,
//     name,
//     username,
//     email,
//     image,
//     bio
// }`);

// export const USER_BY_ID_QUERY = defineQuery(`
//     *[_type == 'user' && _id == $id][0]{
//     _id,
//     id,
//     name,
//     username,
//     email,
//     image,
//     bio
// }`);

// export const EVENTS_BY_USER_ID_QUERY = defineQuery(
//   `*[_type == 'event' && user._ref == $id] | order(_createdAt desc) {
//     _id, 
//     title, 
//     slug,
//     _createdAt,
//     user -> {
//       _id, 
//       name,
//       username, 
//       image, 
//       bio
//     }, 
//     views, 
//     description,
//     category,
//     image
// }`,
// );

// export const PITCH_BY_EVENT_ID_QUERY = defineQuery(`
//   *[_type == 'event' && _id == $id][0]{
//     pitch
//   }
// `);

// export const PLAYLIST_BY_SLUG_QUERY =
//   defineQuery(`*[_type == "playlist" && slug.current == $slug][0]{
//   _id,
//   title,
//   slug,
//   select[]->{
//     _id,
//     _createdAt,
//     title,
//     slug,
//     user->{
//       _id,
//       name,
//       slug,
//       image,
//       bio
//     },
//     views,
//     description,
//     category,
//     image,
//     pitch
//   }
// }`);

//DELETE THIS
// export const DELETE_EVENT_BY_ID_QUERY = `
//   *[_type == "event" && _id == $id][0]{
//     _id
//   }
// `;

// export const USER_BY_EMAIL_QUERY = `
//   *[_type == 'user' && email == $email][0]{
//     _id,
//     id,
//     name,
//     username,
//     email,
//     image,
//     bio,
//     password
//   }
// `;

// export const USER_BY_USERNAME_QUERY = `
//   *[_type == "user" && username == $username][0] {
//     _id,
//     id,
//     name,
//     username,
//     bio,
//     image,
//     "friends": friends[]->{
//       _id,
//       username,
//       image
//     }
//   }
// `;

// export const EVENT_BY_SLUG_QUERY = `
//   *[_type == "event" && slug.current == $slug][0] {
//     _id, 
//     title, 
//     slug,
//     _createdAt,
//     user -> {
//       _id, name, username, image, bio
//     }, 
//     views, 
//     description,
//     category,
//     image,
//     pitch
//   }
// `;

// // Query to search users by name or username
// export const SEARCH_USERS_QUERY = defineQuery(`
//   *[_type == "user" && (username match $searchTerm || name match $searchTerm)] {
//     _id,
//     username,
//     image
//   }
// `);

// // Query to fetch pending friend requests for the logged-in user
// export const PENDING_FRIEND_REQUESTS_QUERY = defineQuery(`
//   *[_type == "friendRequest" && to._ref == $userId && status == "pending"] {
//     _id,
//     from->{
//       _id,
//       username,
//       image
//     }
//   }
// `);

// // Query to fetch friend requests sent by the logged-in user
// export const SENT_FRIEND_REQUESTS_QUERY = defineQuery(`
//   *[_type == "friendRequest" && from._ref == $userId && status == "pending"] {
//     _id,
//     to->{
//       _id,
//       username,
//       image
//     }
//   }
// `);

// export const USER_FRIENDS_BY_USER_ID_QUERY = defineQuery(`
//   *[_type == "user" && _id == $userId][0]{
//     "friends": friends[]->{
//       _id,
//       username,
//       image
//     }
//   }
// `);


