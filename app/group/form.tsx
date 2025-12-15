import { useState } from 'react'
import {
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
  Pressable,
} from 'react-native'
import {
  YStack,
  XStack,
  Text,
  Button,
  Input,
  Separator,
  Spinner,
  Label,
  useThemeName,
} from 'tamagui'
import {
  Lock,
  Globe,
  Camera as CameraIcon,
  Image as ImageIcon,
  ChevronLeft,
} from '@tamagui/lucide-icons'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useRouter, useLocalSearchParams, Stack } from 'expo-router'
import { useGroupStore } from '@/stores/groupStore'
import ImageSelectionSheet from '@/components/ImageSelectionSheet'
import MediaPicker from '@/components/MediaPicker'
import Camera from '@/components/Camera'
import {
  getMediaItemFromCamera,
  getMediaItemsFromPicker,
  processMediaForUpload,
  MediaItem,
} from '@/utils/MediaUtils'

type PrivacyType = 'PUBLIC' | 'PRIVATE'

export default function GroupFormScreen() {
  const router = useRouter()
  const params = useLocalSearchParams()
  const insets = useSafeAreaInsets()
  const { createGroup, updateGroup, currentGroup, groups } =
    useGroupStore()

  const themeName = useThemeName()
  const isDark = themeName === 'dark' || themeName.includes('dark')

  // Theme Colors from EditProfileForm.tsx
  const inputBackground = isDark ? '#1A1A1A' : '#F5F5F5'
  const inputTextColor = isDark ? '#FFFFFF' : '#000000'
  const labelColor = isDark ? '#A0A0A0' : '#666666'
  const borderColor = isDark ? '#333333' : '#E0E0E0'
  const primaryColor = '#0095F6'

  // Screen background
  const screenBackground = isDark ? '#000000' : '#FAFAFA'
  const headerBorderColor = isDark ? '#262626' : '#DBDBDB'

  const mode = (params.mode as 'CREATE' | 'EDIT') || 'CREATE'
  const groupId = params.id as string

  const existingGroup =
    mode === 'EDIT'
      ? currentGroup?.id === groupId
        ? currentGroup
        : groups.find(g => g.id === groupId)
      : null

  const [groupName, setGroupName] = useState(existingGroup?.name || '')
  const [description, setDescription] = useState(
    existingGroup?.description || ''
  )
  const [privacy, setPrivacy] = useState<PrivacyType>(
    existingGroup?.privacy || 'PUBLIC'
  )

  // Image State
  const [background, setBackground] = useState<MediaItem | null>(
    existingGroup?.backgroundUrl
      ? { uri: existingGroup.backgroundUrl, type: 'image' }
      : null
  )
  const [avatar, setAvatar] = useState<MediaItem | null>(
    existingGroup?.avatarUrl
      ? { uri: existingGroup.avatarUrl, type: 'image' }
      : null
  )

  // Selection Logic
  const [selectionTarget, setSelectionTarget] = useState<
    'background' | 'avatar' | null
  >(null)
  const [showSheet, setShowSheet] = useState(false)
  const [showCamera, setShowCamera] = useState(false)
  const [showMediaPicker, setShowMediaPicker] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Handlers
  const handleOpenSelection = (target: 'background' | 'avatar') => {
    setSelectionTarget(target)
    setShowSheet(true)
  }

  const handleMediaSelect = (assets: any[]) => {
    if (assets.length > 0) {
      const mediaItem = getMediaItemsFromPicker([assets[0]])[0]
      if (selectionTarget === 'background') setBackground(mediaItem)
      if (selectionTarget === 'avatar') setAvatar(mediaItem)
    }
  }

  const handleCameraCapture = (media: any) => {
    const mediaItem = getMediaItemFromCamera(media)
    if (selectionTarget === 'background') setBackground(mediaItem)
    if (selectionTarget === 'avatar') setAvatar(mediaItem)
    setShowCamera(false)
  }

  const handleSubmit = async () => {
    if (!groupName.trim() || !description.trim()) {
      return
    }

    setIsLoading(true)
    try {
      let finalBackground:
        | { uri: string; name: string; type: string }
        | undefined
      let finalAvatar: { uri: string; name: string; type: string } | undefined

      // Process Background
      if (background) {
        if (background.uri.startsWith('http')) {
          finalBackground = undefined
        } else {
          const processed = await processMediaForUpload([background])
          if (processed.length > 0) {
            finalBackground = processed[0]
          }
        }
      }

      // Process Avatar
      if (avatar) {
        if (avatar.uri.startsWith('http')) {
          finalAvatar = undefined
        } else {
          const processed = await processMediaForUpload([avatar])
          if (processed.length > 0) {
            finalAvatar = processed[0]
          }
        }
      }

      if (mode === 'CREATE') {
        await createGroup(
          { name: groupName, description, privacy },
          finalBackground,
          finalAvatar
        )
        router.back()
      } else {
        if (!existingGroup) return
        await updateGroup(
          { groupId: existingGroup.id, name: groupName, description, privacy },
          finalBackground,
          finalAvatar
        )
        router.back()
      }
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Custom Header */}
      <YStack
        paddingTop={insets.top}
        backgroundColor={screenBackground}
        zIndex={10}
      >
        <XStack
          alignItems="center"
          justifyContent="space-between"
          paddingHorizontal="$3"
          paddingVertical="$3"
          borderBottomWidth={1}
          borderBottomColor={headerBorderColor}
        >
          <Pressable onPress={router.back} hitSlop={8}>
            <ChevronLeft size={25} color={inputTextColor} />
          </Pressable>
          <Text fontSize={18} fontWeight="700" color={inputTextColor}>
            {mode === 'CREATE' ? 'Create Group' : 'Edit Group'}
          </Text>
          <YStack width={28} />
        </XStack>
      </YStack>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1, backgroundColor: screenBackground }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{ backgroundColor: screenBackground }}
        >
          {/* Visuals Section */}
          <YStack position="relative" zIndex={1}>
            {/* Cover Photo */}
            <Pressable onPress={() => handleOpenSelection('background')}>
              <YStack
                height={180}
                width="100%"
                backgroundColor={inputBackground}
                overflow="hidden"
              >
                {background ? (
                  <Image
                    source={{ uri: background.uri }}
                    style={{ width: '100%', height: '100%' }}
                    resizeMode="cover"
                  />
                ) : (
                  <YStack flex={1} alignItems="center" justifyContent="center">
                    <ImageIcon size={32} color={labelColor} />
                    <Text color={labelColor} fontSize={12}>
                      No Cover Photo
                    </Text>
                  </YStack>
                )}
                <Button
                  position="absolute"
                  bottom={10}
                  right={10}
                  size="$3"
                  circular
                  backgroundColor="rgba(0,0,0,0.6)"
                  icon={<CameraIcon size={16} color="white" />}
                  onPress={() => handleOpenSelection('background')}
                  pointerEvents="none" // Pass press to parent
                />
              </YStack>
            </Pressable>

            {/* Avatar */}
            <Pressable
              onPress={() => handleOpenSelection('avatar')}
              style={{
                position: 'absolute',
                bottom: -40,
                left: 20,
              }}
            >
              <YStack
                width={100}
                height={100}
                borderRadius={50}
                backgroundColor={screenBackground}
                padding={3}
              >
                <YStack
                  flex={1}
                  borderRadius={50}
                  overflow="hidden"
                  backgroundColor={inputBackground}
                >
                  {avatar ? (
                    <Image
                      source={{ uri: avatar.uri }}
                      style={{ width: '100%', height: '100%' }}
                    />
                  ) : (
                    <YStack
                      flex={1}
                      alignItems="center"
                      justifyContent="center"
                    >
                      <ImageIcon size={24} color={labelColor} />
                    </YStack>
                  )}
                </YStack>
                <Button
                  position="absolute"
                  bottom={0}
                  right={0}
                  size="$2.5"
                  circular
                  backgroundColor={primaryColor}
                  icon={<CameraIcon size={14} color="white" />}
                  onPress={() => handleOpenSelection('avatar')}
                  pointerEvents="none" // Pass press to parent
                />
              </YStack>
            </Pressable>
          </YStack>

          <YStack paddingTop="$10" paddingHorizontal="$4" gap="$4">
            {/* Name */}
            <YStack gap="$2">
              <Label
                fontSize={14}
                fontWeight="600"
                color={labelColor}
                marginLeft="$1"
              >
                Group Name
              </Label>
              <Input
                value={groupName}
                onChangeText={setGroupName}
                placeholder="Name your group"
                placeholderTextColor={isDark ? '#666' : '#999'}
                backgroundColor={inputBackground}
                borderColor={borderColor}
                borderWidth={1}
                borderRadius="$4"
                paddingHorizontal="$3"
                paddingVertical="$3"
                fontSize={16}
                color={inputTextColor}
                focusStyle={{
                  borderColor: primaryColor,
                  borderWidth: 1.5,
                }}
              />
            </YStack>

            {/* Description */}
            <YStack gap="$2">
              <Label
                fontSize={14}
                fontWeight="600"
                color={labelColor}
                marginLeft="$1"
              >
                Description
              </Label>
              <Input
                value={description}
                onChangeText={setDescription}
                placeholder="Describe your group..."
                placeholderTextColor={isDark ? '#666' : '#999'}
                backgroundColor={inputBackground}
                borderColor={borderColor}
                borderWidth={1}
                borderRadius="$4"
                paddingHorizontal="$3"
                paddingVertical="$3"
                fontSize={16}
                color={inputTextColor}
                multiline
                minHeight={100}
                textAlignVertical="top"
                focusStyle={{
                  borderColor: primaryColor,
                  borderWidth: 1.5,
                }}
              />
            </YStack>

            <Separator borderColor={borderColor} />

            {/* Privacy */}
            <YStack gap="$2">
              <Label
                fontSize={14}
                fontWeight="600"
                color={labelColor}
                marginLeft="$1"
              >
                Privacy
              </Label>
              <XStack gap="$2">
                <Button
                  flex={1}
                  backgroundColor={
                    privacy === 'PUBLIC'
                      ? isDark
                        ? '#1a2b3c'
                        : '#e7f3ff'
                      : inputBackground
                  }
                  borderColor={
                    privacy === 'PUBLIC' ? primaryColor : borderColor
                  }
                  borderWidth={privacy === 'PUBLIC' ? 1.5 : 1}
                  onPress={() => setPrivacy('PUBLIC')}
                  borderRadius="$4"
                  icon={
                    <Globe
                      size={18}
                      color={privacy === 'PUBLIC' ? primaryColor : labelColor}
                    />
                  }
                >
                  <Text
                    color={privacy === 'PUBLIC' ? primaryColor : labelColor}
                    fontWeight="600"
                  >
                    Public
                  </Text>
                </Button>
                <Button
                  flex={1}
                  backgroundColor={
                    privacy === 'PRIVATE'
                      ? isDark
                        ? '#1a2b3c'
                        : '#e7f3ff'
                      : inputBackground
                  }
                  borderColor={
                    privacy === 'PRIVATE' ? primaryColor : borderColor
                  }
                  borderWidth={privacy === 'PRIVATE' ? 1.5 : 1}
                  onPress={() => setPrivacy('PRIVATE')}
                  borderRadius="$4"
                  icon={
                    <Lock
                      size={18}
                      color={privacy === 'PRIVATE' ? primaryColor : labelColor}
                    />
                  }
                >
                  <Text
                    color={privacy === 'PRIVATE' ? primaryColor : labelColor}
                    fontWeight="600"
                  >
                    Private
                  </Text>
                </Button>
              </XStack>
            </YStack>

            {/* Actions */}
            <Button
              marginTop="$4"
              backgroundColor={primaryColor}
              color="white"
              fontWeight="600"
              onPress={handleSubmit}
              opacity={isLoading ? 0.7 : 1}
              disabled={isLoading}
              borderRadius="$4"
              height={50}
            >
              {isLoading ? (
                <Spinner color="white" />
              ) : mode === 'CREATE' ? (
                'Create Group'
              ) : (
                'Save Changes'
              )}
            </Button>
          </YStack>
        </ScrollView>
      </KeyboardAvoidingView>

      <ImageSelectionSheet
        visible={showSheet}
        onClose={() => setShowSheet(false)}
        onTakePhoto={() => setShowCamera(true)}
        onChooseFromLibrary={() => setShowMediaPicker(true)}
      />

      <MediaPicker
        visible={showMediaPicker}
        onClose={() => setShowMediaPicker(false)}
        onSelect={handleMediaSelect}
        maxSelection={1}
      />

      <Camera
        visible={showCamera}
        onClose={() => setShowCamera(false)}
        onCapture={handleCameraCapture}
      />
    </>
  )
}
