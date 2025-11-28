import React from 'react'
import { useLocalSearchParams } from 'expo-router'
import GroupDetailScreen from '../../src/features/groups/GroupDetailScreen'

export default function GroupPage() {
  const { id } = useLocalSearchParams<{ id: string }>()

  if (!id) {
    return null
  }

  return <GroupDetailScreen groupId={id} />
}
