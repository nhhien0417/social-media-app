import { useEffect, useMemo, useState } from 'react'
import { ScrollView } from 'react-native'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Input,
  Label,
  Text,
  TextArea,
  YStack,
  useThemeName,
} from 'tamagui'
import { Camera } from '@tamagui/lucide-icons'
import type { ProfileUser } from './data'

interface EditProfileFormProps {
  user: ProfileUser
}

export function EditProfileForm({ user }: EditProfileFormProps) {
  const themeName = useThemeName()
  const isDark = themeName === 'dark'
  const initialValues = useMemo(
    () => ({
      fullName: user.fullName,
      username: user.username,
      bio: user.bio,
      link: user.link ?? '',
    }),
    [user.bio, user.fullName, user.link, user.username]
  )
  const [formValues, setFormValues] = useState(initialValues)

  useEffect(() => {
    setFormValues(initialValues)
  }, [initialValues])

  const inputBackground = isDark ? 'rgba(255,255,255,0.08)' : '#f3f4f6'
  const inputTextColor = isDark ? '#f5f5f5' : '#111827'
  const labelColor = isDark ? 'rgba(255,255,255,0.8)' : '#374151'
  const outlineColor = isDark ? 'rgba(255,255,255,0.25)' : '#d1d5db'

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        gap: 24,
        paddingHorizontal: 16,
        paddingBottom: 48,
      }}
    >
      <YStack gap="$3" alignItems="center">
        <Avatar
          size="$8"
          borderWidth={2}
          borderColor={isDark ? '#1877F2' : '#dbeafe'}
        >
          <AvatarImage src={user.avatarUrl} alt={user.username} />
          <AvatarFallback backgroundColor={isDark ? '#1f2937' : '#e5e7eb'}>
            <Text fontSize="$6" fontWeight="700">
              {user.fullName[0]?.toUpperCase() ?? 'A'}
            </Text>
          </AvatarFallback>
        </Avatar>
        <Button
          size="$3"
          backgroundColor={isDark ? 'rgba(255,255,255,0.08)' : '#f3f4f6'}
          color={inputTextColor}
          icon={<Camera size={16} color={inputTextColor} />}
          borderColor={outlineColor}
          borderWidth={1}
        >
          Change profile photo
        </Button>
      </YStack>

      <YStack gap="$2">
        <Label color={labelColor}>Name</Label>
        <Input
          value={formValues.fullName}
          backgroundColor={inputBackground}
          color={inputTextColor}
          onChangeText={value =>
            setFormValues(current => ({ ...current, fullName: value }))
          }
        />
      </YStack>

      <YStack gap="$2">
        <Label color={labelColor}>Username</Label>
        <Input
          value={formValues.username}
          backgroundColor={inputBackground}
          color={inputTextColor}
          onChangeText={value =>
            setFormValues(current => ({ ...current, username: value }))
          }
          autoCapitalize="none"
        />
      </YStack>

      <YStack gap="$2">
        <Label color={labelColor}>Bio</Label>
        <TextArea
          minHeight={112}
          multiline
          value={formValues.bio}
          backgroundColor={inputBackground}
          color={inputTextColor}
          onChangeText={value =>
            setFormValues(current => ({ ...current, bio: value }))
          }
        />
      </YStack>

      <YStack gap="$2">
        <Label color={labelColor}>Website</Label>
        <Input
          value={formValues.link}
          backgroundColor={inputBackground}
          color={inputTextColor}
          onChangeText={value =>
            setFormValues(current => ({ ...current, link: value }))
          }
          autoCapitalize="none"
          keyboardType="url"
        />
      </YStack>
    </ScrollView>
  )
}
