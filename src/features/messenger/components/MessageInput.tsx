import { useRef, useState } from 'react'
import {
  Pressable,
  StyleSheet,
  Image,
  ScrollView,
  ActivityIndicator,
} from 'react-native'
import { Input, XStack, YStack, useThemeName } from 'tamagui'
import {
  ChevronRight,
  Send,
  ThumbsUp,
  Image as ImageIcon,
  Camera as CameraIcon,
  X,
} from '@tamagui/lucide-icons'
import { useChatStore } from '@/stores/chatStore'
import MediaPicker from '@/components/MediaPicker'
import Camera from '@/components/Camera'
import {
  getMediaItemFromCamera,
  getMediaItemsFromPicker,
} from '@/utils/MediaUtils'

interface MessageInputProps {
  chatId: string
}

export default function MessageInput({ chatId }: MessageInputProps) {
  const [text, setText] = useState('')
  const [toolsCollapsed, setToolsCollapsed] = useState(false)
  const inputRef = useRef<any>(null)
  const theme = useThemeName()
  const { sendMessage } = useChatStore()

  const [selectedMedia, setSelectedMedia] = useState<string[]>([])
  const [showMediaPicker, setShowMediaPicker] = useState(false)
  const [showCamera, setShowCamera] = useState(false)
  const [isSending, setIsSending] = useState(false)

  const isDark = theme === 'dark'

  const handleSend = async () => {
    if ((!text.trim() && selectedMedia.length === 0) || isSending) return

    setIsSending(true)
    try {
      const mediaToSend = [...selectedMedia]
      const textToSend = text.trim()

      if (textToSend || mediaToSend.length > 0) {
        const firstMedia = mediaToSend.shift()

        await sendMessage(
          { chatId, content: textToSend },
          firstMedia
            ? {
                uri: firstMedia,
                name: `media_0_${Date.now()}.jpg`,
                type: 'image/jpeg',
              }
            : undefined
        )
      }

      for (let i = 0; i < mediaToSend.length; i++) {
        await sendMessage(
          { chatId, content: '' },
          {
            uri: mediaToSend[i],
            name: `media_${i + 1}_${Date.now()}.jpg`,
            type: 'image/jpeg',
          }
        )
      }

      setText('')
      setSelectedMedia([])
    } catch (error) {
      console.error('Failed to send message', error)
    } finally {
      setIsSending(false)
    }
  }

  const handleLike = async () => {
    try {
      await sendMessage({ chatId, content: '👍' })
    } catch (error) {
      console.error('Failed to send like', error)
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

  return (
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
            {selectedMedia.map((uri, index) => (
              <YStack key={index} position="relative" marginRight={8}>
                <Image
                  source={{ uri }}
                  style={{ width: 100, height: 100, borderRadius: 8 }}
                />
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
        paddingLeft="$2"
        alignItems="center"
        gap="$3"
      >
        <XStack
          alignItems="center"
          gap="$1"
          minWidth={toolsCollapsed ? 40 : undefined}
          width={toolsCollapsed ? 44 : undefined}
          justifyContent={toolsCollapsed ? 'center' : 'flex-start'}
        >
          {toolsCollapsed ? (
            <Pressable
              onPress={() => {
                setToolsCollapsed(false)
                inputRef.current?.blur?.()
              }}
            >
              <ChevronRight size={22} color={iconColor} />
            </Pressable>
          ) : (
            <XStack alignItems="center" gap="$3">
              <Pressable onPress={() => setShowCamera(true)}>
                <CameraIcon size={24} color={iconColor} />
              </Pressable>

              <Pressable onPress={() => setShowMediaPicker(true)}>
                <ImageIcon size={24} color={iconColor} />
              </Pressable>
            </XStack>
          )}
        </XStack>

        <Input
          ref={inputRef}
          flex={1}
          placeholder="Nhắn tin..."
          value={text}
          onChangeText={setText}
          borderRadius="$4"
          backgroundColor="$gray2"
          paddingHorizontal="$3"
          height={40}
          onFocus={() => setToolsCollapsed(true)}
          onBlur={() => setToolsCollapsed(false)}
          editable={!isSending}
        />

        {hasText ? (
          <Pressable onPress={handleSend} disabled={isSending}>
            {isSending ? (
              <ActivityIndicator size="small" color={likeColor} />
            ) : (
              <Send size={24} color={likeColor} />
            )}
          </Pressable>
        ) : (
          <Pressable onPress={handleLike} disabled={isSending}>
            <ThumbsUp size={24} color={likeColor} />
          </Pressable>
        )}
      </XStack>

      {/* MediaPicker Modal */}
      <MediaPicker
        visible={showMediaPicker}
        onClose={() => setShowMediaPicker(false)}
        onSelect={assets => {
          const mediaItems = getMediaItemsFromPicker(assets)
          const uris = mediaItems.map(item => item.uri)
          setSelectedMedia(prev => [...prev, ...uris])
        }}
        maxSelection={10 - selectedMedia.length}
      />

      {/* Camera Modal */}
      <Camera
        visible={showCamera}
        onClose={() => setShowCamera(false)}
        onCapture={media => {
          const mediaItem = getMediaItemFromCamera(media)
          setSelectedMedia(prev => [...prev, mediaItem.uri])
        }}
      />
    </YStack>
  )
}
