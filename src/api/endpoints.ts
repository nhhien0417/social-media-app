export const ENDPOINTS = {
  IDENTITY: {
    LOGIN: 'identity/auth/login',
    LOGOUT: 'identity/auth/logout',
    REGISTER: 'identity/auth/register',
    GOOGLE_LOGIN: 'identity/auth/google',
    TOKEN: 'identity/auth/refresh-token',
  },
  PROFILE: {
    ALL: 'profile/users',
    DETAIL: (id: string | number) => `posts/${id}`,
    FRIENDS: (id: string | number) => `profile/friendships/${id}`,
    SENT: (id: string | number) => `profile/friendships/send/${id}`,
    PENDING: (id: string | number) => `profile/friendships/pending/${id}`,
    REQUEST: 'profile/friendships/request',
    ACCEPT: 'profile/friendships/accept',
    REJECT: 'profile/friendships/reject',
  },
  POSTS: {
    ALL: 'posts',
    DETAIL: (id: string | number) => `posts/${id}`,
    CREATE: 'post/create-post',
    LIKE: 'post/like-post',
  },
  NOTIFICATIONS: {
    REGISTER_PUSH_TOKEN: 'notification/push-token/register',
    UNREGISTER_PUSH_TOKEN: 'notification/push-token/unregister',
    UPDATE_SETTINGS: 'notification/settings',
    GET_SETTINGS: 'notification/settings',
  },
}
