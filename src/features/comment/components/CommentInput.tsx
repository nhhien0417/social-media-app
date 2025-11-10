import React, { forwardRef } from 'react'
import {
  TouchableOpacity,
  StyleSheet,
  TextInput as RNTextInput,
} from 'react-native'
import { XStack, Input, SizableText, YStack } from 'tamagui'
import { Send } from '@tamagui/lucide-icons'
import { Comment } from '@/types/Comment'
import Avatar from '@/components/Avatar'

type Props = {
  value: string
  onChangeText: (text: string) => void
  onSend: () => void
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

          <TouchableOpacity onPress={onSend} disabled={!value.trim()}>
            <Send
              size={24}
              color={value.trim() ? '#0095F6' : '$placeholderColor'}
            />
          </TouchableOpacity>
        </XStack>
      </YStack>
    )
  }
)

CommentInput.displayName = 'CommentInput'

export default CommentInput
