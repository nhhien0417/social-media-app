import { Pressable } from 'react-native'
import { XStack, Text } from 'tamagui'
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
      <Text fontSize="$7" fontWeight="700" color="$color">
        Notifications
      </Text>

      <Pressable
        onPress={onMorePress}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        style={{ opacity: 1 }}
      >
        <MoreVertical size={24} color="$color" />
      </Pressable>
    </XStack>
  )
}
