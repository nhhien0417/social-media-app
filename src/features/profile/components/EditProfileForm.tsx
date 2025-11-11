import { useEffect, useMemo, useState } from 'react'
import { ScrollView } from 'react-native'
import {
  Button,
  Input,
  Label,
  Text,
  TextArea,
  YStack,
  useThemeName,
} from 'tamagui'
import { Camera } from '@tamagui/lucide-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { Image, StyleSheet } from 'react-native'
import type { ProfileUser } from '../../../mock/profile'

interface EditProfileFormProps {
  user: ProfileUser
}

type FormValues = {
  name: string
  username: string
  bio: string
  link: string
}

export function EditProfileForm({ user }: EditProfileFormProps) {
  const themeName = useThemeName()
  const isDark = themeName === 'dark'
  const initialValues = useMemo(
    () => ({
      name: user.username,
      username: user.username,
      bio: user.bio,
      link: user.link ?? '',
    }),
    [user.bio, user.link, user.username]
  )
  const [formValues, setFormValues] = useState<FormValues>(initialValues)

  useEffect(() => {
    setFormValues(initialValues)
  }, [initialValues])

  const inputBackground = isDark ? 'rgba(255,255,255,0.08)' : '#f3f4f6'
  const inputTextColor = isDark ? '#f5f5f5' : '#111827'
  const labelColor = isDark ? 'rgba(255,255,255,0.8)' : '#374151'
  const outlineColor = isDark ? 'rgba(255,255,255,0.25)' : '#d1d5db'
  const ringBackground = isDark ? '#050506' : '#ffffff'
  const fallbackBackground = isDark ? '#111827' : '#e2e8f0'

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        gap: 24,
        paddingHorizontal: 16,
        paddingTop: 24,
        paddingBottom: 48,
      }}
    >
      <YStack gap="$3" alignItems="center">
        <LinearGradient
          colors={INSTAGRAM_GRADIENT}
          start={{ x: 0, y: 0.35 }}
          end={{ x: 1, y: 0.65 }}
          style={styles.avatarRing}
        >
          <YStack
            style={[styles.avatarInner, { backgroundColor: ringBackground }]}
            alignItems="center"
            justifyContent="center"
          >
            <YStack style={styles.avatarImageWrapper}>
              {user.avatarUrl ? (
                <Image
                  source={{ uri: user.avatarUrl }}
                  style={styles.avatarImage}
                />
              ) : (
                <YStack
                  flex={1}
                  alignItems="center"
                  justifyContent="center"
                  backgroundColor={fallbackBackground}
                >
                  <Text
                    fontSize="$6"
                    fontWeight="700"
                    color={isDark ? '#f8fafc' : '#111827'}
                  >
                    {user.username[0]?.toUpperCase() ?? 'A'}
                  </Text>
                </YStack>
              )}
            </YStack>
          </YStack>
        </LinearGradient>
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
          value={formValues.name}
          backgroundColor={inputBackground}
          color={inputTextColor}
          onChangeText={value =>
            setFormValues(current => ({ ...current, name: value }))
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

const INSTAGRAM_GRADIENT = [
  '#f58529',
  '#feda77',
  '#dd2a7b',
  '#8134af',
  '#515bd4',
] as const

const AVATAR_SIZE = 88
const RING_PADDING = 4
const RING_SIZE = AVATAR_SIZE + RING_PADDING * 2

const styles = StyleSheet.create({
  avatarRing: {
    width: RING_SIZE,
    height: RING_SIZE,
    padding: RING_PADDING,
    borderRadius: RING_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInner: {
    width: AVATAR_SIZE + RING_PADDING,
    height: AVATAR_SIZE + RING_PADDING,
    padding: RING_PADDING / 2,
    borderRadius: (AVATAR_SIZE + RING_PADDING) / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  avatarImageWrapper: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    overflow: 'hidden',
  },
})
