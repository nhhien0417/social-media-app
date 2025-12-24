import { Modal, Pressable, StyleSheet } from 'react-native'
import { YStack, XStack, Text } from 'tamagui'
import { Edit3, Trash2 } from '@tamagui/lucide-icons'
import Animated, {
  FadeIn,
  FadeOut,
  SlideInDown,
  SlideOutDown,
} from 'react-native-reanimated'
import { useAppColors } from '@/theme/useAppColors'

interface CommentOptionsSheetProps {
  visible: boolean
  onClose: () => void
  onEdit: () => void
  onDelete: () => void
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable)

export default function CommentOptionsSheet({
  visible,
  onClose,
  onEdit,
  onDelete,
}: CommentOptionsSheetProps) {
  const colors = useAppColors()
  const { isDark } = colors

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
            backgroundColor={colors.modal}
            borderRadius={16}
            overflow="hidden"
            marginHorizontal={16}
            marginBottom={16}
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: isDark ? 0.5 : 0.15,
              shadowRadius: 12,
              elevation: 8,
            }}
          >
            {/* Edit Option */}
            <Pressable
              onPress={() => {
                onEdit()
                onClose()
              }}
              style={({ pressed }) => [
                styles.option,
                {
                  backgroundColor: pressed
                    ? colors.backgroundSecondary
                    : 'transparent',
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
                  <Edit3 size={18} color={colors.accent} />
                </YStack>
                <YStack flex={1}>
                  <Text fontSize={16} fontWeight="600" color={colors.text}>
                    Edit Comment
                  </Text>
                  <Text fontSize={13} color={colors.textSecondary}>
                    Make changes to your comment
                  </Text>
                </YStack>
              </XStack>
            </Pressable>

            {/* Divider */}
            <YStack
              height={StyleSheet.hairlineWidth}
              backgroundColor={colors.border}
              marginHorizontal="$4"
            />

            {/* Delete Option */}
            <Pressable
              onPress={() => {
                onDelete()
                onClose()
              }}
              style={({ pressed }) => [
                styles.option,
                {
                  backgroundColor: pressed
                    ? colors.backgroundSecondary
                    : 'transparent',
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
                  backgroundColor="#ff3b301a"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Trash2 size={18} color={colors.error} />
                </YStack>
                <YStack flex={1}>
                  <Text fontSize={16} fontWeight="600" color={colors.error}>
                    Delete Comment
                  </Text>
                  <Text fontSize={13} color={colors.textSecondary}>
                    Permanently remove this comment
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
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  menuContainer: {
    width: '100%',
  },
  option: {
    width: '100%',
  },
})
