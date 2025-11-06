import React, { useState, useMemo } from 'react'
import {} from 'react-native'
import {
  YStack,
  XStack,
  Button,
  Text,
  Image,
  TextArea,
  SizableText,
  ScrollView,
} from 'tamagui'
import { Trash2, Users, Music, MapPin } from '@tamagui/lucide-icons'
// Import type từ file types.ts (chú ý đường dẫn '../')
import { MediaAsset } from '../CreateScreen'

type CreateDetailsProps = {
  selectedMedia: MediaAsset[]
  onRemoveMedia: () => void // Hàm này sẽ xóa hết media
  caption: string
  onCaptionChange: (caption: string) => void
}

export default function Details({
  selectedMedia,
  onRemoveMedia,
  caption,
  onCaptionChange,
}: CreateDetailsProps) {
  const [activeTab, setActiveTab] = useState('description')

  // Ảnh preview (luôn là ảnh đầu tiên)
  const previewImage = useMemo(() => {
    return selectedMedia.length > 0 ? selectedMedia[0] : null
  }, [selectedMedia])

  return (
    <ScrollView flex={1} backgroundColor="$backgroundPress">
      <YStack padding="$4" gap="$4">
        {/* 1. Preview */}
        <YStack
          height={300}
          backgroundColor="$background"
          borderRadius="$4"
          overflow="hidden"
          alignItems="center"
          justifyContent="center"
        >
          {previewImage ? (
            <Image
              source={{ uri: previewImage.uri }}
              style={{ width: '100%', height: '100%' }}
              resizeMode="contain"
            />
          ) : (
            <Text color="$gray8">No image selected</Text>
          )}
          <Button
            icon={Trash2}
            theme="red"
            circular
            position="absolute"
            top="$3"
            right="$3"
            onPress={onRemoveMedia} // Gọi hàm xóa
          />
        </YStack>

        {/* 2. Tabs tùy chọn */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <XStack gap="$2">
            <Button
              theme={activeTab === 'description' ? 'primary' : 'gray'}
              variant={activeTab !== 'description' ? 'outlined' : undefined}
              onPress={() => setActiveTab('description')}
            >
              Description
            </Button>
            <Button
              theme={activeTab === 'audience' ? 'primary' : 'gray'}
              variant={activeTab !== 'audience' ? 'outlined' : undefined}
              onPress={() => setActiveTab('audience')}
              icon={Users}
            >
              Audience
            </Button>
            <Button
              theme={activeTab === 'music' ? 'primary' : 'gray'}
              variant={activeTab !== 'music' ? 'outlined' : undefined}
              onPress={() => setActiveTab('music')}
              icon={Music}
            >
              Add music
            </Button>
            <Button
              theme={activeTab === 'location' ? 'primary' : 'gray'}
              variant={activeTab !== 'location' ? 'outlined' : undefined}
              onPress={() => setActiveTab('location')}
              icon={MapPin}
            >
              Add location
            </Button>
          </XStack>
        </ScrollView>

        {/* 3. Nội dung Description (Caption) */}
        <YStack>
          <SizableText size="$6" fontWeight="bold" marginBottom="$2">
            My New Setup 2024
          </SizableText>
          <TextArea
            value={caption}
            onChangeText={onCaptionChange}
            placeholder="Excited to share my new workspace..."
            minHeight={120}
            backgroundColor="$background"
            borderColor="$borderColor"
            placeholderTextColor="$placeholderColor"
          />
        </YStack>
      </YStack>
    </ScrollView>
  )
}
