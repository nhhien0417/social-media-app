import {
  createElement,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from 'react'
import {
  ScrollView,
  Image,
  ActivityIndicator,
  Modal,
  TouchableOpacity,
  Platform,
} from 'react-native'
import {
  Button,
  Input,
  Label,
  Text,
  YStack,
  XStack,
  useThemeName,
  Select,
  Adapt,
  Sheet,
} from 'tamagui'
import {
  Camera as CameraIcon,
  ChevronDown,
  Check,
  Calendar,
} from '@tamagui/lucide-icons'
import { LinearGradient } from 'expo-linear-gradient'
import DateTimePicker from '@react-native-community/datetimepicker'
import type { Gender } from '@/types/User'

import { INSTAGRAM_GRADIENT } from '@/utils/InstagramGradient'
import { ProfileComponentProps } from '../ProfileScreen'
import { useProfileStore } from '@/stores/profileStore'
import { Alert } from 'react-native'
import {
  processMediaForUpload,
  getMediaItemFromCamera,
  getMediaItemsFromPicker,
} from '@/utils/MediaUtils'
import ImageSelectionSheet from '@/components/ImageSelectionSheet'
import MediaPicker from '@/components/MediaPicker'
import Camera from '@/components/Camera'

type FormValues = {
  name: string
  username: string
  avatarUrl: string
  gender: Gender | ''
  bio: string
  dob: string
}

export type EditProfileFormRef = {
  handleSave: () => Promise<void>
}

export const EditProfileForm = forwardRef<
  EditProfileFormRef,
  ProfileComponentProps
>(({ user }, ref) => {
  const themeName = useThemeName()
  const isDark = themeName === 'dark'

  const initialValues = useMemo<FormValues>(
    () => ({
      name: [user.firstName, user.lastName].filter(Boolean).join(' '),
      username: user.username || '',
      avatarUrl: user.avatarUrl || '',
      gender: (user.gender as Gender) || '',
      bio: user.bio || '',
      dob: user.dob || '',
    }),
    [user]
  )

  const [formValues, setFormValues] = useState<FormValues>(initialValues)
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)

  // Media Selection State
  const [showAvatarSelection, setShowAvatarSelection] = useState(false)
  const [showMediaPicker, setShowMediaPicker] = useState(false)
  const [showCamera, setShowCamera] = useState(false)

  const [avatarFile, setAvatarFile] = useState<{
    uri: string
    name: string
    type: string
  } | null>(
    user.avatarUrl
      ? {
          uri: user.avatarUrl,
          name: 'avatar.jpg',
          type: 'image/jpeg',
        }
      : null
  )

  const { updateProfile } = useProfileStore()

  useEffect(() => {
    setFormValues(initialValues)
  }, [initialValues])

  // Modern UI Colors
  const inputBackground = isDark ? '#1A1A1A' : '#F5F5F5'
  const inputTextColor = isDark ? '#FFFFFF' : '#000000'
  const labelColor = isDark ? '#A0A0A0' : '#666666'
  const borderColor = isDark ? '#333333' : '#E0E0E0'
  const primaryColor = '#0095F6'

  const displayDob = formValues.dob || 'Select date of birth'

  const handleAvatarPress = () => {
    setShowAvatarSelection(true)
  }

  const handleMediaSelect = (assets: any[]) => {
    if (assets.length > 0) {
      const mediaItem = getMediaItemsFromPicker([assets[0]])[0]
      setFormValues(prev => ({ ...prev, avatarUrl: mediaItem.uri }))
      setAvatarFile({
        uri: mediaItem.uri,
        name: mediaItem.fileName || 'avatar.jpg',
        type: mediaItem.mimeType || 'image/jpeg',
      })
    }
  }

  const handleCameraCapture = (media: any) => {
    const mediaItem = getMediaItemFromCamera(media)
    setFormValues(prev => ({ ...prev, avatarUrl: mediaItem.uri }))
    setAvatarFile({
      uri: mediaItem.uri,
      name: mediaItem.fileName || 'camera_capture.jpg',
      type: mediaItem.mimeType || 'image/jpeg',
    })
    setShowCamera(false)
  }

  useImperativeHandle(ref, () => ({
    handleSave: async () => {
      setIsUpdating(true)
      try {
        const nameParts = formValues.name.trim().split(' ')
        const firstName = nameParts[0]
        const lastName = nameParts.slice(1).join(' ')

        let processedAvatar
        if (avatarFile) {
          const processed = await processMediaForUpload([avatarFile])
          if (processed.length > 0) {
            processedAvatar = processed[0]
          }
        }

        await updateProfile(
          {
            userId: user.id,
            username: formValues.username,
            firstName,
            lastName,
            bio: formValues.bio,
            gender: formValues.gender,
            dob: formValues.dob,
          },
          processedAvatar
        )
      } catch (error) {
        console.log(error)
      } finally {
        setIsUpdating(false)
      }
    },
  }))

  const renderInput = (
    label: string,
    value: string,
    onChangeText: (text: string) => void,
    placeholder: string,
    multiline = false
  ) => (
    <YStack gap="$2">
      <Label fontSize={14} fontWeight="600" color={labelColor} marginLeft="$1">
        {label}
      </Label>
      <Input
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={isDark ? '#666' : '#999'}
        backgroundColor={inputBackground}
        borderColor={borderColor}
        borderWidth={1}
        borderRadius="$4"
        paddingHorizontal="$3"
        paddingVertical={multiline ? '$3' : '$3'}
        fontSize={16}
        color={inputTextColor}
        multiline={multiline}
        minHeight={multiline ? 100 : undefined}
        textAlignVertical={multiline ? 'top' : 'center'}
        focusStyle={{
          borderColor: primaryColor,
          borderWidth: 1.5,
        }}
      />
    </YStack>
  )

  return (
    <>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          padding: 20,
          paddingBottom: 40,
        }}
      >
        {/* Avatar Section */}
        <YStack alignItems="center" marginBottom="$4">
          <TouchableOpacity onPress={handleAvatarPress} activeOpacity={0.8}>
            <YStack position="relative">
              <LinearGradient
                colors={INSTAGRAM_GRADIENT}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                  padding: 3,
                  borderRadius: 60,
                }}
              >
                <Image
                  source={{
                    uri:
                      formValues.avatarUrl || 'https://via.placeholder.com/150',
                  }}
                  style={{
                    width: 110,
                    height: 110,
                    borderRadius: 55,
                    borderWidth: 4,
                    borderColor: isDark ? '#000' : '#fff',
                    backgroundColor: inputBackground,
                  }}
                />
              </LinearGradient>
              <YStack
                position="absolute"
                bottom={5}
                right={5}
                backgroundColor={primaryColor}
                width={32}
                height={32}
                borderRadius={16}
                alignItems="center"
                justifyContent="center"
                borderWidth={3}
                borderColor={isDark ? '#000' : '#fff'}
              >
                <CameraIcon size={16} color="#fff" />
              </YStack>
            </YStack>
          </TouchableOpacity>
        </YStack>

        <YStack gap="$4">
          {renderInput(
            'Name',
            formValues.name,
            text => setFormValues(prev => ({ ...prev, name: text })),
            'Enter your name'
          )}

          {renderInput(
            'Username',
            formValues.username,
            text => setFormValues(prev => ({ ...prev, username: text })),
            'Enter username'
          )}

          {renderInput(
            'Bio',
            formValues.bio,
            text => setFormValues(prev => ({ ...prev, bio: text })),
            'Write a bio...',
            true
          )}

          {/* Gender Select */}
          <YStack gap="$2">
            <Label
              fontSize={14}
              fontWeight="600"
              color={labelColor}
              marginLeft="$1"
            >
              Gender
            </Label>
            <Select
              value={formValues.gender || ''}
              onValueChange={value =>
                setFormValues(prev => ({ ...prev, gender: value as Gender }))
              }
            >
              <Select.Trigger
                iconAfter={ChevronDown}
                backgroundColor={inputBackground}
                borderColor={borderColor}
                borderWidth={1}
                borderRadius="$4"
                paddingHorizontal="$3"
                height={50}
              >
                <Select.Value
                  placeholder="Select gender"
                  style={{ color: inputTextColor, fontSize: 16 }}
                />
              </Select.Trigger>

              <Adapt>
                <Sheet
                  modal
                  dismissOnSnapToBottom
                  animationConfig={{
                    type: 'spring',
                    damping: 20,
                    mass: 0.8,
                    stiffness: 250,
                  }}
                >
                  <Sheet.Frame>
                    <Sheet.ScrollView>
                      <Adapt.Contents />
                    </Sheet.ScrollView>
                  </Sheet.Frame>
                  <Sheet.Overlay />
                </Sheet>
              </Adapt>

              <Select.Content zIndex={1000}>
                <Select.ScrollUpButton />
                <Select.Viewport>
                  <Select.Group>
                    <Select.Label>Gender</Select.Label>
                    <Select.Item value="" index={0}>
                      <Select.ItemText>Prefer not to say</Select.ItemText>
                      <Select.ItemIndicator marginLeft="auto">
                        <Check size={16} />
                      </Select.ItemIndicator>
                    </Select.Item>
                    <Select.Item value="FEMALE" index={1}>
                      <Select.ItemText>Female</Select.ItemText>
                      <Select.ItemIndicator marginLeft="auto">
                        <Check size={16} />
                      </Select.ItemIndicator>
                    </Select.Item>
                    <Select.Item value="MALE" index={2}>
                      <Select.ItemText>Male</Select.ItemText>
                      <Select.ItemIndicator marginLeft="auto">
                        <Check size={16} />
                      </Select.ItemIndicator>
                    </Select.Item>
                    <Select.Item value="OTHER" index={3}>
                      <Select.ItemText>Other</Select.ItemText>
                      <Select.ItemIndicator marginLeft="auto">
                        <Check size={16} />
                      </Select.ItemIndicator>
                    </Select.Item>
                  </Select.Group>
                </Select.Viewport>
                <Select.ScrollDownButton />
              </Select.Content>
            </Select>
          </YStack>

          {/* Date of Birth */}
          <YStack gap="$2">
            <Label
              fontSize={14}
              fontWeight="600"
              color={labelColor}
              marginLeft="$1"
            >
              Date of Birth
            </Label>
            {Platform.OS === 'web' ? (
              <XStack
                alignItems="center"
                backgroundColor={inputBackground}
                borderColor={borderColor}
                borderWidth={1}
                borderRadius="$4"
                paddingHorizontal="$3"
                height={50}
              >
                {createElement('input', {
                  type: 'date',
                  value: formValues.dob,
                  onChange: (e: any) =>
                    setFormValues(prev => ({ ...prev, dob: e.target.value })),
                  style: {
                    border: 'none',
                    background: 'transparent',
                    color: inputTextColor,
                    fontSize: 16,
                    fontFamily: 'System',
                    width: '100%',
                    outline: 'none',
                  },
                })}
              </XStack>
            ) : (
              <TouchableOpacity
                onPress={() => setShowDatePicker(true)}
                activeOpacity={0.7}
              >
                <XStack
                  alignItems="center"
                  justifyContent="space-between"
                  backgroundColor={inputBackground}
                  borderColor={borderColor}
                  borderWidth={1}
                  borderRadius="$4"
                  paddingHorizontal="$3"
                  height={50}
                >
                  <Text
                    fontSize={16}
                    color={
                      formValues.dob ? inputTextColor : isDark ? '#666' : '#999'
                    }
                  >
                    {displayDob}
                  </Text>
                  <Calendar size={20} color={labelColor} />
                </XStack>
              </TouchableOpacity>
            )}
            {showDatePicker && Platform.OS !== 'web' && (
              <DateTimePicker
                value={formValues.dob ? new Date(formValues.dob) : new Date()}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={(event, selectedDate) => {
                  setShowDatePicker(false)
                  if (selectedDate) {
                    const dateString = selectedDate.toISOString().split('T')[0]
                    setFormValues(prev => ({ ...prev, dob: dateString }))
                  }
                }}
              />
            )}
          </YStack>
        </YStack>
      </ScrollView>

      {/* Loading Overlay */}
      <Modal transparent visible={isUpdating} animationType="fade">
        <YStack
          flex={1}
          backgroundColor="rgba(0,0,0,0.5)"
          alignItems="center"
          justifyContent="center"
        >
          <YStack
            backgroundColor={isDark ? '#262626' : 'white'}
            padding="$5"
            borderRadius="$4"
            alignItems="center"
            gap="$3"
            elevation={5}
            shadowColor="#000"
            shadowOffset={{ width: 0, height: 2 }}
            shadowOpacity={0.25}
            shadowRadius={3.84}
          >
            <ActivityIndicator size="large" color={primaryColor} />
            <Text fontWeight="600" fontSize={16} color={inputTextColor}>
              Updating profile...
            </Text>
          </YStack>
        </YStack>
      </Modal>

      {/* Avatar Selection Sheet */}
      <ImageSelectionSheet
        visible={showAvatarSelection}
        onClose={() => setShowAvatarSelection(false)}
        onTakePhoto={() => setShowCamera(true)}
        onChooseFromLibrary={() => setShowMediaPicker(true)}
      />

      {/* Media Picker */}
      <MediaPicker
        visible={showMediaPicker}
        onClose={() => setShowMediaPicker(false)}
        onSelect={handleMediaSelect}
        maxSelection={1}
      />

      {/* Camera */}
      <Camera
        visible={showCamera}
        onClose={() => setShowCamera(false)}
        onCapture={handleCameraCapture}
      />
    </>
  )
})
