import React, { useState } from 'react'
import { Modal, Pressable, ScrollView, Alert, TextInput } from 'react-native'
import { YStack, XStack, Text, Button } from 'tamagui'
import { X, Edit3, Save } from '@tamagui/lucide-icons'

interface EditGroupInfoModalProps {
  visible: boolean
  onClose: () => void
  groupName: string
  groupDescription: string
  groupCategory: string
  isDark: boolean
  onSave: (name: string, description: string, category: string) => void
}

export const EditGroupInfoModal: React.FC<EditGroupInfoModalProps> = ({
  visible,
  onClose,
  groupName,
  groupDescription,
  groupCategory,
  isDark,
  onSave,
}) => {
  const [name, setName] = useState(groupName)
  const [description, setDescription] = useState(groupDescription)
  const [category, setCategory] = useState(groupCategory)

  const backgroundColor = isDark ? '#242526' : '#ffffff'
  const textColor = isDark ? '#e4e6eb' : '#050505'
  const subtitleColor = isDark ? '#b0b3b8' : '#65676b'
  const inputBackground = isDark ? '#3a3b3c' : '#f0f2f5'
  const borderColor = isDark ? '#3e4042' : '#e4e6eb'
  const overlayColor = isDark ? 'rgba(0,0,0,0.85)' : 'rgba(0,0,0,0.7)'

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Group name cannot be empty')
      return
    }

    onSave(name.trim(), description.trim(), category.trim())
    onClose()
  }

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <YStack flex={1} backgroundColor={backgroundColor}>
        {/* Header */}
        <YStack
          paddingHorizontal="$4"
          paddingVertical="$3"
          borderBottomWidth={1}
          borderBottomColor={borderColor}
        >
          <XStack alignItems="center" justifyContent="space-between">
            <Pressable onPress={onClose} hitSlop={8}>
              <X size={24} color={textColor} />
            </Pressable>
            <Text fontSize={18} fontWeight="700" color={textColor}>
              Edit Group Info
            </Text>
            <Button
              backgroundColor="#1877F2"
              color="#ffffff"
              borderRadius={8}
              paddingHorizontal="$5"
              paddingVertical="$2"
              height={36}
              fontWeight="600"
              fontSize={15}
              pressStyle={{ opacity: 0.9, scale: 0.98 }}
              onPress={handleSave}
              icon={<Save size={16} color="#ffffff" />}
            >
              Save
            </Button>
          </XStack>
        </YStack>

        <ScrollView showsVerticalScrollIndicator={false}>
          <YStack padding="$4" gap="$4">
            {/* Group Name */}
            <YStack gap="$2">
              <Text fontSize={14} fontWeight="600" color={textColor}>
                Group Name
              </Text>
              <TextInput
                style={{
                  backgroundColor: inputBackground,
                  color: textColor,
                  padding: 12,
                  borderRadius: 10,
                  fontSize: 15,
                  borderWidth: 1,
                  borderColor: borderColor,
                }}
                value={name}
                onChangeText={setName}
                placeholder="Enter group name"
                placeholderTextColor={subtitleColor}
              />
            </YStack>

            {/* Description */}
            <YStack gap="$2">
              <Text fontSize={14} fontWeight="600" color={textColor}>
                Description
              </Text>
              <TextInput
                style={{
                  backgroundColor: inputBackground,
                  color: textColor,
                  padding: 12,
                  borderRadius: 10,
                  fontSize: 15,
                  borderWidth: 1,
                  borderColor: borderColor,
                  minHeight: 120,
                  textAlignVertical: 'top',
                }}
                value={description}
                onChangeText={setDescription}
                placeholder="Describe your group"
                placeholderTextColor={subtitleColor}
                multiline
                numberOfLines={5}
              />
            </YStack>

            {/* Category */}
            <YStack gap="$2">
              <Text fontSize={14} fontWeight="600" color={textColor}>
                Category
              </Text>
              <TextInput
                style={{
                  backgroundColor: inputBackground,
                  color: textColor,
                  padding: 12,
                  borderRadius: 10,
                  fontSize: 15,
                  borderWidth: 1,
                  borderColor: borderColor,
                }}
                value={category}
                onChangeText={setCategory}
                placeholder="e.g., Technology, Sports, etc."
                placeholderTextColor={subtitleColor}
              />
            </YStack>

            {/* Info */}
            <YStack
              backgroundColor={isDark ? 'rgba(24,119,242,0.15)' : '#eff6ff'}
              padding="$3"
              borderRadius={10}
              borderWidth={1}
              borderColor={isDark ? 'rgba(24,119,242,0.3)' : '#bfdbfe'}
            >
              <Text fontSize={13} color={subtitleColor} lineHeight={18}>
                These changes will be visible to all group members. Make sure
                the information is accurate and appropriate.
              </Text>
            </YStack>
          </YStack>
        </ScrollView>
      </YStack>
    </Modal>
  )
}
