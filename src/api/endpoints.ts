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
    POST_GROUP: (id: string | number) => `post/group/${id}`,
    POST_PROFILE: (id: string | number) => `post/profile/${id}`,
    POST_DETAIL: (id: string | number) => `post/${id}`,
    POST_CREATE: 'post/create-post',
    POST_UPDATE: 'post/update-post',
    POST_DELETE: (id: string | number) => `post/delete-post/${id}`,

    POST_LIKE: 'post/like-post',
    POST_USERLIKES: (id: string | number) => `post/userlikes/${id}`,
    POST_SEEN: 'post/seen',
    POST_USERSSEEN: (id: string | number) => `post/seen/${id}`,

    COMMENT_GET: (postId: string | number) => `post/comments/${postId}`,
    COMMENT_CREATE: 'post/comments',
    COMMENT_UPDATE: 'post/comments',
    COMMENT_DELETE: (id: string | number) => `post/comments/${id}`,
    COMMENT_LIKE: 'post/comments/like',
  },

  GROUP: {
    ALL: 'group/',
    USER_GROUPS: 'group/',

    CREATE: 'group/',
    UPDATE: 'group/',
    DELETE: (id: string | number) => `group/${id}`,
    DETAIL: (id: string | number) => `group/${id}`,

    JOIN: (id: string | number) => `group/${id}/join`,
    LEAVE: (id: string | number) => `group/${id}/leave`,

    GET_USER_REQUEST: 'group/requests',
    GET_GROUP_REQUEST: (id: string | number) => `group/${id}/requests`,
    HANDLE_REQUEST: 'group/requests',
    CANCEL_REQUEST: (id: string | number) => `group/${id}/requests`,

    MEMBERS: (id: string | number) => `group/${id}/members`,
    ROLE: 'group/members',
    REMOVE: (groupId: string | number, memberId: string | number) =>
      `group/${groupId}/members/${memberId}`,
  },

  CHAT: {
    CHAT_ALL: 'chat/',
    CHAT_CREATE_GET: 'chat/',
    CHAT_DELETE: (id: string | number) => `chat/${id}`,
    CHAT_DETAIL: (id: string | number) => `chat/${id}`,
    CHAT_SEEN: (id: string | number) => `chat/${id}`,

    MESSAGE_SEND: 'chat/messages',
    MESSAGE_GET: (id: string | number) => `chat/${id}/messages`,
    MESSAGE_DELETE: (id: string | number) => `chat/messages/${id}`,
  },

  NOTIFICATIONS: {
    REGISTER_PUSH_TOKEN: 'notification/push-token/register',
    UNREGISTER_PUSH_TOKEN: 'notification/push-token/unregister',
    UPDATE_SETTINGS: 'notification/settings',
    GET_SETTINGS: 'notification/settings',
  },
}
