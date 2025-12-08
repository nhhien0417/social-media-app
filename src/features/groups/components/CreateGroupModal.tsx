import { useState } from 'react'
import {
  Modal,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native'
import { YStack, XStack, Text, Button, Input, Separator } from 'tamagui'
import {
  X,
  Lock,
  Globe,
  Image as ImageIcon,
  Users,
} from '@tamagui/lucide-icons'
import Animated, {
  FadeIn,
  FadeOut,
  SlideInDown,
  SlideOutDown,
} from 'react-native-reanimated'

interface CreateGroupModalProps {
  visible: boolean
  onClose: () => void
  isDark: boolean
  onCreateGroup?: (groupData: {
    name: string
    description: string
    privacy: 'PUBLIC' | 'PRIVATE'
    category: string
  }) => void
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable)

const categories = [
  'General',
  'Buy and Sell',
  'Travel',
  'Gaming',
  'Fitness',
  'Food',
  'Photography',
  'Music',
  'Sports',
  'Technology',
  'Art',
  'Books',
  'Custom',
]

export function CreateGroupModal({
  visible,
  onClose,
  isDark,
  onCreateGroup,
}: CreateGroupModalProps) {
  const [groupName, setGroupName] = useState('')
  const [description, setDescription] = useState('')
  const [privacy, setPrivacy] = useState<'PUBLIC' | 'PRIVATE'>('PUBLIC')
  const [category, setCategory] = useState('General')
  const [customCategory, setCustomCategory] = useState('')
  const [showCategoryPicker, setShowCategoryPicker] = useState(false)

  const backgroundColor = isDark ? '#242526' : '#ffffff'
  const textColor = isDark ? '#e4e6eb' : '#050505'
  const subtitleColor = isDark ? '#b0b3b8' : '#65676b'
  const borderColor = isDark ? '#3e4042' : '#e4e6eb'
  const inputBackground = isDark ? '#3a3b3c' : '#f0f2f5'
  const selectedBackground = isDark ? 'rgba(24,119,242,0.2)' : '#e7f3ff'

  const handleCreate = () => {
    if (!groupName.trim()) {
      Alert.alert('Error', 'Please enter a group name')
      return
    }

    if (!description.trim()) {
      Alert.alert('Error', 'Please enter a description')
      return
    }

    if (onCreateGroup) {
      onCreateGroup({
        name: groupName.trim(),
        description: description.trim(),
        privacy,
        category: category === 'Custom' ? customCategory.trim() : category,
      })
    }

    // Reset form
    setGroupName('')
    setDescription('')
    setPrivacy('PUBLIC')
    setCategory('General')
    setCustomCategory('')
    setShowCategoryPicker(false)
    onClose()
  }

  if (!visible) return null

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <AnimatedPressable
        entering={FadeIn.duration(200)}
        exiting={FadeOut.duration(200)}
        style={styles.overlay}
        onPress={onClose}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <Animated.View
            entering={SlideInDown.duration(300).springify()}
            exiting={SlideOutDown.duration(250)}
            style={styles.container}
          >
            <Pressable onPress={e => e.stopPropagation()}>
              <YStack
                backgroundColor={backgroundColor}
                borderTopLeftRadius={16}
                borderTopRightRadius={16}
                maxHeight="90%"
                overflow="hidden"
              >
                {/* Header */}
                <YStack>
                  <XStack
                    paddingHorizontal="$4"
                    paddingVertical="$3.5"
                    alignItems="center"
                    justifyContent="space-between"
                    borderBottomWidth={1}
                    borderBottomColor={borderColor}
                  >
                    <YStack flex={1}>
                      <Text fontSize={20} fontWeight="700" color={textColor}>
                        Create Group
                      </Text>
                    </YStack>
                    <Pressable onPress={onClose} hitSlop={8}>
                      <YStack
                        width={36}
                        height={36}
                        borderRadius={18}
                        backgroundColor={isDark ? '#3a3b3c' : '#e4e6eb'}
                        alignItems="center"
                        justifyContent="center"
                      >
                        <X size={20} color={textColor} />
                      </YStack>
                    </Pressable>
                  </XStack>
                </YStack>

                {/* Content */}
                <ScrollView
                  style={{ maxHeight: 500 }}
                  showsVerticalScrollIndicator={false}
                >
                  <YStack padding="$4" gap="$4">
                    {/* Group Name */}
                    <YStack gap="$2">
                      <Text fontSize={15} fontWeight="600" color={textColor}>
                        Group Name
                      </Text>
                      <Input
                        value={groupName}
                        onChangeText={setGroupName}
                        placeholder="Enter group name"
                        placeholderTextColor={subtitleColor}
                        backgroundColor={inputBackground}
                        borderWidth={0}
                        borderRadius={8}
                        paddingHorizontal="$3"
                        paddingVertical="$2.5"
                        fontSize={15}
                        color={textColor}
                        maxLength={75}
                      />
                      <Text fontSize={12} color={subtitleColor}>
                        {groupName.length}/75
                      </Text>
                    </YStack>

                    {/* Description */}
                    <YStack gap="$2">
                      <Text fontSize={15} fontWeight="600" color={textColor}>
                        Description
                      </Text>
                      <Input
                        value={description}
                        onChangeText={setDescription}
                        placeholder="What's your group about?"
                        placeholderTextColor={subtitleColor}
                        backgroundColor={inputBackground}
                        borderWidth={0}
                        borderRadius={8}
                        paddingHorizontal="$3"
                        paddingVertical="$2.5"
                        fontSize={15}
                        color={textColor}
                        multiline
                        numberOfLines={3}
                        textAlignVertical="top"
                        maxLength={255}
                      />
                      <Text fontSize={12} color={subtitleColor}>
                        {description.length}/255
                      </Text>
                    </YStack>

                    <Separator borderColor={borderColor} />

                    {/* Privacy */}
                    <YStack gap="$2">
                      <Text fontSize={15} fontWeight="600" color={textColor}>
                        Privacy
                      </Text>
                      <YStack gap="$2">
                        {/* Public Option */}
                        <Pressable onPress={() => setPrivacy('PUBLIC')}>
                          <XStack
                            padding="$3"
                            backgroundColor={
                              privacy === 'PUBLIC'
                                ? selectedBackground
                                : inputBackground
                            }
                            borderRadius={8}
                            alignItems="center"
                            gap="$3"
                            borderWidth={privacy === 'PUBLIC' ? 2 : 0}
                            borderColor="#1877F2"
                          >
                            <YStack
                              width={40}
                              height={40}
                              borderRadius={20}
                              backgroundColor={
                                isDark
                                  ? 'rgba(255,255,255,0.1)'
                                  : 'rgba(0,0,0,0.05)'
                              }
                              alignItems="center"
                              justifyContent="center"
                            >
                              <Globe size={20} color={textColor} />
                            </YStack>
                            <YStack flex={1}>
                              <Text
                                fontSize={15}
                                fontWeight="600"
                                color={textColor}
                              >
                                Public
                              </Text>
                              <Text
                                fontSize={13}
                                color={subtitleColor}
                                marginTop="$0.5"
                              >
                                Anyone can see who's in the group and what they
                                post
                              </Text>
                            </YStack>
                            {privacy === 'PUBLIC' && (
                              <YStack
                                width={20}
                                height={20}
                                borderRadius={10}
                                backgroundColor="#1877F2"
                                alignItems="center"
                                justifyContent="center"
                              >
                                <Text color="white" fontSize={12}>
                                  ✓
                                </Text>
                              </YStack>
                            )}
                          </XStack>
                        </Pressable>

                        {/* Private Option */}
                        <Pressable onPress={() => setPrivacy('PRIVATE')}>
                          <XStack
                            padding="$3"
                            backgroundColor={
                              privacy === 'PRIVATE'
                                ? selectedBackground
                                : inputBackground
                            }
                            borderRadius={8}
                            alignItems="center"
                            gap="$3"
                            borderWidth={privacy === 'PRIVATE' ? 2 : 0}
                            borderColor="#1877F2"
                          >
                            <YStack
                              width={40}
                              height={40}
                              borderRadius={20}
                              backgroundColor={
                                isDark
                                  ? 'rgba(255,255,255,0.1)'
                                  : 'rgba(0,0,0,0.05)'
                              }
                              alignItems="center"
                              justifyContent="center"
                            >
                              <Lock size={20} color={textColor} />
                            </YStack>
                            <YStack flex={1}>
                              <Text
                                fontSize={15}
                                fontWeight="600"
                                color={textColor}
                              >
                                Private
                              </Text>
                              <Text
                                fontSize={13}
                                color={subtitleColor}
                                marginTop="$0.5"
                              >
                                Only members can see who's in the group and what
                                they post
                              </Text>
                            </YStack>
                            {privacy === 'PRIVATE' && (
                              <YStack
                                width={20}
                                height={20}
                                borderRadius={10}
                                backgroundColor="#1877F2"
                                alignItems="center"
                                justifyContent="center"
                              >
                                <Text color="white" fontSize={12}>
                                  ✓
                                </Text>
                              </YStack>
                            )}
                          </XStack>
                        </Pressable>
                      </YStack>
                    </YStack>

                    <Separator borderColor={borderColor} />

                    {/* Category */}
                    <YStack gap="$2">
                      <Text fontSize={15} fontWeight="600" color={textColor}>
                        Category
                      </Text>
                      {!showCategoryPicker ? (
                        <Pressable onPress={() => setShowCategoryPicker(true)}>
                          <XStack
                            padding="$3"
                            backgroundColor={inputBackground}
                            borderRadius={8}
                            alignItems="center"
                            gap="$3"
                          >
                            <YStack
                              width={40}
                              height={40}
                              borderRadius={20}
                              backgroundColor={
                                isDark
                                  ? 'rgba(255,255,255,0.1)'
                                  : 'rgba(0,0,0,0.05)'
                              }
                              alignItems="center"
                              justifyContent="center"
                            >
                              <Users size={20} color={textColor} />
                            </YStack>
                            <YStack flex={1}>
                              <Text fontSize={15} color={textColor}>
                                {category === 'Custom' && customCategory
                                  ? customCategory
                                  : category}
                              </Text>
                            </YStack>
                            <Text fontSize={13} color="#1877F2">
                              Change
                            </Text>
                          </XStack>
                        </Pressable>
                      ) : (
                        <YStack gap="$1" maxHeight={200}>
                          <ScrollView showsVerticalScrollIndicator={true}>
                            {categories.map(cat => (
                              <Pressable
                                key={cat}
                                onPress={() => {
                                  setCategory(cat)
                                  if (cat !== 'Custom') {
                                    setShowCategoryPicker(false)
                                  }
                                }}
                              >
                                <XStack
                                  padding="$3"
                                  backgroundColor={
                                    category === cat
                                      ? selectedBackground
                                      : 'transparent'
                                  }
                                  borderRadius={8}
                                  alignItems="center"
                                  justifyContent="space-between"
                                >
                                  <Text
                                    fontSize={15}
                                    fontWeight={
                                      category === cat ? '600' : '400'
                                    }
                                    color={textColor}
                                  >
                                    {cat}
                                  </Text>
                                  {category === cat && (
                                    <YStack
                                      width={20}
                                      height={20}
                                      borderRadius={10}
                                      backgroundColor="#1877F2"
                                      alignItems="center"
                                      justifyContent="center"
                                    >
                                      <Text color="white" fontSize={12}>
                                        ✓
                                      </Text>
                                    </YStack>
                                  )}
                                </XStack>
                              </Pressable>
                            ))}
                          </ScrollView>
                        </YStack>
                      )}

                      {/* Custom Category Input */}
                      {category === 'Custom' && (
                        <YStack gap="$2" marginTop="$2">
                          <Input
                            value={customCategory}
                            onChangeText={setCustomCategory}
                            placeholder="Enter custom category"
                            placeholderTextColor={subtitleColor}
                            backgroundColor={inputBackground}
                            borderWidth={0}
                            borderRadius={8}
                            paddingHorizontal="$3"
                            paddingVertical="$2.5"
                            fontSize={15}
                            color={textColor}
                            maxLength={50}
                          />
                          <XStack justifyContent="space-between" alignItems="center">
                            <Text fontSize={12} color={subtitleColor}>
                              {customCategory.length}/50
                            </Text>
                            {customCategory.trim() && (
                              <Pressable
                                onPress={() => setShowCategoryPicker(false)}
                              >
                                <Text fontSize={13} color="#1877F2" fontWeight="600">
                                  Done
                                </Text>
                              </Pressable>
                            )}
                          </XStack>
                        </YStack>
                      )}
                    </YStack>
                  </YStack>
                </ScrollView>

                {/* Footer */}
                <YStack
                  padding="$4"
                  borderTopWidth={1}
                  borderTopColor={borderColor}
                >
                  <Button
                    backgroundColor="#1877F2"
                    color="white"
                    borderRadius={8}
                    fontWeight="600"
                    fontSize={15}
                    height={44}
                    pressStyle={{ opacity: 0.8, scale: 0.98 }}
                    onPress={handleCreate}
                    disabled={
                      !groupName.trim() ||
                      !description.trim() ||
                      (category === 'Custom' && !customCategory.trim())
                    }
                    opacity={
                      !groupName.trim() ||
                      !description.trim() ||
                      (category === 'Custom' && !customCategory.trim())
                        ? 0.5
                        : 1
                    }
                  >
                    Create Group
                  </Button>
                </YStack>
              </YStack>
            </Pressable>
          </Animated.View>
        </KeyboardAvoidingView>
      </AnimatedPressable>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  keyboardView: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  container: {
    width: '100%',
  },
})
