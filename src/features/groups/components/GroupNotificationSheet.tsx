import { Modal, Pressable } from 'react-native'
import { YStack, XStack, Text, Separator, Switch } from 'tamagui'
import { X, Bell, BellOff, Volume2, VolumeX } from '@tamagui/lucide-icons'
import { useState } from 'react'

interface GroupNotificationSheetProps {
  visible: boolean
  onClose: () => void
  isDark: boolean
  groupName: string
}

export function GroupNotificationSheet({
  visible,
  onClose,
  isDark,
  groupName,
}: GroupNotificationSheetProps) {
  const [allNotifications, setAllNotifications] = useState(true)
  const [postNotifications, setPostNotifications] = useState(true)
  const [highlightsOnly, setHighlightsOnly] = useState(false)
  const [muteFor24h, setMuteFor24h] = useState(false)

  const backgroundColor = isDark ? '#1a1a1a' : '#ffffff'
  const textColor = isDark ? '#f5f5f5' : '#111827'
  const subtitleColor = isDark ? 'rgba(255,255,255,0.6)' : '#6b7280'
  const borderColor = isDark ? '#2a2a2a' : '#e5e7eb'
  const overlayColor = isDark ? 'rgba(0,0,0,0.8)' : 'rgba(0,0,0,0.5)'

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable
        style={{
          flex: 1,
          backgroundColor: overlayColor,
          justifyContent: 'flex-end',
        }}
        onPress={onClose}
      >
        <Pressable onPress={e => e.stopPropagation()}>
          <YStack
            backgroundColor={backgroundColor}
            borderTopLeftRadius={20}
            borderTopRightRadius={20}
            paddingBottom="$6"
          >
            {/* Header */}
            <XStack
              paddingHorizontal="$4"
              paddingVertical="$4"
              alignItems="center"
              justifyContent="space-between"
              borderBottomColor={borderColor}
              borderBottomWidth={1}
            >
              <Text fontSize={18} fontWeight="700" color={textColor}>
                Notification Settings
              </Text>
              <Pressable onPress={onClose} hitSlop={8}>
                <X size={24} color={textColor} />
              </Pressable>
            </XStack>

            {/* Group Name */}
            <YStack paddingHorizontal="$4" paddingVertical="$3">
              <Text fontSize={14} color={subtitleColor}>
                Settings for
              </Text>
              <Text fontSize={16} fontWeight="600" color={textColor}>
                {groupName}
              </Text>
            </YStack>

            <Separator borderColor={borderColor} />

            {/* Notification Options */}
            <YStack padding="$4" gap="$4">
              {/* All Notifications */}
              <XStack alignItems="center" justifyContent="space-between">
                <XStack alignItems="center" gap="$3" flex={1}>
                  <Bell size={22} color={textColor} />
                  <YStack flex={1}>
                    <Text fontSize={15} fontWeight="600" color={textColor}>
                      All notifications
                    </Text>
                    <Text fontSize={13} color={subtitleColor}>
                      Get notified about all posts and comments
                    </Text>
                  </YStack>
                </XStack>
                <Switch
                  checked={allNotifications}
                  onCheckedChange={setAllNotifications}
                  size="$3"
                >
                  <Switch.Thumb animation="quick" />
                </Switch>
              </XStack>

              <Separator borderColor={borderColor} />

              {/* Highlights Only */}
              <XStack alignItems="center" justifyContent="space-between">
                <XStack alignItems="center" gap="$3" flex={1}>
                  <Volume2 size={22} color={textColor} />
                  <YStack flex={1}>
                    <Text fontSize={15} fontWeight="600" color={textColor}>
                      Highlights only
                    </Text>
                    <Text fontSize={13} color={subtitleColor}>
                      Only get notified about important posts
                    </Text>
                  </YStack>
                </XStack>
                <Switch
                  checked={highlightsOnly}
                  onCheckedChange={setHighlightsOnly}
                  size="$3"
                >
                  <Switch.Thumb animation="quick" />
                </Switch>
              </XStack>

              <Separator borderColor={borderColor} />

              {/* Post Notifications */}
              <XStack alignItems="center" justifyContent="space-between">
                <XStack alignItems="center" gap="$3" flex={1}>
                  <Bell size={22} color={textColor} />
                  <YStack flex={1}>
                    <Text fontSize={15} fontWeight="600" color={textColor}>
                      Post notifications
                    </Text>
                    <Text fontSize={13} color={subtitleColor}>
                      Get notified when someone posts
                    </Text>
                  </YStack>
                </XStack>
                <Switch
                  checked={postNotifications}
                  onCheckedChange={setPostNotifications}
                  size="$3"
                >
                  <Switch.Thumb animation="quick" />
                </Switch>
              </XStack>

              <Separator borderColor={borderColor} />

              {/* Mute for 24h */}
              <XStack alignItems="center" justifyContent="space-between">
                <XStack alignItems="center" gap="$3" flex={1}>
                  <BellOff size={22} color={textColor} />
                  <YStack flex={1}>
                    <Text fontSize={15} fontWeight="600" color={textColor}>
                      Mute for 24 hours
                    </Text>
                    <Text fontSize={13} color={subtitleColor}>
                      Temporarily stop all notifications
                    </Text>
                  </YStack>
                </XStack>
                <Switch
                  checked={muteFor24h}
                  onCheckedChange={setMuteFor24h}
                  size="$3"
                >
                  <Switch.Thumb animation="quick" />
                </Switch>
              </XStack>
            </YStack>
          </YStack>
        </Pressable>
      </Pressable>
    </Modal>
  )
}
