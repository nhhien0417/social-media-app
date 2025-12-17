import { Image } from 'expo-image'
import { Modal, Pressable } from 'react-native'
import { YStack } from 'tamagui'
import { X } from '@tamagui/lucide-icons'
import { useState } from 'react'

interface BubbleImageProps {
  uri: string
  width?: number
  height?: number
}

export default function BubbleImage({ uri }: BubbleImageProps) {
  const [visible, setVisible] = useState(false)

  return (
    <>
      <Pressable onPress={() => setVisible(true)}>
        <YStack
          borderRadius={15}
          overflow="hidden"
          maxWidth={240}
          backgroundColor="$background"
        >
          <Image
            style={{
              width: 240,
              height: 240 * 0.75,
              backgroundColor: '#f0f0f0',
            }}
            source={{ uri }}
            contentFit="cover"
            transition={200}
          />
        </YStack>
      </Pressable>

      <Modal
        visible={visible}
        transparent={true}
        onRequestClose={() => setVisible(false)}
        animationType="fade"
      >
        <YStack flex={1} backgroundColor="black" justifyContent="center">
          <Pressable
            onPress={() => setVisible(false)}
            style={{
              position: 'absolute',
              top: 25,
              right: 25,
              zIndex: 1,
            }}
          >
            <X color="white" size={30} />
          </Pressable>

          <Image
            source={{ uri }}
            contentFit="contain"
            style={{ width: '100%', height: '100%' }}
            transition={200}
          />
        </YStack>
      </Modal>
    </>
  )
}
