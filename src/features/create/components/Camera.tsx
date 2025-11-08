import React, { useState, useRef, useEffect } from 'react'
import {
  Modal,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  View,
} from 'react-native'
import { YStack, XStack, SizableText } from 'tamagui'
import { X, FlipHorizontal, Zap, ZapOff } from '@tamagui/lucide-icons'
import {
  CameraView,
  CameraType,
  FlashMode,
  useCameraPermissions,
} from 'expo-camera'

interface CapturedPhoto {
  uri: string
  width: number
  height: number
}

type Props = {
  visible: boolean
  onClose: () => void
  onCapture: (photo: CapturedPhoto) => void
}

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
    top: (StatusBar.currentHeight ?? 0) + 10,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    zIndex: 10,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: 20,
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
})

export default function Camera({ visible, onClose, onCapture }: Props) {
  const [facing, setFacing] = useState<CameraType>('back')
  const [flash, setFlash] = useState<FlashMode>('off')
  const [permission, requestPermission] = useCameraPermissions()
  const cameraRef = useRef<CameraView>(null)

  useEffect(() => {
    if (visible && !permission?.granted) {
      requestPermission()
    }
  }, [visible])

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'))
  }

  const toggleFlash = () => {
    setFlash(current => (current === 'off' ? 'on' : 'off'))
  }

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          base64: false,
          exif: false,
        })

        if (photo) {
          onCapture({
            uri: photo.uri,
            width: photo.width,
            height: photo.height,
          })
          onClose()
        }
      } catch (error) {
        console.error('Error taking picture:', error)
      }
    }
  }

  if (!visible) return null

  if (!permission) {
    return null
  }

  if (!permission.granted) {
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
              Camera Permission Required
            </SizableText>
            <SizableText
              size="$5"
              color="white"
              textAlign="center"
              opacity={0.8}
            >
              We need access to your camera to take photos
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
                onPress={requestPermission}
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
    <Modal visible={visible} animationType="slide" statusBarTranslucent>
      <View style={styles.modal}>
        <CameraView
          ref={cameraRef}
          style={styles.camera}
          facing={facing}
          flash={flash}
        >
          {/* Top Bar */}
          <View style={styles.topBar}>
            <TouchableOpacity style={styles.iconButton} onPress={onClose}>
              <X size={28} color="white" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.iconButton} onPress={toggleFlash}>
              {flash === 'off' ? (
                <ZapOff size={24} color="white" />
              ) : (
                <Zap size={24} color="white" />
              )}
            </TouchableOpacity>
          </View>

          {/* Bottom Bar */}
          <View style={styles.bottomBar}>
            <View style={styles.controls}>
              {/* Placeholder for symmetry */}
              <View style={{ width: 50 }} />

              {/* Capture Button */}
              <TouchableOpacity
                style={styles.captureButton}
                onPress={takePicture}
                activeOpacity={0.8}
              >
                <View style={styles.captureButtonInner} />
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
