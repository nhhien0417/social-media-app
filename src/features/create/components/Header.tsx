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
import { XStack, YStack, Button, SizableText } from 'tamagui'
import {
  ChevronLeft,
  FileText,
  Image,
  ChevronDown,
  Check,
} from '@tamagui/lucide-icons'
import IconButton from '@/components/IconButton'

export type CreateMode = 'post' | 'story'

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
    top: (StatusBar.currentHeight ?? 0) + 12.5,
    alignSelf: 'center',
    paddingHorizontal: 12.5,
    width: '100%',
  },
  dragHandleArea: {
    paddingVertical: 10,
    paddingHorizontal: 20,
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
  const isPost = mode === 'post'

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

        <Button
          size="$4"
          onPress={openSheet}
          backgroundColor="$background"
          borderRadius="$20"
          paddingHorizontal="$4"
          iconAfter={<ChevronDown size={17.5} />}
        >
          <SizableText
            size="$6"
            fontWeight="700"
            color="$color"
            textTransform="capitalize"
          >
            {mode}
          </SizableText>
        </Button>

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
              transform: [{ translateY: sheetY }],
            },
          ]}
        >
          <YStack
            backgroundColor="$background"
            borderRadius={20}
            overflow="hidden"
          >
            {/* Entire content area is draggable */}
            <YStack {...panResponder.panHandlers}>
              {/* Content */}
              <YStack padding="$3" gap="$3">
                {/* Post Option */}
                <Button
                  size="$6"
                  borderRadius={15}
                  padding="$4"
                  justifyContent="flex-start"
                  alignItems="center"
                  gap="$1"
                  onPress={() => handleSelectMode('post')}
                >
                  {isPost ? (
                    <Check size={30} color="$color" />
                  ) : (
                    <FileText size={30} color="$color" />
                  )}

                  <YStack flex={1} alignItems="flex-start">
                    <SizableText size="$6" fontWeight="700" color="$color">
                      Post
                    </SizableText>
                    <SizableText
                      fontSize={12.5}
                      fontWeight="400"
                      color="$color"
                    >
                      Share moment with your friends.
                    </SizableText>
                  </YStack>
                </Button>

                {/* Story Option */}
                <Button
                  size="$6"
                  borderRadius={15}
                  padding="$4"
                  justifyContent="flex-start"
                  alignItems="center"
                  gap="$1"
                  onPress={() => handleSelectMode('story')}
                >
                  {!isPost ? (
                    <Check size={30} color="$color" />
                  ) : (
                    <Image size={30} color="$color" />
                  )}

                  <YStack flex={1} alignItems="flex-start">
                    <SizableText size="$6" fontWeight="700" color="$color">
                      Story
                    </SizableText>
                    <SizableText
                      fontSize={12.5}
                      fontWeight="400"
                      color="$color"
                    >
                      Share content that disappears after 24 hours.
                    </SizableText>
                  </YStack>
                </Button>
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
