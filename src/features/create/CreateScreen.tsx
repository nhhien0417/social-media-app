import React, { useMemo, useState, useCallback } from 'react'
import { KeyboardAvoidingView, Platform, StyleSheet } from 'react-native'
import { ScrollView, YStack } from 'tamagui'
import { useRouter } from 'expo-router'
import Header, { type CreateMode } from './components/Header'
import PostPreview, {
  type MediaItem,
  type UserInfoData,
  type PrivacyOption,
} from './components/PostPreview'
import PostAction from './components/PostAction'
import MediaPicker from './components/MediaPicker'
import Camera from './components/Camera'

export default function NewPostScreen() {
  const router = useRouter()
  const [mode, setMode] = useState<CreateMode>('post')
  const [caption, setCaption] = useState('')
  const [media, setMedia] = useState<MediaItem[]>([])
  const [privacy, setPrivacy] = useState<PrivacyOption>('friends')
  const [showMediaPicker, setShowMediaPicker] = useState(false)
  const [showCamera, setShowCamera] = useState(false)

  const user: UserInfoData = useMemo(
    () => ({
      id: 'me',
      name: 'Adewale Martins',
      avatarUrl: 'https://picsum.photos/id/237/200/200',
    }),
    []
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
    (photo: { uri: string; width: number; height: number }) => {
      const newMedia: MediaItem = {
        id: `captured-${Date.now()}`,
        url: photo.uri,
        type: 'photo',
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
    }))
    setMedia(prev => [...prev, ...newMedia])
    setShowMediaPicker(false)
  }, [])

  const handleShare = useCallback(() => {
    console.log('Share post', { caption, mediaCount: media.length })
  }, [caption, media.length])

  return (
    <YStack flex={1} backgroundColor="$background">
      <Header
        mode={mode}
        onChangeMode={setMode}
        onBack={() => router.back()}
        onShare={handleShare}
        canShare={canShare}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoiding}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
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
    </YStack>
  )
}

const styles = StyleSheet.create({
  keyboardAvoiding: {
    flex: 1,
  },
})
