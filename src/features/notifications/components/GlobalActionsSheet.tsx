import { Sheet, Button } from 'tamagui'

interface GlobalActionsSheetProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  unreadCount: number
  totalCount: number
  onMarkAllAsRead: () => void
  onClearAll: () => void
}

export default function GlobalActionsSheet({
  isOpen,
  onOpenChange,
  unreadCount,
  totalCount,
  onMarkAllAsRead,
  onClearAll,
}: GlobalActionsSheetProps) {
  return (
    <Sheet
      open={isOpen}
      onOpenChange={onOpenChange}
      modal
      snapPointsMode="fit"
      dismissOnSnapToBottom
      animation="quick"
    >
      <Sheet.Overlay backgroundColor="$shadow6" />
      <Sheet.Handle backgroundColor="#888" />
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
          onPress={onMarkAllAsRead}
          width="100%"
          disabled={unreadCount === 0}
        >
          Mark all as read {unreadCount > 0 && `(${unreadCount})`}
        </Button>

        <Button
          size="$5"
          variant="outlined"
          borderRadius="$6"
          onPress={onClearAll}
          width="100%"
          disabled={totalCount === 0}
        >
          Clear all notifications
        </Button>

        <Button
          variant="outlined"
          borderRadius="$6"
          color="#888"
          onPress={() => onOpenChange(false)}
          width="100%"
        >
          Cancel
        </Button>
      </Sheet.Frame>
    </Sheet>
  )
}
