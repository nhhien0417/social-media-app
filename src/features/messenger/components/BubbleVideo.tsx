import { useVideoPlayer, VideoView } from 'expo-video'
import { YStack, Button } from 'tamagui'
import { Play } from '@tamagui/lucide-icons'

interface BubbleVideoProps {
  uri: string
}

export default function BubbleVideo({ uri }: BubbleVideoProps) {
  const player = useVideoPlayer(uri, player => {
    player.loop = true
  })

  return (
    <YStack
      borderRadius={15}
      overflow="hidden"
      maxWidth={240}
      height={320}
      backgroundColor="black"
    >
      <VideoView
        style={{ width: 240, height: 320 }}
        player={player}
        nativeControls
        contentFit="cover"
      />
    </YStack>
  )
}
