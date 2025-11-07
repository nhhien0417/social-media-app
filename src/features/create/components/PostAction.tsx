import React from 'react'
import { XStack, Button, SizableText } from 'tamagui'
import { Image, Camera, Smile, MapPin } from '@tamagui/lucide-icons'

type Props = {
  onAddMedia?: () => void
}

export default function PostAction({ onAddMedia }: Props) {
  return (
    <XStack padding="$3" gap="$2" backgroundColor="$background">
      <Button
        flex={1}
        size="$4"
        icon={Image}
        scaleIcon={1.75}
        onPress={onAddMedia}
        borderRadius={10}
        backgroundColor="$blue4"
        color="$blue10"
      >
        <SizableText
          fontSize={20}
          textAlign="center"
          fontWeight="600"
          color="$blue10"
        >
          Photo
        </SizableText>
      </Button>
      <XStack flex={1} gap="$2">
        <Button
          flex={1}
          size="$4"
          icon={Camera}
          borderRadius={10}
          scaleIcon={1.75}
          backgroundColor="$green4"
          color="$green10"
        />

        <Button
          flex={1}
          size="$4"
          icon={Smile}
          borderRadius={10}
          scaleIcon={1.75}
          backgroundColor="$red4"
          color="$red10"
        />
      </XStack>
    </XStack>
  )
}
