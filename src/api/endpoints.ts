export const ENDPOINTS = {
  IDENTITY: {
    LOGIN: 'identity/auth/login',
    REGISTER: 'identity/auth/register',
    PROFILE: '/auth/me',
  },
  POSTS: {
    ALL: '/posts',
    DETAIL: (id: string | number) => `/posts/${id}`,
  },
  USERS: {
    ALL: '/users',
    DETAIL: (id: string | number) => `/users/${id}`,
  },
}
