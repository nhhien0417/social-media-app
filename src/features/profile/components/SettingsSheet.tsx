import { Modal, Pressable, StyleSheet } from 'react-native'
import { YStack, XStack, Text, useThemeName } from 'tamagui'
import { Palette, Lock, LogOut } from '@tamagui/lucide-icons'
import Animated, {
  FadeIn,
  FadeOut,
  SlideInDown,
  SlideOutDown,
} from 'react-native-reanimated'
import { useRouter } from 'expo-router'

interface SettingsSheetProps {
  visible: boolean
  onClose: () => void
  onToggleTheme: () => void
  onLogout: () => void
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable)

export default function SettingsSheet({
  visible,
  onClose,
  onToggleTheme,
  onLogout,
}: SettingsSheetProps) {
  const router = useRouter()
  const themeName = useThemeName()
  const isDark = themeName.includes('dark')

  const handleChangePassword = () => {
    onClose()
    router.push('/auth/reset')
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
            {/* Theme Toggle */}
            <Pressable
              onPress={() => {
                onToggleTheme()
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
                  backgroundColor={isDark ? '#ff9f0a26' : '#ff9f0a1a'}
                  alignItems="center"
                  justifyContent="center"
                >
                  <Palette size={18} color={isDark ? '#ff9f0a' : '#ff9500'} />
                </YStack>
                <YStack flex={1}>
                  <Text
                    fontSize={16}
                    fontWeight="600"
                    color={isDark ? 'white' : 'black'}
                  >
                    {isDark ? 'Light Mode' : 'Dark Mode'}
                  </Text>
                  <Text fontSize={13} color={isDark ? '#8e8e93' : '#8e8e93'}>
                    Switch to {isDark ? 'light' : 'dark'} theme
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

            {/* Change Password */}
            <Pressable
              onPress={handleChangePassword}
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
                  <Lock size={18} color={isDark ? '#0a84ff' : '#007aff'} />
                </YStack>
                <YStack flex={1}>
                  <Text
                    fontSize={16}
                    fontWeight="600"
                    color={isDark ? 'white' : 'black'}
                  >
                    Change Password
                  </Text>
                  <Text fontSize={13} color={isDark ? '#8e8e93' : '#8e8e93'}>
                    Update your account password
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

            {/* Logout */}
            <Pressable
              onPress={() => {
                onLogout()
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
                  <LogOut size={18} color="#ff3b30" />
                </YStack>
                <YStack flex={1}>
                  <Text fontSize={16} fontWeight="600" color="#ff3b30">
                    Logout
                  </Text>
                  <Text fontSize={13} color={isDark ? '#8e8e93' : '#8e8e93'}>
                    Sign out of your account
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
