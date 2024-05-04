import { defineQuery } from 'next-sanity';


// Query to fetch pending friend requests for the logged-in user
export const PENDING_FRIEND_REQUESTS_QUERY = defineQuery(`
  *[_type == "friendRequest" && to._ref == $userId && status == "pending"] {
    _id,
    from->{
      _id,
      username,
      image
    }
  }
`);

// Query to fetch friend requests sent by the logged-in user
export const SENT_FRIEND_REQUESTS_QUERY = defineQuery(`
  *[_type == "friendRequest" && from._ref == $userId && status == "pending"] {
    _id,
    to->{
      _id,
      username,
      image
    }
  }
`);