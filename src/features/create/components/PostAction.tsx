import React, { useMemo } from 'react'
import { XStack, Button, SizableText } from 'tamagui'
import { Image, Camera, Smile } from '@tamagui/lucide-icons'
import { useAppColors } from '@/theme'

type Props = {
  onAddMedia?: () => void
  onTakePhoto?: () => void
}

export default function PostAction({ onAddMedia, onTakePhoto }: Props) {
  const colors = useAppColors()

  const actions = useMemo(
    () => [
      {
        key: 'gallery',
        label: 'Gallery',
        icon: Image,
        onPress: onAddMedia,
        background: colors.features.gallery.background,
        iconColor: colors.features.gallery.icon,
      },
      {
        key: 'camera',
        label: 'Camera',
        icon: Camera,
        onPress: onTakePhoto,
        background: colors.features.camera.background,
        iconColor: colors.features.camera.icon,
      },
      {
        key: 'feeling',
        label: 'Feeling',
        icon: Smile,
        onPress: undefined,
        background: colors.features.feeling.background,
        iconColor: colors.features.feeling.icon,
      },
    ],
    [colors, onAddMedia, onTakePhoto]
  )

  return (
    <XStack padding="$2" gap="$1.5" backgroundColor={colors.background}>
      {actions.map(action => {
        const IconComponent = action.icon
        return (
          <Button
            key={action.key}
            flex={1}
            size="$3"
            backgroundColor={action.background}
            borderRadius={12}
            onPress={action.onPress}
            disabled={!action.onPress}
            opacity={action.onPress ? 1 : 0.6}
            paddingVertical="$2"
            height={40}
          >
            <XStack alignItems="center" justifyContent="center" gap="$1.5">
              <IconComponent size={18} color={action.iconColor} />
              <SizableText fontSize={14} fontWeight="600" color={colors.text}>
                {action.label}
              </SizableText>
            </XStack>
          </Button>
        )
      })}
    </XStack>
  )
}
