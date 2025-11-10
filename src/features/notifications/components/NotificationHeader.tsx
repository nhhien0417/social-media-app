import { XStack, YStack, Text, Button } from 'tamagui'
import { MoreVertical, Wifi, WifiOff } from '@tamagui/lucide-icons'

interface NotificationHeaderProps {
  unreadCount: number
  isConnected: boolean
  onMorePress: () => void
}

export default function NotificationHeader({
  unreadCount,
  isConnected,
  onMorePress,
}: NotificationHeaderProps) {
  return (
    <XStack
      width="100%"
      alignItems="center"
      justifyContent="space-between"
      padding="$3"
    >
      <XStack alignItems="center" gap="$2">
        <Text fontSize="$7" fontWeight="700" color="$color">
          Notifications
        </Text>
        {unreadCount > 0 && (
          <YStack
            backgroundColor="$red10"
            borderRadius="$10"
            paddingHorizontal="$2"
            paddingVertical="$1"
            minWidth={20}
            alignItems="center"
          >
            <Text fontSize="$2" fontWeight="700" color="white">
              {unreadCount > 99 ? '99+' : unreadCount}
            </Text>
          </YStack>
        )}
      </XStack>

      <XStack gap="$2" alignItems="center">
        {isConnected ? (
          <Wifi size={16} color="$green10" />
        ) : (
          <WifiOff size={16} color="$red10" />
        )}

        <Button
          size="$3"
          chromeless
          onPress={onMorePress}
          color="$color"
          icon={<MoreVertical size={24} />}
        />
      </XStack>
    </XStack>
  )
}
