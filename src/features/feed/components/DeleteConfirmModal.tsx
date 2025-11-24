import { Modal, Pressable, StyleSheet } from 'react-native'
import { YStack, XStack, Text, useThemeName } from 'tamagui'
import { usePostStore } from '@/stores/postStore'
import { usePostStatus } from '@/providers/PostStatusProvider'
import { router } from 'expo-router'
import { AlertCircle } from '@tamagui/lucide-icons'
import Animated, {
  FadeIn,
  FadeOut,
  ZoomIn,
  ZoomOut,
} from 'react-native-reanimated'

interface DeleteConfirmModalProps {
  visible: boolean
  onClose: () => void
  postId: string
  thumbnailUrl?: string
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable)

export default function DeleteConfirmModal({
  visible,
  onClose,
  postId,
  thumbnailUrl,
}: DeleteConfirmModalProps) {
  const deletePost = usePostStore(state => state.deletePost)
  const { startDeleting, finishDeleting, failDeleting } = usePostStatus()
  const themeName = useThemeName()
  const isDark = themeName.includes('dark')

  const handleDelete = async () => {
    onClose()
    startDeleting(thumbnailUrl)

    try {
      await deletePost(postId)
      finishDeleting()
      // Navigate back if we're on the detail screen
      if (router.canGoBack()) {
        router.back()
      }
    } catch (error) {
      const errorMessage =
        (error as any)?.message || 'Failed to delete post. Please try again.'
      failDeleting(errorMessage)
    }
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
                  backgroundColor="#ff3b301a"
                  alignItems="center"
                  justifyContent="center"
                >
                  <AlertCircle size={32} color="#ff3b30" />
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
                  Delete Post?
                </Text>
                <Text
                  fontSize={15}
                  color={isDark ? '#8e8e93' : '#8e8e93'}
                  textAlign="center"
                  lineHeight={20}
                >
                  This post will be permanently deleted. This action cannot be
                  undone.
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
  deleteButton: {
    backgroundColor: '#ff3b30',
  },
})
