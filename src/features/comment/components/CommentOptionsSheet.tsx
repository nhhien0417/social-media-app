import { Modal, Pressable, StyleSheet } from 'react-native'
import { YStack, XStack, Text, useThemeName } from 'tamagui'
import { Edit3, Trash2 } from '@tamagui/lucide-icons'
import Animated, {
  FadeIn,
  FadeOut,
  SlideInDown,
  SlideOutDown,
} from 'react-native-reanimated'

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
          entering={SlideInDown.duration(300).springify()}
          exiting={SlideOutDown.duration(250)}
          style={styles.menuContainer}
        >
          <YStack
            backgroundColor={isDark ? '#1c1c1e' : 'white'}
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
                    ? isDark
                      ? '#2c2c2e'
                      : '#f5f5f5'
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
                  <Edit3 size={18} color={isDark ? '#0a84ff' : '#007aff'} />
                </YStack>
                <YStack flex={1}>
                  <Text
                    fontSize={16}
                    fontWeight="600"
                    color={isDark ? 'white' : 'black'}
                  >
                    Edit Comment
                  </Text>
                  <Text fontSize={13} color={isDark ? '#8e8e93' : '#8e8e93'}>
                    Make changes to your comment
                  </Text>
                </YStack>
              </XStack>
            </Pressable>

            {/* Divider */}
            <YStack
              height={StyleSheet.hairlineWidth}
              backgroundColor={isDark ? '#38383a' : '#e5e5ea'}
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
                    ? isDark
                      ? '#2c2c2e'
                      : '#f5f5f5'
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
                  <Trash2 size={18} color="#ff3b30" />
                </YStack>
                <YStack flex={1}>
                  <Text fontSize={16} fontWeight="600" color="#ff3b30">
                    Delete Comment
                  </Text>
                  <Text fontSize={13} color={isDark ? '#8e8e93' : '#8e8e93'}>
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
