import React, { forwardRef, useState, useEffect, useMemo } from 'react'
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
import { useAppColors } from '@/theme/useAppColors'

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
    const colors = useAppColors()
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

    const dynamicStyles = useMemo(
      () =>
        StyleSheet.create({
          mediaPreviewContainer: {
            backgroundColor: colors.backgroundSecondary,
            padding: 8,
          },
        }),
      [colors]
    )

    return (
      <YStack borderTopWidth={1} borderColor={colors.border}>
        {/* Edit Indicator */}
        {editingComment && (
          <XStack
            paddingHorizontal="$3"
            paddingVertical="$2"
            backgroundColor={colors.backgroundSecondary}
            alignItems="center"
            justifyContent="space-between"
          >
            <SizableText fontSize={13} color={colors.textSecondary}>
              Editing comment...
            </SizableText>
            {onCancelEdit && (
              <TouchableOpacity onPress={onCancelEdit}>
                <X size={16} color={colors.textSecondary} />
              </TouchableOpacity>
            )}
          </XStack>
        )}

        {/* Reply Indicator */}
        {replyingTo && (
          <XStack
            paddingHorizontal="$3"
            paddingVertical="$2"
            backgroundColor={colors.backgroundSecondary}
            alignItems="center"
            justifyContent="space-between"
          >
            <SizableText fontSize={13} color={colors.textSecondary}>
              Replying to {replyingTo.authorProfile?.username || 'Unknown User'}
              ...
            </SizableText>
            {onCancelReply && (
              <TouchableOpacity onPress={onCancelReply}>
                <X size={16} color={colors.textSecondary} />
              </TouchableOpacity>
            )}
          </XStack>
        )}

        {/* Media Preview */}
        {selectedMedia.length > 0 && (
          <YStack style={dynamicStyles.mediaPreviewContainer}>
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
          backgroundColor={colors.modal}
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
          backgroundColor={colors.modal}
          alignItems="center"
          gap="$3"
        >
          <Avatar uri={userAvatarUrl} size={35} />

          <Input
            ref={ref}
            flex={1}
            placeholder="Write a comment..."
            placeholderTextColor={colors.placeholder}
            value={value}
            onChangeText={onChangeText}
            borderWidth={1}
            borderColor={colors.border}
            borderRadius={20}
            paddingHorizontal="$3"
            paddingVertical="$2"
            fontSize={14}
            backgroundColor={colors.input}
            color={colors.text}
            editable={!isLoading}
          />

          <TouchableOpacity
            onPress={() => setShowCamera(true)}
            disabled={isLoading}
          >
            <CameraIcon
              size={24}
              color={isLoading ? colors.textTertiary : colors.textSecondary}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setShowMediaPicker(true)}
            disabled={isLoading}
          >
            <ImageIcon
              size={24}
              color={isLoading ? colors.textTertiary : colors.textSecondary}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleSend}
            disabled={
              (!value.trim() && selectedMedia.length === 0) || isLoading
            }
          >
            {isLoading ? (
              <ActivityIndicator size="small" color={colors.accent} />
            ) : (
              <Send
                size={24}
                color={
                  value.trim() || selectedMedia.length > 0
                    ? colors.accent
                    : colors.placeholder
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
