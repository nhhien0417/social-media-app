export const notifications = [
  {
    id: '1',
    senderId: 'user-5',
    receiverId: 'current-user',
    message: 'Ms.chinh, B Ray and 2 others recently shared 5 posts.',
    createdAt: new Date(Date.now() - 19 * 3600 * 1000).toISOString(),
    read: false,
    type: 'NEW_POST',
  },
  {
    id: '2',
    senderId: 'user-15',
    receiverId: 'current-user',
    message:
      'Thuan Vo commented on your post in Chợ GearVN 2nd: Logitech-Zowie-Hyperx-Razer...',
    createdAt: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString(),
    read: true,
    type: 'COMMENT_ON_POST',
  },
  {
    id: '3',
    senderId: 'user-10',
    receiverId: 'current-user',
    message:
      "adidas posted a new reel: 'BÙNG NỔ SỰ KIỆN KHAI TRƯƠNG CỬA HÀNG HOME OF SPORTS VI...'",
    createdAt: new Date(Date.now() - 4 * 24 * 3600 * 1000).toISOString(),
    read: true,
    type: 'NEW_POST',
  },
  {
    id: '4',
    senderId: 'user-3',
    receiverId: 'current-user',
    message:
      'The Fire Monkey, a Page you recently viewed, invited you to join their private group Săn deal cùng...',
    createdAt: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString(),
    read: true,
    type: 'GROUP_INVITE',
  },
]
