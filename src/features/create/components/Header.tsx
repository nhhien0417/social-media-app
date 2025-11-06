import React from 'react'
import { ArrowLeft, ChevronDown, Check } from '@tamagui/lucide-icons'
import { Button, XStack, Select, YStack } from 'tamagui'
import { CreateMode } from '../CreateScreen'

type CreateHeaderProps = {
  mode: CreateMode
  onModeChange: (mode: CreateMode) => void
  onBack: () => void
}

export default function Header({
  mode,
  onModeChange,
  onBack,
}: CreateHeaderProps) {
  const [open, setOpen] = React.useState(false)

  const suppressOpenRef = React.useRef(false)
  const suppressOnce = () => {
    suppressOpenRef.current = true
    setTimeout(() => {
      suppressOpenRef.current = false
    }, 200)
  }

  const handleChange = (v: string) => {
    onModeChange(v as CreateMode)
    setOpen(false)
    suppressOnce()
  }

  const handleOpenChange = (next: boolean) => {
    if (next && suppressOpenRef.current) {
      return
    }
    setOpen(next)
  }

  return (
    <XStack
      paddingHorizontal="$4"
      paddingVertical="$3"
      alignItems="center"
      justifyContent="space-between"
      borderBottomWidth={1}
      borderColor="$borderColor"
      backgroundColor="$background"
    >
      <Button
        icon={ArrowLeft}
        onPress={onBack}
        circular
        backgroundColor="$background"
        borderColor="$borderColor"
        borderWidth={1}
        size="$3"
        pressStyle={{ backgroundColor: '$backgroundPress' }}
      />

      <Select
        value={mode}
        onValueChange={handleChange}
        open={open}
        onOpenChange={handleOpenChange}
        disablePreventBodyScroll
      >
        <Select.Trigger
          pointerEvents={open ? 'none' : 'auto'}
          width={110}
          iconAfter={ChevronDown}
          backgroundColor="$background"
          borderColor="$borderColor"
          borderWidth={1}
          borderRadius={20}
          paddingVertical="$2"
        >
          <Select.Value size="$5" fontWeight="700" />
        </Select.Trigger>

        <Select.Content zIndex={1000}>
          <Select.Viewport borderWidth={1} borderRadius={20}>
            <Select.Group>
              <Select.Item index={0} value="post">
                <Select.ItemText size="$5" fontWeight="600">
                  Post
                </Select.ItemText>
                <Select.ItemIndicator marginLeft="auto">
                  <Check size={16} />
                </Select.ItemIndicator>
              </Select.Item>

              <Select.Item index={1} value="story">
                <Select.ItemText size="$5" fontWeight="600">
                  Story
                </Select.ItemText>
                <Select.ItemIndicator marginLeft="auto">
                  <Check size={16} />
                </Select.ItemIndicator>
              </Select.Item>
            </Select.Group>
          </Select.Viewport>
        </Select.Content>
      </Select>

      <YStack width={35} />
    </XStack>
  )
}
