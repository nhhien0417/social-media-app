import { XStack, Text, YStack } from 'tamagui'
import { Play, Pause } from '@tamagui/lucide-icons'
import { useState } from 'react'
import { Pressable } from 'react-native'
import { API_BASE_URL } from '@/utils/BaseUrl'

interface BubbleAudioProps {
  uri: string
  duration?: number
}

const getFullUrl = (uri: string) => {
  if (!uri) return ''
  if (uri.startsWith('http')) return uri
  const origin = API_BASE_URL.split('/api')[0]
  return `${origin}${uri.startsWith('/') ? '' : '/'}${uri}`
}

export default function BubbleAudio({ uri, duration }: BubbleAudioProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const fullUri = getFullUrl(uri)

  const handleTogglePlay = () => {
    setIsPlaying(!isPlaying)
  }

  return (
    <XStack
      backgroundColor="$backgroundPress"
      padding="$3"
      borderRadius={20}
      gap="$3"
      alignItems="center"
      minWidth={180}
    >
      <Pressable onPress={handleTogglePlay}>
        <YStack
          width={40}
          height={40}
          backgroundColor="$color5"
          borderRadius={20}
          alignItems="center"
          justifyContent="center"
        >
          {isPlaying ? (
            <Pause size={20} color="$color" />
          ) : (
            <Play size={20} color="$color" />
          )}
        </YStack>
      </Pressable>

      <YStack flex={1} gap="$1">
        <XStack
          height={4}
          backgroundColor="$color5"
          borderRadius={2}
          overflow="hidden"
        >
          <XStack width="30%" backgroundColor="$blue10" height="100%" />
        </XStack>
        <Text fontSize="$2" color="$color10">
          0:05 /{' '}
          {duration
            ? `${Math.floor(duration / 60)}:${(duration % 60).toString().padStart(2, '0')}`
            : '0:30'}
        </Text>
      </YStack>
    </XStack>
  )
}
