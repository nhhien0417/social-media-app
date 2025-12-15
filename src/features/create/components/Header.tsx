import React from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'
import { XStack, YStack, Button, SizableText, useThemeName } from 'tamagui'
import { ChevronLeft } from '@tamagui/lucide-icons'
import IconButton from '@/components/IconButton'
import { PostType } from '@/types/Post'

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
  const themeName = useThemeName()
  const isDark = themeName === 'dark'
  const accentColor = isDark ? '#0095F6' : '#1877F2'
  const segmentBackground = isDark ? 'rgba(255,255,255,0.06)' : '#e2e8f0'
  const segmentActiveBackground = isDark ? 'rgba(0,149,246,0.24)' : accentColor
  const segmentInactiveText = isDark ? 'rgba(226,232,240,0.86)' : '#1f2937'

  return (
    <>
      <XStack
        paddingHorizontal="$3"
        paddingVertical="$3"
        alignItems="center"
        justifyContent="space-between"
        borderBottomWidth={StyleSheet.hairlineWidth}
        borderColor="$borderColor"
        backgroundColor="$background"
        gap="$3"
      >
        <IconButton Icon={ChevronLeft} onPress={onBack} Size={30} />

        {groupName || isEditMode ? (
          <YStack flex={1} alignItems="center" justifyContent="center">
            <SizableText size="$6" fontWeight="700" color="$color">
              {isEditMode
                ? `Update ${mode === 'STORY' ? 'Story' : 'Post'}`
                : 'Create Post'}
            </SizableText>
          </YStack>
        ) : (
          <XStack flex={1} alignItems="center" justifyContent="center">
            <XStack
              alignItems="center"
              backgroundColor={segmentBackground}
              borderRadius={999}
              paddingVertical={6}
              paddingHorizontal={8}
            >
              <XStack
                borderRadius={999}
                overflow="hidden"
                backgroundColor="transparent"
                borderWidth={StyleSheet.hairlineWidth}
                borderColor="rgba(148,163,184,0.35)"
                width={180}
              >
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => onChangeMode?.('POST')}
                  style={{ flex: 1 }}
                >
                  <XStack
                    flex={1}
                    paddingVertical={6}
                    paddingHorizontal={16}
                    borderRadius={999}
                    backgroundColor={
                      isPost ? segmentActiveBackground : 'transparent'
                    }
                    alignItems="center"
                    justifyContent="center"
                  >
                    <SizableText
                      size="$5"
                      fontWeight="700"
                      color={isPost ? '#ffffff' : segmentInactiveText}
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
                    paddingVertical={6}
                    paddingHorizontal={16}
                    borderRadius={999}
                    backgroundColor={
                      !isPost ? segmentActiveBackground : 'transparent'
                    }
                    alignItems="center"
                    justifyContent="center"
                  >
                    <SizableText
                      size="$5"
                      fontWeight="700"
                      color={!isPost ? '#ffffff' : segmentInactiveText}
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
          size="$4"
          disabled={!canShare || isSubmitting}
          onPress={onShare}
          borderRadius={20}
          backgroundColor="#0095F6"
          paddingHorizontal="$4"
          opacity={!canShare || isSubmitting ? 0.5 : 1}
        >
          <SizableText size="$6" fontWeight="700" color="white">
            Post
          </SizableText>
        </Button>
      </XStack>
    </>
  )
}
