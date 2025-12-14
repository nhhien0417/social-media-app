import React from 'react'
import { useLocalSearchParams } from 'expo-router'
import GroupsScreen from '../../src/features/groups/GroupsScreen'

export default function GroupsPage() {
  const { isOwnProfile, userId } = useLocalSearchParams<{
    isOwnProfile?: string
    userId?: string
  }>()

  const isOwn = isOwnProfile !== 'false'

  return <GroupsScreen isOwnProfile={isOwn} userId={userId} />
}
