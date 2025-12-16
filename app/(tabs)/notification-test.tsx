import { useEffect } from 'react'
import { View, Alert } from 'react-native'
import {
  YStack,
  XStack,
  Text,
  Circle,
  ScrollView,
  Separator,
  Button,
} from 'tamagui'
import { useNotifications } from '@/providers/NotificationProvider'
import { Wifi, WifiOff, Bell, Send } from '@tamagui/lucide-icons'
import { sendLocalNotification } from '@/services/pushNotifications'

/**
 * Component để test WebSocket connection và nhận notifications real-time
 * Hiển thị status kết nối và danh sách notifications
 * + Test Push Notifications
 */
export default function NotificationTestScreen() {
  const { notifications, unreadCount, isConnected, pushToken } =
    useNotifications()

  // Log mỗi khi có thay đổi
  useEffect(() => {
    console.log(
      '🔔 Connection status:',
      isConnected ? 'Connected ✅' : 'Disconnected ❌'
    )
    console.log('🔔 Total notifications:', notifications.length)
    console.log('🔔 Unread count:', unreadCount)
    console.log('🔔 Push Token:', pushToken)
  }, [isConnected, notifications.length, unreadCount, pushToken])

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

  /**
   * Test gửi local push notification
   */
  const handleSendTestNotification = async () => {
    try {
      await sendLocalNotification(
        'Test Push Notification',
        'Đây là thông báo test từ ứng dụng!',
        { type: 'test', timestamp: Date.now() }
      )
      Alert.alert('Thành công', 'Đã gửi test notification!')
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể gửi notification')
      console.error('Error sending test notification:', error)
    }
  }

  /**
   * Copy push token
   */
  const handleCopyToken = () => {
    if (pushToken) {
      // Copy to clipboard (sẽ cần expo-clipboard để implement)
      Alert.alert('Push Token', pushToken)
      console.log('📋 Push Token:', pushToken)
    } else {
      Alert.alert('Không có token', 'Push token chưa được tạo')
    }
  }

  return (
    <YStack flex={1} backgroundColor="$background" padding="$4">
      {/* Header */}
      <YStack marginBottom="$4">
        <Text fontSize="$8" fontWeight="700" color="$color">
          Notification Test
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
            <Text color="#888">Connection:</Text>
            <Text color={isConnected ? '$green10' : '$red10'} fontWeight="600">
              {isConnected ? 'Connected ✅' : 'Disconnected ❌'}
            </Text>
          </XStack>
          <XStack justifyContent="space-between">
            <Text color="#888">Total Notifications:</Text>
            <Text color="$color" fontWeight="600">
              {notifications.length}
            </Text>
          </XStack>
          <XStack justifyContent="space-between">
            <Text color="#888">Unread Count:</Text>
            <XStack alignItems="center" gap="$2">
              <Text color="$color" fontWeight="600">
                {unreadCount}
              </Text>
              {unreadCount > 0 && <Circle size={8} backgroundColor="$blue10" />}
            </XStack>
          </XStack>
          <XStack justifyContent="space-between">
            <Text color="#888">Push Token:</Text>
            <Text color="$color" fontWeight="600" numberOfLines={1}>
              {pushToken ? '✅' : '❌'}
            </Text>
          </XStack>
        </YStack>
      </YStack>

      {/* Push Notification Test Buttons */}
      <YStack gap="$3" marginBottom="$4">
        <Button
          backgroundColor="$blue10"
          color="white"
          icon={<Send size={20} />}
          onPress={handleSendTestNotification}
        >
          Gửi Test Push Notification
        </Button>
        <Button
          backgroundColor="$green10"
          color="white"
          onPress={handleCopyToken}
          disabled={!pushToken}
        >
          {pushToken ? 'Xem Push Token' : 'Chưa có Push Token'}
        </Button>
      </YStack>

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
            <Bell size={48} color="#888" />
            <Text color="#888" fontSize="$4" textAlign="center">
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
                      <Text fontSize="$2" color="#888">
                        #{index + 1}
                      </Text>
                      {notif.unread && (
                        <Circle size={6} backgroundColor="$blue10" />
                      )}
                    </XStack>
                    <Text fontSize="$2" color="#888">
                      {notif.section}
                    </Text>
                  </XStack>

                  <Text fontSize="$4" color="$color" marginBottom="$2">
                    {notif.message}
                  </Text>

                  <YStack gap="$1">
                    {notif.type && (
                      <XStack gap="$2">
                        <Text fontSize="$2" color="#888">
                          Type:
                        </Text>
                        <Text fontSize="$2" color="$color" fontWeight="600">
                          {notif.type}
                        </Text>
                      </XStack>
                    )}
                    {notif.senderId && (
                      <XStack gap="$2">
                        <Text fontSize="$2" color="#888">
                          Sender:
                        </Text>
                        <Text fontSize="$2" color="$color" fontFamily="$mono">
                          {notif.senderId}
                        </Text>
                      </XStack>
                    )}
                    {notif.time && (
                      <XStack gap="$2">
                        <Text fontSize="$2" color="#888">
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
