import { defineQuery } from 'next-sanity';

export const USER_BY_GITHUB_ID_QUERY = defineQuery(`
    *[_type == 'user' && id == $id][0]{
    _id,
    id,
    name,
    username,
    email,
    image,
    lake,
    bio
}`);

export const USER_BY_ID_QUERY = defineQuery(`
    *[_type == 'user' && _id == $id][0]{
    _id,
    id,
    name,
    username,
    email,
    image,
    lake,
    bio
}`);

export const USER_BY_EMAIL_QUERY = `
  *[_type == 'user' && email == $email][0]{
    _id,
    id,
    name,
    username,
    email,
    image,
    bio,
    lake,
    password
  }
`;

export const USER_BY_USERNAME_QUERY = `
  *[_type == "user" && username == $username][0] {
    _id,
    id,
    name,
    username,
    bio,
    image,
    lake,
    "friends": friends[]->{
      _id,
      username,
      image
    }
  }
`;

export const USER_FRIENDS_BY_USER_ID_QUERY = defineQuery(`
  *[_type == "user" && _id == $userId][0]{
    "friends": friends[]->{
      _id,
      username,
      image
    }
  }
`);

// Query to search users by name or username
export const SEARCH_USERS_QUERY = defineQuery(`
  *[_type == "user" && (username match $searchTerm || name match $searchTerm)] {
    _id,
    username,
    image
  }
`);

export const USER_BY_IDENTIFIER_QUERY = `
  *[_type == 'user' && (email == $identifier || username == $identifier)][0]{
    _id,
    id,
    name,
    username,
    email,
    image,
    bio,
    lake,
    password
  }
`;
