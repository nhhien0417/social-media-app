import React, { useState, useEffect, useMemo } from 'react'
import { FlatList, Dimensions, Pressable } from 'react-native'
import {
  YStack,
  XStack,
  Button,
  Image,
  SizableText,
  useTheme,
  Text,
} from 'tamagui'
import { Image as ImageIcon, Camera, Check } from '@tamagui/lucide-icons'
import * as MediaLibrary from 'expo-media-library'
// Import type từ file types.ts (chú ý đường dẫn '../')
import { CreateMode, MediaAsset } from '../CreateScreen'

const { width: screenWidth } = Dimensions.get('window')
const numColumns = 3
const itemSize = screenWidth / numColumns

type CreateGalleryProps = {
  mode: CreateMode
  selectedMedia: MediaAsset[]
  onSelectMedia: (media: MediaAsset[]) => void
}

/**
 * Component hiển thị 1 ảnh trong lưới
 */
function MediaGridItem({
  item,
  isSelected,
  onSelect,
}: {
  item: MediaAsset
  isSelected: boolean
  onSelect: () => void
}) {
  return (
    <Pressable onPress={onSelect}>
      <YStack>
        <Image
          source={{ uri: item.uri }}
          width={itemSize}
          height={itemSize}
          opacity={isSelected ? 0.7 : 1}
        />
        {isSelected && (
          // Thay thế 'Badge' bằng 'YStack'
          <YStack
            position="absolute"
            top="$2"
            right="$2"
            backgroundColor="$primary"
            alignItems="center"
            justifyContent="center"
            borderColor="$background"
            borderWidth={2}
          >
            <Check size={12} color="white" />
          </YStack>
        )}
      </YStack>
    </Pressable>
  )
}

/**
 * Component chính cho bước chọn Gallery
 */
export default function Gallery({
  mode,
  selectedMedia,
  onSelectMedia,
}: CreateGalleryProps) {
  const theme = useTheme()
  const [media, setMedia] = useState<MediaAsset[]>([])
  const [permissionResponse, requestPermission] = MediaLibrary.usePermissions()

  // Logic xin quyền và tải ảnh
  useEffect(() => {
    async function checkPermission() {
      if (
        !permissionResponse ||
        (permissionResponse.status !== 'granted' &&
          permissionResponse.canAskAgain)
      ) {
        await requestPermission()
      } else if (permissionResponse.status === 'granted') {
        loadMedia()
      }
    }
    checkPermission()
  }, [permissionResponse])

  async function loadMedia() {
    try {
      const result = await MediaLibrary.getAssetsAsync({
        first: 50,
        mediaType: [MediaLibrary.MediaType.photo, MediaLibrary.MediaType.video],
        sortBy: [MediaLibrary.SortBy.creationTime],
      })
      setMedia(result.assets)
      // Tự động chọn ảnh đầu tiên khi tải xong
      if (result.assets.length > 0) {
        onSelectMedia([result.assets[0]])
      }
    } catch (e) {
      console.error('Failed to load media:', e)
    }
  }

  // Logic chọn ảnh (đa chọn cho Post, đơn chọn cho Story)
  const handleSelectMedia = (item: MediaAsset) => {
    if (mode === 'story') {
      onSelectMedia([item])
      return
    }
    const isAlreadySelected = selectedMedia.find(m => m.id === item.id)
    if (isAlreadySelected) {
      onSelectMedia(selectedMedia.filter(m => m.id !== item.id))
    } else {
      onSelectMedia([item, ...selectedMedia]) // Thêm vào đầu danh sách
    }
  }

  // Ảnh preview (luôn là ảnh đầu tiên trong danh sách chọn)
  const previewImage = useMemo(() => {
    return selectedMedia.length > 0 ? selectedMedia[0] : null
  }, [selectedMedia])

  return (
    <YStack flex={1}>
      {/* 1. Preview */}
      <YStack
        height={300}
        backgroundColor="$backgroundPress"
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
          <ImageIcon size={60} color="$gray8" />
        )}

        {/* Thay thế 'Badge' đếm số bằng 'YStack' + 'Text' */}
        {selectedMedia.length > 1 && (
          <YStack
            position="absolute"
            top="$4"
            right="$4"
            minWidth={30}
            height={30}
            paddingHorizontal="$1.5"
            backgroundColor="$primary"
            alignItems="center"
            justifyContent="center"
            borderColor="$background"
            borderWidth={2}
          >
            <Text fontSize="$3" color="white" fontWeight="bold">
              {selectedMedia.length}
            </Text>
          </YStack>
        )}
      </YStack>

      {/* 2. Gallery Header */}
      <XStack
        paddingHorizontal="$4"
        paddingVertical="$3"
        justifyContent="space-between"
        alignItems="center"
      >
        <SizableText size="$5" fontWeight="bold">
          Recent
        </SizableText>
        <XStack space="$3">
          <Button
            icon={
              <ImageIcon size={20} color={theme?.primary?.val ?? '#3797EF'} />
            }
            backgroundColor="$backgroundPress"
            circular
          />
          <Button icon={<Camera size={20} />} chromeless />
        </XStack>
      </XStack>

      {/* 3. Gallery Grid */}
      <FlatList
        data={media}
        numColumns={numColumns}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <MediaGridItem
            item={item}
            isSelected={!!selectedMedia.find(m => m.id === item.id)}
            onSelect={() => handleSelectMedia(item)}
          />
        )}
      />
    </YStack>
  )
}
