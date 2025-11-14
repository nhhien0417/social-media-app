import { Image, type ImageProps } from 'tamagui'

type Props = {
  uri?: string
  size?: number
} & Partial<ImageProps>

export default function Avatar({ uri, size = 36, ...rest }: Props) {
  return (
    <Image
      source={{ uri }}
      width={size}
      height={size}
      borderRadius={999}
      {...rest}
    />
  )
}
