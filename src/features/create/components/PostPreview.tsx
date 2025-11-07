import React, { useMemo, useState, useEffect } from 'react'
import {
  YStack,
  XStack,
  SizableText,
  TextArea,
  Button,
  Image,
  Select,
  Text,
} from 'tamagui'
import Avatar from '@/components/Avatar'
import { ChevronDown, Trash2 } from '@tamagui/lucide-icons'

export type PrivacyOption = 'public' | 'friends' | 'only-me'

export interface MediaItem {
  id: string
  url: string
}

export interface UserInfoData {
  id: string
  name: string
  avatarUrl: string
}

type Props = {
  user: UserInfoData
  caption: string
  onChangeCaption: (text: string) => void
  media: MediaItem[]
  onRemoveMedia: (id: string) => void
  privacy: PrivacyOption
  onChangePrivacy: (p: PrivacyOption) => void
  showCaption?: boolean
}

const privacyOptions: { value: PrivacyOption; label: string }[] = [
  { value: 'friends', label: 'Friends' },
  { value: 'only-me', label: 'Only me' },
  { value: 'public', label: 'Public' },
]

export default function PostPreview({
  user,
  caption,
  onChangeCaption,
  media,
  onRemoveMedia,
  privacy,
  onChangePrivacy,
  showCaption = true,
}: Props) {
  const [containerWidth, setContainerWidth] = useState<number>(0)
  const isSingle = media.length === 1
  const itemWidth = useMemo(() => {
    if (!containerWidth) return 0
    return Math.floor(containerWidth / 2)
  }, [containerWidth])

  const lineHeight = 20
  const fontSize = 20
  const minHeight = 60
  const [textHeight, setTextHeight] = useState<number>(minHeight)

  return (
    <YStack marginTop="$3" gap="$3">
      {/* User + Privacy */}
      <XStack paddingHorizontal="$3" alignItems="center" gap="$3">
        <Avatar uri={user.avatarUrl} size={55} />
        <YStack flex={1} gap={3}>
          <SizableText size="$5" fontWeight="600">
            {user.name}
          </SizableText>
          <Select
            value={privacy}
            onValueChange={val => onChangePrivacy(val as PrivacyOption)}
          >
            <Select.Trigger
              borderRadius={10}
              backgroundColor="$background"
              height={17}
              width={125}
              paddingHorizontal={12}
              iconAfter={ChevronDown}
            >
              <SizableText fontSize={15} fontWeight={400}>
                {privacyOptions.find(p => p.value === privacy)?.label ??
                  'Privacy'}
              </SizableText>
            </Select.Trigger>
            <Select.Content zIndex={999999}>
              <Select.Viewport borderRadius={10} backgroundColor="$background">
                {privacyOptions.map((opt, idx) => (
                  <Select.Item key={opt.value} index={idx} value={opt.value}>
                    <Select.ItemText fontSize={15} fontWeight={400}>
                      {opt.label}
                    </Select.ItemText>
                  </Select.Item>
                ))}
              </Select.Viewport>
            </Select.Content>
          </Select>
        </YStack>
      </XStack>

      {showCaption && (
        <YStack padding="$3">
          <TextArea
            unstyled
            placeholder="What are you thinking about?"
            value={caption}
            onChangeText={onChangeCaption}
            multiline
            scrollEnabled={false}
            borderWidth={0}
            onContentSizeChange={event => {
              const height = event.nativeEvent.contentSize.height
              const newHeight = Math.max(minHeight, height)
              setTextHeight(newHeight)
            }}
            style={{
              height: textHeight,
              lineHeight,
              fontSize,
              padding: 0,
              margin: 0,
              overflow: 'hidden',
            }}
            focusStyle={{
              outlineWidth: 0,
              outlineColor: 'transparent',
              borderWidth: 0,
              borderColor: 'transparent',
            }}
          />
        </YStack>
      )}

      {/* Media preview*/}
      {!!media.length && (
        <YStack
          onLayout={e => {
            const w = e.nativeEvent.layout.width
            setContainerWidth(prev => (prev === w ? prev : w))
          }}
        >
          {isSingle ? (
            <YStack>
              <Image
                source={{ uri: media[0].url }}
                width="100%"
                aspectRatio={1}
              />
              <Button
                icon={Trash2}
                size="$2"
                circular
                position="absolute"
                top={8}
                right={8}
                zIndex={1}
                backgroundColor="$red10"
                color="$color"
                onPress={() => onRemoveMedia(media[0].id)}
              />
            </YStack>
          ) : (
            <XStack flexWrap="wrap">
              {media.map(item => (
                <YStack key={item.id} width={itemWidth} position="relative">
                  <Image
                    source={{ uri: item.url }}
                    width={itemWidth}
                    aspectRatio={1}
                  />
                  <Button
                    icon={Trash2}
                    size="$2"
                    circular
                    position="absolute"
                    top={8}
                    right={8}
                    zIndex={1}
                    backgroundColor="$red10"
                    color="$color"
                    onPress={() => onRemoveMedia(item.id)}
                  />
                </YStack>
              ))}
            </XStack>
          )}
        </YStack>
      )}
    </YStack>
  )
}
