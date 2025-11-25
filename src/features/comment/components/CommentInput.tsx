import React, { forwardRef, useState } from 'react'
import {
  TouchableOpacity,
  StyleSheet,
  TextInput as RNTextInput,
  Image,
} from 'react-native'
import { XStack, Input, SizableText, YStack, ScrollView } from 'tamagui'
import { Send, Image as ImageIcon, X } from '@tamagui/lucide-icons'
import { Comment } from '@/types/Comment'
import Avatar from '@/components/Avatar'

type Props = {
  value: string
  onChangeText: (text: string) => void
  onSend: (content: string, media: string[]) => void
  userAvatarUrl: string
  replyingTo?: Comment | null
  onSelectEmotion: (emoji: string) => void
  onCancelReply?: () => void
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
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 12,
    padding: 4,
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
      onSelectEmotion,
      onCancelReply,
    },
    ref
  ) => {
    const [selectedMedia, setSelectedMedia] = useState<string[]>([])

    const handleSend = () => {
      if (value.trim() || selectedMedia.length > 0) {
        onSend(value, selectedMedia)
        setSelectedMedia([])
      }
    }

    const handlePickImage = () => {
      // Mock picking an image
      const mockImages = [
        'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
        'https://images.unsplash.com/photo-1682687221038-404670e01d46?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
        'https://images.unsplash.com/photo-1682687220063-4742bd7fd538?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
      ]
      const randomImage =
        mockImages[Math.floor(Math.random() * mockImages.length)]
      setSelectedMedia(prev => [...prev, randomImage])
    }

    const removeMedia = (index: number) => {
      setSelectedMedia(prev => prev.filter((_, i) => i !== index))
    }

    return (
      <YStack borderTopWidth={1} borderColor="$borderColor">
        {/* Reply indicator */}
        {replyingTo && (
          <XStack
            paddingHorizontal="$3"
            paddingVertical="$3"
            alignItems="center"
            justifyContent="space-between"
            backgroundColor="$backgroundFocus"
          >
            <SizableText fontSize={15} fontWeight="600" color="#888">
              Replying to {replyingTo.author.username} ...
            </SizableText>
            <TouchableOpacity onPress={onCancelReply}>
              <SizableText fontSize={15} fontWeight="700" color="#0095F6">
                Cancel
              </SizableText>
            </TouchableOpacity>
          </XStack>
        )}

        {/* Media Preview */}
        {selectedMedia.length > 0 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            paddingHorizontal="$3"
            paddingTop="$3"
          >
            {selectedMedia.map((uri, index) => (
              <YStack key={index} position="relative">
                <Image source={{ uri }} style={styles.mediaPreview} />
                <TouchableOpacity
                  style={styles.removeMediaButton}
                  onPress={() => removeMedia(index)}
                >
                  <X size={12} color="white" />
                </TouchableOpacity>
              </YStack>
            ))}
          </ScrollView>
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
          />

          <TouchableOpacity onPress={handlePickImage}>
            <ImageIcon size={24} color="#888" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleSend}
            disabled={!value.trim() && selectedMedia.length === 0}
          >
            <Send
              size={24}
              color={
                value.trim() || selectedMedia.length > 0
                  ? '#0095F6'
                  : '$placeholderColor'
              }
            />
          </TouchableOpacity>
        </XStack>
      </YStack>
    )
  }
)

CommentInput.displayName = 'CommentInput'

export default CommentInput
