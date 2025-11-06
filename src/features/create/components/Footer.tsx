import { YStack, Button } from 'tamagui'
// Import type từ file types.ts (chú ý đường dẫn '../')
import { CreateStep } from '../CreateScreen'

type CreateFooterProps = {
  step: CreateStep
  onNext: () => void
  onPost: () => void
  isNextDisabled?: boolean
}

export default function Footer({
  step,
  onNext,
  onPost,
  isNextDisabled = false,
}: CreateFooterProps) {
  return (
    <YStack
      padding="$4"
      borderTopWidth={1}
      borderColor="$borderColor"
      backgroundColor="$background"
    >
      {/* Nút Next (hiển thị ở bước 'gallery') */}
      {step === 'gallery' && (
        <Button
          theme="primary"
          size="$5"
          onPress={onNext}
          disabled={isNextDisabled}
          opacity={isNextDisabled ? 0.5 : 1}
        >
          Next
        </Button>
      )}

      {/* Nút Post (hiển thị ở bước 'details') */}
      {step === 'details' && (
        <Button theme="primary" size="$5" onPress={onPost}>
          Post
        </Button>
      )}
    </YStack>
  )
}
