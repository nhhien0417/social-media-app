import React from 'react'
import { XStack, Button, SizableText } from 'tamagui'
import { Image as ImageIcon, Video, Smile, MapPin } from '@tamagui/lucide-icons'

type Props = {
  onAddMedia?: () => void
}

export default function PostAction({ onAddMedia }: Props) {
  return (
    <XStack padding="$3" gap="$2" backgroundColor="$background">
      <Button
        flex={1}
        size="$4"
        icon={ImageIcon}
        onPress={onAddMedia}
        borderRadius={10}
        backgroundColor="$blue4"
        color="$blue10"
      >
        <SizableText fontSize={15} fontWeight="700" color="$blue10">
          Photo
        </SizableText>
      </Button>

      <Button
        size="$4"
        icon={Video}
        borderRadius={10}
        backgroundColor="$green4"
        color="$green10"
      />

      <Button
        size="$4"
        icon={Smile}
        borderRadius={10}
        backgroundColor="$yellow4"
        color="$yellow10"
      />

      <Button
        size="$4"
        icon={MapPin}
        borderRadius={10}
        backgroundColor="$red4"
        color="$red10"
      />
    </XStack>
  )
}
