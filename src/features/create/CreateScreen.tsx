import React, { useMemo, useState, useCallback } from 'react'
import { KeyboardAvoidingView, Platform } from 'react-native'
import { ScrollView, YStack } from 'tamagui'
import { useRouter, useLocalSearchParams, useFocusEffect } from 'expo-router'

import Header from './components/Header'
import PostPreview, {
  type MediaItem,
  type UserInfoData,
} from './components/PostPreview'
import PostAction from './components/PostAction'
import MediaPicker from '../../components/MediaPicker'
import Camera from '../../components/Camera'
import DiscardChangesModal from './components/DiscardChanges'
import { usePostStore } from '@/stores/postStore'
import { usePostStatus } from '@/providers/PostStatusProvider'
import { PostPrivacy, PostType } from '@/types/Post'
import { useCurrentUser } from '@/hooks/useProfile'
import {
  processMediaForUpload,
  getMediaItemFromCamera,
  getMediaItemsFromPicker,
} from '@/utils/MediaUtils'

export default function NewPostScreen() {
  const router = useRouter()
  const params = useLocalSearchParams<{
    mode?: PostType
    editPostId?: string
    groupId?: string
    groupName?: string
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

  const [mode, setMode] = useState<PostType>('POST')
  const [caption, setCaption] = useState('')
  const [media, setMedia] = useState<MediaItem[]>([])
  const [privacy, setPrivacy] = useState<PostPrivacy>('FRIENDS')
  const [showMediaPicker, setShowMediaPicker] = useState(false)
  const [showCamera, setShowCamera] = useState(false)
  const [showDiscardModal, setShowDiscardModal] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [groupName, setGroupName] = useState<string | undefined>(
    params.groupName || (params.groupId ? 'Group' : undefined)
  )

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

              setPrivacy(post.privacy)

              if (post.groupId && !groupName) {
                setGroupName('Group')
              }
            }
          } catch (error) {
            console.error('Failed to load post:', error)
          }
        } else {
          setMedia([])
          setCaption('')
          setPrivacy('FRIENDS')
        }
        setShowCamera(false)
        setShowMediaPicker(false)
        setShowDiscardModal(false)
        setMode(groupName ? 'POST' : params.mode || 'POST')
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
    if (mode === 'STORY') return media.length > 0
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
      const newMedia = getMediaItemFromCamera(media)
      const mediaItem = {
        ...newMedia,
        id: `captured-${Date.now()}`,
        url: newMedia.uri,
        type: newMedia.type as 'photo' | 'video',
      }

      if (mode === 'STORY') {
        setMedia([mediaItem])
      } else {
        setMedia(prev => [...prev, mediaItem])
      }
      setShowCamera(false)
    },
    [mode]
  )

  const handleMediaSelect = useCallback(
    (assets: any[]) => {
      const newMediaItems = getMediaItemsFromPicker(assets)
      const newMediaWithIds = newMediaItems.map(item => ({
        ...item,
        id: item.uri,
        url: item.uri,
        type: (item.type === 'video' ? 'video' : 'photo') as 'photo' | 'video',
      }))

      if (mode === 'STORY') {
        setMedia(newMediaWithIds.slice(0, 1))
      } else {
        setMedia(prev => [...prev, ...newMediaWithIds])
      }
      setShowMediaPicker(false)
    },
    [mode]
  )

  const handleShare = useCallback(async () => {
    if (isSubmitting) return
    setIsSubmitting(true)

    if (!currentUser?.id) {
      console.error('User not found')
      setIsSubmitting(false)
      return
    }

    const firstMediaUrl = media.length > 0 ? media[0].url : undefined

    if (isEditMode && editPostId) {
      startUpdating(firstMediaUrl, mode)

      const mediaData = await processMediaForUpload(
        media.map(m => ({ ...m, uri: m.url }))
      )

      const updateData = {
        postId: editPostId,
        content: mode === 'STORY' ? undefined : caption.trim() || undefined,
        privacy: groupName ? 'PUBLIC' : privacy,
        media: mediaData.length > 0 ? mediaData : undefined,
      }

      router.replace('/(tabs)')

      updatePost(updateData)
        .then(() => {
          if (mode === 'STORY') {
            usePostStore.getState().refreshStories()
          } else {
            usePostStore.getState().refreshPosts()
          }
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
      startPosting(firstMediaUrl, mode)

      const postData = {
        userId: currentUser.id,
        content: caption.trim() || undefined,
        groupId: params.groupId || undefined,
        privacy: groupName ? 'PUBLIC' : privacy,
        type: mode,
        media:
          media.length > 0
            ? await processMediaForUpload(
                media.map(m => ({ ...m, uri: m.url }))
              )
            : undefined,
      }

      router.replace('/(tabs)')

      createPost(postData)
        .then(() => {
          if (mode === 'STORY') {
            usePostStore.getState().refreshStories()
          } else {
            usePostStore.getState().refreshPosts()
          }
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
        onChangeMode={groupName ? undefined : setMode}
        groupName={groupName}
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
            onChangePrivacy={groupName ? () => {} : setPrivacy}
            showCaption={mode === 'POST'}
            groupName={groupName}
          />
        </ScrollView>

        <PostAction onAddMedia={handleAddMedia} onTakePhoto={handleTakePhoto} />
      </KeyboardAvoidingView>

      <MediaPicker
        visible={showMediaPicker}
        onClose={() => setShowMediaPicker(false)}
        onSelect={handleMediaSelect}
        maxSelection={mode === 'STORY' ? 1 : 10}
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
