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
import { usePostStore } from '@/stores/postStore'
import { usePostStatus } from '@/providers/PostStatusProvider'
import { PostPrivacy } from '@/types/Post'
import { useCurrentUser } from '@/hooks/useProfile'

export type CreateMode = 'post' | 'story'

export default function NewPostScreen() {
  const router = useRouter()
  const params = useLocalSearchParams<{
    mode?: CreateMode
    editPostId?: string
  }>()
  const {
    startPosting,
    finishPosting,
    failPosting,
    startUpdating,
    finishUpdating,
    failUpdating,
  } = usePostStatus()
  const currentUser = useCurrentUser()
  const createPost = usePostStore(state => state.createPost)
  const updatePost = usePostStore(state => state.updatePost)
  const getPostDetail = usePostStore(state => state.getPostDetail)

  const editPostId = params.editPostId
  const isEditMode = !!editPostId

  const [mode, setMode] = useState<CreateMode>('post')
  const [caption, setCaption] = useState('')
  const [media, setMedia] = useState<MediaItem[]>([])
  const [privacy, setPrivacy] = useState<PrivacyOption>('friends')
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

  useFocusEffect(
    useCallback(() => {
      const loadPostData = async () => {
        if (isEditMode && editPostId) {
          try {
            await getPostDetail(editPostId)
            const post = usePostStore.getState().currentPost

            if (post) {
              setCaption(post.content || '')

              if (post.media && post.media.length > 0) {
                try {
                  const mediaBlobs = await Promise.all(
                    post.media.map(async (url, index) => {
                      try {
                        const response = await fetch(url)
                        if (!response.ok) throw new Error('Download failed')

                        const blob = await response.blob()
                        const fileName =
                          url.split('/').pop() || `media-${index}.jpg`

                        const objectUrl = URL.createObjectURL(blob)

                        return {
                          id: `media-${index}`,
                          url: objectUrl,
                          type: 'photo' as const,
                          fileName: fileName,
                          mimeType: blob.type || 'image/jpeg',
                          blob: blob,
                        }
                      } catch (err) {
                        console.error('Failed to download media:', url, err)
                        return null
                      }
                    })
                  )

                  // Filter out failed downloads
                  const validMedia = mediaBlobs.filter(
                    (m): m is NonNullable<typeof m> => m !== null
                  )
                  setMedia(validMedia)
                } catch (error) {
                  console.error('Error loading media:', error)
                  setMedia([])
                }
              } else {
                setMedia([])
              }

              const privacyMap: Record<string, PrivacyOption> = {
                PUBLIC: 'public',
                FRIENDS: 'friends',
                PRIVATE: 'only-me',
              }
              setPrivacy(privacyMap[post.privacy] || 'friends')
            }
          } catch (error) {
            console.error('Failed to load post:', error)
          }
        } else {
          setMedia([])
          setCaption('')
          setPrivacy('friends')
        }
        setShowCamera(false)
        setShowMediaPicker(false)
        setShowDiscardModal(false)
        setMode((params.mode as CreateMode) || 'post')
      }

      loadPostData()
    }, [params.mode, isEditMode, editPostId, getPostDetail])
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

    if (!currentUser?.id) {
      console.error('User not found')
      setIsSubmitting(false)
      return
    }

    const firstMediaUrl = media.length > 0 ? media[0].url : undefined

    const privacyMap: Record<PrivacyOption, PostPrivacy> = {
      public: 'PUBLIC',
      friends: 'FRIENDS',
      'only-me': 'PRIVATE',
    }

    if (isEditMode && editPostId) {
      startUpdating(firstMediaUrl)

      const mediaPromises =
        media.length > 0
          ? media.map(m => {
              if (m.blob) {
                return new Promise<{ uri: string; name: string; type: string }>(
                  resolve => {
                    const reader = new FileReader()
                    reader.onloadend = () => {
                      resolve({
                        uri: reader.result as string,
                        name: m.fileName || 'image.jpg',
                        type: m.mimeType || 'image/jpeg',
                      })
                    }
                    reader.readAsDataURL(m.blob!)
                  }
                )
              } else {
                return Promise.resolve({
                  uri: m.url,
                  name: m.fileName || m.url.split('/').pop() || 'file',
                  type:
                    m.mimeType ||
                    (m.type === 'video' ? 'video/mp4' : 'image/jpeg'),
                })
              }
            })
          : []

      const mediaData = await Promise.all(mediaPromises)

      const updateData = {
        postId: editPostId,
        content: caption.trim() || undefined,
        privacy: privacyMap[privacy],
        media: mediaData.length > 0 ? mediaData : undefined,
      }

      router.replace('/(tabs)')

      updatePost(updateData)
        .then(response => {
          console.log('Post updated successfully:', response)
          usePostStore.getState().refreshFeed()
          finishUpdating()
          setIsSubmitting(false)
        })
        .catch(error => {
          console.error('Error updating post:', error)
          const errorMessage =
            error?.message || 'Failed to update post. Please try again.'
          failUpdating(errorMessage)
          setIsSubmitting(false)
        })
    } else {
      // Create new post
      startPosting(firstMediaUrl)

      const postData = {
        userId: currentUser.id,
        content: caption.trim() || undefined,
        groupId: undefined,
        privacy: privacyMap[privacy],
        media:
          media.length > 0
            ? media.map(m => ({
                uri: m.url,
                name: m.fileName || m.url.split('/').pop() || 'file',
                type:
                  m.mimeType ||
                  (m.type === 'video' ? 'video/mp4' : 'image/jpeg'),
              }))
            : undefined,
      }

      router.replace('/(tabs)')

      createPost(postData)
        .then(response => {
          console.log('Post created successfully:', response)
          usePostStore.getState().refreshFeed()
          finishPosting()
          setIsSubmitting(false)
        })
        .catch(error => {
          console.error('Error creating post:', error)
          const errorMessage =
            error?.message || 'Network error. Please check your connection.'
          failPosting(errorMessage)
          setIsSubmitting(false)
        })
    }
  }, [
    currentUser,
    caption,
    media,
    privacy,
    isSubmitting,
    router,
    isEditMode,
    editPostId,
    startPosting,
    finishPosting,
    failPosting,
    startUpdating,
    finishUpdating,
    failUpdating,
    createPost,
    updatePost,
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
        isEditMode={isEditMode}
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
