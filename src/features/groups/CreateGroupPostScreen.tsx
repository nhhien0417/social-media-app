import React, { useMemo, useState } from 'react'
import { KeyboardAvoidingView, Platform, Alert } from 'react-native'
import { ScrollView, YStack } from 'tamagui'
import { useRouter, useLocalSearchParams } from 'expo-router'

import Header from '../create/components/Header'
import PostPreview, {
  type MediaItem,
  type UserInfoData,
  type PrivacyOption,
} from '../create/components/PostPreview'
import PostAction from '../create/components/PostAction'
import MediaPicker from '../../components/MediaPicker'
import Camera from '../../components/Camera'
import DiscardChangesModal from '../create/components/DiscardChanges'
import { usePostStore } from '@/stores/postStore'
import { useCurrentUser } from '@/hooks/useProfile'

export default function CreateGroupPostScreen() {
  const router = useRouter()
  const params = useLocalSearchParams<{
    groupId?: string
    groupName?: string
  }>()

  const currentUser = useCurrentUser()
  const createPost = usePostStore(state => state.createPost)

  const [caption, setCaption] = useState('')
  const [media, setMedia] = useState<MediaItem[]>([])
  const [privacy] = useState<PrivacyOption>('public') // Group posts are typically public within the group
  const [showMediaPicker, setShowMediaPicker] = useState(false)
  const [showCamera, setShowCamera] = useState(false)
  const [showDiscardModal, setShowDiscardModal] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const user: UserInfoData = useMemo(() => {
    if (!currentUser) {
      return {
        id: '',
        name: '',
        avatarUrl: undefined,
      }
    }

    return {
      id: currentUser.id,
      name: currentUser.username,
      avatarUrl: currentUser.avatarUrl || undefined,
    }
  }, [currentUser])

  const hasUnsavedChanges = useMemo(
    () => caption.trim().length > 0 || media.length > 0,
    [caption, media]
  )

  const handleBack = () => {
    if (hasUnsavedChanges) {
      setShowDiscardModal(true)
    } else {
      router.back()
    }
  }

  const handleDiscard = () => {
    setShowDiscardModal(false)
    router.back()
  }

  const handleAddMedia = (newMedia: MediaItem[]) => {
    setMedia(prev => [...prev, ...newMedia])
    setShowMediaPicker(false)
  }

  const handleRemoveMedia = (id: string) => {
    setMedia(prev => prev.filter(item => item.id !== id))
  }

  const handleCameraCapture = (capturedMedia: MediaItem) => {
    setMedia(prev => [...prev, capturedMedia])
    setShowCamera(false)
  }

  const handleShare = async () => {
    if (!caption.trim() && media.length === 0) {
      Alert.alert('Error', 'Please add some content or media to your post')
      return
    }

    setIsSubmitting(true)
    try {
      const formData = new FormData()
      formData.append('content', caption)
      formData.append('privacy', 'PUBLIC')
      if (params.groupId) {
        formData.append('groupId', params.groupId)
      }

      media.forEach((item, index) => {
        if (item.blob) {
          formData.append('media', item.blob, item.fileName || `media-${index}`)
        }
      })

      await createPost(formData)

      Alert.alert('Success', 'Post created successfully!', [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ])
    } catch (error) {
      console.error('Failed to create post:', error)
      Alert.alert('Error', 'Failed to create post. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <YStack flex={1} backgroundColor="$background">
      <Header
        onBack={handleBack}
        onShare={handleShare}
        isLoading={isSubmitting}
        disabled={!caption.trim() && media.length === 0}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={0}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 120 }}
          keyboardShouldPersistTaps="handled"
        >
          <PostPreview
            user={user}
            caption={caption}
            onChangeCaption={setCaption}
            media={media}
            onRemoveMedia={handleRemoveMedia}
            privacy={privacy}
            onChangePrivacy={() => {}} // Group posts don't change privacy
            groupName={params.groupName || 'Group'}
          />
        </ScrollView>

        <PostAction
          onMediaPickerPress={() => setShowMediaPicker(true)}
          onCameraPress={() => setShowCamera(true)}
        />
      </KeyboardAvoidingView>

      <MediaPicker
        visible={showMediaPicker}
        onClose={() => setShowMediaPicker(false)}
        onSelectMedia={handleAddMedia}
        maxSelection={10}
      />

      <Camera
        visible={showCamera}
        onClose={() => setShowCamera(false)}
        onCapture={handleCameraCapture}
      />

      <DiscardChangesModal
        visible={showDiscardModal}
        onDiscard={handleDiscard}
        onKeepEditing={() => setShowDiscardModal(false)}
      />
    </YStack>
  )
}
