export const ENDPOINTS = {
  IDENTITY: {
    LOGIN: 'identity/auth/login',
    LOGOUT: 'identity/auth/logout',
    REGISTER: 'identity/auth/register',
    GOOGLE_LOGIN: 'identity/auth/google',
    TOKEN: 'identity/auth/refresh-token',
    PROFILE: 'identity/me',
  },
  POSTS: {
    ALL: '/posts',
    DETAIL: (id: string | number) => `/posts/${id}`,
    CREATE: '/post/create-post',
    LIKE: '/post/like-post',
  },
  USERS: {
    ALL: 'profile/users',
    DETAIL: (id: string | number) => `profile/users/${id}`,
  },
}
