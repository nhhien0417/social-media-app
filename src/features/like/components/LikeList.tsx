import React from 'react'
import { FlatList, StyleSheet } from 'react-native'
import { YStack, SizableText } from 'tamagui'
import LikeItem from './LikeItem'
import { User } from '@/types/User'

interface LikeListProps {
  users: User[]
  currentUserId?: string
  onClose?: () => void
}

export default function LikeList({
  users,
  currentUserId,
  onClose,
}: LikeListProps) {
  if (users.length === 0) {
    return (
      <YStack flex={1} alignItems="center" justifyContent="center" padding="$4">
        <SizableText color="#888">No likes yet</SizableText>
      </YStack>
    )
  }

  return (
    <FlatList
      data={users}
      keyExtractor={item => item.id}
      renderItem={({ item }) => (
        <LikeItem user={item} currentUserId={currentUserId} onClose={onClose} />
      )}
      contentContainerStyle={styles.listContent}
      showsVerticalScrollIndicator={false}
    />
  )
}

const styles = StyleSheet.create({
  listContent: {
    paddingBottom: 20,
  },
})
