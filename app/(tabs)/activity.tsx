import { YStack } from 'tamagui'
import NotificationPage from '@/features/notifications/NotificationPage'

export default function Screen() {
  return (
    <YStack
      flex={1}
      backgroundColor="$background"
      alignItems="center"
      justifyContent="center"
    >
      <NotificationPage />
    </YStack>
  )
}
