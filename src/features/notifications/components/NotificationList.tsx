import { YStack, XStack, Text, Button, ScrollView } from 'tamagui'
import Avatar from '@/components/Avatar'
import { MoreVertical } from '@tamagui/lucide-icons'
import type { NotificationItem } from '@/types/Notification'

interface NotificationListProps {
  notifications: NotificationItem[]
  isScrollable: boolean
  onNotificationPress: (notification: NotificationItem) => void
  onMorePress: (notification: NotificationItem) => void
  onLayout: (event: any) => void
  onContentSizeChange: (width: number, height: number) => void
}

export default function NotificationList({
  notifications,
  isScrollable,
  onNotificationPress,
  onMorePress,
  onLayout,
  onContentSizeChange,
}: NotificationListProps) {
  // Group notifications by section
  const grouped = notifications.reduce<Record<string, NotificationItem[]>>(
    (acc, item) => {
      if (!acc[item.section]) acc[item.section] = []
      acc[item.section].push(item)
      return acc
    },
    {}
  )

  return (
    <ScrollView
      backgroundColor="$background"
      showsVerticalScrollIndicator={false}
      onLayout={onLayout}
      onContentSizeChange={onContentSizeChange}
      contentContainerStyle={{
        paddingHorizontal: 16,
        paddingBottom: 24,
      }}
    >
      {(Object.entries(grouped) as [string, NotificationItem[]][]).map(
        ([section, items]) => (
          <YStack key={section} marginBottom="$4">
            <Text
              color="$color"
              fontWeight="700"
              fontSize="$5"
              marginBottom="$2"
            >
              {section}
            </Text>

            {items.map(item => (
              <YStack
                key={item.id}
                backgroundColor={
                  item.unread ? '$backgroundPress' : '$background'
                }
                borderRadius="$4"
                padding="$3"
                marginBottom="$2"
                pressStyle={{ opacity: 0.8 }}
                onPress={() => onNotificationPress(item)}
              >
                <XStack alignItems="center" gap="$3">
                  <Avatar uri={item.avatar || ''} size={60} />
                  <YStack flex={1}>
                    <Text color="$color" fontSize="$4">
                      {item.message}
                    </Text>
                    <Text color="$gray8" fontSize="$3" marginTop={2}>
                      {item.time}
                    </Text>
                  </YStack>

                  {item.unread && (
                    <YStack
                      width={8}
                      height={8}
                      borderRadius="$10"
                      backgroundColor="$blue10"
                    />
                  )}

                  <Button
                    size="$3"
                    chromeless
                    onPress={() => onMorePress(item)}
                    icon={<MoreVertical size={20} color="$color" />}
                  />
                </XStack>

                {item.actions && (
                  <XStack gap="$2" marginTop="$3">
                    {item.actions.map((action, idx) => (
                      <Button
                        key={idx}
                        flex={1}
                        theme={
                          action.type === 'primary' ? 'primary' : undefined
                        }
                        {...(action.type === 'primary'
                          ? {}
                          : { variant: 'outlined' })}
                        borderRadius="$6"
                      >
                        {action.label}
                      </Button>
                    ))}
                  </XStack>
                )}
              </YStack>
            ))}
          </YStack>
        )
      )}

      {isScrollable && (
        <YStack alignItems="center" marginTop="$4" marginBottom="$8">
          <Button variant="outlined" borderRadius="$6" color="$gray9" size="$4">
            See previous notifications
          </Button>
        </YStack>
      )}
    </ScrollView>
  )
}
