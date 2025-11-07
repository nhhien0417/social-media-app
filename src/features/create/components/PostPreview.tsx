import React, { useMemo, useState } from 'react'
import { Modal, TouchableOpacity, StyleSheet } from 'react-native'
import {
  YStack,
  XStack,
  SizableText,
  TextArea,
  Button,
  Image,
  Paragraph,
} from 'tamagui'
import Avatar from '@/components/Avatar'
import { Trash2, Globe, Users, Lock, ChevronDown } from '@tamagui/lucide-icons'

export type PrivacyOption = 'public' | 'friends' | 'only-me'

type DropdownOption = {
  value: PrivacyOption
  label: string
  explanation: string
  icon: React.ElementType
}

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

const privacyOptions: DropdownOption[] = [
  {
    value: 'public',
    label: 'Public',
    explanation: 'Anyone can see this post',
    icon: Globe,
  },
  {
    value: 'friends',
    label: 'Friends',
    explanation: 'Your friends can see this post',
    icon: Users,
  },
  {
    value: 'only-me',
    label: 'Only me',
    explanation: 'Only you can see this post',
    icon: Lock,
  },
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
  const [showModal, setShowModal] = useState(false)
  const [containerWidth, setContainerWidth] = useState<number>(0)

  const isSingle = media.length === 1
  const itemWidth = useMemo(() => {
    if (!containerWidth) return 0
    return Math.floor((containerWidth - 13) / 2)
  }, [containerWidth])

  const lineHeight = 22.5
  const fontSize = 20
  const minHeight = 22.5
  const [textHeight, setTextHeight] = useState<number>(minHeight)

  const selectedOption =
    privacyOptions.find(opt => opt.value === privacy) || privacyOptions[0]
  const SelectedIcon = selectedOption.icon

  const handleSelect = (selectedValue: PrivacyOption) => {
    onChangePrivacy(selectedValue)
    setShowModal(false)
  }

  return (
    <>
      <YStack marginTop="$3" gap="$3" paddingHorizontal="$3">
        {/* User + Privacy */}
        <XStack alignItems="center" gap="$3">
          <Avatar uri={user.avatarUrl} size={55} />
          <YStack flex={1} gap={3}>
            <SizableText size="$6" fontWeight="600">
              {user.name}
            </SizableText>

            <Button
              width={125}
              height={30}
              onPress={() => setShowModal(true)}
              backgroundColor="$background"
              borderRadius="$5"
              paddingHorizontal="$2"
              icon={<SelectedIcon size={20} color="$color" />}
              iconAfter={<ChevronDown size={17.5} color="$color" />}
            >
              <SizableText size="$3" fontWeight="500" color="$color" flex={1}>
                {selectedOption.label}
              </SizableText>
            </Button>
          </YStack>
        </XStack>

        {showCaption && (
          <YStack>
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
                if (newHeight !== textHeight) {
                  setTextHeight(newHeight)
                }
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
                  borderRadius={10}
                />
                <Button
                  icon={Trash2}
                  size={40}
                  circular
                  position="absolute"
                  top={15}
                  right={15}
                  zIndex={1}
                  backgroundColor="#000"
                  color="#FFF"
                  onPress={() => onRemoveMedia(media[0].id)}
                />
              </YStack>
            ) : (
              <XStack flexWrap="wrap" gap="$3">
                {media.map(item => (
                  <YStack key={item.id} width={itemWidth} position="relative">
                    <Image
                      source={{ uri: item.url }}
                      width={itemWidth}
                      aspectRatio={1}
                      borderRadius={10}
                    />
                    <Button
                      icon={Trash2}
                      size={30}
                      circular
                      position="absolute"
                      top={10}
                      right={10}
                      zIndex={1}
                      backgroundColor="#000"
                      color="#FFF"
                      onPress={() => onRemoveMedia(item.id)}
                    />
                  </YStack>
                ))}
              </XStack>
            )}
          </YStack>
        )}
      </YStack>

      <Modal
        visible={showModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowModal(false)}
      >
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={() => setShowModal(false)}
        >
          <TouchableOpacity
            activeOpacity={1}
            style={{ width: '100%' }}
            onPress={e => e.stopPropagation()}
          >
            <YStack
              backgroundColor="$background"
              borderRadius={20}
              padding="$3"
              width="100%"
            >
              <SizableText
                size="$7"
                fontWeight="800"
                textAlign="center"
                paddingBottom="$3"
                borderBottomWidth={StyleSheet.hairlineWidth}
                borderColor="$borderColor"
              >
                Post Audience
              </SizableText>

              <YStack gap="$0.5" paddingVertical="$3">
                <SizableText size="$6" fontWeight="600" color="$color">
                  Who can see your post?
                </SizableText>
                <Paragraph size="$4" color="$color" lineHeight={20}>
                  Your post will appear in Feed, on your profile and in search
                  results.
                </Paragraph>
              </YStack>

              {privacyOptions.map(option => {
                const isActive = option.value === privacy
                const OptionIcon = option.icon
                return (
                  <TouchableOpacity
                    key={option.value}
                    onPress={() => handleSelect(option.value)}
                  >
                    <XStack
                      alignItems="center"
                      gap="$3"
                      marginVertical="$2"
                      paddingVertical="$2"
                      paddingHorizontal="$2"
                      borderRadius={15}
                      backgroundColor="#EEE"
                    >
                      {/* Icon */}
                      <YStack
                        width={50}
                        height={50}
                        borderRadius={25}
                        backgroundColor="#d2d2d2"
                        alignItems="center"
                        justifyContent="center"
                      >
                        <OptionIcon size={25} color="$color" />
                      </YStack>

                      {/* Text (Title + Explanation) */}
                      <YStack flex={1}>
                        <SizableText size="$6" fontWeight="600">
                          {option.label}
                        </SizableText>
                        <Paragraph color="$color" size="$5">
                          {option.explanation}
                        </Paragraph>
                      </YStack>

                      {/* Nút Radio */}
                      <YStack
                        width={20}
                        height={20}
                        borderRadius={12}
                        borderWidth={2}
                        borderColor={isActive ? '#00aaee' : '#555'}
                        alignItems="center"
                        justifyContent="center"
                        marginRight="$2"
                      >
                        {isActive && (
                          <YStack
                            width={12}
                            height={12}
                            borderRadius={6}
                            backgroundColor="#00aaee"
                          />
                        )}
                      </YStack>
                    </XStack>
                  </TouchableOpacity>
                )
              })}
            </YStack>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12.5,
  },
})
