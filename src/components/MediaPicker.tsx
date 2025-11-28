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
  Platform,
} from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import { XStack, YStack, Button, SizableText } from 'tamagui'
import { X, Check } from '@tamagui/lucide-icons'
import * as MediaLibrary from 'expo-media-library'

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window')
const MODAL_HALF_HEIGHT = SCREEN_HEIGHT * 0.5
const MODAL_FULL_HEIGHT = SCREEN_HEIGHT
const ITEM_SIZE = (SCREEN_WIDTH - 2.5) / 3

const SNAP_POINTS = {
  HIDDEN: SCREEN_HEIGHT,
  HALF: SCREEN_HEIGHT - MODAL_HALF_HEIGHT,
  FULL: SCREEN_HEIGHT - MODAL_FULL_HEIGHT,
}

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
  dragHandleArea: {
    paddingVertical: 4,
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

  const translateY = useRef(new Animated.Value(SNAP_POINTS.HIDDEN)).current
  const overlayOpacity = useRef(new Animated.Value(0)).current
  const currentSnapPoint = useRef(SNAP_POINTS.HALF)
  const dragStartY = useRef(0)

  useEffect(() => {
    ;(async () => {
      const { status } = await MediaLibrary.requestPermissionsAsync()
      setHasPermission(status === 'granted')
    })()
  }, [])

  useEffect(() => {
    if (visible && hasPermission) {
      setAssets([])
      setEndCursor(undefined)
      setHasMore(true)
      loadMedia(true)
    }
  }, [visible, mediaType, hasPermission])

  useEffect(() => {
    if (visible) {
      if (Platform.OS === 'web') {
        ;(async () => {
          try {
            const result = await ImagePicker.launchImageLibraryAsync({
              mediaTypes: ['images', 'videos'],
              allowsMultipleSelection: true,
              quality: 1,
              selectionLimit: maxSelection,
            })

            if (!result.canceled) {
              const webAssets: MediaAsset[] = result.assets.map(asset => ({
                id: asset.assetId || asset.uri,
                uri: asset.uri,
                mediaType: asset.type === 'video' ? 'video' : 'photo',
                duration: asset.duration || undefined,
              }))
              onSelect(webAssets)
            }
            onClose()
          } catch (error) {
            console.error('Web picker error:', error)
            onClose()
          }
        })()
      } else {
        translateY.setValue(SNAP_POINTS.HIDDEN)
        currentSnapPoint.current = SNAP_POINTS.HALF
        openSheet()
      }
    } else {
      setSelectedIds(new Set())
    }
  }, [visible])

  const animateToSnapPoint = (snapPoint: number, onComplete?: () => void) => {
    currentSnapPoint.current = snapPoint
    Animated.spring(translateY, {
      toValue: snapPoint,
      useNativeDriver: true,
      damping: 50,
      stiffness: 500,
      mass: 1,
    }).start(({ finished }) => {
      if (finished && onComplete) {
        onComplete()
      }
    })
  }

  const openSheet = () => {
    Animated.parallel([
      Animated.spring(translateY, {
        toValue: SNAP_POINTS.HALF,
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
        currentSnapPoint.current = SNAP_POINTS.HALF
      }
    })
  }

  const findNearestSnapPoint = (position: number, velocity: number) => {
    if (Math.abs(velocity) > 0.5) {
      if (velocity > 0) {
        if (currentSnapPoint.current === SNAP_POINTS.FULL) {
          return SNAP_POINTS.HALF
        } else {
          return SNAP_POINTS.HIDDEN
        }
      } else {
        if (currentSnapPoint.current === SNAP_POINTS.HALF) {
          return SNAP_POINTS.FULL
        }
        return currentSnapPoint.current
      }
    }

    const snapPoints = [SNAP_POINTS.FULL, SNAP_POINTS.HALF, SNAP_POINTS.HIDDEN]
    let nearest = snapPoints[0]
    let minDistance = Math.abs(position - snapPoints[0])

    for (const point of snapPoints) {
      const distance = Math.abs(position - point)
      if (distance < minDistance) {
        minDistance = distance
        nearest = point
      }
    }

    return nearest
  }

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, g) => {
        return Math.abs(g.dy) > 10 && Math.abs(g.dy) > Math.abs(g.dx)
      },
      onPanResponderGrant: () => {
        dragStartY.current = currentSnapPoint.current
      },
      onPanResponderMove: (_, g) => {
        const newY = dragStartY.current + g.dy

        const minY = SNAP_POINTS.FULL
        const maxY = SNAP_POINTS.HIDDEN

        if (newY >= minY && newY <= maxY) {
          translateY.setValue(newY)
        } else if (newY < minY) {
          translateY.setValue(minY + (newY - minY) * 0.25)
        } else {
          translateY.setValue(maxY + (newY - maxY) * 0.25)
        }
      },
      onPanResponderRelease: (_, g) => {
        const finalY = dragStartY.current + g.dy
        const nearestSnap = findNearestSnapPoint(finalY, g.vy)

        if (nearestSnap === SNAP_POINTS.HIDDEN) {
          closeSheet()
        } else {
          animateToSnapPoint(nearestSnap)
        }
      },
      onPanResponderTerminate: () => {
        animateToSnapPoint(currentSnapPoint.current)
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
          return prev
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

  if (!visible || Platform.OS === 'web') return null

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
            height: SCREEN_HEIGHT,
            transform: [{ translateY }],
          },
        ]}
      >
        {/* Draggable Header Area */}
        <YStack {...panResponder.panHandlers}>
          {/* Header */}
          <YStack
            padding="$3"
            backgroundColor="$background"
            borderBottomWidth={StyleSheet.hairlineWidth}
            borderColor="$borderColor"
          >
            {/* Drag handle */}
            <YStack style={styles.dragHandleArea} backgroundColor="$background">
              <YStack style={styles.dragHandle} />
            </YStack>

            <XStack alignItems="center" justifyContent="space-between">
              <SizableText size="$8" fontWeight="700" color="$color">
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
            <XStack gap="$3" paddingTop="$3">
              {(['all', 'photo', 'video'] as MediaType[]).map(type => (
                <Button
                  key={type}
                  flex={1}
                  size="$3"
                  onPress={() => setMediaType(type)}
                  borderRadius={10}
                  backgroundColor={
                    mediaType === type ? '$blue10' : '$background'
                  }
                  borderWidth={1}
                  borderColor={mediaType === type ? '$blue10' : '$borderColor'}
                >
                  <SizableText
                    size="$5"
                    fontWeight="700"
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
                  <ActivityIndicator size="large" color="$blue10" />
                </YStack>
              ) : null
            }
          />
        )}
      </Animated.View>
    </Modal>
  )
}
