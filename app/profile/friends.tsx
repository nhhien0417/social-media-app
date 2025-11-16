import React from 'react'
import { useLocalSearchParams } from 'expo-router'
import FriendsScreen from '../../src/features/friends/FriendsScreen'

export default function FriendsPage() {
  const params = useLocalSearchParams<{
    isOwnProfile?: string
    userId?: string
  }>()
  const isOwnProfile = params.isOwnProfile === 'true'
  const userId = params.userId

  return <FriendsScreen userId={userId} isOwnProfile={isOwnProfile} />
}
