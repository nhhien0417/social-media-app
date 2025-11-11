import React from 'react'
import { useLocalSearchParams } from 'expo-router'
import FriendsScreen from '../../src/features/profile/FriendsScreen'

export default function FriendsPage() {
  const params = useLocalSearchParams<{ isOwnProfile?: string }>()
  const isOwnProfile = params.isOwnProfile === 'true'

  return <FriendsScreen isOwnProfile={isOwnProfile} />
}
