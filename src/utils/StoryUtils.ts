import { Post } from '@/types/Post'

export interface StoryGroup {
  authorId: string
  stories: Post[]
  hasUnseen: boolean
  latestCreatedAt: string
}

export function groupAndSortStories(
  stories: Post[],
  currentUserId: string | undefined
): Post[][] {
  if (!stories || stories.length === 0) return []
  const groups: { [key: string]: Post[] } = {}

  // 1. Group by author
  stories.forEach(story => {
    if (!story.authorProfile) return
    const authorId = story.authorProfile.id
    if (!groups[authorId]) {
      groups[authorId] = []
    }
    groups[authorId].push(story)
  })

  const sortableGroups: StoryGroup[] = Object.keys(groups).map(authorId => {
    const userStories = groups[authorId]
    userStories.sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    )

    const hasUnseen = userStories.some(
      story => !story.seenBy?.includes(currentUserId || '')
    )

    const latestStory = userStories[userStories.length - 1]

    return {
      authorId,
      stories: userStories,
      hasUnseen,
      latestCreatedAt: latestStory.createdAt,
    }
  })

  sortableGroups.sort((a, b) => {
    if (a.authorId === currentUserId) return -1
    if (b.authorId === currentUserId) return 1

    if (a.hasUnseen && !b.hasUnseen) return -1
    if (!a.hasUnseen && b.hasUnseen) return 1

    return (
      new Date(b.latestCreatedAt).getTime() -
      new Date(a.latestCreatedAt).getTime()
    )
  })

  return sortableGroups.map(group => group.stories)
}

export function getFirstUnseenStoryId(
  stories: Post[],
  currentUserId: string | undefined
): string {
  const unseenStory = stories.find(
    story => !story.seenBy?.includes(currentUserId || '')
  )
  return unseenStory ? unseenStory.id : stories[0].id
}

export function getFirstUnseenStoryIndex(
  stories: Post[],
  currentUserId: string | undefined
): number {
  const index = stories.findIndex(
    story => !story.seenBy?.includes(currentUserId || '')
  )
  return index !== -1 ? index : 0
}
