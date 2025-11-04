import {
  YStack,
  XStack,
  Text,
  Avatar,
  Button,
  ScrollView,
  Theme,
  Sheet,
} from 'tamagui'
import { useState } from 'react'
import { useAppTheme } from '@/providers/ThemeProvider'
import { notificationsData } from '@/mock/db'

export default function NotificationScreen() {
  const { theme } = useAppTheme()
  const [isSheetOpen, setIsSheetOpen] = useState(false)

  const grouped = notificationsData.reduce(
    (acc, item) => {
      if (!acc[item.section]) acc[item.section] = []
      acc[item.section].push(item)
      return acc
    },
    {} as Record<string, typeof notificationsData>
  )

  const handleMarkAllRead = () => {
    console.log('✅ All notifications marked as read')
    setIsSheetOpen(false)
  }

  return (
    <Theme name={theme}>
      <YStack
        flex={1}
        backgroundColor="$background"
        paddingHorizontal="$4"
        paddingTop="$6"
      >
        {/* --- TOP BAR --- */}
        <XStack
          width="100%"
          alignItems="center"
          justifyContent="space-between"
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
            iconAfter={() => <Text fontSize="$7">⋯</Text>}
          />
        </XStack>

        {/* --- CONTENT --- */}
        <ScrollView showsVerticalScrollIndicator={false}>
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
                    item.unread ? '$backgroundHover' : '$background'
                  }
                  borderRadius="$4"
                  padding="$3"
                  marginBottom="$2"
                >
                  <XStack alignItems="center" gap="$3">
                    <Avatar circular size="$5">
                      <Avatar.Image src={item.avatar} />
                      <Avatar.Fallback backgroundColor="$gray5" />
                    </Avatar>

                    <YStack flex={1}>
                      <Text color="$color" fontSize="$4">
                        {item.message}
                      </Text>
                      <Text color="$gray8" fontSize="$3" marginTop={2}>
                        {item.time}
                      </Text>
                    </YStack>

                    <Text color="$gray8" fontSize="$6">
                      ⋯
                    </Text>
                  </XStack>

                  {item.actions && (
                    <XStack gap="$2" marginTop="$3">
                      {item.actions.map((action, idx) => (
                        <Button
                          key={idx}
                          flex={1}
                          theme={action.type === 'primary' ? 'blue' : 'gray'}
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
          <Sheet.Handle />
          <Sheet.Frame
            backgroundColor="$background"
            elevation={20}
            borderTopLeftRadius="$6"
            borderTopRightRadius="$6"
            padding="$4"
            alignItems="center"
            justifyContent="center"
            gap="$4"
          >
            <Button
              size="$5"
              theme="active"
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
    </Theme>
  )
}
