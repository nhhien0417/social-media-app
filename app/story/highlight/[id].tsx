import { useLocalSearchParams } from 'expo-router'
import HighlightViewer from '@/features/story/HighlightViewer'
import { profileMock } from '@/mock/profile'
import { YStack, Text, Spinner } from 'tamagui'
import { useEffect } from 'react'

export default function HighlightScreen() {
  const { id, username, avatarUrl } = useLocalSearchParams<{
    id: string
    username?: string
    avatarUrl?: string
  }>()

  useEffect(() => {
    console.log('HighlightScreen params:', { id, username, avatarUrl })
    console.log('Available highlights:', profileMock.highlights.map(h => h.id))
  }, [id, username, avatarUrl])

  // Find the highlight from mock data
  const highlight = profileMock.highlights.find(h => h.id === id)

  useEffect(() => {
    if (highlight) {
      console.log('Found highlight:', highlight.label, 'Stories:', highlight.stories?.length)
    } else {
      console.log('Highlight not found for id:', id)
    }
  }, [highlight, id])

  if (!id) {
    return (
      <YStack flex={1} alignItems="center" justifyContent="center" backgroundColor="#000">
        <Text color="white">No highlight ID provided</Text>
      </YStack>
    )
  }

  if (!highlight) {
    return (
      <YStack flex={1} alignItems="center" justifyContent="center" backgroundColor="#000">
        <Text color="white">Highlight not found: {id}</Text>
      </YStack>
    )
  }

  if (!highlight.stories || highlight.stories.length === 0) {
    return (
      <YStack flex={1} alignItems="center" justifyContent="center" backgroundColor="#000">
        <Text color="white">No stories in this highlight</Text>
      </YStack>
    )
  }

  return (
    <HighlightViewer
      highlight={highlight}
      username={username}
      avatarUrl={avatarUrl}
    />
  )
}
