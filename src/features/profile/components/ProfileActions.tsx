import { useState } from 'react'
import { Button, XStack, useThemeName } from 'tamagui'
import { Share2 } from '@tamagui/lucide-icons'
import { useRouter } from 'expo-router'
import { ShareProfileSheet } from './ShareProfileSheet'
import { ProfileComponentProps } from '../ProfileScreen'

export function ProfileActions({ user, isOwnProfile }: ProfileComponentProps) {
  const router = useRouter()
  const [showShare, setShowShare] = useState(false)
  const themeName = useThemeName()
  const isDark = themeName === 'dark'
  const secondaryBackground = isDark ? 'rgba(255,255,255,0.08)' : '#e3e8f1ff'
  const secondaryTextColor = isDark ? '#f5f5f5' : '#0d131eff'
  const outlineColor = isDark ? 'rgba(255,255,255,0.4)' : '#9fa2a7ff'

  return (
    <>
      <XStack gap="$3" paddingHorizontal="$3">
        {isOwnProfile ? (
          <>
            <Button
              flex={1}
              borderRadius="$5"
              backgroundColor={secondaryBackground}
              color={secondaryTextColor}
              borderColor={outlineColor}
              borderWidth={1}
              fontSize={15}
              fontWeight={500}
              onPress={() => router.push('/profile/edit')}
            >
              Edit Profile
            </Button>
            <Button
              flex={1}
              borderRadius="$5"
              backgroundColor={secondaryBackground}
              color={secondaryTextColor}
              borderColor={outlineColor}
              borderWidth={1}
              fontSize={15}
              fontWeight={500}
              icon={<Share2 size={18} color={secondaryTextColor} />}
              onPress={() => setShowShare(true)}
            >
              Share Profile
            </Button>
          </>
        ) : (
          <>
            <Button
              flex={1}
              borderRadius="$5"
              backgroundColor="#1877F2"
              color="#ffffff"
              fontSize={15}
              fontWeight={500}
            >
              Follow
            </Button>
            <Button
              flex={1}
              borderRadius="$5"
              backgroundColor={secondaryBackground}
              color={secondaryTextColor}
              fontSize={15}
              fontWeight={500}
            >
              Message
            </Button>
            <Button
              width={44}
              borderRadius="$5"
              backgroundColor={secondaryBackground}
              color={secondaryTextColor}
            >
              ⋯
            </Button>
          </>
        )}
      </XStack>

      <ShareProfileSheet
        open={showShare}
        onOpenChange={setShowShare}
        user={user}
      />
    </>
  )
}
