import React, { useState, useMemo } from 'react'
import {
  Modal,
  Pressable,
  StyleSheet,
  TextInput,
  ScrollView,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native'
import { YStack, XStack, Text, Button, useThemeName } from 'tamagui'
import {
  X,
  Image as ImageIcon,
  Video,
  Smile,
  MapPin,
  Tag,
  Calendar,
  Camera,
  FileText,
  Mic,
  MoreHorizontal,
} from '@tamagui/lucide-icons'
import * as ImagePicker from 'expo-image-picker'

interface CreateGroupPostModalProps {
  visible: boolean
  onClose: () => void
  isDark: boolean
  groupName: string
  userAvatar?: string
  userName: string
}

interface SelectedMedia {
  id: string
  uri: string
  type: 'image' | 'video'
  fileName?: string
}

export const CreateGroupPostModal: React.FC<CreateGroupPostModalProps> = ({
  visible,
  onClose,
  isDark,
  groupName,
  userAvatar,
  userName,
}) => {
  const [postText, setPostText] = useState('')
  const [selectedMedia, setSelectedMedia] = useState<SelectedMedia[]>([])
  const [isPosting, setIsPosting] = useState(false)

  const backgroundColor = isDark ? '#242526' : '#ffffff'
  const textColor = isDark ? '#e4e6eb' : '#050505'
  const subtitleColor = isDark ? '#b0b3b8' : '#65676b'
  const inputBackground = isDark ? '#3a3b3c' : '#f0f2f5'
  const borderColor = isDark ? '#3e4042' : '#e4e6eb'
  const iconBackground = isDark ? 'rgba(255,255,255,0.1)' : '#f0f2f5'

  const canPost = postText.trim().length > 0 || selectedMedia.length > 0

  const handlePickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()

      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Please grant camera roll permissions to upload photos'
        )
        return
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 1,
        selectionLimit: 10,
      })

      if (!result.canceled && result.assets) {
        const newMedia: SelectedMedia[] = result.assets.map((asset, index) => ({
          id: `media-${Date.now()}-${index}`,
          uri: asset.uri,
          type: 'image' as const,
          fileName: asset.fileName || `image-${index}.jpg`,
        }))
        setSelectedMedia(prev => [...prev, ...newMedia])
      }
    } catch (error) {
      console.error('Error picking image:', error)
      Alert.alert('Error', 'Failed to pick image')
    }
  }

  const handleTakePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync()

      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Please grant camera permissions to take photos'
        )
        return
      }

      const result = await ImagePicker.launchCameraAsync({
        quality: 1,
        allowsEditing: false,
      })

      if (!result.canceled && result.assets?.[0]) {
        const newMedia: SelectedMedia = {
          id: `media-${Date.now()}`,
          uri: result.assets[0].uri,
          type: 'image',
          fileName: result.assets[0].fileName || 'photo.jpg',
        }
        setSelectedMedia(prev => [...prev, newMedia])
      }
    } catch (error) {
      console.error('Error taking photo:', error)
      Alert.alert('Error', 'Failed to take photo')
    }
  }

  const handleRemoveMedia = (id: string) => {
    setSelectedMedia(prev => prev.filter(item => item.id !== id))
  }

  const handlePost = async () => {
    if (!canPost) return

    setIsPosting(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))

      Alert.alert('Success', 'Post created successfully!')
      handleClose()
    } catch (error) {
      Alert.alert('Error', 'Failed to create post')
    } finally {
      setIsPosting(false)
    }
  }

  const handleClose = () => {
    if (postText.trim() || selectedMedia.length > 0) {
      Alert.alert(
        'Discard post?',
        'Are you sure you want to discard this post?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Discard',
            style: 'destructive',
            onPress: () => {
              setPostText('')
              setSelectedMedia([])
              onClose()
            },
          },
        ]
      )
    } else {
      onClose()
    }
  }

  const renderMediaGrid = () => {
    if (selectedMedia.length === 0) return null

    const mediaCount = selectedMedia.length

    return (
      <YStack
        marginTop="$3"
        borderRadius={12}
        overflow="hidden"
        borderWidth={1}
        borderColor={borderColor}
      >
        {mediaCount === 1 && (
          <YStack position="relative">
            <Image
              source={{ uri: selectedMedia[0].uri }}
              style={styles.singleImage}
            />
            <Pressable
              style={[styles.removeButton, { backgroundColor }]}
              onPress={() => handleRemoveMedia(selectedMedia[0].id)}
            >
              <X size={20} color={textColor} />
            </Pressable>
          </YStack>
        )}

        {mediaCount === 2 && (
          <XStack>
            {selectedMedia.map((media, index) => (
              <YStack key={media.id} flex={1} position="relative">
                <Image
                  source={{ uri: media.uri }}
                  style={[
                    styles.gridImage,
                    index === 0 && styles.gridImageLeft,
                  ]}
                />
                <Pressable
                  style={[styles.removeButton, { backgroundColor }]}
                  onPress={() => handleRemoveMedia(media.id)}
                >
                  <X size={18} color={textColor} />
                </Pressable>
              </YStack>
            ))}
          </XStack>
        )}

        {mediaCount === 3 && (
          <XStack>
            <YStack flex={1} position="relative">
              <Image
                source={{ uri: selectedMedia[0].uri }}
                style={styles.gridImageTall}
              />
              <Pressable
                style={[styles.removeButton, { backgroundColor }]}
                onPress={() => handleRemoveMedia(selectedMedia[0].id)}
              >
                <X size={18} color={textColor} />
              </Pressable>
            </YStack>
            <YStack flex={1}>
              {selectedMedia.slice(1).map((media, index) => (
                <YStack key={media.id} flex={1} position="relative">
                  <Image
                    source={{ uri: media.uri }}
                    style={[
                      styles.gridImage,
                      index === 0 && styles.gridImageTopRight,
                      index === 1 && styles.gridImageBottomRight,
                    ]}
                  />
                  <Pressable
                    style={[styles.removeButton, { backgroundColor }]}
                    onPress={() => handleRemoveMedia(media.id)}
                  >
                    <X size={18} color={textColor} />
                  </Pressable>
                </YStack>
              ))}
            </YStack>
          </XStack>
        )}

        {mediaCount >= 4 && (
          <YStack>
            <XStack>
              {selectedMedia.slice(0, 2).map((media, index) => (
                <YStack key={media.id} flex={1} position="relative">
                  <Image
                    source={{ uri: media.uri }}
                    style={[
                      styles.gridImage,
                      index === 0 && styles.gridImageLeft,
                    ]}
                  />
                  <Pressable
                    style={[styles.removeButton, { backgroundColor }]}
                    onPress={() => handleRemoveMedia(media.id)}
                  >
                    <X size={18} color={textColor} />
                  </Pressable>
                </YStack>
              ))}
            </XStack>
            <XStack>
              {selectedMedia.slice(2, 4).map((media, index) => (
                <YStack key={media.id} flex={1} position="relative">
                  <Image
                    source={{ uri: media.uri }}
                    style={[
                      styles.gridImage,
                      index === 0 && styles.gridImageLeft,
                    ]}
                  />
                  <Pressable
                    style={[styles.removeButton, { backgroundColor }]}
                    onPress={() => handleRemoveMedia(media.id)}
                  >
                    <X size={18} color={textColor} />
                  </Pressable>
                  {index === 1 && mediaCount > 4 && (
                    <YStack
                      position="absolute"
                      top={0}
                      left={0}
                      right={0}
                      bottom={0}
                      backgroundColor="rgba(0,0,0,0.6)"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Text fontSize={32} fontWeight="700" color="#ffffff">
                        +{mediaCount - 4}
                      </Text>
                    </YStack>
                  )}
                </YStack>
              ))}
            </XStack>
          </YStack>
        )}
      </YStack>
    )
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <YStack flex={1} backgroundColor={backgroundColor}>
          {/* Header */}
          <YStack
            paddingHorizontal="$4"
            paddingVertical="$3"
            borderBottomWidth={1}
            borderBottomColor={borderColor}
          >
            <XStack alignItems="center" justifyContent="space-between">
              <Pressable onPress={handleClose} hitSlop={8}>
                <X size={24} color={textColor} />
              </Pressable>
              <Text fontSize={18} fontWeight="700" color={textColor}>
                Create post
              </Text>
              <Button
                backgroundColor={canPost ? '#1877F2' : borderColor}
                color={canPost ? '#ffffff' : subtitleColor}
                borderRadius={8}
                paddingHorizontal="$5"
                paddingVertical="$2"
                height={36}
                fontWeight="600"
                fontSize={15}
                disabled={!canPost || isPosting}
                pressStyle={{ opacity: 0.9, scale: 0.98 }}
                onPress={handlePost}
              >
                {isPosting ? 'Posting...' : 'Post'}
              </Button>
            </XStack>
          </YStack>

          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <YStack padding="$4" gap="$3">
              {/* User Info */}
              <XStack gap="$3" alignItems="center">
                <YStack
                  width={40}
                  height={40}
                  borderRadius={20}
                  backgroundColor={isDark ? '#3a3b3c' : '#e4e6eb'}
                  alignItems="center"
                  justifyContent="center"
                  overflow="hidden"
                >
                  {userAvatar ? (
                    <Image source={{ uri: userAvatar }} style={styles.avatar} />
                  ) : (
                    <Text fontSize={16} fontWeight="700" color={textColor}>
                      {userName.charAt(0).toUpperCase()}
                    </Text>
                  )}
                </YStack>
                <YStack gap="$1">
                  <Text fontSize={15} fontWeight="600" color={textColor}>
                    {userName}
                  </Text>
                  <XStack
                    backgroundColor={inputBackground}
                    paddingHorizontal="$2.5"
                    paddingVertical="$1"
                    borderRadius={6}
                    alignItems="center"
                    gap="$1.5"
                  >
                    <Text fontSize={12} fontWeight="500" color={subtitleColor}>
                      Posting in
                    </Text>
                    <Text fontSize={12} fontWeight="600" color={textColor}>
                      {groupName}
                    </Text>
                  </XStack>
                </YStack>
              </XStack>

              {/* Text Input */}
              <TextInput
                style={[
                  styles.textInput,
                  {
                    color: textColor,
                    minHeight: selectedMedia.length > 0 ? 100 : 200,
                  },
                ]}
                placeholder={`What's on your mind, ${userName}?`}
                placeholderTextColor={subtitleColor}
                multiline
                value={postText}
                onChangeText={setPostText}
                autoFocus
                textAlignVertical="top"
              />

              {/* Media Grid */}
              {renderMediaGrid()}

              {/* Add to Post */}
              <YStack
                backgroundColor={iconBackground}
                borderRadius={12}
                padding="$4"
                gap="$3"
              >
                <Text fontSize={15} fontWeight="600" color={textColor}>
                  Add to your post
                </Text>
                <XStack flexWrap="wrap" gap="$2">
                  <Pressable
                    style={[
                      styles.addButton,
                      { backgroundColor: iconBackground },
                    ]}
                    onPress={handlePickImage}
                  >
                    <ImageIcon size={24} color="#45bd62" />
                  </Pressable>
                  <Pressable
                    style={[
                      styles.addButton,
                      { backgroundColor: iconBackground },
                    ]}
                    onPress={handleTakePhoto}
                  >
                    <Camera size={24} color="#45bd62" />
                  </Pressable>
                  <Pressable
                    style={[
                      styles.addButton,
                      { backgroundColor: iconBackground },
                    ]}
                  >
                    <Tag size={24} color="#1877F2" />
                  </Pressable>
                  <Pressable
                    style={[
                      styles.addButton,
                      { backgroundColor: iconBackground },
                    ]}
                  >
                    <Smile size={24} color="#f7b928" />
                  </Pressable>
                  <Pressable
                    style={[
                      styles.addButton,
                      { backgroundColor: iconBackground },
                    ]}
                  >
                    <MapPin size={24} color="#f5533d" />
                  </Pressable>
                  <Pressable
                    style={[
                      styles.addButton,
                      { backgroundColor: iconBackground },
                    ]}
                  >
                    <Video size={24} color="#f02849" />
                  </Pressable>
                  <Pressable
                    style={[
                      styles.addButton,
                      { backgroundColor: iconBackground },
                    ]}
                  >
                    <FileText size={24} color="#7646ff" />
                  </Pressable>
                  <Pressable
                    style={[
                      styles.addButton,
                      { backgroundColor: iconBackground },
                    ]}
                  >
                    <MoreHorizontal size={24} color={subtitleColor} />
                  </Pressable>
                </XStack>
              </YStack>
            </YStack>
          </ScrollView>
        </YStack>
      </KeyboardAvoidingView>
    </Modal>
  )
}

const styles = StyleSheet.create({
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  textInput: {
    fontSize: 16,
    fontWeight: '400',
    padding: 0,
    textAlignVertical: 'top',
  },
  singleImage: {
    width: '100%',
    height: 400,
    resizeMode: 'cover',
  },
  gridImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  gridImageLeft: {
    borderRightWidth: 1,
    borderRightColor: '#fff',
  },
  gridImageTall: {
    width: '100%',
    height: 400,
    resizeMode: 'cover',
    borderRightWidth: 1,
    borderRightColor: '#fff',
  },
  gridImageTopRight: {
    borderBottomWidth: 1,
    borderBottomColor: '#fff',
  },
  gridImageBottomRight: {
    // No border
  },
  removeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
})
