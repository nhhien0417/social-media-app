import { ScrollView, ActivityIndicator } from 'react-native'
import { YStack, Text } from 'tamagui'
import { UserCard } from './Card'
import { User } from '@/types/User'

type CardType = 'friend' | 'request' | 'sent' | 'suggestion'

interface FriendsListProps {
  users: User[]
  type: CardType
  isDark: boolean
  isLoading?: boolean
  emptyMessage?: string
  showSuggestions?: boolean
  suggestions?: User[]
  onAddFriend?: (userId: string) => void
  onAcceptFriend?: (userId: string) => void
  onCancelRequest?: (userId: string) => void
  onRejectFriend?: (userId: string) => void
  onUnfriend?: (userId: string) => void
  actionPending?: boolean
}

export function FriendsList({
  users,
  type,
  isDark,
  isLoading = false,
  emptyMessage = 'No users found',
  showSuggestions = false,
  suggestions = [],
  onAddFriend,
  onAcceptFriend,
  onCancelRequest,
  onRejectFriend,
  onUnfriend,
  actionPending = false,
}: FriendsListProps) {
  const textColor = isDark ? '#f5f5f5' : '#111827'
  const subtitleColor = isDark ? 'rgba(255,255,255,0.6)' : '#6b7280'

  // Get section title based on type
  const getSectionTitle = () => {
    switch (type) {
      case 'friend':
        return 'All Friends'
      case 'request':
        return 'Friend Requests'
      case 'sent':
        return 'Pending Requests'
      default:
        return 'All Friends'
    }
  }

  if (isLoading) {
    return (
      <YStack flex={1} alignItems="center" justifyContent="center" padding="$6">
        <ActivityIndicator size="large" color="#0095F6" />
      </YStack>
    )
  }

  return (
    <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
      {users.length === 0 && !showSuggestions ? (
        <YStack alignItems="center" justifyContent="center" padding="$8">
          <Text fontSize={15} color={subtitleColor}>
            {emptyMessage}
          </Text>
        </YStack>
      ) : (
        <YStack paddingBottom="$6">
          {/* Main Section */}
          {users.length > 0 && (
            <>
              <Text
                fontSize={15}
                fontWeight="600"
                color={textColor}
                paddingHorizontal="$4"
                paddingTop="$2"
                paddingBottom="$2"
              >
                {getSectionTitle()}
              </Text>

              {users.map(user => (
                <UserCard
                  key={user.id}
                  user={user}
                  type={type}
                  isDark={isDark}
                  onAccept={onAcceptFriend}
                  onCancel={onCancelRequest}
                  onReject={onRejectFriend}
                  onUnfriend={onUnfriend}
                  isLoading={actionPending}
                />
              ))}
            </>
          )}

          {/* Suggestions Section */}
          {showSuggestions && suggestions.length > 0 && (
            <YStack marginTop={users.length > 0 ? '$1' : '$0'}>
              <Text
                fontSize={15}
                fontWeight="600"
                color={textColor}
                paddingHorizontal="$4"
                paddingTop="$2"
                paddingBottom="$2"
              >
                Suggestions For You
              </Text>

              {suggestions.map(user => (
                <UserCard
                  key={user.id}
                  user={user}
                  type="suggestion"
                  isDark={isDark}
                  onAddFriend={onAddFriend}
                  isLoading={actionPending}
                />
              ))}
            </YStack>
          )}
        </YStack>
      )}
    </ScrollView>
  )
}
