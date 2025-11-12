import { YStack, YStackProps } from 'tamagui'
import React from 'react'

type Props = {
  Icon: React.ElementType
  Size?: number
  Fill?: boolean
  Color?: string
} & YStackProps

export default function ButtonIcon({
  Icon,
  Size = 24,
  Fill = false,
  Color = '$color',
  ...rest
}: Props) {
  return (
    <YStack
      padding="$2"
      pressStyle={{ opacity: 0.5 }}
      alignItems="center"
      justifyContent="center"
      {...rest}
    >
      {Fill ? (
        <Icon size={Size} color={Color} fill={Color} />
      ) : (
        <Icon size={Size} color={Color} />
      )}
    </YStack>
  )
}
