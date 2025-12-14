import React from 'react'
import { useLocalSearchParams } from 'expo-router'
import FriendsScreen from '../../src/features/friends/FriendsScreen'

export default function FriendsPage() {
  const { isOwnProfile, userId } = useLocalSearchParams<{
    isOwnProfile?: string
    userId?: string
  }>()

  const isOwn = isOwnProfile !== 'false'

  return <FriendsScreen isOwnProfile={isOwn} userId={userId} />
}
