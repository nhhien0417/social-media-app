import { Text, XStack } from 'tamagui'
import { ChevronLeft, PenSquare } from '@tamagui/lucide-icons'
import { useRouter } from 'expo-router'
import { Pressable } from 'react-native'

export default function ChatListHeader() {
  const router = useRouter()

  return (
    <XStack
      justifyContent="space-between"
      alignItems="center"
      paddingHorizontal="$3"
      paddingVertical="$3"
      backgroundColor="$background"
    >
      <XStack alignItems="center" gap="$3">
        <Pressable
          onPress={() => {
            if (router.canGoBack()) {
              router.back()
            } else {
              router.replace('/(tabs)')
            }
          }}
          style={({ pressed }) => ({
            padding: 0,
            margin: 0,
            minWidth: 0,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'transparent',
            opacity: pressed ? 0.5 : 1,
          })}
          android_ripple={{ color: '#00000010', borderless: true }}
        >
          <ChevronLeft size={22} color="$color" />
        </Pressable>

        <Text fontSize={20} fontWeight="700">
          Chats
        </Text>
      </XStack>

      <Pressable
        onPress={() => router.push('/message/new')}
        style={({ pressed }) => ({
          padding: 0,
          margin: 0,
          minWidth: 0,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'transparent',
          opacity: pressed ? 0.5 : 1,
        })}
        android_ripple={{ color: '#00000010', borderless: true }}
      >
        <PenSquare size={20} />
      </Pressable>
    </XStack>
  )
}
