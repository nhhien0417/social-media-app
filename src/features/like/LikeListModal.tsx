import React, { useRef, useEffect, useState } from 'react'
import {
  Modal,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Animated,
  PanResponder,
  Easing,
  Dimensions,
  ActivityIndicator,
} from 'react-native'
import { YStack, XStack, SizableText, Input, useThemeName } from 'tamagui'
import { Search } from '@tamagui/lucide-icons'
import LikeList from './components/LikeList'
import { getUserId } from '@/utils/SecureStore'
import { SafeAreaView } from 'react-native-safe-area-context'

const { height: SCREEN_HEIGHT } = Dimensions.get('window')

const SNAP_POINTS = {
  HIDDEN: SCREEN_HEIGHT,
  FULL: 0,
}

interface LikeListModalProps {
  visible: boolean
  onClose: () => void
  postId: string
}

import { User } from '@/types/User'
import { usePostStore } from '@/stores/postStore'

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
  bottomSheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
    backgroundColor: '$background',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})

export default function LikeListModal({
  visible,
  onClose,
  postId,
}: LikeListModalProps) {
  const [currentUserId, setCurrentUserId] = useState<string | undefined>()
  const [searchQuery, setSearchQuery] = useState('')
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { getUserLikes } = usePostStore()

  useEffect(() => {
    getUserId().then(id => setCurrentUserId(id || undefined))
  }, [])

  useEffect(() => {
    if (visible && postId) {
      fetchLikes()
    }
  }, [visible, postId])

  const fetchLikes = async () => {
    setIsLoading(true)
    try {
      const data = await getUserLikes(postId)
      setUsers(data)
    } catch (error) {
      console.error('Failed to fetch likes:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredUsers = users
    .filter(
      user =>
        user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (user.firstName &&
          user.firstName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (user.lastName &&
          user.lastName.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .sort((a, b) => {
      // Priority 0: Current User
      if (a.id === currentUserId) return -1
      if (b.id === currentUserId) return 1

      // Priority 1: Friend
      if (a.friendStatus === 'FRIEND' && b.friendStatus !== 'FRIEND') return -1
      if (a.friendStatus !== 'FRIEND' && b.friendStatus === 'FRIEND') return 1

      // Priority 2: Incoming Pending
      if (
        a.friendStatus === 'INCOMING_PENDING' &&
        b.friendStatus !== 'INCOMING_PENDING'
      )
        return -1
      if (
        a.friendStatus !== 'INCOMING_PENDING' &&
        b.friendStatus === 'INCOMING_PENDING'
      )
        return 1

      // Priority 3: Outgoing Pending
      if (
        a.friendStatus === 'OUTGOING_PENDING' &&
        b.friendStatus !== 'OUTGOING_PENDING'
      )
        return -1
      if (
        a.friendStatus !== 'OUTGOING_PENDING' &&
        b.friendStatus === 'OUTGOING_PENDING'
      )
        return 1

      // Priority 4: Others (NONE or null)
      return 0
    })

  const translateY = useRef(new Animated.Value(SNAP_POINTS.HIDDEN)).current
  const overlayOpacity = useRef(new Animated.Value(0)).current

  useEffect(() => {
    if (visible) {
      translateY.setValue(SNAP_POINTS.HIDDEN)
      openSheet()
    }
  }, [visible])

  const openSheet = () => {
    Animated.parallel([
      Animated.spring(translateY, {
        toValue: SNAP_POINTS.FULL,
        useNativeDriver: true,
        damping: 50,
        stiffness: 500,
        mass: 1,
      }),
      Animated.timing(overlayOpacity, {
        toValue: 1,
        duration: 300,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start()
  }

  const closeSheet = () => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: SNAP_POINTS.HIDDEN,
        duration: 300,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(overlayOpacity, {
        toValue: 0,
        duration: 300,
        easing: Easing.in(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start(({ finished }) => {
      if (finished) {
        onClose()
        setSearchQuery('')
      }
    })
  }

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, g) => {
        return Math.abs(g.dy) > 10 && Math.abs(g.dy) > Math.abs(g.dx)
      },
      onPanResponderGrant: () => {},
      onPanResponderMove: (_, g) => {
        if (g.dy > 0) {
          translateY.setValue(g.dy)
        }
      },
      onPanResponderRelease: (_, g) => {
        if (g.dy > 150 || g.vy > 0.5) {
          closeSheet()
        } else {
          Animated.spring(translateY, {
            toValue: SNAP_POINTS.FULL,
            useNativeDriver: true,
            damping: 50,
            stiffness: 500,
            mass: 1,
          }).start()
        }
      },
      onPanResponderTerminate: () => {
        Animated.spring(translateY, {
          toValue: SNAP_POINTS.FULL,
          useNativeDriver: true,
          damping: 50,
          stiffness: 500,
          mass: 1,
        }).start()
      },
    })
  ).current

  if (!visible) return null

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={closeSheet}
      statusBarTranslucent
    >
      {/* Overlay */}
      <Animated.View style={[styles.absoluteFill, { opacity: overlayOpacity }]}>
        <TouchableOpacity
          style={styles.overlayTouchable}
          activeOpacity={1}
          onPress={closeSheet}
        />
      </Animated.View>

      {/* Bottom Sheet */}
      <Animated.View
        style={[
          styles.bottomSheet,
          {
            transform: [{ translateY }],
            backgroundColor: '$background',
          },
        ]}
      >
        <SafeAreaView
          style={{
            flex: 1,
            backgroundColor: '$background',
          }}
          edges={['top', 'bottom']}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
          >
            <YStack {...panResponder.panHandlers}>
              {/* Header */}
              <YStack
                backgroundColor="$background"
                borderBottomWidth={StyleSheet.hairlineWidth}
                borderColor="$borderColor"
                paddingVertical="$3"
              >
                <YStack
                  style={styles.dragHandleArea}
                  backgroundColor="$background"
                >
                  <YStack style={styles.dragHandle} />
                </YStack>
                <XStack justifyContent="center" alignItems="center">
                  <SizableText fontSize={17} fontWeight="700" paddingTop="$1">
                    Likes
                  </SizableText>
                </XStack>
              </YStack>
            </YStack>

            {/* Search Bar */}
            <YStack
              paddingHorizontal="$4"
              paddingVertical="$2"
              backgroundColor="$background"
            >
              <XStack
                backgroundColor="$background"
                borderRadius={10}
                paddingHorizontal="$3"
                height={36}
                alignItems="center"
              >
                <Search size={16} color="#888" />
                <Input
                  flex={1}
                  backgroundColor="transparent"
                  borderWidth={0}
                  placeholder="Search"
                  placeholderTextColor="#888"
                  fontSize={14}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  height="100%"
                  paddingLeft="$2"
                />
              </XStack>
            </YStack>

            {/* List */}
            <YStack flex={1} backgroundColor="$background">
              {isLoading ? (
                <YStack style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color="#0095F6" />
                </YStack>
              ) : (
                <LikeList
                  users={filteredUsers}
                  currentUserId={currentUserId}
                  onClose={closeSheet}
                />
              )}
            </YStack>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </Animated.View>
    </Modal>
  )
}
