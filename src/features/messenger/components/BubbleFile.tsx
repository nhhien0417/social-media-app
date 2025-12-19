import { XStack, Text, YStack } from 'tamagui'
import { FileText, Download } from '@tamagui/lucide-icons'
import { Pressable, Platform, Linking } from 'react-native'
import * as FileSystem from 'expo-file-system/legacy'
import { shareAsync } from 'expo-sharing'

interface BubbleFileProps {
  uri: string
  name?: string
  size?: number
}

export default function BubbleFile({
  uri,
  name = 'File',
  size,
}: BubbleFileProps) {
  const handleOpen = async () => {
    try {
      // Web: Use browser native download
      if (Platform.OS === 'web') {
        const link = document.createElement('a')
        link.href = uri
        link.download = name
        link.target = '_blank'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        return
      }

      // Mobile: Download to cache and share
      const cacheDir = FileSystem.cacheDirectory
      if (!cacheDir) {
        // Fallback: Open URL directly
        await Linking.openURL(uri)
        return
      }

      const fileUri = cacheDir + name
      const { uri: localUri } = await FileSystem.downloadAsync(uri, fileUri)
      await shareAsync(localUri)
    } catch (e) {
      console.error('Download error:', e)
      // Fallback: Try to open URL directly
      try {
        await Linking.openURL(uri)
      } catch (linkError) {
        console.error('Failed to open URL:', linkError)
      }
    }
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
