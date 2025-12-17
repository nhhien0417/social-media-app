import { useState, useEffect } from 'react'
import { XStack, Text, YStack } from 'tamagui'
import { Play, Pause } from '@tamagui/lucide-icons'
import { Pressable } from 'react-native'
import { useAudioPlayer } from 'expo-audio'

interface BubbleAudioProps {
  uri: string
  duration?: number
}

const formatTime = (seconds: number) => {
  if (!seconds) return '0:00'
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

export default function BubbleAudio({ uri, duration }: BubbleAudioProps) {
  const player = useAudioPlayer({ uri })
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentPosition, setCurrentPosition] = useState(0)
  const [totalDuration, setTotalDuration] = useState(duration || 0)

  useEffect(() => {
    const interval = setInterval(() => {
      setIsPlaying(player.playing)
      setCurrentPosition(player.currentTime)
      if (player.duration) {
        setTotalDuration(player.duration)
      }
    }, 200)
    return () => clearInterval(interval)
  }, [player])

  const handleTogglePlay = () => {
    if (isPlaying) {
      player.pause()
      setIsPlaying(false)
    } else {
      player.play()
      setIsPlaying(true)
    }
  }

  const progress =
    totalDuration > 0 ? (currentPosition / totalDuration) * 100 : 0

  return (
    <XStack
      backgroundColor="$background"
      paddingHorizontal="$3"
      paddingVertical="$2"
      borderRadius={50}
      gap="$2"
      alignItems="center"
      maxWidth={250}
      borderWidth={1}
      borderColor="$borderColor"
    >
      <Pressable onPress={handleTogglePlay}>
        <YStack
          width={32}
          height={32}
          backgroundColor="$color5"
          borderRadius={16}
          alignItems="center"
          justifyContent="center"
        >
          {isPlaying ? (
            <Pause size={16} color="$color" />
          ) : (
            <Play size={16} color="$color" />
          )}
        </YStack>
      </Pressable>

      <XStack flex={1} alignItems="center" gap="$2">
        <XStack
          flex={1}
          height={4}
          backgroundColor="$color5"
          borderRadius={2}
          overflow="hidden"
        >
          <XStack
            width={`${progress}%`}
            backgroundColor="$blue10"
            height="100%"
          />
        </XStack>
        <Text fontSize="$1" color="$color10" minWidth={65} textAlign="right">
          {formatTime(currentPosition)} / {formatTime(totalDuration)}
        </Text>
      </XStack>
    </XStack>
  )
}
