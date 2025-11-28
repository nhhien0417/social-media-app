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
    UPDATE: 'profile/users',
    DETAIL: (id: string | number) => `profile/users/${id}`,
    FRIENDS: (id: string | number) => `profile/friendships/${id}`,
    SENT: (id: string | number) => `profile/friendships/sent/${id}`,
    PENDING: (id: string | number) => `profile/friendships/pending/${id}`,

    REQUEST: 'profile/friendships/request',
    ACCEPT: 'profile/friendships/accept',
    REJECT: 'profile/friendships/reject',
  },
  POSTS: {
    POST_FEED: 'post/get-post',
    POST_DETAIL: (id: string | number) => `post/${id}`,
    POST_CREATE: 'post/create-post',
    POST_UPDATE: 'post/update-post',
    POST_DELETE: (id: string | number) => `post/delete-post/${id}`,
    POST_LIKE: 'post/like-post',
    POST_USERLIKES: (id: string | number) => `post/userlikes/${id}`,

    COMMENT_GET: (postId: string | number) => `post/comments/${postId}`,
    COMMENT_CREATE: 'post/comments',
    COMMENT_UPDATE: `post/comments`,
    COMMENT_DELETE: (id: string | number) => `post/comments/${id}`,
    COMMENT_LIKE: 'post/comments/like',
  },
  NOTIFICATIONS: {
    REGISTER_PUSH_TOKEN: 'notification/push-token/register',
    UNREGISTER_PUSH_TOKEN: 'notification/push-token/unregister',
    UPDATE_SETTINGS: 'notification/settings',
    GET_SETTINGS: 'notification/settings',
  },
}
