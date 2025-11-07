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

export default function NewPostScreen() {
  const router = useRouter()
  const [mode, setMode] = useState<CreateMode>('post')
  const [caption, setCaption] = useState('')
  const [media, setMedia] = useState<MediaItem[]>([
    { id: '1', url: 'https://picsum.photos/id/102/200/200' },
    { id: '2', url: 'https://picsum.photos/id/192/200/200' },
    { id: '3', url: 'https://picsum.photos/id/103/200/200' },
  ])
  const [privacy, setPrivacy] = useState<PrivacyOption>('public')

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
    setMedia(prev => [
      ...prev,
      {
        id: String(Date.now()),
        url: `https://picsum.photos/seed/${prev.length + 10}/200/200`,
      },
    ])
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

        <PostAction onAddMedia={handleAddMedia} />
      </KeyboardAvoidingView>
    </YStack>
  )
}

const styles = StyleSheet.create({
  keyboardAvoiding: {
    flex: 1,
  },
})
