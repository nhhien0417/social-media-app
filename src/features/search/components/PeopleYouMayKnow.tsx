import { memo, useEffect } from 'react'
import { ScrollView, Pressable } from 'react-native'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Spinner,
  Text,
  XStack,
  YStack,
  Card,
  useThemeName,
} from 'tamagui'
import { useProfileStore } from '@/stores/profileStore'
import { User } from '@/types/User'
import { router } from 'expo-router'
import { getAvatarUrl } from '@/utils/Avatar'

interface SuggestionCardProps {
  user: User
  isDark: boolean
}

const SuggestionCard = memo(function SuggestionCard({
  user,
  isDark,
}: SuggestionCardProps) {
  const textColor = isDark ? '#f5f5f5' : '#111827'
  const subtitleColor = isDark ? 'rgba(255,255,255,0.6)' : '#6b7280'
  const cardBackground = isDark ? '#1f1f1f' : '#ffffff'
  const borderColor = isDark ? '#2a2a2a' : '#e5e7eb'

  const displayName =
    user.firstName && user.lastName
      ? `${user.firstName} ${user.lastName}`
      : user.username || 'Unknown User'

  const getInitials = () => {
    if (user.firstName && user.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
    }
    return user.username ? user.username[0].toUpperCase() : 'U'
  }

  const handleNavigateToProfile = () => {
    const currentUserId = useProfileStore.getState().currentUserId
    if (currentUserId && user.id === currentUserId) {
      router.push('/(tabs)/profile')
    } else {
      router.push({
        pathname: '/profile/[id]',
        params: { id: user.id },
      })
    }
  }

  return (
    <Card
      width={150}
      backgroundColor={cardBackground}
      borderRadius={20}
      borderColor={borderColor}
      borderWidth={1}
      padding="$3"
      elevate
      elevation={isDark ? 0 : 2}
    >
      <YStack alignItems="center" gap="$3">
        <Pressable onPress={handleNavigateToProfile}>
          <Avatar size="$6" circular>
            <AvatarImage
              src={user.avatarUrl || getAvatarUrl(user.username || 'user')}
            />
            <AvatarFallback backgroundColor={isDark ? '#374151' : '#dbeafe'}>
              <Text fontWeight="700" color={textColor} fontSize={20}>
                {getInitials()}
              </Text>
            </AvatarFallback>
          </Avatar>
        </Pressable>

        <Pressable onPress={handleNavigateToProfile} style={{ width: '100%' }}>
          <YStack alignItems="center" gap="$1.5">
            <Text
              fontSize={14}
              fontWeight="700"
              color={textColor}
              textAlign="center"
              numberOfLines={1}
            >
              {displayName}
            </Text>
            {user.username && (
              <Text
                fontSize={12}
                color={subtitleColor}
                textAlign="center"
                numberOfLines={1}
              >
                @{user.username}
              </Text>
            )}
          </YStack>
        </Pressable>
      </YStack>
    </Card>
  )
})

export const PeopleYouMayKnow = memo(function PeopleYouMayKnow() {
  const themeName = useThemeName()
  const isDark = themeName === 'dark'
  const titleColor = isDark ? '#f5f5f5' : '#111827'
  const subtitleColor = isDark ? 'rgba(255,255,255,0.65)' : '#4b5563'

  const { suggestions, fetchSuggestions, isLoading } = useProfileStore()

  useEffect(() => {
    fetchSuggestions()
  }, [fetchSuggestions])

  const handleViewAll = () => {
    router.push('/profile/friends')
  }

  if (isLoading) {
    return (
      <YStack gap="$3" alignItems="center" padding="$4">
        <Spinner size="large" color={titleColor} />
        <Text fontSize="$3" color={subtitleColor}>
          Loading suggestions...
        </Text>
      </YStack>
    )
  }

  if (!suggestions.length) {
    return null
  }

  return (
    <YStack gap="$3">
      <XStack justifyContent="space-between" alignItems="center">
        <Text fontSize="$5" fontWeight="700" color={titleColor}>
          People you may know
        </Text>
        <Pressable onPress={handleViewAll}>
          <Text fontSize={14} color="#0095F6" fontWeight="600">
            See All
          </Text>
        </Pressable>
      </XStack>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 12, paddingRight: 12 }}
      >
        {suggestions.slice(0, 10).map(user => (
          <SuggestionCard key={user.id} user={user} isDark={isDark} />
        ))}
      </ScrollView>
    </YStack>
  )
})
