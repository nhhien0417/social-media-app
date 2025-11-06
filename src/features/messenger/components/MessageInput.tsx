import { useState } from 'react'
import { XStack, Input, Button } from 'tamagui'
import { Send } from '@tamagui/lucide-icons'

interface MessageInputProps {
  chatId: string
  onSend?: (text: string) => void
}

export default function MessageInput({ chatId, onSend }: MessageInputProps) {
  const [text, setText] = useState('')

  const handleSend = () => {
    if (!text.trim()) return
    onSend?.(text.trim())
    console.log(`Send message to chat ${chatId}:`, text)
    setText('')
  }

  return (
    <XStack
      padding="$3"
      alignItems="center"
      gap="$2"
      borderTopWidth={1}
      borderColor="$borderColor"
      backgroundColor="$backgroundStrong"
    >
      <Input
        flex={1}
        size="$4"
        placeholder="Type a message..."
        value={text}
        onChangeText={setText}
        backgroundColor="$background"
      />
      <Button
        size="$4"
        icon={Send}
        circular
        onPress={handleSend}
        disabled={!text.trim()}
      />
    </XStack>
  )
}
