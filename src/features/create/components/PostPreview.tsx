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

const { width: SCREEN_WIDTH } = Dimensions.get('window')
const GRID_SPACING = 8
const MIN_TEXTAREA_HEIGHT = 44

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
  fileName?: string
  mimeType?: string
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
  onChangePrivacy: (value: PrivacyOption) => void
  showCaption?: boolean
}

const privacyOptions: DropdownOption[] = [
  {
    value: 'public',
    label: 'Public',
    explanation: 'Anyone on or off the app can see this post',
    icon: Globe,
  },
  {
    value: 'friends',
    label: 'Friends',
    explanation: 'Only your friends will see this post',
    icon: Users,
  },
  {
    value: 'only-me',
    label: 'Only me',
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
}: Props) {
  const [showPrivacyModal, setShowPrivacyModal] = useState(false)
  const [fullscreenMedia, setFullscreenMedia] = useState<MediaItem | null>(null)
  const [containerWidth, setContainerWidth] = useState(0)
  const [textHeight, setTextHeight] = useState(MIN_TEXTAREA_HEIGHT)

  const themeName = useThemeName()
  const isDark = themeName === 'dark'
  const accentColor = isDark ? '#0095F6' : '#1877F2'
  const borderColor = isDark ? 'rgba(255,255,255,0.12)' : '#e5e7eb'
  const cardBackground = isDark ? 'rgba(255,255,255,0.05)' : '#ffffff'
  const chipBackground = isDark ? 'rgba(255,255,255,0.08)' : '#eff6ff'
  const chipBorder = isDark ? 'rgba(255,255,255,0.14)' : '#dbeafe'
  const mutedTextColor = isDark ? 'rgba(255,255,255,0.68)' : '#6b7280'
  const overlayColor = 'rgba(0,0,0,0.65)'
  const modalBorderColor = isDark ? 'rgba(255,255,255,0.08)' : '#e2e8f0'
  const modalTitleColor = isDark ? '#f7f7f8' : '#0f172a'
  const modalSubtitleColor = isDark ? 'rgba(209,213,219,0.78)' : '#475569'
  const modalShadowColor = isDark ? 'rgba(0,0,0,0.85)' : 'rgba(15,23,42,0.12)'
  const privacyOptionActiveBackground = isDark
    ? 'rgba(0,149,246,0.18)'
    : '#eff6ff'
  const privacyOptionInactiveBorder = isDark
    ? 'rgba(255,255,255,0.08)'
    : '#e2e8f0'
  const privacyOptionIconBackground = isDark
    ? 'rgba(255,255,255,0.08)'
    : '#f1f5f9'
  const privacyOptionCheckBorder = isDark ? 'rgba(148,163,184,0.5)' : '#94a3b8'

  const selectedOption =
    privacyOptions.find(option => option.value === privacy) ?? privacyOptions[0]
  const SelectedIcon = selectedOption.icon

  const isSingle = media.length === 1

  const itemWidth = useMemo(() => {
    if (!containerWidth) return 0
    if (isSingle) return containerWidth
    return Math.floor((containerWidth - GRID_SPACING) / 2)
  }, [containerWidth, isSingle])

  const handleSelectPrivacy = (value: PrivacyOption) => {
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
      <YStack paddingHorizontal="$3" paddingVertical="$3" gap="$3">
        <YStack
          style={[
            styles.card,
            { backgroundColor: cardBackground, borderColor },
          ]}
          gap="$3"
        >
          <XStack alignItems="center" gap="$3">
            <Avatar uri={user.avatarUrl} size={40} />

            <YStack flex={1} gap={4}>
              <SizableText size="$4" fontWeight="700">
                {user.name}
              </SizableText>
              <Text fontSize={12} color={mutedTextColor}>
                {selectedOption.explanation}
              </Text>
            </YStack>

            <Button
              size="$3"
              height={30}
              paddingHorizontal="$3"
              borderRadius="$9"
              backgroundColor={chipBackground}
              borderWidth={1}
              borderColor={chipBorder}
              onPress={() => setShowPrivacyModal(true)}
            >
              <XStack alignItems="center" gap="$1.5">
                <SelectedIcon
                  size={14}
                  color={isDark ? '#f5f5f5' : '#0f172a'}
                />
                <SizableText size="$3" fontWeight="600">
                  {selectedOption.label}
                </SizableText>
                <ChevronDown size={14} color={mutedTextColor} />
              </XStack>
            </Button>
          </XStack>

          {showCaption && (
            <YStack
              borderRadius={14}
              backgroundColor={isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc'}
              padding={12}
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
                  fontSize: 15,
                  lineHeight: 20,
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
          style={styles.privacyOverlay}
          activeOpacity={1}
          onPress={() => setShowPrivacyModal(false)}
        >
          <YStack
            width="100%"
            backgroundColor="$backgroundModal"
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
                          isActive ? '#ffffff' : isDark ? '#f5f5f5' : '#111827'
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
    borderRadius: 22,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 16,
  },
  privacyOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
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
    resizeMode: 'contain',
  },
  fullscreenBadge: {
    right: 20,
    bottom: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
})
