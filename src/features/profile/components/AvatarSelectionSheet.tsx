import { Modal, Pressable, StyleSheet } from 'react-native'
import { YStack, XStack, Text, useThemeName } from 'tamagui'
import { Camera, Image as ImageIcon } from '@tamagui/lucide-icons'
import Animated, {
  FadeIn,
  FadeOut,
  SlideInDown,
  SlideOutDown,
} from 'react-native-reanimated'

interface AvatarSelectionSheetProps {
  visible: boolean
  onClose: () => void
  onTakePhoto: () => void
  onChooseFromLibrary: () => void
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable)

export default function AvatarSelectionSheet({
  visible,
  onClose,
  onTakePhoto,
  onChooseFromLibrary,
}: AvatarSelectionSheetProps) {
  const themeName = useThemeName()
  const isDark = themeName.includes('dark')

  if (!visible) return null

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
            {/* Take Photo Option */}
            <Pressable
              onPress={() => {
                onTakePhoto()
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
                  backgroundColor={isDark ? '#3a3a3c' : '#f2f2f7'}
                  alignItems="center"
                  justifyContent="center"
                >
                  <Camera size={18} color={isDark ? 'white' : 'black'} />
                </YStack>
                <YStack flex={1}>
                  <Text
                    fontSize={16}
                    fontWeight="600"
                    color={isDark ? 'white' : 'black'}
                  >
                    Take Photo
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

            {/* Choose from Library Option */}
            <Pressable
              onPress={() => {
                onChooseFromLibrary()
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
                  backgroundColor={isDark ? '#3a3a3c' : '#f2f2f7'}
                  alignItems="center"
                  justifyContent="center"
                >
                  <ImageIcon size={18} color={isDark ? 'white' : 'black'} />
                </YStack>
                <YStack flex={1}>
                  <Text
                    fontSize={16}
                    fontWeight="600"
                    color={isDark ? 'white' : 'black'}
                  >
                    Choose from Library
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
