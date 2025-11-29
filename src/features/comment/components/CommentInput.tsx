import React, { forwardRef, useState, useEffect } from 'react'
import {
  TouchableOpacity,
  StyleSheet,
  TextInput as RNTextInput,
  Image,
  ActivityIndicator,
} from 'react-native'
import { XStack, Input, SizableText, YStack, ScrollView } from 'tamagui'
import {
  Send,
  Image as ImageIcon,
  X,
  Camera as CameraIcon,
} from '@tamagui/lucide-icons'
import { Comment } from '@/types/Comment'
import Avatar from '@/components/Avatar'
import MediaPicker from '@/components/MediaPicker'
import Camera from '@/components/Camera'
import {
  getMediaItemFromCamera,
  getMediaItemsFromPicker,
} from '@/utils/MediaUtils'

type Props = {
  value: string
  onChangeText: (text: string) => void
  onSend: (content: string, media: string[]) => Promise<void> | void
  userAvatarUrl: string
  replyingTo?: Comment | null
  editingComment?: Comment | null
  onSelectEmotion: (emoji: string) => void
  onCancelReply?: () => void
  onCancelEdit?: () => void
  isLoading?: boolean
}

const styles = StyleSheet.create({
  emotionButton: {
    width: 35,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mediaPreviewContainer: {
    backgroundColor: '#f5f5f5',
    padding: 8,
  },
  mediaPreview: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 8,
  },
  removeMediaButton: {
    position: 'absolute',
    top: 4,
    right: 12,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
})

type Emotion = {
  emoji: string
  label: string
}

const emotions: Emotion[] = [
  { emoji: '❤️', label: 'love' },
  { emoji: '🙌', label: 'celebrate' },
  { emoji: '🔥', label: 'fire' },
  { emoji: '👏', label: 'clap' },
  { emoji: '👍', label: 'like' },
  { emoji: '😊', label: 'smile' },
  { emoji: '🍀', label: 'lucky' },
  { emoji: '😢', label: 'sad' },
]

const CommentInput = forwardRef<RNTextInput, Props>(
  (
    {
      value,
      onChangeText,
      onSend,
      userAvatarUrl,
      replyingTo,
      editingComment,
      onSelectEmotion,
      onCancelReply,
      onCancelEdit,
      isLoading = false,
    },
    ref
  ) => {
    const [selectedMedia, setSelectedMedia] = useState<string[]>([])
    const [showMediaPicker, setShowMediaPicker] = useState(false)
    const [showCamera, setShowCamera] = useState(false)

    useEffect(() => {
      if (editingComment && editingComment.media) {
        setSelectedMedia(editingComment.media)
      } else if (!editingComment) {
        setSelectedMedia([])
      }
    }, [editingComment])

    const handleSend = async () => {
      if (value.trim() || selectedMedia.length > 0) {
        await onSend(value, selectedMedia)
        if (!editingComment) {
          setSelectedMedia([])
        }
      }
    }

    const handleRemoveMedia = (index: number) => {
      setSelectedMedia(prev => prev.filter((_, i) => i !== index))
    }

    return (
      <YStack borderTopWidth={1} borderColor="$borderColor">
        {/* Edit Indicator */}
        {editingComment && (
          <XStack
            paddingHorizontal="$3"
            paddingVertical="$2"
            backgroundColor="#f0f0f0"
            alignItems="center"
            justifyContent="space-between"
          >
            <SizableText fontSize={13} color="#666">
              Editing comment...
            </SizableText>
            {onCancelEdit && (
              <TouchableOpacity onPress={onCancelEdit}>
                <X size={16} color="#666" />
              </TouchableOpacity>
            )}
          </XStack>
        )}

        {/* Reply Indicator */}
        {replyingTo && (
          <XStack
            paddingHorizontal="$3"
            paddingVertical="$2"
            backgroundColor="#f0f0f0"
            alignItems="center"
            justifyContent="space-between"
          >
            <SizableText fontSize={13} color="#666">
              Replying to {replyingTo.authorProfile?.username || 'Unknown User'}
              ...
            </SizableText>
            {onCancelReply && (
              <TouchableOpacity onPress={onCancelReply}>
                <X size={16} color="#666" />
              </TouchableOpacity>
            )}
          </XStack>
        )}

        {/* Media Preview */}
        {selectedMedia.length > 0 && (
          <YStack style={styles.mediaPreviewContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {selectedMedia.map((uri, index) => (
                <YStack key={index} position="relative">
                  <Image source={{ uri }} style={styles.mediaPreview} />
                  <TouchableOpacity
                    style={styles.removeMediaButton}
                    onPress={() => handleRemoveMedia(index)}
                  >
                    <X size={14} color="white" />
                  </TouchableOpacity>
                </YStack>
              ))}
            </ScrollView>
          </YStack>
        )}

        {/* Input Area */}
        <XStack
          paddingHorizontal="$3"
          paddingVertical="$2"
          backgroundColor="$backgroundModal"
          justifyContent="space-around"
          alignItems="center"
        >
          {emotions.map(emotion => (
            <TouchableOpacity
              key={emotion.label}
              style={styles.emotionButton}
              onPress={() => onSelectEmotion(emotion.emoji)}
              activeOpacity={0.75}
            >
              <SizableText fontSize={24}>{emotion.emoji}</SizableText>
            </TouchableOpacity>
          ))}
        </XStack>
        <XStack
          paddingHorizontal="$3"
          paddingBottom="$3"
          backgroundColor="$backgroundModal"
          alignItems="center"
          gap="$3"
        >
          <Avatar uri={userAvatarUrl} size={35} />

          <Input
            ref={ref}
            flex={1}
            placeholder="Write a comment..."
            value={value}
            onChangeText={onChangeText}
            borderWidth={1}
            borderColor="$placeholderColor"
            borderRadius={20}
            paddingHorizontal="$3"
            paddingVertical="$2"
            fontSize={14}
            backgroundColor="$backgroundModal"
            editable={!isLoading}
          />

          <TouchableOpacity
            onPress={() => setShowCamera(true)}
            disabled={isLoading}
          >
            <CameraIcon size={24} color={isLoading ? '#ccc' : '#888'} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setShowMediaPicker(true)}
            disabled={isLoading}
          >
            <ImageIcon size={24} color={isLoading ? '#ccc' : '#888'} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleSend}
            disabled={
              (!value.trim() && selectedMedia.length === 0) || isLoading
            }
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#0095F6" />
            ) : (
              <Send
                size={24}
                color={
                  value.trim() || selectedMedia.length > 0
                    ? '#0095F6'
                    : '$placeholderColor'
                }
              />
            )}
          </TouchableOpacity>
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
)

CommentInput.displayName = 'CommentInput'

export default CommentInput
