import { ComponentType, memo } from 'react'
import {
  Button,
  Card,
  Image,
  Paragraph,
  Text,
  XStack,
  YStack,
  useThemeName,
} from 'tamagui'
import {
  Check,
  ExternalLink,
  MessageCircle,
  UserPlus,
  Users,
} from '@tamagui/lucide-icons'
import type { GroupResult, PostResult, SearchResult, UserResult } from './data'

interface SearchResultCardProps {
  result: SearchResult
  onSendFriendRequest?: (result: UserResult) => void
  onJoinGroup?: (result: GroupResult) => void
  onOpenPost?: (result: PostResult) => void
}

function ActionButton({
  label,
  icon,
  onPress,
  disabled,
}: {
  label: string
  icon: ComponentType<{ size?: number; color?: string }>
  onPress?: () => void
  disabled?: boolean
}) {
  const themeName = useThemeName()
  const isDark = themeName === 'dark'
  const enabledBackground = '#1877F2'
  const disabledBackground = isDark ? 'rgba(255,255,255,0.16)' : '#d9dce3'
  const enabledTextColor = '#ffffff'
  const disabledTextColor = isDark ? 'rgba(255,255,255,0.7)' : '#4b5563'

  return (
    <Button
      size="$3"
      borderRadius={999}
      backgroundColor={disabled ? disabledBackground : enabledBackground}
      color={disabled ? disabledTextColor : enabledTextColor}
      icon={icon as any}
      disabled={disabled}
      onPress={onPress}
      borderColor="transparent"
      pressStyle={{ opacity: disabled ? 1 : 0.85 }}
    >
      {label}
    </Button>
  )
}

function renderActions(
  result: SearchResult,
  handlers: Pick<
    SearchResultCardProps,
    'onJoinGroup' | 'onOpenPost' | 'onSendFriendRequest'
  >
) {
  switch (result.category) {
    case 'users': {
      const user = result as UserResult
      const disabled = user.isFriend
      return (
        <ActionButton
          label={disabled ? 'Friends' : 'Add Friend'}
          icon={disabled ? Check : UserPlus}
          disabled={disabled}
          onPress={
            disabled ? undefined : () => handlers.onSendFriendRequest?.(user)
          }
        />
      )
    }
    case 'groups': {
      const group = result as GroupResult
      const disabled = group.isMember
      return (
        <ActionButton
          label={disabled ? 'Joined' : 'Join Group'}
          icon={Users}
          disabled={disabled}
          onPress={disabled ? undefined : () => handlers.onJoinGroup?.(group)}
        />
      )
    }
    case 'posts': {
      const post = result as PostResult
      return (
        <ActionButton
          label="View Post"
          icon={ExternalLink}
          onPress={() => handlers.onOpenPost?.(post)}
        />
      )
    }
    default:
      return null
  }
}

export const SearchResultCard = memo(function SearchResultCard({
  result,
  onJoinGroup,
  onOpenPost,
  onSendFriendRequest,
}: SearchResultCardProps) {
  const themeName = useThemeName()
  const isDark = themeName === 'dark'
  const cardBackground = isDark ? 'rgba(255,255,255,0.05)' : '#ffffff'
  const cardBorderColor = isDark ? 'rgba(255,255,255,0.08)' : '#e4e6eb'
  const subtitleColor = isDark ? 'rgba(255,255,255,0.68)' : '#4b5563'
  const authorColor = isDark ? 'rgba(255,255,255,0.75)' : '#6b7280'
  const descriptionColor = isDark ? 'rgba(255,255,255,0.78)' : '#374151'

  const subtitle = (() => {
    if (result.category === 'users') {
      const user = result as UserResult
      return `${user.mutualFriends} mutual friends`
    }
    if (result.category === 'groups') {
      const group = result as GroupResult
      return `${group.members.toLocaleString('en-US')} members`
    }
    if (result.category === 'posts') {
      const post = result as PostResult
      return `${post.likes.toLocaleString('en-US')} likes • ${post.comments.toLocaleString('en-US')} comments`
    }
    return ''
  })()

  const SubtitleIcon = (() => {
    if (result.category === 'posts') return MessageCircle
    return Users
  })()

  const author =
    result.category === 'posts' ? (result as PostResult).author : undefined

  return (
    <Card
      bordered
      backgroundColor={cardBackground}
      padding="$3"
      gap="$3"
      animation="quick"
      borderColor={cardBorderColor}
      borderWidth={1}
    >
      <XStack gap="$3">
        {result.category === 'posts' && (result as PostResult).thumbnail ? (
          <Image
            source={{ uri: (result as PostResult).thumbnail }}
            width={96}
            height={96}
            borderRadius={12}
          />
        ) : null}

        <YStack flex={1} gap="$2">
          <YStack gap="$1">
            <Text fontSize="$5" fontWeight="700">
              {result.title}
            </Text>
            {author ? (
              <Text fontSize="$2" color={authorColor}>
                {author}
              </Text>
            ) : null}
            {subtitle ? (
              <XStack gap="$1" alignItems="center">
                <SubtitleIcon size={14} color={subtitleColor} />
                <Text fontSize="$2" color={subtitleColor}>
                  {subtitle}
                </Text>
              </XStack>
            ) : null}
          </YStack>

          <Paragraph size="$3" color={descriptionColor}>
            {result.description}
          </Paragraph>

          <XStack justifyContent="flex-start">
            {renderActions(result, {
              onJoinGroup,
              onOpenPost,
              onSendFriendRequest,
            })}
          </XStack>
        </YStack>
      </XStack>
    </Card>
  )
})
