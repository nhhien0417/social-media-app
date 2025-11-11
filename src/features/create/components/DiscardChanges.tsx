import React, { useEffect } from 'react'
import { Modal, StyleSheet, TouchableOpacity, Dimensions } from 'react-native'
import { YStack, Text, Button } from 'tamagui'
import { AlertTriangle } from '@tamagui/lucide-icons'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated'

const { width } = Dimensions.get('window')

type Props = {
  visible: boolean
  onDiscard: () => void
  onCancel: () => void
}

export default function DiscardChangesModal({
  visible,
  onDiscard,
  onCancel,
}: Props) {
  const scale = useSharedValue(0)
  const opacity = useSharedValue(0)

  useEffect(() => {
    if (visible) {
      opacity.value = withTiming(1, { duration: 150 })
      scale.value = withTiming(1, { duration: 150 })
    } else {
      opacity.value = withTiming(0, { duration: 150 })
      scale.value = withTiming(0.75, { duration: 150 })
    }
  }, [visible])

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }))

  const modalStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }))

  if (!visible) return null

  return (
    <Modal transparent visible={visible} animationType="none">
      <Animated.View style={[styles.overlay, overlayStyle]}>
        <TouchableOpacity
          style={styles.overlayTouchable}
          activeOpacity={1}
          onPress={onCancel}
        />

        <Animated.View style={[styles.modalContainer, modalStyle]}>
          <YStack
            backgroundColor="$background"
            borderRadius="$8"
            padding="$5"
            gap="$3"
            width={width * 0.85}
            maxWidth={400}
            elevation={5}
            shadowColor="$shadowColor"
            shadowOffset={{ width: 0, height: 4 }}
            shadowOpacity={0.3}
            shadowRadius={8}
          >
            {/* Icon */}
            <YStack alignItems="center" marginBottom="$2">
              <YStack
                backgroundColor="$red5"
                borderRadius={999}
                padding="$3"
                marginBottom="$3"
              >
                <AlertTriangle size={40} color="$red10" />
              </YStack>

              <Text
                fontSize={22}
                fontWeight="700"
                color="$color"
                textAlign="center"
              >
                Discard changes?
              </Text>
            </YStack>

            {/* Message */}
            <Text
              fontSize={15}
              color="$color"
              opacity={0.75}
              textAlign="center"
              lineHeight={20}
            >
              You have unsaved changes. Are you sure you want to leave? All your
              changes will be lost.
            </Text>

            {/* Actions */}
            <YStack gap="$2.5" marginTop="$2">
              <Button
                size="$4"
                backgroundColor="$red10"
                color="white"
                fontWeight="700"
                fontSize={18}
                borderRadius="$5"
                pressStyle={{
                  backgroundColor: '$red9',
                  scale: 0.975,
                }}
                onPress={onDiscard}
              >
                Discard
              </Button>

              <Button
                size="$4"
                backgroundColor="#d3d3d3"
                color="$color"
                fontWeight="600"
                fontSize={18}
                borderRadius="$5"
                pressStyle={{
                  backgroundColor: '#bababa',
                  scale: 0.975,
                }}
                onPress={onCancel}
              >
                Keep Editing
              </Button>
            </YStack>
          </YStack>
        </Animated.View>
      </Animated.View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayTouchable: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalContainer: {
    zIndex: 1,
  },
})
