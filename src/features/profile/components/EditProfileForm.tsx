import { useEffect, useMemo, useState } from 'react'
import { ScrollView, Image, StyleSheet } from 'react-native'
import {
  Button,
  Input,
  Label,
  Text,
  TextArea,
  YStack,
  XStack,
  useThemeName,
  Select,
  Adapt,
  Sheet,
} from 'tamagui'
import { Camera, ChevronDown } from '@tamagui/lucide-icons'
import { LinearGradient } from 'expo-linear-gradient'

import { INSTAGRAM_GRADIENT } from '@/utils/InstagramGradient'
import { ProfileComponentProps } from '../ProfileScreen'

type FormValues = {
  name: string
  username: string
  avatarUrl: string
  gender: string
  bio: string
  dob: string
}

export function EditProfileForm({ user }: ProfileComponentProps) {
  const themeName = useThemeName()
  const isDark = themeName === 'dark'

  const initialValues = useMemo<FormValues>(
    () => ({
      name: [user.firstName, user.lastName].filter(Boolean).join(' '),
      username: user.username || '',
      avatarUrl: user.avatarUrl || '',
      gender: user.gender || '',
      bio: user.bio || '',
      dob: user.dob || '',
    }),
    [user]
  )

  const [formValues, setFormValues] = useState<FormValues>(initialValues)

  useEffect(() => {
    setFormValues(initialValues)
  }, [initialValues])

  const inputBackground = isDark ? 'rgba(255,255,255,0.08)' : '#f3f4f6'
  const inputTextColor = isDark ? '#f5f5f5' : '#05070cff'
  const labelColor = isDark ? 'rgba(255,255,255,0.8)' : '#151719ff'
  const outlineColor = isDark ? 'rgba(255,255,255,0.25)' : '#d1d5db'
  const ringBackground = isDark ? '#050506' : '#ffffff'
  const displayDob = formValues.dob || 'Select your date of birth'

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        padding: 15,
        gap: 10,
      }}
    >
      {/* Avatar + change button */}
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
              <Image
                source={{ uri: formValues.avatarUrl }}
                style={styles.avatarImage}
              />
            </YStack>
          </YStack>
        </LinearGradient>

        <Button
          size="$3"
          backgroundColor={isDark ? 'rgba(255,255,255,0.08)' : '#f3f4f6'}
          color={inputTextColor}
          icon={<Camera size={20} color={inputTextColor} />}
          borderColor={outlineColor}
          borderWidth={1}
          fontSize={15}
          onPress={() => {
            // TODO: open image picker
          }}
        >
          Change profile photo
        </Button>
      </YStack>

      {/* Name */}
      <YStack>
        <Label fontWeight={700} fontSize={15} color={labelColor}>
          Name
        </Label>
        <Input
          value={formValues.name}
          fontSize={15}
          placeholder="Full name"
          backgroundColor={inputBackground}
          color={inputTextColor}
          onChangeText={value =>
            setFormValues(current => ({ ...current, name: value }))
          }
        />
      </YStack>

      {/* Username */}
      <YStack>
        <Label fontWeight={700} fontSize={15} color={labelColor}>
          Username
        </Label>
        <Input
          value={formValues.username}
          placeholder="username"
          fontSize={15}
          backgroundColor={inputBackground}
          color={inputTextColor}
          onChangeText={value =>
            setFormValues(current => ({ ...current, username: value }))
          }
          autoCapitalize="none"
        />
      </YStack>

      {/* Bio */}
      <YStack>
        <Label fontWeight={700} fontSize={15} color={labelColor}>
          Bio
        </Label>
        <TextArea
          minHeight={112}
          multiline
          value={formValues.bio}
          fontSize={15}
          placeholder="Tell people a bit about yourself"
          backgroundColor={inputBackground}
          color={inputTextColor}
          onChangeText={value =>
            setFormValues(current => ({ ...current, bio: value }))
          }
        />
      </YStack>

      {/* Gender (Select) */}
      <YStack>
        <Label fontWeight={700} fontSize={15} color={labelColor}>
          Gender
        </Label>
        <Select
          value={formValues.gender || ''}
          onValueChange={value =>
            setFormValues(current => ({ ...current, gender: value }))
          }
        >
          <Select.Trigger
            iconAfter={ChevronDown}
            borderColor={outlineColor}
            backgroundColor={inputBackground}
            fontSize={15}
          >
            <Select.Value
              placeholder="Select gender"
              style={{ color: inputTextColor as string }}
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
                    •
                  </Select.ItemIndicator>
                </Select.Item>

                <Select.Item value="FEMALE" index={1}>
                  <Select.ItemText>Female</Select.ItemText>
                  <Select.ItemIndicator marginLeft="auto">
                    •
                  </Select.ItemIndicator>
                </Select.Item>

                <Select.Item value="MALE" index={2}>
                  <Select.ItemText>Male</Select.ItemText>
                  <Select.ItemIndicator marginLeft="auto">
                    •
                  </Select.ItemIndicator>
                </Select.Item>

                <Select.Item value="OTHER" index={3}>
                  <Select.ItemText>Other</Select.ItemText>
                  <Select.ItemIndicator marginLeft="auto">
                    •
                  </Select.ItemIndicator>
                </Select.Item>
              </Select.Group>
            </Select.Viewport>
            <Select.ScrollDownButton />
          </Select.Content>
        </Select>
      </YStack>

      {/* Date of birth (display + placeholder, chuẩn text để sau gắn DatePicker) */}
      <YStack>
        <Label fontWeight={700} fontSize={15} color={labelColor}>
          Date of birth
        </Label>
        <XStack
          alignItems="center"
          borderWidth={1}
          borderColor={outlineColor}
          borderRadius="$4"
          paddingHorizontal="$3"
          paddingVertical="$2"
          backgroundColor={inputBackground}
          justifyContent="space-between"
        >
          <Text
            fontSize={15}
            color={
              formValues.dob
                ? inputTextColor
                : isDark
                  ? 'rgba(255,255,255,0.5)'
                  : '#9ca3af'
            }
          >
            {displayDob}
          </Text>

          <Button
            size="$2"
            fontSize={15}
            fontWeight={500}
            backgroundColor="transparent"
            color={inputTextColor}
            onPress={() => {
              // TODO: open date picker, rồi setFormValues({ ... , dob: 'YYYY-MM-DD' })
            }}
          >
            Change
          </Button>
        </XStack>
      </YStack>
    </ScrollView>
  )
}

const AVATAR_SIZE = 100
const RING_PADDING = 5
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
