import { XStack, Text, YStack } from 'tamagui'
import { FileText, Download } from '@tamagui/lucide-icons'
import { Linking, Pressable } from 'react-native'

interface BubbleFileProps {
  uri: string
  name?: string
  size?: number // bytes
}

export default function BubbleFile({
  uri,
  name = 'File',
  size,
}: BubbleFileProps) {
  const handleOpen = () => {
    Linking.openURL(uri)
  }

  return (
    <Pressable onPress={handleOpen}>
      <XStack
        backgroundColor="$backgroundPress"
        padding="$3"
        borderRadius={12}
        gap="$3"
        alignItems="center"
        maxWidth={240}
      >
        <YStack
          width={40}
          height={40}
          backgroundColor="$color5"
          borderRadius={8}
          alignItems="center"
          justifyContent="center"
        >
          <FileText size={24} color="$color" />
        </YStack>

        <YStack flex={1}>
          <Text numberOfLines={1} fontWeight="600" color="$color">
            {name}
          </Text>
          <Text fontSize="$2" color="$color10">
            {size ? `${(size / 1024).toFixed(1)} KB` : 'Tap to download'}
          </Text>
        </YStack>

        <Download size={20} color="$color8" />
      </XStack>
    </Pressable>
  )
}
