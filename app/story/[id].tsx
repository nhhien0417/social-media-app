import { router, useLocalSearchParams } from 'expo-router'
import React from 'react'
import StoryViewer from '@/features/story/StoryViewer'

export default function StoryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()

  return <StoryViewer initialStoryId={id} />
}
