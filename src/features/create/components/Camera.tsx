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
} from 'react-native'
import { YStack, XStack, SizableText } from 'tamagui'
import {
  X,
  FlipHorizontal,
  Zap,
  ZapOff,
  Video,
  Camera as CameraIcon,
  Grid3x3,
  Timer,
  ZoomIn,
  ZoomOut,
} from '@tamagui/lucide-icons'
import {
  CameraView,
  CameraType,
  FlashMode,
  useCameraPermissions,
  useMicrophonePermissions,
} from 'expo-camera'

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

const SCREEN_HEIGHT = Dimensions.get('window').height
const SCREEN_WIDTH = Dimensions.get('window').width

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    backgroundColor: 'black',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  topBar: {
    position: 'absolute',
    top: 40,
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
    bottom: 30,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: 20,
    zIndex: 100,
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'white',
    borderWidth: 6,
    borderColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonInner: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: 'white',
  },
  iconButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    marginTop: 20,
  },
  permissionContainer: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  recordingButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'red',
    borderWidth: 6,
    borderColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordingInner: {
    width: 30,
    height: 30,
    borderRadius: 6,
    backgroundColor: 'red',
  },
  modeSelector: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 20,
  },
  modeButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  modeButtonActive: {
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  modeText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  modeTextInactive: {
    color: 'rgba(255,255,255,0.6)',
  },
  timerText: {
    position: 'absolute',
    top: '45%',
    alignSelf: 'center',
    fontSize: 80,
    fontWeight: 'bold',
    color: 'white',
    textShadowColor: 'rgba(0,0,0,0.75)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
    zIndex: 50,
  },
  recordingTime: {
    position: 'absolute',
    top: 100,
    alignSelf: 'center',
    backgroundColor: 'rgba(255,0,0,0.8)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    zIndex: 100,
  },
  recordingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'white',
  },
  recordingTimeText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  warningMessage: {
    position: 'absolute',
    bottom: 200,
    alignSelf: 'center',
    backgroundColor: 'rgba(255,165,0,0.9)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    zIndex: 100,
  },
  warningText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  zoomContainer: {
    position: 'absolute',
    bottom: 200,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 8,
    gap: 10,
    zIndex: 100,
  },
  zoomText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    minWidth: 40,
    textAlign: 'center',
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
    borderRightColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'space-between',
  },
  gridRow: {
    height: '33.33%',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.3)',
  },
})

export default function Camera({ visible, onClose, onCapture }: Props) {
  const [facing, setFacing] = useState<CameraType>('back')
  const [flash, setFlash] = useState<FlashMode>('off')
  const [mode, setMode] = useState<CameraMode>('photo')
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [timer, setTimer] = useState<TimerOption>(0)
  const [countdown, setCountdown] = useState<number | null>(null)
  const [showGrid, setShowGrid] = useState(false)
  const [zoom, setZoom] = useState(0)
  const [showMinDurationWarning, setShowMinDurationWarning] = useState(false)
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

  const toggleMode = () => {
    setMode(current => (current === 'photo' ? 'video' : 'photo'))
  }

  const toggleGrid = () => {
    const now = Date.now()
    if (now - lastActionTime.current < 300) return // Debounce 300ms
    lastActionTime.current = now
    setShowGrid(current => !current)
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
    const now = Date.now()
    if (now - lastActionTime.current < 100) return // Faster for zoom
    lastActionTime.current = now
    setZoom(current => Math.min(current + 0.1, 1))
  }

  const decreaseZoom = () => {
    const now = Date.now()
    if (now - lastActionTime.current < 100) return
    lastActionTime.current = now
    setZoom(current => Math.max(current - 0.1, 0))
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
      animationType="slide"
      statusBarTranslucent
      presentationStyle="fullScreen"
      transparent={false}
    >
      <StatusBar hidden />
      <View style={styles.modal}>
        <CameraView
          ref={cameraRef}
          style={styles.camera}
          facing={facing}
          flash={flash}
          zoom={zoom}
          mode={mode === 'video' ? 'video' : 'picture'}
        >
          {/* Grid Overlay */}
          {showGrid && (
            <View style={styles.gridOverlay}>
              <View style={styles.gridColumn}>
                <View style={styles.gridRow} />
                <View style={styles.gridRow} />
              </View>
              <View style={styles.gridColumn}>
                <View style={styles.gridRow} />
                <View style={styles.gridRow} />
              </View>
              <View style={[styles.gridColumn, { borderRightWidth: 0 }]}>
                <View style={styles.gridRow} />
                <View style={styles.gridRow} />
              </View>
            </View>
          )}

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
            <View style={styles.warningMessage}>
              <Text style={styles.warningText}>Hold for at least 1 second</Text>
            </View>
          )}

          {/* Top Bar */}
          <View style={styles.topBar}>
            <TouchableOpacity style={styles.iconButton} onPress={onClose}>
              <X size={28} color="white" />
            </TouchableOpacity>

            <XStack gap="$2">
              <TouchableOpacity style={styles.iconButton} onPress={cycleTimer}>
                <Timer size={24} color="white" />
                {timer > 0 && (
                  <Text
                    style={{
                      position: 'absolute',
                      color: 'white',
                      fontSize: 10,
                      fontWeight: 'bold',
                      bottom: 4,
                    }}
                  >
                    {timer}
                  </Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity style={styles.iconButton} onPress={toggleGrid}>
                <Grid3x3 size={24} color="white" opacity={showGrid ? 1 : 0.6} />
              </TouchableOpacity>

              <TouchableOpacity style={styles.iconButton} onPress={toggleFlash}>
                {flash === 'off' ? (
                  <ZapOff size={24} color="white" />
                ) : (
                  <Zap size={24} color="white" />
                )}
              </TouchableOpacity>
            </XStack>
          </View>

          {/* Zoom Controls */}
          {zoom > 0 && (
            <View style={styles.zoomContainer}>
              <TouchableOpacity onPress={decreaseZoom}>
                <ZoomOut size={24} color="white" />
              </TouchableOpacity>
              <Text style={styles.zoomText}>{(zoom * 10 + 1).toFixed(1)}x</Text>
              <TouchableOpacity onPress={increaseZoom}>
                <ZoomIn size={24} color="white" />
              </TouchableOpacity>
            </View>
          )}

          {/* Bottom Bar */}
          <View style={styles.bottomBar}>
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
                    mode !== 'photo' && styles.modeTextInactive,
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
                    mode !== 'video' && styles.modeTextInactive,
                  ]}
                >
                  Video
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.controls}>
              {/* Zoom In Button */}
              <TouchableOpacity
                style={styles.iconButton}
                onPress={increaseZoom}
              >
                <ZoomIn size={28} color="white" />
              </TouchableOpacity>

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
                  <Video size={32} color="white" />
                )}
              </TouchableOpacity>

              {/* Flip Camera */}
              <TouchableOpacity
                style={styles.iconButton}
                onPress={toggleCameraFacing}
              >
                <FlipHorizontal size={28} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </CameraView>
      </View>
    </Modal>
  )
}
