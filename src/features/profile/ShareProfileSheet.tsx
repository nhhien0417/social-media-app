import { memo } from 'react'
import { ScrollView } from 'react-native'
import { Button, Sheet, Text, XStack, YStack, useThemeName } from 'tamagui'
import {
  Copy,
  Link,
  MessageCircle,
  QrCode,
  Share2,
} from '@tamagui/lucide-icons'
import type { ProfileUser } from './data'

interface ShareProfileSheetProps {
  open: boolean
  onOpenChange: (next: boolean) => void
  user: ProfileUser
}

const shareOptions = [
  { key: 'qr', label: 'QR Code', icon: QrCode },
  { key: 'link', label: 'Copy Link', icon: Link },
  { key: 'messages', label: 'Share to Messages', icon: MessageCircle },
  { key: 'apps', label: 'Share to other apps', icon: Share2 },
]

export const ShareProfileSheet = memo(function ShareProfileSheet({
  open,
  onOpenChange,
  user,
}: ShareProfileSheetProps) {
  const themeName = useThemeName()
  const isDark = themeName === 'dark'
  const sheetBackground = isDark ? '#111418' : '#ffffff'
  const textColor = isDark ? '#f5f5f5' : '#111827'
  const subTextColor = isDark ? 'rgba(255,255,255,0.64)' : '#6b7280'

  return (
    <Sheet
      modal
      open={open}
      onOpenChange={onOpenChange}
      snapPoints={[48]}
      dismissOnSnapToBottom
    >
      <Sheet.Overlay backgroundColor="rgba(0,0,0,0.5)" />
      <Sheet.Handle backgroundColor={isDark ? '#374151' : '#d1d5db'} />
      <Sheet.Frame backgroundColor={sheetBackground} padding="$4" gap="$4">
        <YStack gap="$1">
          <Text fontSize="$6" fontWeight="700" color={textColor}>
            Share {user.username}'s profile
          </Text>
          <Text fontSize="$3" color={subTextColor}>
            Choose one of the options below to share this profile with friends.
          </Text>
        </YStack>

        <ScrollView>
          <YStack gap="$2">
            {shareOptions.map(option => {
              const Icon = option.icon
              return (
                <XStack
                  key={option.key}
                  alignItems="center"
                  gap="$3"
                  padding="$3"
                  borderRadius="$4"
                  backgroundColor={
                    isDark ? 'rgba(255,255,255,0.04)' : '#f3f4f6'
                  }
                >
                  <Icon size={20} color={textColor} />
                  <Text fontSize="$4" color={textColor}>
                    {option.label}
                  </Text>
                </XStack>
              )
            })}
          </YStack>
        </ScrollView>

        <Button
          icon={<Copy size={18} color="#ffffff" />}
          backgroundColor="#1877F2"
          color="#ffffff"
          onPress={() => onOpenChange(false)}
        >
          Copy Profile Link
        </Button>
      </Sheet.Frame>
    </Sheet>
  )
})
