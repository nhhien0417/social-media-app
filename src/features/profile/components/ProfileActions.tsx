import { useState } from 'react'
import { Button, XStack, useThemeName } from 'tamagui'
import { Share2 } from '@tamagui/lucide-icons'
import { useRouter } from 'expo-router'
import type { ProfileUser } from './data'
import { ShareProfileSheet } from './ShareProfileSheet'

interface ProfileActionsProps {
  user: ProfileUser
}

export function ProfileActions({ user }: ProfileActionsProps) {
  const router = useRouter()
  const [showShare, setShowShare] = useState(false)
  const themeName = useThemeName()
  const isDark = themeName === 'dark'
  const secondaryBackground = isDark ? 'rgba(255,255,255,0.08)' : '#f3f4f6'
  const secondaryTextColor = isDark ? '#f5f5f5' : '#111827'
  const outlineColor = isDark ? 'rgba(255,255,255,0.4)' : '#d1d5db'
  const isCurrentUser = Boolean(user.isCurrentUser)

  return (
    <>
      <XStack gap="$2" paddingHorizontal="$3">
        {isCurrentUser ? (
          <>
            <Button
              flex={1}
              borderRadius="$6"
              backgroundColor={secondaryBackground}
              color={secondaryTextColor}
              borderColor={outlineColor}
              borderWidth={1}
              onPress={() => router.push('/profile/edit')}
            >
              Edit Profile
            </Button>
            <Button
              flex={1}
              borderRadius="$6"
              backgroundColor={secondaryBackground}
              color={secondaryTextColor}
              borderColor={outlineColor}
              borderWidth={1}
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
              borderRadius="$6"
              backgroundColor="#1877F2"
              color="#ffffff"
            >
              Follow
            </Button>
            <Button
              flex={1}
              borderRadius="$6"
              backgroundColor={secondaryBackground}
              color={secondaryTextColor}
            >
              Message
            </Button>
            <Button
              width={44}
              borderRadius="$6"
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
