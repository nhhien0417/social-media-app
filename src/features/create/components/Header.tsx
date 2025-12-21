import React from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'
import { XStack, YStack, Button, SizableText } from 'tamagui'
import { ChevronLeft } from '@tamagui/lucide-icons'
import IconButton from '@/components/IconButton'
import { PostType } from '@/types/Post'
import { useAppColors } from '@/theme'

type Props = {
  mode: PostType
  canShare?: boolean
  isSubmitting?: boolean
  isEditMode?: boolean
  groupName?: string
  onBack?: () => void
  onShare?: () => void
  onChangeMode?: (mode: PostType) => void
}

export default function Header({
  mode,
  canShare = true,
  isSubmitting = false,
  isEditMode = false,
  groupName,
  onBack,
  onShare,
  onChangeMode,
}: Props) {
  const isPost = mode === 'POST'
  const colors = useAppColors()
  const segmentControl = colors.components.segmentControl

  return (
    <>
      <XStack
        paddingHorizontal="$2.5"
        paddingVertical="$2"
        alignItems="center"
        justifyContent="space-between"
        borderBottomWidth={StyleSheet.hairlineWidth}
        borderColor="$borderColor"
        backgroundColor="$background"
        gap="$2"
        minHeight={50}
      >
        <IconButton Icon={ChevronLeft} onPress={onBack} Size={28} />

        {groupName || isEditMode ? (
          <YStack flex={1} alignItems="center" justifyContent="center">
            <SizableText size="$5" fontWeight="700" color="$color">
              {isEditMode
                ? `Update ${mode === 'STORY' ? 'Story' : 'Post'}`
                : 'Create Post'}
            </SizableText>
          </YStack>
        ) : (
          <XStack flex={1} alignItems="center" justifyContent="center">
            <XStack
              alignItems="center"
              backgroundColor={segmentControl.background}
              borderRadius={999}
              paddingVertical={4}
              paddingHorizontal={6}
            >
              <XStack
                borderRadius={999}
                overflow="hidden"
                backgroundColor="transparent"
                borderWidth={StyleSheet.hairlineWidth}
                borderColor={segmentControl.border}
                width={160}
              >
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => onChangeMode?.('POST')}
                  style={{ flex: 1 }}
                >
                  <XStack
                    flex={1}
                    paddingVertical={5}
                    paddingHorizontal={12}
                    borderRadius={999}
                    backgroundColor={
                      isPost ? segmentControl.activeBackground : 'transparent'
                    }
                    alignItems="center"
                    justifyContent="center"
                  >
                    <SizableText
                      size="$4"
                      fontWeight="700"
                      color={isPost ? segmentControl.activeText : segmentControl.inactiveText}
                    >
                      Post
                    </SizableText>
                  </XStack>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => onChangeMode?.('STORY')}
                  style={{ flex: 1 }}
                >
                  <XStack
                    flex={1}
                    paddingVertical={5}
                    paddingHorizontal={12}
                    borderRadius={999}
                    backgroundColor={
                      !isPost ? segmentControl.activeBackground : 'transparent'
                    }
                    alignItems="center"
                    justifyContent="center"
                  >
                    <SizableText
                      size="$4"
                      fontWeight="700"
                      color={!isPost ? segmentControl.activeText : segmentControl.inactiveText}
                    >
                      Story
                    </SizableText>
                  </XStack>
                </TouchableOpacity>
              </XStack>
            </XStack>
          </XStack>
        )}

        <Button
          size="$3"
          disabled={!canShare || isSubmitting}
          onPress={onShare}
          borderRadius={18}
          backgroundColor={colors.accent}
          paddingHorizontal="$3"
          paddingVertical="$2"
          opacity={!canShare || isSubmitting ? 0.5 : 1}
          height={36}
        >
          <SizableText size="$5" fontWeight="700" color="white">
            Post
          </SizableText>
        </Button>
      </XStack>
    </>
  )
}
