import React, { useMemo, useState } from 'react'
import {
  Modal,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image as RNImage,
} from 'react-native'
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
import {
  Trash2,
  Globe,
  Users,
  Lock,
  ChevronDown,
  X,
} from '@tamagui/lucide-icons'

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window')

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
  type?: 'photo' | 'video'
  duration?: number
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
  const [fullscreenMedia, setFullscreenMedia] = useState<MediaItem | null>(null)

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

  const formatDuration = (duration?: number) => {
    if (!duration || duration <= 0) return '0:01' // Default to 1 second if no duration
    const minutes = Math.floor(duration / 60)
    const seconds = Math.floor(duration % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  return (
    <>
      <YStack marginTop="$3" gap="$3" paddingHorizontal="$3">
        {/* User + Privacy */}
        <XStack alignItems="center" gap="$3">
          <Avatar uri={user.avatarUrl} size={55} />
          <YStack flex={1} gap={3}>
            <SizableText size="$6" fontWeight="700">
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
              <SizableText size="$3" fontWeight="600" color="$color" flex={1}>
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
              color="$color"
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
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => setFullscreenMedia(media[0])}
              >
                <YStack>
                  <Image
                    source={{ uri: media[0].url }}
                    width="100%"
                    aspectRatio={1}
                    borderRadius={10}
                  />
                  {media[0].type === 'video' && (
                    <YStack
                      position="absolute"
                      bottom={10}
                      right={10}
                      backgroundColor="rgba(0,0,0,0.75)"
                      paddingHorizontal="$2"
                      paddingVertical="$1"
                      borderRadius={6}
                    >
                      <SizableText fontSize={12} fontWeight="600">
                        {formatDuration(media[0].duration)}
                      </SizableText>
                    </YStack>
                  )}
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
              </TouchableOpacity>
            ) : (
              <XStack flexWrap="wrap" gap="$3">
                {media.map(item => (
                  <TouchableOpacity
                    key={item.id}
                    activeOpacity={0.9}
                    onPress={() => setFullscreenMedia(item)}
                  >
                    <YStack width={itemWidth} position="relative">
                      <Image
                        source={{ uri: item.url }}
                        width={itemWidth}
                        aspectRatio={1}
                        borderRadius={10}
                      />
                      {item.type === 'video' && (
                        <YStack
                          position="absolute"
                          bottom={6}
                          right={6}
                          backgroundColor="rgba(0,0,0,0.75)"
                          paddingHorizontal="$1.5"
                          paddingVertical="$0.5"
                          borderRadius={4}
                        >
                          <SizableText
                            fontSize={10}
                            color="white"
                            fontWeight="600"
                          >
                            {formatDuration(item.duration)}
                          </SizableText>
                        </YStack>
                      )}
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
                  </TouchableOpacity>
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
                <SizableText size="$6" fontWeight="700" color="$color">
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
                      backgroundColor="$backgroundFocus"
                    >
                      {/* Icon */}
                      <YStack
                        width={50}
                        height={50}
                        borderRadius={25}
                        backgroundColor="$borderColor"
                        alignItems="center"
                        justifyContent="center"
                      >
                        <OptionIcon size={25} color="$color" />
                      </YStack>

                      {/* Text (Title + Explanation) */}
                      <YStack flex={1}>
                        <SizableText size="$6" fontWeight="700">
                          {option.label}
                        </SizableText>
                        <Paragraph color="$color" size="$5">
                          {option.explanation}
                        </Paragraph>
                      </YStack>

                      {/* Radio */}
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

      {/* Fullscreen Media Modal */}
      <Modal
        visible={!!fullscreenMedia}
        transparent
        animationType="fade"
        onRequestClose={() => setFullscreenMedia(null)}
      >
        <YStack
          flex={1}
          backgroundColor="rgba(0,0,0,0.95)"
          justifyContent="center"
          alignItems="center"
        >
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setFullscreenMedia(null)}
          >
            <X size={32} color="white" />
          </TouchableOpacity>

          {fullscreenMedia && (
            <YStack
              width={SCREEN_WIDTH}
              height={SCREEN_WIDTH}
              position="relative"
            >
              <RNImage
                source={{ uri: fullscreenMedia.url }}
                style={{
                  width: SCREEN_WIDTH,
                  height: SCREEN_WIDTH,
                }}
                resizeMode="contain"
              />
              {fullscreenMedia.type === 'video' && (
                <YStack
                  position="absolute"
                  bottom={20}
                  right={20}
                  backgroundColor="rgba(0,0,0,0.7)"
                  paddingHorizontal="$3"
                  paddingVertical="$2"
                  borderRadius={8}
                >
                  <SizableText fontSize={16} color="white" fontWeight="600">
                    {formatDuration(fullscreenMedia.duration)}
                  </SizableText>
                </YStack>
              )}
            </YStack>
          )}
        </YStack>
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
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
    padding: 10,
  },
})
