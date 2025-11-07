import { ComponentType, useRef, useState } from 'react'
import { StyleSheet } from 'react-native'
import { Input, XStack, useThemeName } from 'tamagui'
import {
  Camera,
  ChevronRight,
  Mic,
  Paperclip,
  Send,
  ThumbsUp,
} from '@tamagui/lucide-icons'

interface MessageInputProps {
  chatId: string
  onSend?: (text: string) => void
}

export default function MessageInput({ chatId, onSend }: MessageInputProps) {
  const [text, setText] = useState('')
  const [toolsCollapsed, setToolsCollapsed] = useState(false)
  const inputRef = useRef<any>(null)
  const theme = useThemeName()
  const isDark = theme === 'dark'

  const handleSend = () => {
    if (!text.trim()) return
    onSend?.(text.trim())
    console.log(`Send message to chat ${chatId}:`, text)
    setText('')
  }

  const handleLike = () => {
    onSend?.('👍')
    console.log(`Send quick like to chat ${chatId}`)
  }

  const hasText = text.trim().length > 0

  const likeColor = '#1877F2'
  const iconColor = isDark ? '#E4E6EB' : '#65676B'
  const inputBackground = isDark ? 'rgba(255,255,255,0.07)' : '#f0f2f5'
  const placeholderColor = isDark ? 'rgba(255,255,255,0.55)' : '#8D949E'
  const containerBackground = isDark ? 'rgba(17,20,24,0.92)' : '#ffffff'
  const borderColor = isDark ? 'rgba(255,255,255,0.08)' : '#e4e6eb'

  type IconTouchableProps = {
    Icon: ComponentType<{ size?: number; color?: string }>
    onPress?: () => void
    accessibilityLabel?: string
    color?: string
    size?: number
  }

  const IconTouchable = ({
    Icon,
    onPress,
    accessibilityLabel,
    color,
    size = 22,
  }: IconTouchableProps) => (
    <XStack
      paddingVertical="$2"
      paddingHorizontal="$1"
      alignItems="center"
      justifyContent="center"
      pressStyle={{ opacity: 0.65 }}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      hitSlop={10}
    >
      <Icon size={size} color={color ?? iconColor} />
    </XStack>
  )

  return (
    <XStack
      paddingHorizontal="$3"
      paddingVertical="$2"
      paddingLeft="$2"
      alignItems="center"
      gap="$3"
      borderTopWidth={StyleSheet.hairlineWidth}
      borderColor={borderColor}
      backgroundColor={containerBackground}
    >
      <XStack
        alignItems="center"
        gap="$1"
        minWidth={toolsCollapsed ? 40 : undefined}
        width={toolsCollapsed ? 44 : undefined}
        justifyContent={toolsCollapsed ? 'center' : 'flex-start'}
      >
        {toolsCollapsed ? (
          <IconTouchable
            Icon={ChevronRight}
            accessibilityLabel="Expand message tools"
            onPress={() => {
              setToolsCollapsed(false)
              inputRef.current?.blur?.()
            }}
          />
        ) : (
          <XStack alignItems="center" gap="$2">
            <IconTouchable
              Icon={Camera}
              accessibilityLabel="Open camera"
              onPress={() => console.log(`Open camera for chat ${chatId}`)}
            />
            <IconTouchable
              Icon={Paperclip}
              accessibilityLabel="Attach a file"
              onPress={() => console.log(`Open file picker for chat ${chatId}`)}
            />
            <IconTouchable
              Icon={Mic}
              accessibilityLabel="Record a voice message"
              onPress={() =>
                console.log(`Record voice message for chat ${chatId}`)
              }
            />
          </XStack>
        )}
      </XStack>

      <Input
        ref={inputRef}
        flex={1}
        placeholder="Type a message..."
        value={text}
        onChangeText={setText}
        backgroundColor={inputBackground}
        placeholderTextColor={placeholderColor}
        borderRadius={999}
        paddingHorizontal="$4"
        height={44}
        fontSize={16}
        borderColor="transparent"
        borderWidth={0}
        onFocus={() => setToolsCollapsed(true)}
        onBlur={() => setToolsCollapsed(false)}
      />
      {hasText ? (
        <IconTouchable
          Icon={Send}
          accessibilityLabel="Send message"
          onPress={handleSend}
          color={likeColor}
        />
      ) : (
        <IconTouchable
          Icon={ThumbsUp}
          accessibilityLabel="Send Like"
          onPress={handleLike}
          color={likeColor}
          size={24}
        />
      )}
    </XStack>
  )
}
