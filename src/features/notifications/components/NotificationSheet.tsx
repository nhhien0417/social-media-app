import { Sheet, Text, Button, Separator } from 'tamagui'
import Avatar from '@/components/Avatar'
import type { NotificationItem } from '@/types/Notification'
import { formatDate } from '@/utils/FormatDate'

interface NotificationSheetProps {
  notification: NotificationItem | null
  onOpenChange: (open: boolean) => void
  onDelete: (id: string) => void
}

export default function NotificationSheet({
  notification,
  onOpenChange,
  onDelete,
}: NotificationSheetProps) {
  return (
    <Sheet
      open={!!notification}
      onOpenChange={onOpenChange}
      modal
      snapPointsMode="fit"
      dismissOnSnapToBottom
      animation="quick"
    >
      <Sheet.Overlay backgroundColor="$shadow6" />
      <Sheet.Handle backgroundColor="$gray6" />
      <Sheet.Frame
        backgroundColor="$background"
        borderTopLeftRadius="$6"
        borderTopRightRadius="$6"
        padding="$4"
        alignItems="center"
        gap="$4"
      >
        {notification && (
          <>
            <Avatar
              uri={`https://i.pravatar.cc/150?u=${notification.senderId}`}
              size={80}
            />
            <Text
              color="$color"
              textAlign="center"
              fontSize="$5"
              fontWeight="600"
              lineHeight={22}
              maxWidth="100%"
              flexWrap="wrap"
            >
              {notification.message}
            </Text>
            <Text color="$gray8" fontSize="$3">
              {formatDate(notification.createdAt)}
            </Text>

            <Separator marginVertical="$3" />

            <Button
              theme="red"
              borderRadius="$6"
              size="$5"
              width="100%"
              onPress={() => onDelete(notification.id)}
            >
              Delete this notification
            </Button>

            <Button
              variant="outlined"
              borderRadius="$6"
              color="$gray9"
              width="100%"
              onPress={() => onOpenChange(false)}
            >
              Cancel
            </Button>
          </>
        )}
      </Sheet.Frame>
    </Sheet>
  )
}
