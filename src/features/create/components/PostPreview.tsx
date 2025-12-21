import React, { useMemo, useState } from 'react'
import {
  Dimensions,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Image as RNImage,
} from 'react-native'
import {
  Button,
  Paragraph,
  SizableText,
  Text,
  TextArea,
  XStack,
  YStack,
  useThemeName,
} from 'tamagui'
import Avatar from '@/components/Avatar'
import {
  ChevronDown,
  Globe,
  Lock,
  Trash2,
  Users,
  X,
} from '@tamagui/lucide-icons'
import { PostPrivacy } from '@/types/Post'

const { width: SCREEN_WIDTH } = Dimensions.get('window')
const GRID_SPACING = 8
const MIN_TEXTAREA_HEIGHT = 44

type DropdownOption = {
  value: PostPrivacy
  label: string
  explanation: string
  icon: React.ElementType
}

export interface MediaItem {
  id: string
  url: string
  type?: 'photo' | 'video'
  duration?: number
  fileName?: string
  mimeType?: string
  blob?: Blob
}

export interface UserInfoData {
  id: string
  name: string
  avatarUrl?: string
}

type Props = {
  user: UserInfoData
  caption: string
  onChangeCaption: (text: string) => void
  media: MediaItem[]
  onRemoveMedia: (id: string) => void
  privacy: PostPrivacy
  onChangePrivacy: (value: PostPrivacy) => void
  showCaption?: boolean
  groupName?: string
}

const privacyOptions: DropdownOption[] = [
  {
    value: 'PUBLIC',
    label: 'Public',
    explanation: 'Anyone on or off the app can see this post',
    icon: Globe,
  },
  {
    value: 'FRIENDS',
    label: 'Friends',
    explanation: 'Only your friends will see this post',
    icon: Users,
  },
  {
    value: 'PRIVATE',
    label: 'Private',
    explanation: 'Keep this post private to you',
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
  groupName,
}: Props) {
  const [showPrivacyModal, setShowPrivacyModal] = useState(false)
  const [fullscreenMedia, setFullscreenMedia] = useState<MediaItem | null>(null)
  const [containerWidth, setContainerWidth] = useState(0)
  const [textHeight, setTextHeight] = useState(MIN_TEXTAREA_HEIGHT)

  const themeName = useThemeName()
  const isDark = themeName === 'dark'
  const accentColor = isDark ? '#1DA1F2' : '#0095F6'
  const borderColor = isDark ? 'rgba(255,255,255,0.1)' : '#DBDBDB'
  const cardBackground = isDark ? '#121212' : '#FFFFFF'
  const chipBackground = isDark ? 'rgba(29,161,242,0.15)' : 'rgba(0,149,246,0.1)'
  const chipBorder = isDark ? 'rgba(29,161,242,0.3)' : 'rgba(0,149,246,0.2)'
  const mutedTextColor = isDark ? 'rgba(250,250,250,0.6)' : '#8E8E93'
  const overlayColor = 'rgba(0,0,0,0.65)'
  const modalBackground = isDark ? '#121212' : '#FFFFFF'
  const modalBorderColor = isDark ? 'rgba(255,255,255,0.1)' : '#DBDBDB'
  const modalTitleColor = isDark ? '#FAFAFA' : '#262626'
  const modalSubtitleColor = isDark ? 'rgba(250,250,250,0.6)' : '#8E8E93'
  const modalShadowColor = isDark ? 'rgba(0,0,0,0.85)' : 'rgba(15,23,42,0.12)'
  const modalOverlayColor = isDark ? 'rgba(0,0,0,0.85)' : 'rgba(0,0,0,0.7)'
  const privacyOptionActiveBackground = isDark
    ? 'rgba(29,161,242,0.2)'
    : 'rgba(0,149,246,0.12)'
  const privacyOptionInactiveBorder = isDark
    ? 'rgba(255,255,255,0.1)'
    : '#DBDBDB'
  const privacyOptionIconBackground = isDark
    ? 'rgba(255,255,255,0.1)'
    : '#F0F0F0'
  const privacyOptionCheckBorder = isDark ? 'rgba(250,250,250,0.4)' : '#8E8E93'

  const selectedOption =
    privacyOptions.find(option => option.value === privacy) ?? privacyOptions[0]
  const SelectedIcon = selectedOption.icon

  const isSingle = media.length === 1

  const itemWidth = useMemo(() => {
    if (!containerWidth) return 0
    if (isSingle) return containerWidth
    return Math.floor((containerWidth - GRID_SPACING) / 2)
  }, [containerWidth, isSingle])

  const handleSelectPrivacy = (value: PostPrivacy) => {
    onChangePrivacy(value)
    setShowPrivacyModal(false)
  }

  const formatDuration = (duration?: number) => {
    if (!duration || duration <= 0) return '0:01'
    const minutes = Math.floor(duration / 60)
    const seconds = Math.floor(duration % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  return (
    <>
      <YStack paddingHorizontal="$2.5" paddingVertical="$2.5" gap="$2.5">
        <YStack
          style={[
            styles.card,
            { backgroundColor: cardBackground, borderColor },
          ]}
          gap="$2.5"
        >
          <XStack alignItems="center" gap="$2.5">
            <Avatar uri={user.avatarUrl} size={38} />

            <YStack flex={1} gap={3}>
              <SizableText size="$3" fontWeight="700">
                {user.name}
              </SizableText>
              {groupName ? (
                <XStack alignItems="center" gap="$1.5">
                  <Text fontSize={11} fontWeight="500" color={mutedTextColor}>
                    Posting in
                  </Text>
                  <Text fontSize={11} fontWeight="700" color={accentColor}>
                    {groupName}
                  </Text>
                </XStack>
              ) : (
                <Text fontSize={11} color={mutedTextColor}>
                  {selectedOption.explanation}
                </Text>
              )}
            </YStack>

            {!groupName && (
              <Button
                size="$2"
                height={28}
                paddingHorizontal="$2.5"
                borderRadius="$9"
                backgroundColor={chipBackground}
                borderWidth={1}
                borderColor={chipBorder}
                onPress={() => setShowPrivacyModal(true)}
              >
                <XStack alignItems="center" gap="$1.5">
                  <SelectedIcon
                    size={13}
                    color={isDark ? '#FAFAFA' : '#262626'}
                  />
                  <SizableText size="$2" fontWeight="600">
                    {selectedOption.label}
                  </SizableText>
                  <ChevronDown size={13} color={mutedTextColor} />
                </XStack>
              </Button>
            )}
          </XStack>

          {showCaption && (
            <YStack
              borderRadius={12}
              backgroundColor={isDark ? 'rgba(255,255,255,0.05)' : '#F5F5F5'}
              padding={10}
            >
              <TextArea
                unstyled
                placeholder="Write something..."
                value={caption}
                onChangeText={onChangeCaption}
                multiline
                scrollEnabled={false}
                borderWidth={0}
                onContentSizeChange={event => {
                  const height = event.nativeEvent.contentSize.height
                  setTextHeight(Math.max(MIN_TEXTAREA_HEIGHT, height))
                }}
                style={{
                  height: textHeight,
                  fontSize: 14,
                  lineHeight: 19,
                }}
                focusStyle={{ outlineWidth: 0 }}
                color="$color"
              />
            </YStack>
          )}

          {!!media.length && (
            <YStack
              gap="$2"
              onLayout={event => {
                const width = event.nativeEvent.layout.width
                setContainerWidth(width)
              }}
            >
              {isSingle ? (
                <TouchableOpacity
                  activeOpacity={0.92}
                  onPress={() => setFullscreenMedia(media[0])}
                >
                  <YStack position="relative">
                    <RNImage
                      source={{ uri: media[0].url }}
                      style={styles.singleMedia}
                    />
                    {media[0].type === 'video' && (
                      <YStack
                        style={[
                          styles.badge,
                          styles.videoBadge,
                          { backgroundColor: overlayColor },
                        ]}
                      >
                        <SizableText
                          fontSize={11}
                          fontWeight="600"
                          color="white"
                        >
                          {formatDuration(media[0].duration)}
                        </SizableText>
                      </YStack>
                    )}
                    <Button
                      size="$2"
                      circular
                      position="absolute"
                      top={10}
                      right={10}
                      backgroundColor={overlayColor}
                      icon={<Trash2 size={14} color="white" />}
                      onPress={() => onRemoveMedia(media[0].id)}
                    />
                  </YStack>
                </TouchableOpacity>
              ) : (
                <XStack flexWrap="wrap" marginHorizontal={-GRID_SPACING / 2}>
                  {media.map(item => (
                    <TouchableOpacity
                      key={item.id}
                      activeOpacity={0.92}
                      onPress={() => setFullscreenMedia(item)}
                      style={{
                        paddingHorizontal: GRID_SPACING / 2,
                        paddingVertical: GRID_SPACING / 2,
                      }}
                    >
                      <YStack width={itemWidth} position="relative">
                        <RNImage
                          source={{ uri: item.url }}
                          style={[
                            styles.gridMedia,
                            { width: itemWidth, height: itemWidth },
                          ]}
                        />

                        {item.type === 'video' && (
                          <YStack
                            style={[
                              styles.badge,
                              styles.gridBadge,
                              { backgroundColor: overlayColor },
                            ]}
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
                          size="$2"
                          circular
                          position="absolute"
                          top={8}
                          right={8}
                          backgroundColor={overlayColor}
                          icon={<Trash2 size={12} color="white" />}
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
      </YStack>

      <Modal
        visible={showPrivacyModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowPrivacyModal(false)}
      >
        <TouchableOpacity
          style={[
            styles.privacyOverlay,
            { backgroundColor: modalOverlayColor },
          ]}
          activeOpacity={1}
          onPress={() => setShowPrivacyModal(false)}
        >
          <YStack
            width="100%"
            backgroundColor={modalBackground}
            borderRadius={24}
            padding="$4"
            gap="$3"
            borderWidth={StyleSheet.hairlineWidth}
            borderColor={modalBorderColor}
            style={{
              shadowColor: modalShadowColor,
              shadowOpacity: isDark ? 0.6 : 0.35,
              shadowRadius: 18,
              shadowOffset: { width: 0, height: 18 },
              elevation: 12,
            }}
          >
            <SizableText
              size="$5"
              fontWeight="700"
              textAlign="center"
              paddingBottom="$2"
              borderBottomWidth={StyleSheet.hairlineWidth}
              borderColor={modalBorderColor}
              color={modalTitleColor}
            >
              Post audience
            </SizableText>

            <Paragraph size="$3" color={modalSubtitleColor} lineHeight={20}>
              Choose who can see this post. You can change this anytime.
            </Paragraph>

            {privacyOptions.map(option => {
              const isActive = option.value === privacy
              const OptionIcon = option.icon
              return (
                <TouchableOpacity
                  key={option.value}
                  activeOpacity={0.85}
                  onPress={() => handleSelectPrivacy(option.value)}
                >
                  <XStack
                    alignItems="center"
                    gap="$3"
                    padding="$2.5"
                    borderRadius={16}
                    backgroundColor={
                      isActive ? privacyOptionActiveBackground : 'transparent'
                    }
                    borderWidth={1}
                    borderColor={
                      isActive ? accentColor : privacyOptionInactiveBorder
                    }
                  >
                    <YStack
                      width={44}
                      height={44}
                      borderRadius={22}
                      backgroundColor={
                        isActive ? accentColor : privacyOptionIconBackground
                      }
                      alignItems="center"
                      justifyContent="center"
                    >
                      <OptionIcon
                        size={20}
                        color={
                          isActive ? '#ffffff' : isDark ? '#FAFAFA' : '#262626'
                        }
                      />
                    </YStack>

                    <YStack flex={1}>
                      <SizableText
                        size="$4"
                        fontWeight="700"
                        color={modalTitleColor}
                      >
                        {option.label}
                      </SizableText>
                      <SizableText
                        size="$3"
                        color={modalSubtitleColor}
                        lineHeight="$1"
                      >
                        {option.explanation}
                      </SizableText>
                    </YStack>

                    <YStack
                      width={18}
                      height={18}
                      borderRadius={9}
                      borderWidth={2}
                      borderColor={
                        isActive ? accentColor : privacyOptionCheckBorder
                      }
                      alignItems="center"
                      justifyContent="center"
                    >
                      {isActive && (
                        <YStack
                          width={10}
                          height={10}
                          borderRadius={5}
                          backgroundColor={accentColor}
                        />
                      )}
                    </YStack>
                  </XStack>
                </TouchableOpacity>
              )
            })}
          </YStack>
        </TouchableOpacity>
      </Modal>

      <Modal
        visible={!!fullscreenMedia}
        transparent
        animationType="fade"
        onRequestClose={() => setFullscreenMedia(null)}
      >
        <YStack style={styles.fullscreenBackdrop}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setFullscreenMedia(null)}
          >
            <X size={26} color="white" />
          </TouchableOpacity>

          {fullscreenMedia && (
            <YStack
              width={SCREEN_WIDTH}
              height={SCREEN_WIDTH}
              position="relative"
            >
              <RNImage
                source={{ uri: fullscreenMedia.url }}
                style={styles.fullscreenMedia}
                resizeMode="contain"
              />
              {fullscreenMedia.type === 'video' && (
                <YStack
                  style={[
                    styles.badge,
                    styles.fullscreenBadge,
                    { backgroundColor: overlayColor },
                  ]}
                >
                  <SizableText fontSize={14} color="white" fontWeight="600">
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
  card: {
    borderRadius: 18,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 12,
  },
  privacyOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 20,
  },
  fullscreenBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.94)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 52,
    right: 28,
    padding: 8,
    zIndex: 10,
  },
  singleMedia: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 18,
  },
  gridMedia: {
    borderRadius: 12,
  },
  badge: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoBadge: {
    right: 10,
    bottom: 10,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 8,
  },
  gridBadge: {
    right: 6,
    bottom: 6,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  fullscreenMedia: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH,
  },
  fullscreenBadge: {
    right: 20,
    bottom: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
})
