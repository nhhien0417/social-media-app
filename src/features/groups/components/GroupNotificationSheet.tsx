import { Modal, Pressable, Animated } from 'react-native'
import { YStack, XStack, Text, Separator } from 'tamagui'
import { X, Bell, BellOff, Volume2 } from '@tamagui/lucide-icons'
import { useState } from 'react'

// Custom Toggle Switch Component
interface ToggleSwitchProps {
  value: boolean
  onValueChange: (value: boolean) => void
  isDark: boolean
}

function ToggleSwitch({ value, onValueChange, isDark }: ToggleSwitchProps) {
  const trackColor = value ? '#1877F2' : isDark ? '#3a3a3a' : '#d1d5db'
  const thumbColor = '#ffffff'

  return (
    <Pressable
      onPress={() => onValueChange(!value)}
      hitSlop={8}
      style={{
        width: 51,
        height: 31,
        borderRadius: 16,
        backgroundColor: trackColor,
        padding: 2,
        justifyContent: 'center',
      }}
    >
      <Animated.View
        style={{
          width: 27,
          height: 27,
          borderRadius: 14,
          backgroundColor: thumbColor,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.2,
          shadowRadius: 3,
          elevation: 3,
          transform: [{ translateX: value ? 18 : 0 }],
        }}
      />
    </Pressable>
  )
}

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
            <YStack padding="$4" gap="$3">
              {/* All Notifications */}
              <Pressable onPress={() => setAllNotifications(!allNotifications)}>
                <XStack
                  alignItems="center"
                  justifyContent="space-between"
                  paddingVertical="$2"
                >
                  <XStack alignItems="center" gap="$3" flex={1}>
                    <YStack
                      width={40}
                      height={40}
                      borderRadius={20}
                      backgroundColor={isDark ? '#2a2a2a' : '#f0f2f5'}
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Bell
                        size={20}
                        color={allNotifications ? '#1877F2' : textColor}
                      />
                    </YStack>
                    <YStack flex={1}>
                      <Text fontSize={15} fontWeight="600" color={textColor}>
                        All notifications
                      </Text>
                      <Text fontSize={13} color={subtitleColor} marginTop="$1">
                        Get notified about all posts and comments
                      </Text>
                    </YStack>
                  </XStack>
                  <ToggleSwitch
                    value={allNotifications}
                    onValueChange={setAllNotifications}
                    isDark={isDark}
                  />
                </XStack>
              </Pressable>

              <Separator borderColor={borderColor} marginVertical="$1" />

              {/* Highlights Only */}
              <Pressable onPress={() => setHighlightsOnly(!highlightsOnly)}>
                <XStack
                  alignItems="center"
                  justifyContent="space-between"
                  paddingVertical="$2"
                >
                  <XStack alignItems="center" gap="$3" flex={1}>
                    <YStack
                      width={40}
                      height={40}
                      borderRadius={20}
                      backgroundColor={isDark ? '#2a2a2a' : '#f0f2f5'}
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Volume2
                        size={20}
                        color={highlightsOnly ? '#1877F2' : textColor}
                      />
                    </YStack>
                    <YStack flex={1}>
                      <Text fontSize={15} fontWeight="600" color={textColor}>
                        Highlights only
                      </Text>
                      <Text fontSize={13} color={subtitleColor} marginTop="$1">
                        Only get notified about important posts
                      </Text>
                    </YStack>
                  </XStack>
                  <ToggleSwitch
                    value={highlightsOnly}
                    onValueChange={setHighlightsOnly}
                    isDark={isDark}
                  />
                </XStack>
              </Pressable>

              <Separator borderColor={borderColor} marginVertical="$1" />

              {/* Post Notifications */}
              <Pressable
                onPress={() => setPostNotifications(!postNotifications)}
              >
                <XStack
                  alignItems="center"
                  justifyContent="space-between"
                  paddingVertical="$2"
                >
                  <XStack alignItems="center" gap="$3" flex={1}>
                    <YStack
                      width={40}
                      height={40}
                      borderRadius={20}
                      backgroundColor={isDark ? '#2a2a2a' : '#f0f2f5'}
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Bell
                        size={20}
                        color={postNotifications ? '#1877F2' : textColor}
                      />
                    </YStack>
                    <YStack flex={1}>
                      <Text fontSize={15} fontWeight="600" color={textColor}>
                        Post notifications
                      </Text>
                      <Text fontSize={13} color={subtitleColor} marginTop="$1">
                        Get notified when someone posts
                      </Text>
                    </YStack>
                  </XStack>
                  <ToggleSwitch
                    value={postNotifications}
                    onValueChange={setPostNotifications}
                    isDark={isDark}
                  />
                </XStack>
              </Pressable>

              <Separator borderColor={borderColor} marginVertical="$1" />

              {/* Mute for 24h */}
              <Pressable onPress={() => setMuteFor24h(!muteFor24h)}>
                <XStack
                  alignItems="center"
                  justifyContent="space-between"
                  paddingVertical="$2"
                >
                  <XStack alignItems="center" gap="$3" flex={1}>
                    <YStack
                      width={40}
                      height={40}
                      borderRadius={20}
                      backgroundColor={isDark ? '#2a2a2a' : '#f0f2f5'}
                      alignItems="center"
                      justifyContent="center"
                    >
                      <BellOff
                        size={20}
                        color={muteFor24h ? '#1877F2' : textColor}
                      />
                    </YStack>
                    <YStack flex={1}>
                      <Text fontSize={15} fontWeight="600" color={textColor}>
                        Mute for 24 hours
                      </Text>
                      <Text fontSize={13} color={subtitleColor} marginTop="$1">
                        Temporarily stop all notifications
                      </Text>
                    </YStack>
                  </XStack>
                  <ToggleSwitch
                    value={muteFor24h}
                    onValueChange={setMuteFor24h}
                    isDark={isDark}
                  />
                </XStack>
              </Pressable>
            </YStack>
          </YStack>
        </Pressable>
      </Pressable>
    </Modal>
  )
}
