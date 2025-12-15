import { Post } from '@/types/Post'

type PostUpdater = (post: Post) => Post

interface PostSnapshot {
  postStorePost: Post | null
  profileStorePost: Post | null
  groupStorePost: Post | null
  profileUserId: string | null
}

async function capturePostSnapshot(postId: string): Promise<PostSnapshot> {
  const { usePostStore } = await import('@/stores/postStore')
  const { useProfileStore } = await import('@/stores/profileStore')
  const { useGroupStore } = await import('@/stores/groupStore')

  const postStore = usePostStore.getState()
  const profileStore = useProfileStore.getState()
  const groupStore = useGroupStore.getState()

  const postStorePost =
    postStore.posts.find(p => p.id === postId) ||
    postStore.stories.find(p => p.id === postId) ||
    null

  let profileStorePost: Post | null = null
  let profileUserId: string | null = null

  for (const userId in profileStore.users) {
    const user = profileStore.users[userId]
    if (user.posts) {
      const post = user.posts.find(p => p.id === postId)
      if (post) {
        profileStorePost = post
        profileUserId = userId
        break
      }
    }
  }

  const groupStorePost = groupStore.posts.find(p => p.id === postId) || null

  return { postStorePost, profileStorePost, groupStorePost, profileUserId }
}

async function restorePostSnapshot(snapshot: PostSnapshot): Promise<void> {
  const { usePostStore } = await import('@/stores/postStore')
  const { useProfileStore } = await import('@/stores/profileStore')
  const { useGroupStore } = await import('@/stores/groupStore')

  const postStore = usePostStore.getState()
  const profileStore = useProfileStore.getState()

  if (snapshot.postStorePost) {
    const isStory = snapshot.postStorePost.type === 'STORY'
    const targetArray = isStory ? postStore.stories : postStore.posts
    const stateKey = isStory ? 'stories' : 'posts'

    const index = targetArray.findIndex(
      p => p.id === snapshot.postStorePost!.id
    )
    if (index !== -1) {
      const newArray = [...targetArray]
      newArray[index] = snapshot.postStorePost
      usePostStore.setState({ [stateKey]: newArray })
    } else {
      usePostStore.setState({
        [stateKey]: [snapshot.postStorePost, ...targetArray],
      })
    }
  }

  if (snapshot.profileStorePost && snapshot.profileUserId) {
    const user = profileStore.users[snapshot.profileUserId]
    if (user && user.posts) {
      const postIndex = user.posts.findIndex(
        p => p.id === snapshot.profileStorePost!.id
      )
      let updatedUserPosts: Post[]

      if (postIndex !== -1) {
        updatedUserPosts = [...user.posts]
        updatedUserPosts[postIndex] = snapshot.profileStorePost
      } else {
        updatedUserPosts = [snapshot.profileStorePost, ...user.posts]
      }

      useProfileStore.setState({
        users: {
          ...profileStore.users,
          [snapshot.profileUserId]: {
            ...user,
            posts: updatedUserPosts,
          },
        },
        currentUser:
          profileStore.currentUser?.id === snapshot.profileUserId
            ? { ...profileStore.currentUser, posts: updatedUserPosts }
            : profileStore.currentUser,
      })
    }
  }

  if (snapshot.groupStorePost) {
    const groupStore = useGroupStore.getState()
    const index = groupStore.posts.findIndex(
      p => p.id === snapshot.groupStorePost!.id
    )
    if (index !== -1) {
      const newPosts = [...groupStore.posts]
      newPosts[index] = snapshot.groupStorePost
      useGroupStore.setState({ posts: newPosts })
    } else {
      useGroupStore.setState({
        posts: [snapshot.groupStorePost, ...groupStore.posts],
      })
    }
  }
}

export async function updatePostInStores(
  postId: string,
  updater: PostUpdater
): Promise<void> {
  const { usePostStore } = await import('@/stores/postStore')
  const { useProfileStore } = await import('@/stores/profileStore')
  const { useGroupStore } = await import('@/stores/groupStore')

  const postStore = usePostStore.getState()
  const profileStore = useProfileStore.getState()
  const groupStore = useGroupStore.getState()

  const postIndex = postStore.posts.findIndex(p => p.id === postId)
  if (postIndex !== -1) {
    const updatedPosts = [...postStore.posts]
    updatedPosts[postIndex] = updater(updatedPosts[postIndex])
    usePostStore.setState({ posts: updatedPosts })
  }

  const storyIndex = postStore.stories.findIndex(p => p.id === postId)
  if (storyIndex !== -1) {
    const updatedStories = [...postStore.stories]
    updatedStories[storyIndex] = updater(updatedStories[storyIndex])
    usePostStore.setState({ stories: updatedStories })
  }

  for (const userId in profileStore.users) {
    const user = profileStore.users[userId]
    if (user.posts) {
      const userPostIndex = user.posts.findIndex(p => p.id === postId)
      if (userPostIndex !== -1) {
        const updatedUserPosts = [...user.posts]
        updatedUserPosts[userPostIndex] = updater(
          updatedUserPosts[userPostIndex]
        )

        useProfileStore.setState({
          users: {
            ...profileStore.users,
            [userId]: {
              ...user,
              posts: updatedUserPosts,
            },
          },
          currentUser:
            profileStore.currentUser?.id === userId
              ? { ...profileStore.currentUser, posts: updatedUserPosts }
              : profileStore.currentUser,
        })
        break
      }
    }
  }

  const groupPostIndex = groupStore.posts.findIndex(p => p.id === postId)
  if (groupPostIndex !== -1) {
    const updatedGroupPosts = [...groupStore.posts]
    updatedGroupPosts[groupPostIndex] = updater(
      updatedGroupPosts[groupPostIndex]
    )
    useGroupStore.setState({ posts: updatedGroupPosts })
  }
}

export async function addPostToStores(post: Post): Promise<void> {
  const { usePostStore } = await import('@/stores/postStore')
  const { useProfileStore } = await import('@/stores/profileStore')
  const { useGroupStore } = await import('@/stores/groupStore')

  const postStore = usePostStore.getState()
  const profileStore = useProfileStore.getState()
  const groupStore = useGroupStore.getState()

  if (post.type === 'STORY') {
    usePostStore.setState({
      stories: [post, ...postStore.stories],
    })
  } else {
    usePostStore.setState({
      posts: [post, ...postStore.posts],
    })
  }

  const authorId = post.authorProfile?.id
  if (authorId && profileStore.users[authorId]) {
    const user = profileStore.users[authorId]
    const updatedUserPosts = [post, ...(user.posts || [])]

    useProfileStore.setState({
      users: {
        ...profileStore.users,
        [authorId]: {
          ...user,
          posts: updatedUserPosts,
        },
      },
      currentUser:
        profileStore.currentUser?.id === authorId
          ? { ...profileStore.currentUser, posts: updatedUserPosts }
          : profileStore.currentUser,
    })
  }

  if (post.groupId && groupStore.currentGroup?.id === post.groupId) {
    useGroupStore.setState({
      posts: [post, ...groupStore.posts],
    })
  }
}

export async function deletePostFromStores(
  postId: string
): Promise<PostSnapshot> {
  const snapshot = await capturePostSnapshot(postId)

  const { usePostStore } = await import('@/stores/postStore')
  const { useProfileStore } = await import('@/stores/profileStore')
  const { useGroupStore } = await import('@/stores/groupStore')

  const postStore = usePostStore.getState()
  const profileStore = useProfileStore.getState()
  const groupStore = useGroupStore.getState()

  usePostStore.setState({
    posts: postStore.posts.filter(p => p.id !== postId),
    stories: postStore.stories.filter(p => p.id !== postId),
  })

  for (const userId in profileStore.users) {
    const user = profileStore.users[userId]
    if (user.posts) {
      const hasPost = user.posts.some(p => p.id === postId)
      if (hasPost) {
        const updatedUserPosts = user.posts.filter(p => p.id !== postId)

        useProfileStore.setState({
          users: {
            ...profileStore.users,
            [userId]: {
              ...user,
              posts: updatedUserPosts,
            },
          },
          currentUser:
            profileStore.currentUser?.id === userId
              ? { ...profileStore.currentUser, posts: updatedUserPosts }
              : profileStore.currentUser,
        })
        break
      }
    }
  }

  useGroupStore.setState({
    posts: groupStore.posts.filter(p => p.id !== postId),
  })

  return snapshot
}

export async function addSeenToStores(
  postId: string,
  userId: string
): Promise<void> {
  await updatePostInStores(postId, post => {
    const currentSeenBy = post.seenBy || []
    if (currentSeenBy.includes(userId)) {
      return post
    }
    return { ...post, seenBy: [...currentSeenBy, userId] }
  })
}

export async function toggleLikeInStores(
  postId: string,
  userId: string
): Promise<PostSnapshot> {
  const snapshot = await capturePostSnapshot(postId)

  await updatePostInStores(postId, post => {
    const isLiked = post.likes.includes(userId)
    const updatedLikes = isLiked
      ? post.likes.filter(id => id !== userId)
      : [...post.likes, userId]

    return { ...post, likes: updatedLikes }
  })

  return snapshot
}

export async function updatePostWithSnapshot(
  postId: string,
  updatedPost: Post
): Promise<PostSnapshot> {
  const snapshot = await capturePostSnapshot(postId)
  await updatePostInStores(postId, () => updatedPost)
  return snapshot
}

export { restorePostSnapshot }
