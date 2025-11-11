import React, { useEffect, useRef } from 'react'
import { View, Animated, StyleSheet } from 'react-native'

interface StoryProgressBarProps {
  duration: number
  isPaused: boolean
  isActive: boolean
  isCompleted: boolean
}

export default function StoryProgressBar({
  duration,
  isPaused,
  isActive,
  isCompleted,
}: StoryProgressBarProps) {
  const progressAnim = useRef(new Animated.Value(isCompleted ? 1 : 0)).current
  const animationRef = useRef<Animated.CompositeAnimation | null>(null)

  useEffect(() => {
    if (isCompleted) {
      progressAnim.setValue(1)
      return
    }

    if (!isActive) {
      progressAnim.setValue(0)
      return
    }

    if (isPaused) {
      animationRef.current?.stop()
      return
    }

    // Reset and start animation
    progressAnim.setValue(0)
    animationRef.current = Animated.timing(progressAnim, {
      toValue: 1,
      duration: duration,
      useNativeDriver: false,
    })
    animationRef.current.start()

    return () => {
      animationRef.current?.stop()
    }
  }, [duration, isPaused, isActive, isCompleted])

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  })

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.progress,
          {
            width: progressWidth,
            opacity: isCompleted ? 1 : isActive ? 1 : 0.4,
          },
        ]}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 1.5,
    overflow: 'hidden',
  },
  progress: {
    position: 'absolute',
    height: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 1.5,
  },
})
