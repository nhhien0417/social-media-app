import { Modal, Pressable, StyleSheet } from 'react-native'
import { YStack, XStack, Text, useThemeName } from 'tamagui'
import { CheckCheck } from '@tamagui/lucide-icons'
import Animated, {
  FadeIn,
  FadeOut,
  SlideInDown,
  SlideOutDown,
} from 'react-native-reanimated'

interface GlobalActionsSheetProps {
  visible: boolean
  onClose: () => void
  unreadCount: number
  onMarkAllAsRead: () => void
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable)

export default function GlobalActionsSheet({
  visible,
  onClose,
  unreadCount,
  onMarkAllAsRead,
}: GlobalActionsSheetProps) {
  const themeName = useThemeName()
  const isDark = themeName.includes('dark')

  const hasUnread = unreadCount > 0

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <AnimatedPressable
        entering={FadeIn.duration(200)}
        exiting={FadeOut.duration(200)}
        style={styles.overlay}
        onPress={onClose}
      >
        <Animated.View
          entering={SlideInDown.duration(300).springify()}
          exiting={SlideOutDown.duration(250)}
          style={styles.menuContainer}
        >
          <YStack
            backgroundColor={isDark ? '#1c1c1e' : 'white'}
            borderRadius={16}
            overflow="hidden"
            margin={16}
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: isDark ? 0.5 : 0.15,
              shadowRadius: 12,
              elevation: 8,
            }}
          >
            {/* Mark All as Read Option */}
            <Pressable
              onPress={() => {
                if (hasUnread) {
                  onMarkAllAsRead()
                }
                onClose()
              }}
              disabled={!hasUnread}
              style={({ pressed }) => [
                styles.option,
                {
                  backgroundColor:
                    pressed && hasUnread
                      ? isDark
                        ? '#2c2c2e'
                        : '#f5f5f5'
                      : 'transparent',
                  opacity: hasUnread ? 1 : 0.5,
                },
              ]}
            >
              <XStack
                alignItems="center"
                gap="$3"
                paddingVertical="$3.5"
                paddingHorizontal="$4"
              >
                <YStack
                  width={36}
                  height={36}
                  borderRadius={18}
                  backgroundColor={isDark ? '#0a84ff26' : '#007aff1a'}
                  alignItems="center"
                  justifyContent="center"
                >
                  <CheckCheck
                    size={18}
                    color={isDark ? '#0a84ff' : '#007aff'}
                  />
                </YStack>
                <YStack flex={1}>
                  <Text
                    fontSize={16}
                    fontWeight="600"
                    color={isDark ? 'white' : 'black'}
                  >
                    Mark all as read
                    {hasUnread && ` (${unreadCount})`}
                  </Text>
                  <Text fontSize={13} color={isDark ? '#8e8e93' : '#8e8e93'}>
                    Mark all notifications as read
                  </Text>
                </YStack>
              </XStack>
            </Pressable>
          </YStack>
        </Animated.View>
      </AnimatedPressable>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  menuContainer: {
    width: '100%',
  },
  option: {
    width: '100%',
  },
})
