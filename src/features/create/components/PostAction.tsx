import React from 'react'
import { StyleSheet } from 'react-native'
import { XStack, Button, SizableText } from 'tamagui'
import { Image as ImageIcon } from '@tamagui/lucide-icons'

type Props = {
  onAddMedia?: () => void
}

export default function PostAction({ onAddMedia }: Props) {
  return (
    <XStack
      padding="$3"
      gap="$3"
      borderTopWidth={StyleSheet.hairlineWidth}
      borderColor="$borderColor"
      backgroundColor="$background"
    >
      <Button
        flex={1}
        size="$4"
        icon={ImageIcon}
        onPress={onAddMedia}
        borderRadius={12}
      >
        <SizableText fontSize={15} fontWeight="600">
          Add Photo
        </SizableText>
      </Button>
    </XStack>
  )
}
