import React, { useMemo } from 'react'
import { XStack, Button, SizableText, useThemeName } from 'tamagui'
import { Image, Camera, Smile } from '@tamagui/lucide-icons'

type Props = {
  onAddMedia?: () => void
  onTakePhoto?: () => void
}

export default function PostAction({ onAddMedia, onTakePhoto }: Props) {
  const themeName = useThemeName()
  const isDark = themeName === 'dark'

  const actions = useMemo(
    () => [
      {
        key: 'gallery',
        label: 'Gallery',
        icon: Image,
        onPress: onAddMedia,
        background: isDark ? 'rgba(37,99,235,0.18)' : 'rgba(37,99,235,0.12)',
        iconColor: '#2563EB',
      },
      {
        key: 'camera',
        label: 'Camera',
        icon: Camera,
        onPress: onTakePhoto,
        background: isDark ? 'rgba(34,197,94,0.2)' : 'rgba(34,197,94,0.12)',
        iconColor: '#22C55E',
      },
      {
        key: 'feeling',
        label: 'Feeling',
        icon: Smile,
        onPress: undefined,
        background: isDark ? 'rgba(234,179,8,0.2)' : 'rgba(234,179,8,0.16)',
        iconColor: '#ca8a04',
      },
    ],
    [isDark, onAddMedia, onTakePhoto]
  )

  const labelColor = isDark ? '#F9FAFB' : '#111827'

  return (
    <XStack padding="$3" gap="$2" backgroundColor="$background">
      {actions.map(action => {
        const IconComponent = action.icon
        return (
          <Button
            key={action.key}
            flex={1}
            size="$4"
            backgroundColor={action.background}
            borderRadius={14}
            onPress={action.onPress}
            disabled={!action.onPress}
            opacity={action.onPress ? 1 : 0.6}
          >
            <XStack alignItems="center" justifyContent="center" gap="$2">
              <IconComponent size={20} color={action.iconColor} />
              <SizableText fontSize={15} fontWeight="600" color={labelColor}>
                {action.label}
              </SizableText>
            </XStack>
          </Button>
        )
      })}
    </XStack>
  )
}
