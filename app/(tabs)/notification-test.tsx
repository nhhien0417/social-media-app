import { useEffect } from 'react'
import { View } from 'react-native'
import { YStack, XStack, Text, Circle, ScrollView, Separator } from 'tamagui'
import { useNotifications } from '@/providers/NotificationProvider'
import { Wifi, WifiOff, Bell } from '@tamagui/lucide-icons'

/**
 * Component để test WebSocket connection và nhận notifications real-time
 * Hiển thị status kết nối và danh sách notifications
 */
export default function NotificationTestScreen() {
  const { notifications, unreadCount, isConnected } = useNotifications()

  // Log mỗi khi có thay đổi
  useEffect(() => {
    console.log(
      '🔔 Connection status:',
      isConnected ? 'Connected ✅' : 'Disconnected ❌'
    )
    console.log('🔔 Total notifications:', notifications.length)
    console.log('🔔 Unread count:', unreadCount)
  }, [isConnected, notifications.length, unreadCount])

  // Log chi tiết khi có notification mới
  useEffect(() => {
    if (notifications.length > 0) {
      const latest = notifications[0]
      console.log('🔔 Latest notification:', {
        id: latest.id,
        message: latest.message,
        type: latest.type,
        unread: latest.unread,
        section: latest.section,
      })
    }
  }, [notifications])

  return (
    <YStack flex={1} backgroundColor="$background" padding="$4">
      {/* Header */}
      <YStack marginBottom="$4">
        <Text fontSize="$8" fontWeight="700" color="$color">
          Notification Test
        </Text>
        <Text fontSize="$3" color="$gray10">
          Test WebSocket connection và nhận notifications
        </Text>
      </YStack>

      {/* Connection Status Card */}
      <YStack
        backgroundColor="$backgroundHover"
        borderRadius="$4"
        padding="$4"
        marginBottom="$4"
        borderWidth={2}
        borderColor={isConnected ? '$green8' : '$red8'}
      >
        <XStack alignItems="center" gap="$3" marginBottom="$3">
          {isConnected ? (
            <Wifi size={24} color="$green10" />
          ) : (
            <WifiOff size={24} color="$red10" />
          )}
          <Text fontSize="$6" fontWeight="600" color="$color">
            WebSocket Status
          </Text>
        </XStack>

        <YStack gap="$2">
          <XStack justifyContent="space-between">
            <Text color="$gray10">Connection:</Text>
            <Text color={isConnected ? '$green10' : '$red10'} fontWeight="600">
              {isConnected ? 'Connected ✅' : 'Disconnected ❌'}
            </Text>
          </XStack>
          <XStack justifyContent="space-between">
            <Text color="$gray10">Total Notifications:</Text>
            <Text color="$color" fontWeight="600">
              {notifications.length}
            </Text>
          </XStack>
          <XStack justifyContent="space-between">
            <Text color="$gray10">Unread Count:</Text>
            <XStack alignItems="center" gap="$2">
              <Text color="$color" fontWeight="600">
                {unreadCount}
              </Text>
              {unreadCount > 0 && <Circle size={8} backgroundColor="$blue10" />}
            </XStack>
          </XStack>
        </YStack>
      </YStack>

      {/* Instructions */}
      <YStack
        backgroundColor="$blue2"
        borderRadius="$4"
        padding="$4"
        marginBottom="$4"
      >
        <Text fontSize="$4" fontWeight="600" color="$blue10" marginBottom="$2">
          📝 Hướng dẫn test:
        </Text>
        <YStack gap="$1">
          <Text fontSize="$3" color="$blue11">
            1. Đảm bảo WebSocket Status = Connected ✅
          </Text>
          <Text fontSize="$3" color="$blue11">
            2. Ở client khác, gửi friend request
          </Text>
          <Text fontSize="$3" color="$blue11">
            3. Notification sẽ xuất hiện ở danh sách bên dưới
          </Text>
          <Text fontSize="$3" color="$blue11">
            4. Kiểm tra console logs để xem chi tiết
          </Text>
        </YStack>
      </YStack>

      <Separator marginBottom="$4" />

      {/* Notifications List */}
      <YStack flex={1}>
        <XStack alignItems="center" gap="$2" marginBottom="$3">
          <Bell size={20} color="$color" />
          <Text fontSize="$6" fontWeight="600" color="$color">
            Notifications ({notifications.length})
          </Text>
        </XStack>

        {notifications.length === 0 ? (
          <YStack flex={1} alignItems="center" justifyContent="center" gap="$3">
            <Bell size={48} color="$gray8" />
            <Text color="$gray10" fontSize="$4" textAlign="center">
              Chưa có notification nào{'\n'}
              Gửi friend request từ client khác để test
            </Text>
          </YStack>
        ) : (
          <ScrollView showsVerticalScrollIndicator={false}>
            <YStack gap="$2">
              {notifications.map((notif, index) => (
                <YStack
                  key={notif.id}
                  backgroundColor={notif.unread ? '$blue2' : '$backgroundHover'}
                  borderRadius="$3"
                  padding="$3"
                  borderWidth={1}
                  borderColor={notif.unread ? '$blue8' : '$borderColor'}
                >
                  <XStack justifyContent="space-between" marginBottom="$2">
                    <XStack alignItems="center" gap="$2">
                      <Text fontSize="$2" color="$gray10">
                        #{index + 1}
                      </Text>
                      {notif.unread && (
                        <Circle size={6} backgroundColor="$blue10" />
                      )}
                    </XStack>
                    <Text fontSize="$2" color="$gray10">
                      {notif.section}
                    </Text>
                  </XStack>

                  <Text fontSize="$4" color="$color" marginBottom="$2">
                    {notif.message}
                  </Text>

                  <YStack gap="$1">
                    {notif.type && (
                      <XStack gap="$2">
                        <Text fontSize="$2" color="$gray10">
                          Type:
                        </Text>
                        <Text fontSize="$2" color="$color" fontWeight="600">
                          {notif.type}
                        </Text>
                      </XStack>
                    )}
                    {notif.senderId && (
                      <XStack gap="$2">
                        <Text fontSize="$2" color="$gray10">
                          Sender:
                        </Text>
                        <Text fontSize="$2" color="$color" fontFamily="$mono">
                          {notif.senderId}
                        </Text>
                      </XStack>
                    )}
                    {notif.time && (
                      <XStack gap="$2">
                        <Text fontSize="$2" color="$gray10">
                          Time:
                        </Text>
                        <Text fontSize="$2" color="$color">
                          {notif.time}
                        </Text>
                      </XStack>
                    )}
                  </YStack>
                </YStack>
              ))}
            </YStack>
          </ScrollView>
        )}
      </YStack>
    </YStack>
  )
}
