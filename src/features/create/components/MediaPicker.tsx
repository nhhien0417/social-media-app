import React, { useRef, useState, useEffect } from 'react'
import {
  StyleSheet,
  Modal,
  TouchableOpacity,
  Animated,
  PanResponder,
  Easing,
  FlatList,
  Dimensions,
  Image as RNImage,
  ActivityIndicator,
} from 'react-native'
import { XStack, YStack, Button, SizableText } from 'tamagui'
import { X, Check } from '@tamagui/lucide-icons'
import * as MediaLibrary from 'expo-media-library'

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window')
const MODAL_HALF_HEIGHT = SCREEN_HEIGHT * 0.5
const MODAL_FULL_HEIGHT = SCREEN_HEIGHT
const ITEM_SIZE = (SCREEN_WIDTH - 2.5) / 3

type MediaType = 'all' | 'photo' | 'video'

interface MediaAsset {
  id: string
  uri: string
  mediaType: MediaLibrary.MediaTypeValue
  duration?: number
}

type Props = {
  visible: boolean
  onClose: () => void
  onSelect: (assets: MediaAsset[]) => void
  maxSelection?: number
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
  bottomSheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
  },
  mediaItem: {
    width: ITEM_SIZE,
    height: ITEM_SIZE,
    margin: 0.25,
  },
  mediaImage: {
    width: '100%',
    height: '100%',
  },
  selectedOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,122,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkMark: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#0095F6',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 8,
    right: 8,
  },
  videoDuration: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  loader: {
    padding: 20,
  },
})

export default function MediaPicker({
  visible,
  onClose,
  onSelect,
  maxSelection = 10,
}: Props) {
  const [mediaType, setMediaType] = useState<MediaType>('all')
  const [assets, setAssets] = useState<MediaAsset[]>([])
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [hasPermission, setHasPermission] = useState(false)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [endCursor, setEndCursor] = useState<string | undefined>(undefined)
  const [modalHeight, setModalHeight] = useState(MODAL_HALF_HEIGHT)

  const sheetY = useRef(new Animated.Value(MODAL_HALF_HEIGHT)).current
  const overlayOpacity = useRef(new Animated.Value(0)).current

  // Request permissions
  useEffect(() => {
    ;(async () => {
      const { status } = await MediaLibrary.requestPermissionsAsync()
      setHasPermission(status === 'granted')
    })()
  }, [])

  // Reset and load media when modal opens or type changes
  useEffect(() => {
    if (visible && hasPermission) {
      setAssets([])
      setEndCursor(undefined)
      setHasMore(true)
      loadMedia(true)
    }
  }, [visible, mediaType, hasPermission])

  // Animate modal open/close
  useEffect(() => {
    if (visible) {
      setModalHeight(MODAL_HALF_HEIGHT)
      sheetY.setValue(MODAL_HALF_HEIGHT)
      openSheet()
    } else {
      setSelectedIds(new Set())
    }
  }, [visible])

  const openSheet = () => {
    Animated.parallel([
      Animated.timing(sheetY, {
        toValue: 0,
        duration: 300,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
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
      Animated.timing(sheetY, {
        toValue: modalHeight,
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
      if (finished) onClose()
    })
  }

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dy) > 5,
      onPanResponderMove: (_, g) => {
        if (g.dy > 0) {
          // Dragging down
          const v = Math.max(0, Math.min(modalHeight, g.dy))
          sheetY.setValue(v)
        } else {
          // Dragging up
          const currentHeight = modalHeight
          const targetHeight = MODAL_FULL_HEIGHT
          const dragProgress = Math.abs(g.dy) / 200
          const newHeight = Math.min(
            targetHeight,
            currentHeight + dragProgress * (targetHeight - currentHeight)
          )
          setModalHeight(newHeight)
          sheetY.setValue(Math.max(-50, g.dy))
        }
      },
      onPanResponderRelease: (_, g) => {
        if (g.dy > 150 || g.vy > 0.5) {
          // Close modal
          closeSheet()
        } else if (g.dy < -100 || g.vy < -0.5) {
          // Expand to full height
          setModalHeight(MODAL_FULL_HEIGHT)
          Animated.spring(sheetY, {
            toValue: 0,
            useNativeDriver: true,
            damping: 20,
            stiffness: 200,
            mass: 0.75,
          }).start()
        } else {
          // Snap back
          Animated.spring(sheetY, {
            toValue: 0,
            useNativeDriver: true,
            damping: 20,
            stiffness: 200,
            mass: 0.75,
          }).start()
        }
      },
    })
  ).current

  const loadMedia = async (reset = false) => {
    if (loading || (!reset && !hasMore)) return

    setLoading(true)
    try {
      const mediaTypeMap: Record<MediaType, MediaLibrary.MediaTypeValue[]> = {
        all: ['photo', 'video'],
        photo: ['photo'],
        video: ['video'],
      }

      const result = await MediaLibrary.getAssetsAsync({
        first: 30,
        after: reset ? undefined : endCursor,
        mediaType: mediaTypeMap[mediaType],
        sortBy: MediaLibrary.SortBy.creationTime,
      })

      const newAssets: MediaAsset[] = result.assets.map(asset => ({
        id: asset.id,
        uri: asset.uri,
        mediaType: asset.mediaType,
        duration: asset.duration,
      }))

      setAssets(prev => (reset ? newAssets : [...prev, ...newAssets]))
      setEndCursor(result.endCursor)
      setHasMore(result.hasNextPage)
    } catch (error) {
      console.error('Error loading media:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      loadMedia(false)
    }
  }

  const toggleSelection = (id: string) => {
    setSelectedIds(prev => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        if (newSet.size >= maxSelection) {
          return prev // Don't add if max reached
        }
        newSet.add(id)
      }
      return newSet
    })
  }

  const handleConfirm = () => {
    const selectedAssets = assets.filter(asset => selectedIds.has(asset.id))
    onSelect(selectedAssets)
    closeSheet()
  }

  const formatDuration = (duration?: number) => {
    if (!duration) return ''
    const minutes = Math.floor(duration / 60)
    const seconds = Math.floor(duration % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const renderMediaItem = ({ item }: { item: MediaAsset }) => {
    const isSelected = selectedIds.has(item.id)
    const isVideo = item.mediaType === 'video'

    return (
      <TouchableOpacity
        style={styles.mediaItem}
        onPress={() => toggleSelection(item.id)}
        activeOpacity={0.8}
      >
        <RNImage source={{ uri: item.uri }} style={styles.mediaImage} />

        {isSelected && (
          <YStack style={styles.selectedOverlay}>
            <YStack style={styles.checkMark}>
              <Check size={20} color="white" />
            </YStack>
          </YStack>
        )}

        {isVideo && (
          <YStack style={styles.videoDuration}>
            <SizableText fontSize={11} color="white" fontWeight="600">
              {formatDuration(item.duration)}
            </SizableText>
          </YStack>
        )}
      </TouchableOpacity>
    )
  }

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
            height: modalHeight,
            transform: [{ translateY: sheetY }],
          },
        ]}
      >
        {/* Header */}
        <YStack
          {...panResponder.panHandlers}
          backgroundColor="$background"
          paddingTop="$3"
          paddingBottom="$2"
          borderBottomWidth={StyleSheet.hairlineWidth}
          borderColor="$borderColor"
        >
          {/* Drag handle bar */}
          <YStack alignItems="center" paddingBottom="$3">
            <YStack
              width={50}
              height={5}
              borderRadius={999}
              backgroundColor="#888"
            />
          </YStack>

          <XStack
            paddingHorizontal="$3"
            alignItems="center"
            justifyContent="space-between"
            paddingBottom="$2"
          >
            <TouchableOpacity onPress={closeSheet}>
              <X size={28} color="$color" />
            </TouchableOpacity>

            <SizableText size="$7" fontWeight="700" color="$color">
              Select Media
            </SizableText>

            <Button
              size="$3"
              disabled={selectedIds.size === 0}
              onPress={handleConfirm}
              borderRadius={8}
              backgroundColor="#0095F6"
              paddingHorizontal="$4"
            >
              <SizableText size="$5" fontWeight="700" color="white">
                Done {selectedIds.size > 0 ? `(${selectedIds.size})` : ''}
              </SizableText>
            </Button>
          </XStack>

          {/* Media Type Tabs */}
          <XStack gap="$2" paddingHorizontal="$3" paddingTop="$3">
            {(['all', 'photo', 'video'] as MediaType[]).map(type => (
              <Button
                key={type}
                flex={1}
                size="$3"
                onPress={() => setMediaType(type)}
                borderRadius={10}
                backgroundColor={mediaType === type ? '$blue10' : '$background'}
                borderWidth={1}
                borderColor={mediaType === type ? '$blue10' : '$borderColor'}
              >
                <SizableText
                  size="$5"
                  fontWeight="600"
                  color={mediaType === type ? 'white' : '$color'}
                  textTransform="capitalize"
                >
                  {type === 'all'
                    ? 'All'
                    : type === 'photo'
                      ? 'Photos'
                      : 'Videos'}
                </SizableText>
              </Button>
            ))}
          </XStack>
        </YStack>

        {/* Media Grid */}
        {!hasPermission ? (
          <YStack flex={1} justifyContent="center" alignItems="center" gap="$3">
            <SizableText size="$6" color="$color" textAlign="center">
              Need permission to access photo library
            </SizableText>
          </YStack>
        ) : (
          <FlatList
            data={assets}
            renderItem={renderMediaItem}
            keyExtractor={item => item.id}
            numColumns={3}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
            ListFooterComponent={
              loading ? (
                <YStack style={styles.loader}>
                  <ActivityIndicator size="large" color="#0095F6" />
                </YStack>
              ) : null
            }
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        )}
      </Animated.View>
    </Modal>
  )
}
