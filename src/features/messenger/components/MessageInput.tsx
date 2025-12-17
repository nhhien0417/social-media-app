import { useRef, useState, useEffect } from 'react'
import {
  Pressable,
  StyleSheet,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native'
import { Input, XStack, YStack, useThemeName, Text } from 'tamagui'
import {
  Send,
  Heart,
  Image as ImageIcon,
  Camera as CameraIcon,
  X,
  Plus,
  Mic,
  FileText,
  Music,
} from '@tamagui/lucide-icons'
import { useAudioRecorder, AudioQuality, AudioModule } from 'expo-audio'
import * as DocumentPicker from 'expo-document-picker'
import { useChatStore } from '@/stores/chatStore'
import MediaPicker from '@/components/MediaPicker'
import Camera from '@/components/Camera'
import {
  getMediaItemFromCamera,
  getMediaItemsFromPicker,
  MediaItem,
} from '@/utils/MediaUtils'
import { useSendTyping } from '@/hooks/useChatWebSocket'

interface MessageInputProps {
  chatId: string
}

export default function MessageInput({ chatId }: MessageInputProps) {
  const [text, setText] = useState('')
  const inputRef = useRef<any>(null)
  const theme = useThemeName()
  const { sendMessage } = useChatStore()
  const { sendTyping, stopTyping } = useSendTyping(chatId)

  const [selectedMedia, setSelectedMedia] = useState<MediaItem[]>([])
  const [showMediaPicker, setShowMediaPicker] = useState(false)
  const [showCamera, setShowCamera] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [recordingDuration, setRecordingDuration] = useState(0)

  const [isRecordingState, setIsRecordingState] = useState(false)
  const durationRef = useRef(0)

  const audioRecorder = useAudioRecorder({
    sampleRate: 44100,
    numberOfChannels: 2,
    bitRate: 128000,
    extension: '.m4a',
    android: {
      extension: '.m4a',
      outputFormat: 'mpeg4',
      audioEncoder: 'aac',
    },
    ios: {
      extension: '.m4a',
      outputFormat: 'mpeg4aac',
      audioQuality: AudioQuality.HIGH,
    },
    web: {},
  })

  const isDark = theme === 'dark'

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isRecordingState) {
      durationRef.current = 0
      setRecordingDuration(0)
      interval = setInterval(() => {
        durationRef.current += 1
        setRecordingDuration(prev => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isRecordingState])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
      })

      if (result.canceled) return

      const asset = result.assets[0]
      const newItem: MediaItem = {
        uri: asset.uri,
        name: asset.name,
        fileName: asset.name,
        mimeType: asset.mimeType,
        type: asset.mimeType?.startsWith('audio')
          ? 'audio'
          : asset.mimeType?.startsWith('video')
            ? 'video'
            : asset.mimeType?.startsWith('image')
              ? 'photo'
              : 'file',
      }
      setSelectedMedia(prev => [...prev, newItem])
    } catch (err) {
      console.error('Error picking document:', err)
    }
  }

  const handleMicrophone = async () => {
    if (isRecordingState) {
      // Stop recording
      try {
        await audioRecorder.stop()
        setIsRecordingState(false)
        const uri = audioRecorder.uri
        if (uri) {
          const newItem: MediaItem = {
            uri,
            name: `audio_${Date.now()}.m4a`,
            fileName: `audio_${Date.now()}.m4a`,
            mimeType: 'audio/m4a',
            type: 'audio',
            duration: durationRef.current,
          }
          setSelectedMedia(prev => [...prev, newItem])
        }
      } catch (error) {
        console.error('Failed to stop recording', error)
        setIsRecordingState(false)
      }
    } else {
      // Start recording
      try {
        const permission = await AudioModule.requestRecordingPermissionsAsync()
        if (!permission.granted) {
          // alert('Permission to access microphone is required!')
          return
        }
        await audioRecorder.prepareToRecordAsync()
        audioRecorder.record()
        setIsRecordingState(true)
      } catch (err) {
        console.error('Failed to start recording', err)
        setIsRecordingState(false)
      }
    }
  }

  const handleSend = async () => {
    if (
      (!text.trim() && selectedMedia.length === 0) ||
      isSending ||
      isRecordingState
    )
      return

    stopTyping()
    setIsSending(true)
    try {
      const mediaToSend = [...selectedMedia]
      const textToSend = text.trim()

      setText('')
      setSelectedMedia([])

      const attachments = mediaToSend.map((item, index) => ({
        uri: item.uri,
        name: item.fileName || item.name || `media_${index}_${Date.now()}`,
        type: item.mimeType || item.type || 'audio/m4a',
      }))

      await sendMessage({ chatId, content: textToSend }, attachments)
    } catch (error) {
      console.error('Failed to send message', error)
    } finally {
      setIsSending(false)
    }
  }

  const handleHeart = async () => {
    try {
      await sendMessage({ chatId, content: '❤️' })
    } catch (error) {
      console.error('Failed to send heart', error)
    }
  }

  const handleRemoveMedia = (index: number) => {
    setSelectedMedia(prev => prev.filter((_, i) => i !== index))
  }

  const hasText = text.trim().length > 0 || selectedMedia.length > 0

  const likeColor = '#1877F2'
  const iconColor = isDark ? '#E4E6EB' : '#65676B'
  const containerBackground = isDark ? 'rgba(17,20,24,0.92)' : '#ffffff'
  const borderColor = isDark ? 'rgba(255,255,255,0.08)' : '#e4e6eb'

  const renderPreviewItem = (item: MediaItem) => {
    const isImage = item.mimeType?.startsWith('image') || item.type === 'photo'
    const isVideo = item.mimeType?.startsWith('video') || item.type === 'video'

    if (isImage || isVideo) {
      return (
        <Image
          source={{ uri: item.uri }}
          style={{ width: 100, height: 100, borderRadius: 8 }}
        />
      )
    }

    return (
      <YStack
        width={100}
        height={100}
        borderRadius={8}
        backgroundColor="#DDD"
        justifyContent="center"
        alignItems="center"
        padding="$2"
      >
        {item.type === 'audio' || item.mimeType?.startsWith('audio') ? (
          <Music size={32} color={iconColor} />
        ) : (
          <>
            <FileText size={32} color={iconColor} />
            <Text
              fontSize="$1"
              numberOfLines={2}
              textAlign="center"
              marginTop="$2"
            >
              {item.fileName || item.name}
            </Text>
          </>
        )}
      </YStack>
    )
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      style={{ width: '100%' }}
    >
      <YStack
        borderTopWidth={StyleSheet.hairlineWidth}
        borderColor={borderColor}
        backgroundColor={containerBackground}
      >
        {/* Media Preview */}
        {selectedMedia.length > 0 && (
          <YStack
            style={{ backgroundColor: isDark ? '#222' : '#f5f5f5', padding: 8 }}
          >
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {selectedMedia.map((item, index) => (
                <YStack key={index} position="relative" marginRight={8}>
                  {renderPreviewItem(item)}
                  <Pressable
                    style={{
                      position: 'absolute',
                      top: 4,
                      right: 4,
                      backgroundColor: 'rgba(0,0,0,0.7)',
                      borderRadius: 12,
                      width: 24,
                      height: 24,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                    onPress={() => handleRemoveMedia(index)}
                  >
                    <X size={14} color="white" />
                  </Pressable>
                </YStack>
              ))}
            </ScrollView>
          </YStack>
        )}

        <XStack
          paddingHorizontal="$3"
          paddingVertical="$2"
          alignItems="center"
          gap="$2"
        >
          {/* Toolbar Icons */}
          <Pressable onPress={pickDocument}>
            <Plus size={24} color={iconColor} />
          </Pressable>

          <Pressable onPress={() => setShowCamera(true)}>
            <CameraIcon size={24} color={iconColor} />
          </Pressable>

          <Pressable onPress={() => setShowMediaPicker(true)}>
            <ImageIcon size={24} color={iconColor} />
          </Pressable>

          <Pressable onPress={handleMicrophone}>
            <Mic size={24} color={isRecordingState ? '$red10' : iconColor} />
          </Pressable>

          {isRecordingState ? (
            <XStack
              flex={1}
              alignItems="center"
              paddingHorizontal="$3"
              gap="$2"
              backgroundColor="$red2"
              borderRadius="$4"
              height={40}
            >
              <YStack
                width={10}
                height={10}
                borderRadius={5}
                backgroundColor="$red10"
                opacity={0.8}
                animation="pulse"
              />
              <Text color="$red10" fontWeight="bold">
                Recording {formatTime(recordingDuration)}
              </Text>
            </XStack>
          ) : (
            <Input
              ref={inputRef}
              flex={1}
              placeholder="Type a message..."
              value={text}
              onChangeText={value => {
                setText(value)
                if (value.length > 0) sendTyping()
              }}
              onBlur={stopTyping}
              borderRadius="$4"
              backgroundColor="$gray2"
              paddingHorizontal="$3"
              height={40}
              editable={!isSending && !isRecordingState}
            />
          )}

          {hasText ? (
            <Pressable
              onPress={handleSend}
              disabled={isSending || !!isRecordingState}
            >
              <Send size={24} color={likeColor} opacity={isSending ? 0.5 : 1} />
            </Pressable>
          ) : (
            <Pressable
              onPress={handleHeart}
              disabled={isSending || !!isRecordingState}
            >
              <Heart size={24} color="#ef4e4eff" fill="#ef4e4eff" />
            </Pressable>
          )}
        </XStack>

        {/* MediaPicker Modal */}
        <MediaPicker
          visible={showMediaPicker}
          onClose={() => setShowMediaPicker(false)}
          onSelect={assets => {
            const mediaItems = getMediaItemsFromPicker(assets)
            setSelectedMedia(prev => [...prev, ...mediaItems])
          }}
          maxSelection={10 - selectedMedia.length}
        />

        {/* Camera Modal */}
        <Camera
          visible={showCamera}
          onClose={() => setShowCamera(false)}
          onCapture={media => {
            const mediaItem = getMediaItemFromCamera(media)
            setSelectedMedia(prev => [...prev, mediaItem])
          }}
        />
      </YStack>
    </KeyboardAvoidingView>
  )
}
