export const ENDPOINTS = {
  AUTH: {
    SIGN_IN: '/auth/signin',
    SIGN_UP: '/auth/signup',
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
