import React, { useState } from 'react'
import { Pressable, StyleSheet, Image } from 'react-native'
import { YStack, XStack, Text, useThemeName } from 'tamagui'
import { Image as ImageIcon, Video } from '@tamagui/lucide-icons'
import { CreatePostModal } from './CreatePostModal'

interface CreatePostButtonProps {
  userName: string
  userAvatar?: string
}

export const CreatePostButton: React.FC<CreatePostButtonProps> = ({
  userName,
  userAvatar,
}) => {
  const [modalVisible, setModalVisible] = useState(false)
  const themeName = useThemeName()
  const isDark = themeName === 'dark'

  const backgroundColor = isDark ? '#1a1a1a' : '#ffffff'
  const textColor = isDark ? '#e4e6eb' : '#050505'
  const subtitleColor = isDark ? '#b0b3b8' : '#65676b'
  const inputBackground = isDark ? '#3a3b3c' : '#f0f2f5'
  const borderColor = isDark ? '#2a2a2a' : '#e5e7eb'

  return (
    <>
      <YStack
        backgroundColor={backgroundColor}
        paddingHorizontal="$4"
        paddingVertical="$3"
        borderBottomWidth={8}
        borderBottomColor={isDark ? '#000000' : '#f0f2f5'}
      >
        {/* Create Post Input */}
        <Pressable onPress={() => setModalVisible(true)}>
          <XStack gap="$3" alignItems="center" marginBottom="$3">
            <YStack
              width={40}
              height={40}
              borderRadius={20}
              backgroundColor={inputBackground}
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
            <YStack
              flex={1}
              backgroundColor={inputBackground}
              borderRadius={24}
              paddingHorizontal="$4"
              paddingVertical="$3"
              borderWidth={1}
              borderColor={borderColor}
            >
              <Text color={subtitleColor} fontSize={15}>
                What's on your mind, {userName}?
              </Text>
            </YStack>
          </XStack>
        </Pressable>

        {/* Action Buttons */}
        <YStack height={1} backgroundColor={borderColor} marginVertical="$2" />
        <XStack gap="$2" justifyContent="space-around">
          <Pressable
            style={styles.actionButton}
            onPress={() => setModalVisible(true)}
          >
            <ImageIcon size={24} color="#45bd62" />
            <Text fontSize={14} fontWeight="500" color={textColor}>
              Photo
            </Text>
          </Pressable>
          <Pressable
            style={styles.actionButton}
            onPress={() => setModalVisible(true)}
          >
            <Video size={24} color="#f02849" />
            <Text fontSize={14} fontWeight="500" color={textColor}>
              Video
            </Text>
          </Pressable>
        </XStack>
      </YStack>

      <CreatePostModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        isDark={isDark}
        userName={userName}
        userAvatar={userAvatar}
      />
    </>
  )
}

const styles = StyleSheet.create({
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 8,
  },
})
