import React, { useState, useRef, useEffect, useCallback } from 'react'
import {
  Modal,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  View,
  Animated,
  Text,
  Dimensions,
  ScrollView,
} from 'react-native'
import { YStack, XStack, SizableText } from 'tamagui'
import { Ionicons } from '@expo/vector-icons'
import {
  CameraView,
  CameraType,
  FlashMode,
  useCameraPermissions,
  useMicrophonePermissions,
} from 'expo-camera'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

interface CapturedMedia {
  uri: string
  width?: number
  height?: number
  type: 'photo' | 'video'
  duration?: number
}

type Props = {
  visible: boolean
  onClose: () => void
  onCapture: (media: CapturedMedia) => void
}

type CameraMode = 'photo' | 'video'
type TimerOption = 0 | 3 | 10
type FilterType = 'none' | 'vivid' | 'warm' | 'cool' | 'bw' | 'sepia'

const FILTERS = [
  { id: 'none', name: 'Normal', colors: undefined },
  { id: 'vivid', name: 'Vivid', colors: 'rgba(255,100,100,0.15)' },
  { id: 'warm', name: 'Warm', colors: 'rgba(255,150,50,0.2)' },
  { id: 'cool', name: 'Cool', colors: 'rgba(50,150,255,0.2)' },
  { id: 'bw', name: 'B&W', colors: 'rgba(0,0,0,0.4)' }, // Darker overlay for B&W effect
  { id: 'sepia', name: 'Sepia', colors: 'rgba(150,100,50,0.25)' },
] as const

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  topBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    zIndex: 100,
  },
  bottomBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: 20,
    zIndex: 100,
  },
  captureButton: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: 'transparent',
    borderWidth: 5,
    borderColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonInner: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: '#FFFFFF',
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    marginTop: 24,
  },
  permissionContainer: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  recordingButton: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: 'transparent',
    borderWidth: 5,
    borderColor: '#FF3B30',
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordingInner: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: '#FF3B30',
  },
  modeSelector: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 24,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 25,
    padding: 4,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  modeButton: {
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderRadius: 20,
  },
  modeButtonActive: {
    backgroundColor: '#FFFFFF',
  },
  modeText: {
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  modeTextInactive: {
    color: 'rgba(255,255,255,0.7)',
  },
  timerText: {
    position: 'absolute',
    top: '45%',
    alignSelf: 'center',
    fontSize: 90,
    fontWeight: '700',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 12,
    zIndex: 50,
  },
  recordingTime: {
    position: 'absolute',
    top: 110,
    alignSelf: 'center',
    backgroundColor: 'rgba(255,59,48,0.9)',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 22,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    zIndex: 100,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  recordingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
  },
  recordingTimeText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  warningMessage: {
    position: 'absolute',
    alignSelf: 'center',
    backgroundColor: 'rgba(255,149,0,0.95)',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 28,
    zIndex: 100,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  warningText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  zoomContainer: {
    position: 'absolute',
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 28,
    paddingHorizontal: 18,
    paddingVertical: 10,
    gap: 12,
    zIndex: 100,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  zoomText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    minWidth: 44,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  gridOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    pointerEvents: 'none',
    zIndex: 1,
  },
  gridColumn: {
    flex: 1,
    borderRightWidth: 1,
    borderRightColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'space-between',
  },
  gridRow: {
    height: '33.33%',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.2)',
  },
  filterOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
    zIndex: 2,
  },
  filtersContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 100,
    zIndex: 100,
  },
  filterScroll: {
    paddingHorizontal: 16,
  },
  filterItem: {
    alignItems: 'center',
    marginRight: 16,
  },
  filterPreview: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterPreviewActive: {
    borderColor: '#0095F6',
    borderWidth: 3,
  },
  filterName: {
    color: '#FFFFFF',
    fontSize: 11,
    marginTop: 6,
    fontWeight: '600',
  },
})

export default function Camera({ visible, onClose, onCapture }: Props) {
  const insets = useSafeAreaInsets()
  const [facing, setFacing] = useState<CameraType>('back')
  const [flash, setFlash] = useState<FlashMode>('off')
  const [mode, setMode] = useState<CameraMode>('photo')
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [timer, setTimer] = useState<TimerOption>(0)
  const [countdown, setCountdown] = useState<number | null>(null)
  const [zoom, setZoom] = useState(0)
  const [showZoomControls, setShowZoomControls] = useState(false)
  const [filter, setFilter] = useState<FilterType>('none')
  const [showGrid, setShowGrid] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [showMinDurationWarning, setShowMinDurationWarning] = useState(false)
  const [isZoomChanging, setIsZoomChanging] = useState(false)
  const [cameraPermission, requestCameraPermission] = useCameraPermissions()
  const [microphonePermission, requestMicrophonePermission] =
    useMicrophonePermissions()
  const cameraRef = useRef<CameraView>(null)
  const recordingInterval = useRef<NodeJS.Timeout | null>(null)
  const recordingStartTime = useRef<number>(0)
  const isRecordingRef = useRef(false)
  const lastActionTime = useRef<number>(0)

  const takePicture = useCallback(async () => {
    if (cameraRef.current) {
      try {
        console.log('Taking picture...')
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          base64: false,
          exif: false,
          skipProcessing: false,
        })

        console.log('Picture taken:', photo)
        if (photo && photo.uri) {
          onCapture({
            uri: photo.uri,
            width: photo.width,
            height: photo.height,
            type: 'photo',
          })
          onClose()
        }
      } catch (error) {
        console.error('Error taking picture:', error)
        // Retry once if failed
        try {
          console.log('Retrying picture...')
          await new Promise(resolve => setTimeout(resolve, 500))
          const photo = await cameraRef.current?.takePictureAsync({
            quality: 0.8,
          })
          if (photo && photo.uri) {
            onCapture({
              uri: photo.uri,
              width: photo.width,
              height: photo.height,
              type: 'photo',
            })
            onClose()
          }
        } catch (retryError) {
          console.error('Retry failed:', retryError)
        }
      }
    }
  }, [onCapture, onClose])

  const startRecording = useCallback(async () => {
    if (cameraRef.current && !isRecordingRef.current) {
      try {
        console.log('Starting recording...')
        setIsRecording(true)
        isRecordingRef.current = true
        recordingStartTime.current = Date.now()
        setRecordingTime(0)

        recordingInterval.current = setInterval(() => {
          const elapsed = Math.floor(
            (Date.now() - recordingStartTime.current) / 1000
          )
          setRecordingTime(elapsed)
        }, 1000)

        // Start recording without await - let it run in background
        cameraRef.current
          .recordAsync()
          .then(video => {
            console.log('Recording completed:', video)
            // Only process if still recording (not cancelled)
            if (video && video.uri && isRecordingRef.current) {
              const duration = Math.floor(
                (Date.now() - recordingStartTime.current) / 1000
              )

              if (recordingInterval.current) {
                clearInterval(recordingInterval.current)
                recordingInterval.current = null
              }

              setIsRecording(false)
              isRecordingRef.current = false

              console.log('Video captured with duration:', duration)
              onCapture({
                uri: video.uri,
                type: 'video',
                duration: duration > 0 ? duration : 1, // Ensure at least 1 second
              })
              onClose()
            }
          })
          .catch(error => {
            console.error('Error recording video:', error)
            setIsRecording(false)
            isRecordingRef.current = false
            if (recordingInterval.current) {
              clearInterval(recordingInterval.current)
              recordingInterval.current = null
            }
          })
      } catch (error) {
        console.error('Error starting recording:', error)
        setIsRecording(false)
        isRecordingRef.current = false
        if (recordingInterval.current) {
          clearInterval(recordingInterval.current)
          recordingInterval.current = null
        }
      }
    }
  }, [onCapture, onClose])

  useEffect(() => {
    if (visible) {
      console.log('Camera opened, current zoom:', zoom)
      // Request both camera and microphone permissions when visible
      if (!cameraPermission?.granted) {
        requestCameraPermission()
      }
      if (!microphonePermission?.granted) {
        requestMicrophonePermission()
      }
    }
  }, [visible, cameraPermission?.granted, microphonePermission?.granted])

  useEffect(() => {
    if (!visible) {
      // Reset states when modal closes
      if (isRecordingRef.current && cameraRef.current) {
        try {
          cameraRef.current.stopRecording()
        } catch (error) {
          console.log('Error stopping recording on close:', error)
        }
      }
      setIsRecording(false)
      isRecordingRef.current = false
      setRecordingTime(0)
      setCountdown(null)
      console.log('Resetting zoom to 0')
      setZoom(0) // Reset zoom to 1.0x
      setShowZoomControls(false) // Hide zoom controls
      if (recordingInterval.current) {
        clearInterval(recordingInterval.current)
        recordingInterval.current = null
      }
    }
  }, [visible])

  useEffect(() => {
    if (countdown !== null && countdown > 0) {
      const timeout = setTimeout(() => {
        setCountdown(countdown - 1)
      }, 1000)
      return () => clearTimeout(timeout)
    } else if (countdown === 0) {
      setCountdown(null)
      // Delay slightly to avoid animation issues
      setTimeout(() => {
        if (mode === 'photo') {
          takePicture()
        } else {
          startRecording()
        }
      }, 100)
    }
  }, [countdown, mode, takePicture, startRecording])

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'))
  }

  const toggleFlash = () => {
    setFlash(current => (current === 'off' ? 'on' : 'off'))
  }

  const cycleTimer = () => {
    const now = Date.now()
    if (now - lastActionTime.current < 300) return
    lastActionTime.current = now
    setTimer(current => {
      if (current === 0) return 3
      if (current === 3) return 10
      return 0
    })
  }

  const increaseZoom = () => {
    if (isZoomChanging) return
    setIsZoomChanging(true)

    // If zoom controls not showing, show them first at 1.0x
    if (!showZoomControls) {
      console.log('Showing zoom controls at 1.0x')
      setShowZoomControls(true)
      setZoom(0) // Start at 1.0x
      setTimeout(() => setIsZoomChanging(false), 200)
      return
    }

    setZoom(current => {
      console.log('Current zoom before increase:', current)
      const newZoom = Math.min(current + 0.1, 1)
      console.log('Increasing to', newZoom)
      return newZoom
    })
    setTimeout(() => setIsZoomChanging(false), 200)
  }

  const decreaseZoom = () => {
    if (isZoomChanging) return
    setIsZoomChanging(true)
    setZoom(current => {
      console.log('Current zoom before decrease:', current)
      const newZoom = Math.max(current - 0.1, 0)
      console.log('Decreasing to', newZoom)

      // If back to 1.0x (0), hide controls
      if (newZoom === 0) {
        console.log('Back to 1.0x - hide popup')
        setShowZoomControls(false)
      }

      return newZoom
    })
    setTimeout(() => setIsZoomChanging(false), 200)
  }

  const stopRecording = () => {
    if (cameraRef.current && isRecordingRef.current) {
      try {
        // Ensure minimum recording duration (1000ms for Android)
        const elapsed = Date.now() - recordingStartTime.current
        const minDuration = 1000 // 1 second minimum for Android

        if (elapsed < minDuration) {
          console.log('Recording too short, waiting...')
          // Show warning message
          setShowMinDurationWarning(true)
          setTimeout(() => setShowMinDurationWarning(false), 2000)

          // Wait for minimum duration before stopping
          setTimeout(() => {
            if (cameraRef.current && isRecordingRef.current) {
              console.log('Stopping recording after min duration')
              cameraRef.current.stopRecording()
            }
          }, minDuration - elapsed)
        } else {
          console.log('Stopping recording')
          cameraRef.current.stopRecording()
        }

        // Don't clear states here - let the recordAsync promise handle it
      } catch (error) {
        console.error('Error stopping recording:', error)
        setIsRecording(false)
        isRecordingRef.current = false
        if (recordingInterval.current) {
          clearInterval(recordingInterval.current)
          recordingInterval.current = null
        }
      }
    }
  }

  const handleCapture = () => {
    const now = Date.now()
    if (now - lastActionTime.current < 500) {
      console.log('Action debounced - too fast')
      return // Debounce 500ms for capture
    }
    lastActionTime.current = now

    if (timer > 0) {
      setCountdown(timer)
    } else {
      if (mode === 'photo') {
        takePicture()
      } else {
        if (isRecording) {
          stopRecording()
        } else {
          startRecording()
        }
      }
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  if (!visible) return null

  if (!cameraPermission || !microphonePermission) {
    return null
  }

  const allPermissionsGranted =
    cameraPermission.granted && microphonePermission.granted

  if (!allPermissionsGranted) {
    const requestAllPermissions = async () => {
      await requestCameraPermission()
      await requestMicrophonePermission()
    }

    return (
      <Modal visible={visible} animationType="slide" statusBarTranslucent>
        <View style={styles.permissionContainer}>
          <YStack gap="$4" alignItems="center">
            <SizableText
              size="$8"
              color="white"
              fontWeight="700"
              textAlign="center"
            >
              Permissions Required
            </SizableText>
            <SizableText
              size="$5"
              color="white"
              textAlign="center"
              opacity={0.8}
            >
              We need access to your camera and microphone to record videos
            </SizableText>
            <XStack gap="$3" marginTop="$4">
              <TouchableOpacity
                style={[styles.iconButton, { width: 120, borderRadius: 10 }]}
                onPress={onClose}
              >
                <SizableText size="$5" color="white" fontWeight="600">
                  Cancel
                </SizableText>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.iconButton,
                  { width: 120, borderRadius: 10, backgroundColor: '#0095F6' },
                ]}
                onPress={requestAllPermissions}
              >
                <SizableText size="$5" color="white" fontWeight="600">
                  Allow
                </SizableText>
              </TouchableOpacity>
            </XStack>
          </YStack>
        </View>
      </Modal>
    )
  }

  return (
    <Modal
      visible={visible}
      animationType="fade"
      statusBarTranslucent={true}
      presentationStyle="fullScreen"
      transparent={false}
      hardwareAccelerated={true}
    >
      <StatusBar hidden={true} />
      <View style={styles.container}>
        <CameraView
          ref={cameraRef}
          style={StyleSheet.absoluteFill}
          facing={facing}
          flash={flash}
          zoom={zoom}
          mode={mode === 'video' ? 'video' : 'picture'}
        >
          {/* Countdown Timer */}
          {countdown !== null && countdown > 0 && (
            <Animated.Text style={styles.timerText}>{countdown}</Animated.Text>
          )}

          {/* Recording Indicator */}
          {isRecording && (
            <View style={styles.recordingTime}>
              <View style={styles.recordingDot} />
              <Text style={styles.recordingTimeText}>
                {formatTime(recordingTime)}
              </Text>
            </View>
          )}

          {/* Minimum Duration Warning */}
          {showMinDurationWarning && (
            <View
              style={[styles.warningMessage, { bottom: insets.bottom + 220 }]}
            >
              <Text style={styles.warningText}>Hold for at least 1 second</Text>
            </View>
          )}

          {/* Top Bar */}
          <View style={[styles.topBar, { top: insets.top + 10 }]}>
            <TouchableOpacity style={styles.iconButton} onPress={onClose}>
              <Ionicons name="close" size={28} color="white" />
            </TouchableOpacity>

            <XStack gap="$2.5">
              <TouchableOpacity
                style={[
                  styles.iconButton,
                  timer > 0 && { backgroundColor: 'rgba(255,255,255,0.25)' },
                ]}
                onPress={cycleTimer}
              >
                <Ionicons name="timer-outline" size={24} color="white" />
                {timer > 0 && (
                  <View
                    style={{
                      position: 'absolute',
                      top: -4,
                      right: -4,
                      backgroundColor: '#0095F6',
                      borderRadius: 10,
                      minWidth: 20,
                      height: 20,
                      justifyContent: 'center',
                      alignItems: 'center',
                      paddingHorizontal: 4,
                      borderWidth: 2,
                      borderColor: '#000000',
                    }}
                  >
                    <Text
                      style={{
                        color: '#FFFFFF',
                        fontSize: 11,
                        fontWeight: '700',
                      }}
                    >
                      {timer}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.iconButton,
                  flash === 'on' && { backgroundColor: 'rgba(255,204,0,0.25)' },
                ]}
                onPress={toggleFlash}
              >
                {flash === 'off' ? (
                  <Ionicons name="flash-off-outline" size={24} color="white" />
                ) : (
                  <Ionicons name="flash" size={24} color="#FFCC00" />
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.iconButton,
                  showGrid && { backgroundColor: 'rgba(255,255,255,0.25)' },
                ]}
                onPress={() => setShowGrid(!showGrid)}
              >
                <Ionicons name="grid-outline" size={24} color="white" />
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.iconButton,
                  filter !== 'none' && {
                    backgroundColor: 'rgba(255,255,255,0.25)',
                  },
                ]}
                onPress={() => setShowFilters(!showFilters)}
              >
                <Ionicons name="color-filter-outline" size={24} color="white" />
              </TouchableOpacity>
            </XStack>
          </View>

          {/* Zoom Controls */}
          {showZoomControls && (
            <View
              style={[styles.zoomContainer, { bottom: insets.bottom + 220 }]}
            >
              <TouchableOpacity
                onPress={decreaseZoom}
                disabled={isZoomChanging || zoom === 0}
                activeOpacity={isZoomChanging || zoom === 0 ? 1 : 0.7}
                style={{ padding: 4 }}
              >
                <Ionicons
                  name="remove-circle-outline"
                  size={24}
                  color="white"
                  style={{
                    opacity: zoom === 0 ? 0.3 : isZoomChanging ? 0.5 : 1,
                  }}
                />
              </TouchableOpacity>
              <Text style={styles.zoomText}>{(zoom + 1).toFixed(1)}x</Text>
              <TouchableOpacity
                onPress={increaseZoom}
                disabled={isZoomChanging || zoom >= 1}
                activeOpacity={isZoomChanging || zoom >= 1 ? 1 : 0.7}
                style={{ padding: 4 }}
              >
                <Ionicons
                  name="add-circle-outline"
                  size={24}
                  color="white"
                  style={{
                    opacity: zoom >= 1 ? 0.3 : isZoomChanging ? 0.5 : 1,
                  }}
                />
              </TouchableOpacity>
            </View>
          )}

          {/* Filter Overlay */}
          {filter !== 'none' && (
            <View
              style={[
                styles.filterOverlay,
                {
                  backgroundColor:
                    FILTERS.find(f => f.id === filter)?.colors || 'transparent',
                },
              ]}
            />
          )}

          {/* Grid Lines */}
          {showGrid && (
            <View style={styles.gridOverlay}>
              {[0, 1, 2].map(col => (
                <View
                  key={col}
                  style={[
                    styles.gridColumn,
                    col === 2 && { borderRightWidth: 0 }, // Remove right border from last column
                  ]}
                >
                  {[0, 1, 2].map(row => (
                    <View
                      key={row}
                      style={[
                        styles.gridRow,
                        row === 2 && { borderBottomWidth: 0 }, // Remove bottom border from last row
                      ]}
                    />
                  ))}
                </View>
              ))}
            </View>
          )}

          {/* Filters Selection */}
          {showFilters && (
            <View
              style={[styles.filtersContainer, { bottom: insets.bottom + 240 }]}
            >
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.filterScroll}
              >
                {FILTERS.map(f => (
                  <TouchableOpacity
                    key={f.id}
                    style={styles.filterItem}
                    onPress={() => {
                      setFilter(f.id as FilterType)
                      setShowFilters(false)
                    }}
                  >
                    <View
                      style={[
                        styles.filterPreview,
                        filter === f.id && styles.filterPreviewActive,
                        { backgroundColor: f.colors || 'rgba(0,0,0,0.4)' },
                      ]}
                    >
                      <Ionicons
                        name="image-outline"
                        size={24}
                        color="white"
                        style={{ opacity: 0.8 }}
                      />
                    </View>
                    <Text style={styles.filterName}>{f.name}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          {/* Bottom Bar */}
          <View style={[styles.bottomBar, { bottom: insets.bottom + 20 }]}>
            {/* Mode Selector */}
            <View style={styles.modeSelector}>
              <TouchableOpacity
                style={[
                  styles.modeButton,
                  mode === 'photo' && styles.modeButtonActive,
                ]}
                onPress={() => setMode('photo')}
              >
                <Text
                  style={[
                    styles.modeText,
                    mode === 'photo'
                      ? { color: '#000000' }
                      : styles.modeTextInactive,
                  ]}
                >
                  Photo
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.modeButton,
                  mode === 'video' && styles.modeButtonActive,
                ]}
                onPress={() => setMode('video')}
              >
                <Text
                  style={[
                    styles.modeText,
                    mode === 'video'
                      ? { color: '#000000' }
                      : styles.modeTextInactive,
                  ]}
                >
                  Video
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.controls}>
              {/* Zoom In Button - only show when zoom controls not visible */}
              {!showZoomControls && (
                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={increaseZoom}
                  disabled={isZoomChanging}
                  activeOpacity={isZoomChanging ? 1 : 0.7}
                >
                  <Ionicons
                    name="add-circle-outline"
                    size={26}
                    color="white"
                    style={{ opacity: isZoomChanging ? 0.5 : 1 }}
                  />
                </TouchableOpacity>
              )}
              {showZoomControls && <View style={{ width: 44 }} />}

              {/* Capture/Record Button */}
              <TouchableOpacity
                style={
                  mode === 'video' && isRecording
                    ? styles.recordingButton
                    : styles.captureButton
                }
                onPress={handleCapture}
                activeOpacity={0.8}
              >
                {mode === 'photo' ? (
                  <View style={styles.captureButtonInner} />
                ) : isRecording ? (
                  <View style={styles.recordingInner} />
                ) : (
                  <View
                    style={[
                      styles.captureButtonInner,
                      {
                        backgroundColor: '#FF3B30',
                        justifyContent: 'center',
                        alignItems: 'center',
                      },
                    ]}
                  >
                    <Ionicons name="videocam" size={28} color="white" />
                  </View>
                )}
              </TouchableOpacity>

              {/* Flip Camera */}
              <TouchableOpacity
                style={styles.iconButton}
                onPress={toggleCameraFacing}
              >
                <Ionicons
                  name="camera-reverse-outline"
                  size={28}
                  color="white"
                />
              </TouchableOpacity>
            </View>
          </View>
        </CameraView>
      </View>
    </Modal>
  )
}
