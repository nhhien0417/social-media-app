import { XStack, Text, Button } from 'tamagui'
import { MoreVertical } from '@tamagui/lucide-icons'

interface NotificationHeaderProps {
  onMorePress: () => void
}

export default function NotificationHeader({
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
      </XStack>

      <XStack gap="$2" alignItems="center">
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
