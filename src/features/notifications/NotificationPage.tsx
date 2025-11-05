import { useState, useEffect } from 'react'
import { YStack, XStack, Text, Button, ScrollView, Theme, Sheet } from 'tamagui'
import { useAppTheme } from '@/providers/ThemeProvider'
import { notifications } from '@/mock/notifications'
import Avatar from '@/components/Avatar'
import { MoreVertical } from '@tamagui/lucide-icons'

export default function NotificationScreen() {
  const { theme } = useAppTheme()
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [isScrollable, setIsScrollable] = useState(false)

  const [layoutHeight, setLayoutHeight] = useState(0)
  const [contentHeight, setContentHeight] = useState(0)

  const grouped = notifications.reduce(
    (acc, item) => {
      if (!acc[item.section]) acc[item.section] = []
      acc[item.section].push(item)
      return acc
    },
    {} as Record<string, typeof notifications>
  )

  const handleMarkAllRead = () => {
    console.log('✅ All notifications marked as read')
    setIsSheetOpen(false)
  }

  useEffect(() => {
    if (layoutHeight > 0 && contentHeight > 0) {
      setIsScrollable(contentHeight > layoutHeight + 10)
    }
  }, [layoutHeight, contentHeight])

  return (
    <YStack flex={1} backgroundColor="$background">
      {/* --- TOP BAR --- */}
      <XStack
        width="100%"
        alignItems="center"
        justifyContent="space-between"
        paddingHorizontal="$4"
        paddingTop="$6"
        marginBottom="$3"
      >
        <Text fontSize="$7" fontWeight="700" color="$color">
          Notifications
        </Text>

        <Button
          size="$3"
          chromeless
          onPress={() => setIsSheetOpen(true)}
          color="$color"
          icon={<MoreVertical size={24} />}
        />
      </XStack>

      {/* --- CONTENT --- */}
      <ScrollView
        backgroundColor="$background"
        showsVerticalScrollIndicator={false}
        onLayout={e => setLayoutHeight(e.nativeEvent.layout.height)}
        onContentSizeChange={(w, h) => setContentHeight(h)}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingBottom: 24,
        }}
      >
        {Object.entries(grouped).map(([section, items]) => (
          <YStack key={section} marginBottom="$4">
            <Text
              color="$color"
              fontWeight="700"
              fontSize="$5"
              marginBottom="$2"
            >
              {section}
            </Text>

            {items.map(item => (
              <YStack
                key={item.id}
                backgroundColor={
                  item.unread ? '$backgroundPress' : '$background'
                }
                borderRadius="$4"
                padding="$3"
                marginBottom="$2"
              >
                <XStack alignItems="center" gap="$3">
                  <Avatar uri={item.avatar} size={60} />
                  <YStack flex={1}>
                    <Text color="$color" fontSize="$4">
                      {item.message}
                    </Text>
                    <Text color="$gray8" fontSize="$3" marginTop={2}>
                      {item.time}
                    </Text>
                  </YStack>
                  <MoreVertical size={20} color={888} />
                </XStack>

                {item.actions && (
                  <XStack gap="$2" marginTop="$3">
                    {item.actions.map((action, idx) => (
                      <Button
                        key={idx}
                        flex={1}
                        theme={
                          action.type === 'primary' ? 'primary' : undefined
                        }
                        {...(action.type === 'primary'
                          ? {}
                          : { variant: 'outlined' })}
                        borderRadius="$6"
                      >
                        {action.label}
                      </Button>
                    ))}
                  </XStack>
                )}
              </YStack>
            ))}
          </YStack>
        ))}

        {isScrollable && (
          <YStack alignItems="center" marginTop="$4" marginBottom="$8">
            <Button
              variant="outlined"
              borderRadius="$6"
              color="$gray9"
              size="$4"
            >
              See previous notifications
            </Button>
          </YStack>
        )}
      </ScrollView>

      {/* --- BOTTOM SHEET --- */}
      <Sheet
        open={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        modal
        snapPointsMode="fit"
        dismissOnSnapToBottom
        animation="quick"
      >
        <Sheet.Overlay
          backgroundColor="$shadow6"
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
        />
        <Sheet.Handle backgroundColor="$gray6" />
        <Sheet.Frame
          backgroundColor="$background"
          borderTopLeftRadius="$6"
          borderTopRightRadius="$6"
          padding="$4"
          alignItems="center"
          justifyContent="center"
          gap="$4"
        >
          <Button
            size="$5"
            theme="primary"
            borderRadius="$6"
            onPress={handleMarkAllRead}
            width="100%"
          >
            Mark all as read
          </Button>

          <Button
            variant="outlined"
            borderRadius="$6"
            color="$gray9"
            onPress={() => setIsSheetOpen(false)}
            width="100%"
          >
            Cancel
          </Button>
        </Sheet.Frame>
      </Sheet>
    </YStack>
  )
}
