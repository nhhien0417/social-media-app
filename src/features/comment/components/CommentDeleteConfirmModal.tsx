import { Modal, Pressable, StyleSheet } from 'react-native'
import { YStack, Text } from 'tamagui'
import { AlertCircle } from '@tamagui/lucide-icons'
import Animated, {
  FadeIn,
  FadeOut,
  ZoomIn,
  ZoomOut,
} from 'react-native-reanimated'
import { useAppColors } from '@/theme/useAppColors'

interface CommentDeleteConfirmModalProps {
  visible: boolean
  onClose: () => void
  onConfirm: () => void
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable)

export default function CommentDeleteConfirmModal({
  visible,
  onClose,
  onConfirm,
}: CommentDeleteConfirmModalProps) {
  const colors = useAppColors()
  const { isDark } = colors

  const handleDelete = async () => {
    onClose()
    onConfirm()
  }

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
              backgroundColor={colors.modal}
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
                  backgroundColor="#ff3b301a"
                  alignItems="center"
                  justifyContent="center"
                >
                  <AlertCircle size={32} color={colors.error} />
                </YStack>
              </YStack>

              {/* Title */}
              <YStack gap="$2" alignItems="center">
                <Text
                  fontSize={20}
                  fontWeight="700"
                  color={colors.text}
                  textAlign="center"
                >
                  Delete Comment?
                </Text>
                <Text
                  fontSize={15}
                  color={colors.textSecondary}
                  textAlign="center"
                  lineHeight={20}
                >
                  This comment will be permanently deleted. This action cannot
                  be undone.
                </Text>
              </YStack>

              {/* Buttons */}
              <YStack gap="$2.5" marginTop="$2">
                <Pressable
                  onPress={handleDelete}
                  style={({ pressed }) => [
                    styles.button,
                    styles.deleteButton,
                    { opacity: pressed ? 0.8 : 1 },
                  ]}
                >
                  <Text fontSize={16} fontWeight="700" color="white">
                    Delete
                  </Text>
                </Pressable>

                <Pressable
                  onPress={onClose}
                  style={({ pressed }) => [
                    styles.button,
                    {
                      backgroundColor: pressed
                        ? colors.backgroundTertiary
                        : colors.backgroundSecondary,
                    },
                  ]}
                >
                  <Text fontSize={16} fontWeight="600" color={colors.text}>
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
  deleteButton: {
    backgroundColor: '#ff3b30',
  },
})
