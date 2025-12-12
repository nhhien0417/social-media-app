import { useState } from 'react'
import {
  Modal,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  Image,
} from 'react-native'
import { YStack, XStack, Text, Button, Input, Separator } from 'tamagui'
import {
  X,
  Lock,
  Globe,
  Camera,
  Image as ImageIcon,
} from '@tamagui/lucide-icons'
import Animated, {
  FadeIn,
  FadeOut,
  SlideInDown,
  SlideOutDown,
} from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import * as ImagePicker from 'expo-image-picker'

interface CreateGroupModalProps {
  visible: boolean
  onClose: () => void
  isDark: boolean
  onCreateGroup?: (
    name: string,
    description: string,
    privacy: 'PUBLIC' | 'PRIVATE',
    background?: { uri: string; name: string; type: string },
    avatar?: { uri: string; name: string; type: string }
  ) => void
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable)

export function CreateGroupModal({
  visible,
  onClose,
  isDark,
  onCreateGroup,
}: CreateGroupModalProps) {
  const [groupName, setGroupName] = useState('')
  const [description, setDescription] = useState('')
  const [privacy, setPrivacy] = useState<'PUBLIC' | 'PRIVATE'>('PUBLIC')
  const [background, setBackground] = useState<{
    uri: string
    name: string
    type: string
  } | null>(null)
  const [avatar, setAvatar] = useState<{
    uri: string
    name: string
    type: string
  } | null>(null)

  const insets = useSafeAreaInsets()

  const backgroundColor = isDark ? '#242526' : '#ffffff'
  const textColor = isDark ? '#e4e6eb' : '#050505'
  const subtitleColor = isDark ? '#b0b3b8' : '#65676b'
  const borderColor = isDark ? '#3e4042' : '#e4e6eb'
  const inputBackground = isDark ? '#3a3b3c' : '#f0f2f5'
  const selectedBackground = isDark ? 'rgba(24,119,242,0.2)' : '#e7f3ff'

  const pickImage = async (type: 'background' | 'avatar') => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: type === 'background' ? [16, 9] : [1, 1],
      quality: 0.8,
    })

    if (!result.canceled) {
      const asset = result.assets[0]
      const file = {
        uri: asset.uri,
        name: asset.fileName || 'image.jpg',
        type: asset.type || 'image/jpeg',
      }
      if (type === 'background') {
        setBackground(file)
      } else {
        setAvatar(file)
      }
    }
  }

  const handleCreate = () => {
    if (!groupName.trim()) {
      Alert.alert('Error', 'Please enter a group name')
      return
    }

    if (!description.trim()) {
      Alert.alert('Error', 'Please enter a description')
      return
    }

    if (onCreateGroup) {
      onCreateGroup(
        groupName.trim(),
        description.trim(),
        privacy,
        background || undefined,
        avatar || undefined
      )
    }

    // Reset form
    setGroupName('')
    setDescription('')
    setPrivacy('PUBLIC')
    setBackground(null)
    setAvatar(null)
    onClose()
  }

  if (!visible) return null

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <AnimatedPressable
        entering={FadeIn.duration(200)}
        exiting={FadeOut.duration(200)}
        style={styles.overlay}
        onPress={onClose}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <Animated.View
            entering={SlideInDown.duration(300).springify()}
            exiting={SlideOutDown.duration(250)}
            style={styles.container}
          >
            <Pressable onPress={e => e.stopPropagation()}>
              <YStack
                backgroundColor={backgroundColor}
                borderTopLeftRadius={16}
                borderTopRightRadius={16}
                maxHeight="90%"
                overflow="hidden"
              >
                {/* Header */}
                <YStack>
                  <XStack
                    paddingHorizontal="$4"
                    paddingVertical="$3.5"
                    alignItems="center"
                    justifyContent="space-between"
                    borderBottomWidth={1}
                    borderBottomColor={borderColor}
                  >
                    <YStack flex={1}>
                      <Text fontSize={20} fontWeight="700" color={textColor}>
                        Create Group
                      </Text>
                    </YStack>
                    <Pressable onPress={onClose} hitSlop={8}>
                      <YStack
                        width={36}
                        height={36}
                        borderRadius={18}
                        backgroundColor={isDark ? '#3a3b3c' : '#e4e6eb'}
                        alignItems="center"
                        justifyContent="center"
                      >
                        <X size={20} color={textColor} />
                      </YStack>
                    </Pressable>
                  </XStack>
                </YStack>

                {/* Content */}
                <ScrollView
                  style={{ maxHeight: 600 }}
                  showsVerticalScrollIndicator={false}
                >
                  <YStack padding="$4" gap="$4">
                    {/* Cover Photo & Avatar */}
                    <YStack gap="$2" marginBottom="$4">
                      <Text fontSize={15} fontWeight="600" color={textColor}>
                        Group Visuals
                      </Text>
                      <YStack position="relative">
                        <Pressable onPress={() => pickImage('background')}>
                          <YStack
                            height={150}
                            borderRadius={12}
                            backgroundColor={inputBackground}
                            alignItems="center"
                            justifyContent="center"
                            overflow="hidden"
                          >
                            {background ? (
                              <Image
                                source={{ uri: background.uri }}
                                style={{ width: '100%', height: '100%' }}
                              />
                            ) : (
                              <YStack alignItems="center" gap="$2">
                                <ImageIcon size={24} color={subtitleColor} />
                                <Text fontSize={13} color={subtitleColor}>
                                  Add Cover Photo
                                </Text>
                              </YStack>
                            )}
                          </YStack>
                        </Pressable>

                        <Pressable
                          onPress={() => pickImage('avatar')}
                          style={{
                            position: 'absolute',
                            bottom: -30,
                            left: 20,
                          }}
                        >
                          <YStack
                            width={80}
                            height={80}
                            borderRadius={40}
                            backgroundColor={inputBackground}
                            borderWidth={3}
                            borderColor={backgroundColor}
                            alignItems="center"
                            justifyContent="center"
                            overflow="hidden"
                          >
                            {avatar ? (
                              <Image
                                source={{ uri: avatar.uri }}
                                style={{ width: '100%', height: '100%' }}
                              />
                            ) : (
                              <Camera size={24} color={subtitleColor} />
                            )}
                          </YStack>
                        </Pressable>
                      </YStack>
                      <YStack height={20} />
                    </YStack>

                    {/* Group Name */}
                    <YStack gap="$2">
                      <Text fontSize={15} fontWeight="600" color={textColor}>
                        Group Name
                      </Text>
                      <Input
                        value={groupName}
                        onChangeText={setGroupName}
                        placeholder="Enter group name"
                        placeholderTextColor={subtitleColor}
                        backgroundColor={inputBackground}
                        borderWidth={0}
                        borderRadius={8}
                        paddingHorizontal="$3"
                        paddingVertical="$2.5"
                        fontSize={15}
                        color={textColor}
                        maxLength={75}
                      />
                      <Text fontSize={12} color={subtitleColor}>
                        {groupName.length}/75
                      </Text>
                    </YStack>

                    {/* Description */}
                    <YStack gap="$2">
                      <Text fontSize={15} fontWeight="600" color={textColor}>
                        Description
                      </Text>
                      <Input
                        value={description}
                        onChangeText={setDescription}
                        placeholder="What's your group about?"
                        placeholderTextColor={subtitleColor}
                        backgroundColor={inputBackground}
                        borderWidth={0}
                        borderRadius={8}
                        paddingHorizontal="$3"
                        paddingVertical="$2.5"
                        fontSize={15}
                        color={textColor}
                        multiline
                        numberOfLines={3}
                        textAlignVertical="top"
                        maxLength={255}
                      />
                      <Text fontSize={12} color={subtitleColor}>
                        {description.length}/255
                      </Text>
                    </YStack>

                    <Separator borderColor={borderColor} />

                    {/* Privacy */}
                    <YStack gap="$2">
                      <Text fontSize={15} fontWeight="600" color={textColor}>
                        Privacy
                      </Text>
                      <YStack gap="$2">
                        {/* Public Option */}
                        <Pressable onPress={() => setPrivacy('PUBLIC')}>
                          <XStack
                            padding="$3"
                            backgroundColor={
                              privacy === 'PUBLIC'
                                ? selectedBackground
                                : inputBackground
                            }
                            borderRadius={8}
                            alignItems="center"
                            gap="$3"
                            borderWidth={privacy === 'PUBLIC' ? 2 : 0}
                            borderColor="#1877F2"
                          >
                            <YStack
                              width={40}
                              height={40}
                              borderRadius={20}
                              backgroundColor={
                                isDark
                                  ? 'rgba(255,255,255,0.1)'
                                  : 'rgba(0,0,0,0.05)'
                              }
                              alignItems="center"
                              justifyContent="center"
                            >
                              <Globe size={20} color={textColor} />
                            </YStack>
                            <YStack flex={1}>
                              <Text
                                fontSize={15}
                                fontWeight="600"
                                color={textColor}
                              >
                                Public
                              </Text>
                              <Text
                                fontSize={13}
                                color={subtitleColor}
                                marginTop="$0.5"
                              >
                                Anyone can see who's in the group and what they
                                post
                              </Text>
                            </YStack>
                            {privacy === 'PUBLIC' && (
                              <YStack
                                width={20}
                                height={20}
                                borderRadius={10}
                                backgroundColor="#1877F2"
                                alignItems="center"
                                justifyContent="center"
                              >
                                <Text color="white" fontSize={12}>
                                  ✓
                                </Text>
                              </YStack>
                            )}
                          </XStack>
                        </Pressable>

                        {/* Private Option */}
                        <Pressable onPress={() => setPrivacy('PRIVATE')}>
                          <XStack
                            padding="$3"
                            backgroundColor={
                              privacy === 'PRIVATE'
                                ? selectedBackground
                                : inputBackground
                            }
                            borderRadius={8}
                            alignItems="center"
                            gap="$3"
                            borderWidth={privacy === 'PRIVATE' ? 2 : 0}
                            borderColor="#1877F2"
                          >
                            <YStack
                              width={40}
                              height={40}
                              borderRadius={20}
                              backgroundColor={
                                isDark
                                  ? 'rgba(255,255,255,0.1)'
                                  : 'rgba(0,0,0,0.05)'
                              }
                              alignItems="center"
                              justifyContent="center"
                            >
                              <Lock size={20} color={textColor} />
                            </YStack>
                            <YStack flex={1}>
                              <Text
                                fontSize={15}
                                fontWeight="600"
                                color={textColor}
                              >
                                Private
                              </Text>
                              <Text
                                fontSize={13}
                                color={subtitleColor}
                                marginTop="$0.5"
                              >
                                Only members can see who's in the group and what
                                they post
                              </Text>
                            </YStack>
                            {privacy === 'PRIVATE' && (
                              <YStack
                                width={20}
                                height={20}
                                borderRadius={10}
                                backgroundColor="#1877F2"
                                alignItems="center"
                                justifyContent="center"
                              >
                                <Text color="white" fontSize={12}>
                                  ✓
                                </Text>
                              </YStack>
                            )}
                          </XStack>
                        </Pressable>
                      </YStack>
                    </YStack>
                  </YStack>
                </ScrollView>

                {/* Footer */}
                <YStack
                  padding="$4"
                  paddingBottom={insets.bottom || 16}
                  borderTopWidth={1}
                  borderTopColor={borderColor}
                >
                  <Button
                    backgroundColor="#1877F2"
                    color="white"
                    borderRadius={8}
                    fontWeight="600"
                    fontSize={15}
                    height={44}
                    pressStyle={{ opacity: 0.8, scale: 0.98 }}
                    onPress={handleCreate}
                    disabled={!groupName.trim() || !description.trim()}
                    opacity={!groupName.trim() || !description.trim() ? 0.5 : 1}
                  >
                    Create Group
                  </Button>
                </YStack>
              </YStack>
            </Pressable>
          </Animated.View>
        </KeyboardAvoidingView>
      </AnimatedPressable>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  keyboardView: {
    justifyContent: 'flex-end',
  },
  container: {
    width: '100%',
  },
})
