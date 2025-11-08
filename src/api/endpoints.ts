export const ENDPOINTS = {
  IDENTITY: {
    LOGIN: 'identity/auth/login',
    LOGOUT: 'identity/auth/logout',
    REGISTER: 'identity/auth/register',
    TOKEN: 'identity/auth/refresh-token',
    PROFILE: 'identity/me',
  },
  POSTS: {
    ALL: '/posts',
    DETAIL: (id: string | number) => `/posts/${id}`,
    CREATE_POST: '/post/create-post',
  },
  USERS: {
    ALL: '/users',
    DETAIL: (id: string | number) => `/users/${id}`,
  },
}
