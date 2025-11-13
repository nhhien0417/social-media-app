import React, { useMemo, useState, useCallback } from 'react'
import { KeyboardAvoidingView, Platform } from 'react-native'
import { ScrollView, YStack } from 'tamagui'
import { useRouter, useLocalSearchParams, useFocusEffect } from 'expo-router'

import Header from './components/Header'
import PostPreview, {
  type MediaItem,
  type UserInfoData,
  type PrivacyOption,
} from './components/PostPreview'
import PostAction from './components/PostAction'
import MediaPicker from './components/MediaPicker'
import Camera from './components/Camera'
import DiscardChangesModal from './components/DiscardChanges'
import { createPostApi } from '@/api/api.post'
import { getUserId } from '@/utils/SecureStore'
import { usePostStatus } from '@/providers/PostStatusProvider'

export type CreateMode = 'post' | 'story'

export default function NewPostScreen() {
  const router = useRouter()
  const params = useLocalSearchParams<{ mode?: CreateMode }>()
  const { startPosting, finishPosting, failPosting } = usePostStatus()

  const [mode, setMode] = useState<CreateMode>('post')
  const [caption, setCaption] = useState('')
  const [media, setMedia] = useState<MediaItem[]>([])
  const [privacy, setPrivacy] = useState<PrivacyOption>('friends')
  const [showMediaPicker, setShowMediaPicker] = useState(false)
  const [showCamera, setShowCamera] = useState(false)
  const [showDiscardModal, setShowDiscardModal] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const user: UserInfoData = useMemo(
    () => ({
      id: 'me',
      name: 'Adewale Martins',
      avatarUrl: 'https://picsum.photos/id/237/200/200',
    }),
    []
  )

  useFocusEffect(
    useCallback(() => {
      setMedia([])
      setCaption('')
      setPrivacy('friends')
      setShowCamera(false)
      setShowMediaPicker(false)
      setShowDiscardModal(false)
      setMode((params.mode as CreateMode) || 'post')
    }, [params.mode])
  )

  const hasUnsavedChanges = useMemo(
    () => caption.trim().length > 0 || media.length > 0,
    [caption, media]
  )

  const canShare = useMemo(() => {
    const hasContent = caption.trim().length > 0 || media.length > 0
    if (mode === 'story') return media.length > 0
    return hasContent
  }, [caption, media, mode])

  const handleRemove = useCallback((id: string) => {
    setMedia(prev => prev.filter(m => m.id !== id))
  }, [])

  const handleAddMedia = useCallback(() => {
    setShowMediaPicker(true)
  }, [])

  const handleTakePhoto = useCallback(() => {
    setShowCamera(true)
  }, [])

  const handlePhotoCapture = useCallback(
    (media: {
      uri: string
      width?: number
      height?: number
      type: 'photo' | 'video'
      duration?: number
    }) => {
      const filename = media.uri.startsWith('data:')
        ? `photo-${Date.now()}.jpg`
        : media.uri.split('/').pop() || `photo-${Date.now()}.jpg`

      const mimeType = media.uri.startsWith('data:')
        ? media.uri.split(',')[0].split(':')[1].split(';')[0]
        : media.type === 'video'
          ? 'video/mp4'
          : 'image/jpeg'

      const newMedia: MediaItem = {
        id: `captured-${Date.now()}`,
        url: media.uri,
        type: media.type,
        duration: media.duration,
        fileName: filename,
        mimeType,
      }
      setMedia(prev => [...prev, newMedia])
      setShowCamera(false)
    },
    []
  )

  const handleMediaSelect = useCallback((assets: any[]) => {
    const newMedia: MediaItem[] = assets.map(asset => ({
      id: asset.id,
      url: asset.uri,
      type: asset.mediaType === 'video' ? 'video' : 'photo',
      duration: asset.duration,
      fileName: asset.fileName || asset.uri.split('/').pop() || 'file',
      mimeType:
        asset.mimeType ||
        (asset.mediaType === 'video' ? 'video/mp4' : 'image/jpeg'),
    }))
    setMedia(prev => [...prev, ...newMedia])
    setShowMediaPicker(false)
  }, [])

  const handleShare = useCallback(async () => {
    if (isSubmitting) return
    setIsSubmitting(true)

    const userId = await getUserId()
    if (!userId) {
      console.error('❌ User not found')
      setIsSubmitting(false)
      return
    }

    const firstMediaUrl = media.length > 0 ? media[0].url : undefined
    startPosting(firstMediaUrl)

    const privacyMap: Record<PrivacyOption, 'PUBLIC' | 'PRIVATE' | 'FRIEND'> = {
      public: 'PUBLIC',
      friends: 'FRIEND',
      'only-me': 'PRIVATE',
    }

    const postData = {
      userId,
      content: caption.trim() || undefined,
      groupId: undefined,
      privacy: privacyMap[privacy],
      media:
        media.length > 0
          ? media.map(m => ({
              uri: m.url,
              name: m.fileName || m.url.split('/').pop() || 'file',
              type:
                m.mimeType || (m.type === 'video' ? 'video/mp4' : 'image/jpeg'),
            }))
          : undefined,
    }

    router.replace('/(tabs)')

    createPostApi(postData)
      .then(response => {
        console.log('✅ Post created successfully:', response)
        finishPosting()
        setIsSubmitting(false)
      })
      .catch(error => {
        console.error('❌ Error creating post:', error)
        const errorMessage =
          error?.message || 'Network error. Please check your connection.'
        failPosting(errorMessage)
        setIsSubmitting(false)
      })
  }, [
    caption,
    media,
    privacy,
    isSubmitting,
    router,
    startPosting,
    finishPosting,
    failPosting,
  ])

  const navigateBack = useCallback(() => {
    if (router.canGoBack()) {
      router.back()
    } else {
      router.replace('/(tabs)')
    }
  }, [router])

  const handleBack = useCallback(() => {
    if (hasUnsavedChanges) {
      setShowDiscardModal(true)
    } else {
      navigateBack()
    }
  }, [hasUnsavedChanges, navigateBack])

  const handleDiscard = useCallback(() => {
    setShowDiscardModal(false)
    navigateBack()
  }, [navigateBack])

  const handleCancelDiscard = useCallback(() => {
    setShowDiscardModal(false)
  }, [])

  return (
    <YStack flex={1} backgroundColor="$background">
      <Header
        mode={mode}
        onChangeMode={setMode}
        onBack={handleBack}
        onShare={handleShare}
        canShare={canShare}
        isSubmitting={isSubmitting}
      />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.select({
          ios: 'padding',
          android: 'height',
        })}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 55 : 0}
      >
        <ScrollView flex={1} showsVerticalScrollIndicator={false}>
          <PostPreview
            user={user}
            caption={caption}
            onChangeCaption={setCaption}
            media={media}
            onRemoveMedia={handleRemove}
            privacy={privacy}
            onChangePrivacy={setPrivacy}
            showCaption={mode === 'post'}
          />
        </ScrollView>

        <PostAction onAddMedia={handleAddMedia} onTakePhoto={handleTakePhoto} />
      </KeyboardAvoidingView>

      <MediaPicker
        visible={showMediaPicker}
        onClose={() => setShowMediaPicker(false)}
        onSelect={handleMediaSelect}
        maxSelection={10}
      />

      <Camera
        visible={showCamera}
        onClose={() => setShowCamera(false)}
        onCapture={handlePhotoCapture}
      />

      <DiscardChangesModal
        visible={showDiscardModal}
        onDiscard={handleDiscard}
        onCancel={handleCancelDiscard}
      />
    </YStack>
  )
}
