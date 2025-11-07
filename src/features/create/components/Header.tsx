import React from 'react'
import { StyleSheet } from 'react-native'
import { XStack, Button, SizableText, Select } from 'tamagui'
import { ChevronLeft, ChevronDown, Check } from '@tamagui/lucide-icons'
import IconButton from '@/components/IconButton'

export type CreateMode = 'post' | 'story'

type Props = {
  mode: CreateMode
  canShare?: boolean
  onBack?: () => void
  onShare?: () => void
  onChangeMode?: (mode: CreateMode) => void
}

export default function Header({
  mode,
  canShare = true,
  onBack,
  onShare,
  onChangeMode,
}: Props) {
  const isPost = mode === 'post'
  return (
    <XStack
      paddingHorizontal="$3"
      paddingVertical="$3"
      alignItems="center"
      justifyContent="space-between"
      borderBottomWidth={StyleSheet.hairlineWidth}
      borderColor="$borderColor"
      backgroundColor="$background"
      gap="$3"
    >
      <IconButton Icon={ChevronLeft} onPress={onBack} Size={30} />

      <Select
        value={mode}
        onValueChange={val => onChangeMode?.(val as CreateMode)}
      >
        <Select.Trigger
          borderRadius={20}
          backgroundColor="$background"
          height={30}
          width={125}
          iconAfter={ChevronDown}
        >
          <Select.Value
            fontSize="$6"
            fontWeight={600}
            textTransform="capitalize"
          />
        </Select.Trigger>
        <Select.Content zIndex={99999}>
          <Select.Viewport borderRadius={20} backgroundColor="$background">
            <Select.Group>
              {['post', 'story'].map((val, idx) => (
                <Select.Item key={val} index={idx} value={val}>
                  <Select.ItemText
                    fontSize="$6"
                    fontWeight={500}
                    textTransform="capitalize"
                  >
                    {val}
                  </Select.ItemText>
                  <Select.ItemIndicator marginLeft="auto">
                    <Check size={16} />
                  </Select.ItemIndicator>
                </Select.Item>
              ))}
            </Select.Group>
          </Select.Viewport>
        </Select.Content>
      </Select>

      <Button
        size={40}
        disabled={!canShare}
        onPress={onShare}
        borderRadius={20}
        backgroundColor="#00AAFF"
        paddingHorizontal={20}
      >
        <SizableText size={20} fontWeight="700" color="$color">
          {isPost ? 'Post' : 'Share'}
        </SizableText>
      </Button>
    </XStack>
  )
}
