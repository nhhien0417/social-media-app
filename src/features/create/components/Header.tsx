import React, { useRef, useState } from 'react'
import {
  StyleSheet,
  Modal,
  TouchableOpacity,
  Animated,
  PanResponder,
  Easing,
  StatusBar,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import {
  XStack,
  YStack,
  Button,
  SizableText,
  Paragraph,
  useThemeName,
} from 'tamagui'
import {
  ChevronLeft,
  FileText,
  Image,
  ChevronDown,
  Check,
} from '@tamagui/lucide-icons'
import IconButton from '@/components/IconButton'
import { CreateMode } from '../CreateScreen'

type Props = {
  mode: CreateMode
  canShare?: boolean
  onBack?: () => void
  onShare?: () => void
  onChangeMode?: (mode: CreateMode) => void
}

const styles = StyleSheet.create({
  absoluteFill: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  overlayTouchable: {
    flex: 1,
  },
  topSheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignSelf: 'center',
    paddingHorizontal: 12.5,
    width: '100%',
  },
  dragHandleArea: {
    alignItems: 'center',
    width: '100%',
  },
  dragHandle: {
    width: 50,
    height: 5,
    borderRadius: 999,
    backgroundColor: '#888',
  },
})

export default function Header({
  mode,
  canShare = true,
  onBack,
  onShare,
  onChangeMode,
}: Props) {
  const [showModal, setShowModal] = useState(false)
  const insets = useSafeAreaInsets()
  const isPost = mode === 'post'
  const themeName = useThemeName()
  const isDark = themeName === 'dark'
  const accentColor = isDark ? '#0095F6' : '#1877F2'
  const segmentBackground = isDark ? 'rgba(255,255,255,0.06)' : '#e2e8f0'
  const segmentActiveBackground = isDark ? 'rgba(0,149,246,0.24)' : accentColor
  const segmentInactiveText = isDark ? 'rgba(226,232,240,0.86)' : '#1f2937'
  const sheetBackground = isDark ? 'rgba(18,18,18,0.96)' : '#ffffff'
  const sheetBorderColor = isDark
    ? 'rgba(255,255,255,0.08)'
    : 'rgba(148,163,184,0.18)'
  const sheetShadowColor = isDark ? 'rgba(0,0,0,0.82)' : 'rgba(15,23,42,0.12)'
  const sheetLabelColor = isDark ? '#f8fafc' : '#0f172a'
  const sheetDescriptionColor = isDark
    ? 'rgba(209,213,219,0.82)'
    : 'rgba(100,116,139,0.9)'
  const optionBorderColor = isDark
    ? 'rgba(255,255,255,0.08)'
    : 'rgba(148,163,184,0.35)'
  const optionIconBackground = isDark ? 'rgba(255,255,255,0.08)' : '#f1f5f9'
  const optionActiveBackground = isDark
    ? 'rgba(0,149,246,0.18)'
    : 'rgba(24,119,242,0.08)'

  const sheetY = useRef(new Animated.Value(-200)).current
  const overlayOpacity = useRef(new Animated.Value(0)).current

  const openSheet = () => {
    setShowModal(true)
    requestAnimationFrame(() => {
      Animated.parallel([
        Animated.timing(sheetY, {
          toValue: 0,
          duration: 200,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(overlayOpacity, {
          toValue: 1,
          duration: 200,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
      ]).start()
    })
  }

  const closeSheet = () => {
    Animated.parallel([
      Animated.timing(sheetY, {
        toValue: -200,
        duration: 200,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(overlayOpacity, {
        toValue: 0,
        duration: 200,
        easing: Easing.in(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start(({ finished }) => {
      if (finished) setShowModal(false)
    })
  }

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, g) => {
        return Math.abs(g.dy) > 10 && Math.abs(g.dy) > Math.abs(g.dx)
      },
      onPanResponderMove: (_, g) => {
        if (g.dy < 0) {
          const v = Math.max(-200, Math.min(0, g.dy))
          sheetY.setValue(v)
        }
      },
      onPanResponderRelease: (_, g) => {
        if (g.dy < -50 || g.vy < -0.5) {
          closeSheet()
        } else {
          Animated.spring(sheetY, {
            toValue: 0,
            useNativeDriver: true,
            damping: 20,
            stiffness: 250,
            mass: 0.75,
          }).start()
        }
      },
      onPanResponderTerminate: () => {
        Animated.spring(sheetY, {
          toValue: 0,
          useNativeDriver: true,
          damping: 20,
          stiffness: 250,
          mass: 0.75,
        }).start()
      },
    })
  ).current

  const handleSelectMode = (selectedMode: CreateMode) => {
    onChangeMode?.(selectedMode)
    closeSheet()
  }

  return (
    <>
      <XStack
        paddingTop={insets.top}
        paddingHorizontal="$3"
        paddingVertical="$3"
        alignItems="center"
        justifyContent="space-between"
        borderBottomWidth={StyleSheet.hairlineWidth}
        borderColor="$borderColor"
        backgroundColor="$background"
        gap="$3"
      >
        <IconButton Icon={ChevronLeft} onPress={onBack} Size={30} />

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={openSheet}
          style={{ flex: 1, alignItems: 'center' }}
        >
          <XStack
            alignItems="center"
            backgroundColor={segmentBackground}
            borderRadius={999}
            paddingVertical={6}
            paddingHorizontal={8}
            gap="$3"
          >
            <XStack
              borderRadius={999}
              overflow="hidden"
              backgroundColor="transparent"
              borderWidth={StyleSheet.hairlineWidth}
              borderColor="rgba(148,163,184,0.35)"
              width={180}
            >
              <XStack
                flex={1}
                paddingVertical={6}
                paddingHorizontal={16}
                borderRadius={999}
                backgroundColor={
                  isPost ? segmentActiveBackground : 'transparent'
                }
                alignItems="center"
                justifyContent="center"
              >
                <SizableText
                  size="$5"
                  fontWeight="700"
                  color={isPost ? '#ffffff' : segmentInactiveText}
                >
                  Post
                </SizableText>
              </XStack>

              <XStack
                flex={1}
                paddingVertical={6}
                paddingHorizontal={16}
                borderRadius={999}
                backgroundColor={
                  !isPost ? segmentActiveBackground : 'transparent'
                }
                alignItems="center"
                justifyContent="center"
              >
                <SizableText
                  size="$5"
                  fontWeight="700"
                  color={!isPost ? '#ffffff' : segmentInactiveText}
                >
                  Story
                </SizableText>
              </XStack>
            </XStack>

            <ChevronDown size={16} color={isDark ? '#f8fafc' : '#1f2937'} />
          </XStack>
        </TouchableOpacity>

        <Button
          size="$4"
          disabled={!canShare}
          onPress={onShare}
          borderRadius={20}
          backgroundColor="#0095F6"
          paddingHorizontal="$4"
        >
          <SizableText size="$6" fontWeight="700" color="white">
            Post
          </SizableText>
        </Button>
      </XStack>

      {/* Custom Top Sheet Dropdown */}
      <Modal
        visible={showModal}
        transparent
        animationType="fade"
        onRequestClose={closeSheet}
        statusBarTranslucent
      >
        {/* Overlay */}
        <Animated.View
          style={[styles.absoluteFill, { opacity: overlayOpacity }]}
        >
          <TouchableOpacity
            style={styles.overlayTouchable}
            activeOpacity={1}
            onPress={closeSheet}
          />
        </Animated.View>

        {/* Top anchored sheet */}
        <Animated.View
          style={[
            styles.topSheet,
            {
              top: insets.top + 12.5,
              transform: [{ translateY: sheetY }],
            },
          ]}
        >
          <YStack
            borderRadius={20}
            overflow="hidden"
            backgroundColor={sheetBackground}
            borderWidth={StyleSheet.hairlineWidth}
            borderColor={sheetBorderColor}
            style={{
              shadowColor: sheetShadowColor,
              shadowOpacity: isDark ? 0.6 : 0.35,
              shadowRadius: 18,
              shadowOffset: { width: 0, height: 18 },
              elevation: 12,
            }}
          >
            {/* Entire content area is draggable */}
            <YStack {...panResponder.panHandlers}>
              {/* Content */}
              <YStack padding="$3" gap="$3">
                {[
                  {
                    value: 'post' as const,
                    title: 'Post',
                    description: 'Share moments with your friends.',
                    Icon: FileText,
                  },
                  {
                    value: 'story' as const,
                    title: 'Story',
                    description:
                      'Share content that disappears after 24 hours.',
                    Icon: Image,
                  },
                ].map(({ value, title, description, Icon }) => {
                  const isActive = mode === value
                  return (
                    <TouchableOpacity
                      key={value}
                      activeOpacity={0.85}
                      onPress={() => handleSelectMode(value)}
                    >
                      <XStack
                        alignItems="center"
                        gap="$3"
                        padding="$3"
                        borderRadius={18}
                        borderWidth={1}
                        borderColor={isActive ? accentColor : optionBorderColor}
                        backgroundColor={
                          isActive ? optionActiveBackground : 'transparent'
                        }
                      >
                        <YStack
                          width={48}
                          height={48}
                          borderRadius={24}
                          backgroundColor={
                            isActive ? accentColor : optionIconBackground
                          }
                          alignItems="center"
                          justifyContent="center"
                        >
                          <Icon
                            size={22}
                            color={
                              isActive
                                ? '#ffffff'
                                : isDark
                                  ? '#f8fafc'
                                  : '#1f2937'
                            }
                          />
                        </YStack>

                        <YStack flex={1} gap={2} alignItems="flex-start">
                          <SizableText
                            size="$6"
                            fontWeight="700"
                            color={sheetLabelColor}
                          >
                            {title}
                          </SizableText>
                          <Paragraph size="$3" color={sheetDescriptionColor}>
                            {description}
                          </Paragraph>
                        </YStack>

                        <YStack
                          width={22}
                          height={22}
                          borderRadius={11}
                          borderWidth={2}
                          borderColor={
                            isActive ? accentColor : optionBorderColor
                          }
                          backgroundColor={
                            isActive ? accentColor : 'transparent'
                          }
                          alignItems="center"
                          justifyContent="center"
                        >
                          {isActive && <Check size={12} color="#ffffff" />}
                        </YStack>
                      </XStack>
                    </TouchableOpacity>
                  )
                })}
                {/* Drag handle area */}
                <YStack alignItems="center">
                  <YStack style={styles.dragHandle} />
                </YStack>
              </YStack>
            </YStack>
          </YStack>
        </Animated.View>
      </Modal>
    </>
  )
}
