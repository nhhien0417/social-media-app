import { memo } from 'react'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Text,
  XStack,
  YStack,
  useThemeName,
} from 'tamagui'
import { Check, UserPlus } from '@tamagui/lucide-icons'
import type { UserResult } from '../data'

interface PeopleYouMayKnowProps {
  users: UserResult[]
  onAddFriend?: (user: UserResult) => void
}

export const PeopleYouMayKnow = memo(function PeopleYouMayKnow({
  users,
  onAddFriend,
}: PeopleYouMayKnowProps) {
  const themeName = useThemeName()
  const isDark = themeName === 'dark'
  const titleColor = isDark ? '#f5f5f5' : '#111827'
  const subtitleColor = isDark ? 'rgba(255,255,255,0.65)' : '#4b5563'
  const buttonBackground = '#1877F2'
  const buttonTextColor = '#ffffff'
  const buttonDisabledBackground = isDark ? 'rgba(255,255,255,0.12)' : '#e5e7eb'
  const buttonDisabledTextColor = isDark ? 'rgba(255,255,255,0.7)' : '#4b5563'

  if (!users.length) {
    return null
  }

  return (
    <YStack gap="$3">
      <Text fontSize="$5" fontWeight="600" color={titleColor}>
        People you may know
      </Text>

      <YStack gap="$3">
        {users.map(user => (
          <XStack key={user.id} gap="$3" alignItems="center">
            <Avatar size="$5">
              <AvatarImage
                src={`https://source.boringavatars.com/marble/120/${encodeURIComponent(
                  user.title
                )}?colors=0F172A,2563EB,22D3EE,F472B6,FACC15`}
                alt={user.title}
              />
              <AvatarFallback backgroundColor={isDark ? '#1f2937' : '#e5e7eb'}>
                <Text fontWeight="700" color={titleColor}>
                  {user.title[0]?.toUpperCase() ?? 'U'}
                </Text>
              </AvatarFallback>
            </Avatar>

            <YStack flex={1} gap="$1">
              <Text fontSize="$4" fontWeight="600" color={titleColor}>
                {user.title}
              </Text>
              <Text fontSize="$3" color={subtitleColor}>
                {user.description}
              </Text>
              <Text fontSize="$2" color={subtitleColor}>
                {user.mutualFriends} mutual friends
              </Text>
            </YStack>

            <Button
              size="$3"
              borderRadius={999}
              paddingHorizontal="$4"
              backgroundColor={
                user.isFriend ? buttonDisabledBackground : buttonBackground
              }
              color={user.isFriend ? buttonDisabledTextColor : buttonTextColor}
              icon={user.isFriend ? Check : UserPlus}
              disabled={user.isFriend}
              onPress={() => onAddFriend?.(user)}
            >
              {user.isFriend ? 'Friends' : 'Add friend'}
            </Button>
          </XStack>
        ))}
      </YStack>
    </YStack>
  )
})
