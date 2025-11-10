import { memo } from 'react'
import { Grid3x3, Film, Tag } from '@tamagui/lucide-icons'
import { Text, XStack, useThemeName } from 'tamagui'
import { ProfileTabKey } from '@/mock/profile';

const tabs: Array<{ key: ProfileTabKey; icon: typeof Grid3x3; label: string }> =
  [
    { key: 'posts', icon: Grid3x3, label: 'Posts' },
    { key: 'reels', icon: Film, label: 'Reels' },
    { key: 'tagged', icon: Tag, label: 'Tagged' },
  ]

interface ProfileTabBarProps {
  value: ProfileTabKey
  onChange: (next: ProfileTabKey) => void
}

export const ProfileTabBar = memo(function ProfileTabBar({
  value,
  onChange,
}: ProfileTabBarProps) {
  const themeName = useThemeName()
  const isDark = themeName === 'dark'
  const activeColor = '#1877F2'
  const inactiveColor = isDark ? 'rgba(255,255,255,0.6)' : '#6b7280'

  return (
    <XStack
      borderTopWidth={1}
      borderColor={isDark ? 'rgba(255,255,255,0.1)' : '#e5e7eb'}
    >
      {tabs.map(tab => {
        const Icon = tab.icon
        const isActive = value === tab.key
        return (
          <XStack
            key={tab.key}
            flex={1}
            alignItems="center"
            justifyContent="center"
            gap="$2"
            paddingVertical="$3"
            pressStyle={{ opacity: 0.7 }}
            onPress={() => onChange(tab.key)}
          >
            <Icon size={20} color={isActive ? activeColor : inactiveColor} />
            <Text fontSize="$3" color={isActive ? activeColor : inactiveColor}>
              {tab.label}
            </Text>
          </XStack>
        )
      })}
    </XStack>
  )
})
