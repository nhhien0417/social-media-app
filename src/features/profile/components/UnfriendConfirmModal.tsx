import { Modal, Pressable, StyleSheet } from 'react-native'
import { YStack, Text, useThemeName } from 'tamagui'
import { AlertCircle } from '@tamagui/lucide-icons'
import Animated, {
  FadeIn,
  FadeOut,
  ZoomIn,
  ZoomOut,
} from 'react-native-reanimated'

interface UnfriendConfirmModalProps {
  visible: boolean
  onClose: () => void
  onConfirm: () => void
  isProcessing: boolean
  username: string
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable)

export default function UnfriendConfirmModal({
  visible,
  onClose,
  onConfirm,
  isProcessing,
  username,
}: UnfriendConfirmModalProps) {
  const themeName = useThemeName()
  const isDark = themeName.includes('dark')

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
          entering={ZoomIn.duration(250).springify()}
          exiting={ZoomOut.duration(200)}
          style={styles.modalContainer}
        >
          <Pressable onPress={e => e.stopPropagation()}>
            <YStack
              backgroundColor={isDark ? '#1c1c1e' : 'white'}
              borderRadius={20}
              padding="$5"
              width={320}
              gap="$4"
              style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: isDark ? 0.5 : 0.2,
                shadowRadius: 16,
                elevation: 12,
              }}
            >
              {/* Icon */}
              <YStack alignItems="center">
                <YStack
                  width={64}
                  height={64}
                  borderRadius={32}
                  backgroundColor="#ff95001a"
                  alignItems="center"
                  justifyContent="center"
                >
                  <AlertCircle size={32} color="#ff9500" />
                </YStack>
              </YStack>

              {/* Title */}
              <YStack gap="$2" alignItems="center">
                <Text
                  fontSize={20}
                  fontWeight="700"
                  color={isDark ? 'white' : 'black'}
                  textAlign="center"
                >
                  Unfriend {username}?
                </Text>
                <Text
                  fontSize={15}
                  color={isDark ? '#8e8e93' : '#8e8e93'}
                  textAlign="center"
                  lineHeight={20}
                >
                  Are you sure you want to remove {username} from your friends
                  list? You can send them a friend request again later.
                </Text>
              </YStack>

              {/* Buttons */}
              <YStack gap="$2.5" marginTop="$2">
                <Pressable
                  onPress={onConfirm}
                  disabled={isProcessing}
                  style={({ pressed }) => [
                    styles.button,
                    styles.unfriendButton,
                    { opacity: pressed || isProcessing ? 0.8 : 1 },
                  ]}
                >
                  <Text fontSize={16} fontWeight="700" color="white">
                    {isProcessing ? 'Removing...' : 'Unfriend'}
                  </Text>
                </Pressable>

                <Pressable
                  onPress={onClose}
                  disabled={isProcessing}
                  style={({ pressed }) => [
                    styles.button,
                    {
                      backgroundColor: pressed
                        ? isDark
                          ? '#2c2c2e'
                          : '#f5f5f5'
                        : isDark
                          ? '#38383a'
                          : '#f0f0f0',
                    },
                  ]}
                >
                  <Text
                    fontSize={16}
                    fontWeight="600"
                    color={isDark ? 'white' : 'black'}
                  >
                    Cancel
                  </Text>
                </Pressable>
              </YStack>
            </YStack>
          </Pressable>
        </Animated.View>
      </AnimatedPressable>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    alignItems: 'center',
  },
  button: {
    height: 52,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unfriendButton: {
    backgroundColor: '#ff9500',
  },
})
