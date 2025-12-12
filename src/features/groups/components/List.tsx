import { ScrollView, ActivityIndicator } from 'react-native'
import { YStack, Text } from 'tamagui'
import { GroupCard } from './Card'
import { Group } from '@/types/Group'

type CardType = 'joined' | 'pending' | 'suggestion'

interface GroupsListProps {
  groups: Group[]
  type: CardType
  isDark: boolean
  isLoading?: boolean
  emptyMessage?: string
  onJoinGroup?: (groupId: string) => void
  onCancelRequest?: (groupId: string) => void
  onLeaveGroup?: (groupId: string) => void
  actionPending?: boolean
}

export function GroupsList({
  groups,
  type,
  isDark,
  isLoading = false,
  emptyMessage = 'No groups found',
  onJoinGroup,
  onCancelRequest,
  onLeaveGroup,
  actionPending = false,
}: GroupsListProps) {
  const textColor = isDark ? '#f5f5f5' : '#111827'
  const subtitleColor = isDark ? 'rgba(255,255,255,0.6)' : '#6b7280'

  // Get section title based on type
  const getSectionTitle = () => {
    switch (type) {
      case 'joined':
        return 'Your Groups'
      case 'pending':
        return 'Pending Requests'
      default:
        return 'Your Groups'
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
      {groups.length === 0 ? (
        <YStack alignItems="center" justifyContent="center" padding="$8">
          <Text fontSize={15} color={subtitleColor}>
            {emptyMessage}
          </Text>
        </YStack>
      ) : (
        <YStack paddingBottom="$6">
          {/* Main Section */}
          {groups.length > 0 && (
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

              {groups.map(group => (
                <GroupCard
                  key={group.id}
                  group={group}
                  type={type}
                  isDark={isDark}
                  onJoinGroup={onJoinGroup}
                  onCancelRequest={onCancelRequest}
                  onLeaveGroup={onLeaveGroup}
                  isLoading={actionPending}
                />
              ))}
            </>
          )}
        </YStack>
      )}
    </ScrollView>
  )
}
