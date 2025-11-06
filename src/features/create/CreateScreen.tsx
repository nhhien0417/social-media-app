import React, { useState } from 'react'
import { YStack } from 'tamagui'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'

import * as MediaLibrary from 'expo-media-library'

import Header from '@/features/create/components/Header'
import Gallery from '@/features/create/components/Gallery'
import Details from '@/features/create/components/Details'
import Footer from '@/features/create/components/Footer'

export type CreateMode = 'post' | 'story'
export type CreateStep = 'gallery' | 'details'
export type MediaAsset = MediaLibrary.Asset

export default function CreateScreen() {
  const insets = useSafeAreaInsets()
  const router = useRouter()

  const [mode, setMode] = useState<CreateMode>('post')
  const [step, setStep] = useState<CreateStep>('gallery')
  const [selectedMedia, setSelectedMedia] = useState<MediaAsset[]>([])
  const [caption, setCaption] = useState('')

  const handleBack = () => {
    if (step === 'details') {
      setStep('gallery')
    } else {
      router.back()
    }
  }

  const handleNext = () => {
    setStep('details')
  }

  const handlePost = () => {
    console.log('Posting:', {
      mode: mode,
      media: selectedMedia.map(m => m.uri),
      caption: caption,
    })
    router.back()
  }

  return (
    <YStack flex={1} paddingTop={insets.top} backgroundColor="$background">
      <Header mode={mode} onModeChange={setMode} onBack={handleBack} />

      <YStack flex={1}>
        {step === 'gallery' && (
          <Gallery
            mode={mode}
            selectedMedia={selectedMedia}
            onSelectMedia={setSelectedMedia}
          />
        )}
        {step === 'details' && (
          <Details
            selectedMedia={selectedMedia}
            onRemoveMedia={() => setSelectedMedia([])}
            caption={caption}
            onCaptionChange={setCaption}
          />
        )}
      </YStack>

      <Footer
        step={step}
        onNext={handleNext}
        onPost={handlePost}
        isNextDisabled={selectedMedia.length === 0}
      />
    </YStack>
  )
}
