import { YStack, YStackProps } from 'tamagui'
import React from 'react'

type Props = {
  Icon: React.ElementType
  Size?: number
} & YStackProps

export default function ButtonIcon({ Icon, Size = 24, ...rest }: Props) {
  return (
    <YStack
      padding="$2"
      pressStyle={{ opacity: 0.5 }}
      alignItems="center"
      justifyContent="center"
      {...rest}
    >
      <Icon size={Size} />
    </YStack>
  )
}
