import React from 'react'
import { Modal, Pressable, Alert } from 'react-native'
import { YStack, XStack, Text, Button } from 'tamagui'
import { X, UserX, Crown, Ban } from '@tamagui/lucide-icons'
import { GroupMember } from '@/types/Group'

interface GroupMemberManagementModalProps {
  visible: boolean
  onClose: () => void
  member: GroupMember
  isAdmin: boolean
  isDark: boolean
  onPromoteToAdmin: (memberId: string) => void
  onRemoveMember: (memberId: string) => void
  onBlockMember: (memberId: string) => void
}

export const GroupMemberManagementModal: React.FC<
  GroupMemberManagementModalProps
> = ({
  visible,
  onClose,
  member,
  isAdmin,
  isDark,
  onPromoteToAdmin,
  onRemoveMember,
  onBlockMember,
}) => {
  const backgroundColor = isDark ? '#242526' : '#ffffff'
  const textColor = isDark ? '#e4e6eb' : '#050505'
  const subtitleColor = isDark ? '#b0b3b8' : '#65676b'
  const borderColor = isDark ? '#3e4042' : '#e4e6eb'
  const overlayColor = isDark ? 'rgba(0,0,0,0.85)' : 'rgba(0,0,0,0.7)'
  const dangerColor = '#ef4444'
  const successColor = '#10b981'

  const handlePromoteToAdmin = () => {
    Alert.alert(
      'Promote to Admin',
      `Are you sure you want to make ${member.name} an admin?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Promote',
          style: 'default',
          onPress: () => {
            onPromoteToAdmin(member.userId)
            onClose()
          },
        },
      ]
    )
  }

  const handleRemoveMember = () => {
    Alert.alert(
      'Remove Member',
      `Are you sure you want to remove ${member.name} from this group?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            onRemoveMember(member.userId)
            onClose()
          },
        },
      ]
    )
  }

  const handleBlockMember = () => {
    Alert.alert(
      'Block Member',
      `Are you sure you want to block ${member.name}? They won't be able to join this group again.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Block',
          style: 'destructive',
          onPress: () => {
            onBlockMember(member.userId)
            onClose()
          },
        },
      ]
    )
  }

  if (!isAdmin || member.role === 'ADMIN') {
    return null
  }

  return (
    <Modal visible={visible} transparent animationType="fade">
      <Pressable
        style={{
          flex: 1,
          backgroundColor: overlayColor,
          justifyContent: 'flex-end',
        }}
        onPress={onClose}
      >
        <Pressable onPress={e => e.stopPropagation()}>
          <YStack
            backgroundColor={backgroundColor}
            borderTopLeftRadius={20}
            borderTopRightRadius={20}
            padding="$4"
            gap="$3"
          >
            {/* Header */}
            <XStack
              alignItems="center"
              justifyContent="space-between"
              marginBottom="$2"
            >
              <Text fontSize={18} fontWeight="700" color={textColor}>
                Manage Member
              </Text>
              <Pressable onPress={onClose} hitSlop={8}>
                <X size={24} color={textColor} />
              </Pressable>
            </XStack>

            {/* Member Info */}
            <XStack
              alignItems="center"
              gap="$3"
              padding="$3"
              backgroundColor={isDark ? '#3a3b3c' : '#f0f2f5'}
              borderRadius={12}
            >
              <YStack
                width={48}
                height={48}
                borderRadius={24}
                backgroundColor={isDark ? '#4a4b4c' : '#e4e6eb'}
                alignItems="center"
                justifyContent="center"
              >
                <Text fontSize={18} fontWeight="700" color={textColor}>
                  {member.name.charAt(0)}
                </Text>
              </YStack>
              <YStack flex={1}>
                <Text fontSize={16} fontWeight="600" color={textColor}>
                  {member.name}
                </Text>
                <Text fontSize={13} color={subtitleColor}>
                  Member
                </Text>
              </YStack>
            </XStack>

            {/* Actions */}
            <YStack gap="$2">
              <Button
                backgroundColor="transparent"
                borderWidth={1}
                borderColor={borderColor}
                borderRadius={10}
                height={50}
                onPress={handlePromoteToAdmin}
                pressStyle={{ opacity: 0.8, scale: 0.98 }}
              >
                <XStack alignItems="center" gap="$3" flex={1}>
                  <Crown size={20} color={successColor} />
                  <YStack flex={1}>
                    <Text fontSize={15} fontWeight="600" color={textColor}>
                      Promote to Admin
                    </Text>
                    <Text fontSize={12} color={subtitleColor}>
                      Give admin privileges
                    </Text>
                  </YStack>
                </XStack>
              </Button>

              <Button
                backgroundColor="transparent"
                borderWidth={1}
                borderColor={borderColor}
                borderRadius={10}
                height={50}
                onPress={handleRemoveMember}
                pressStyle={{ opacity: 0.8, scale: 0.98 }}
              >
                <XStack alignItems="center" gap="$3" flex={1}>
                  <UserX size={20} color={dangerColor} />
                  <YStack flex={1}>
                    <Text fontSize={15} fontWeight="600" color={dangerColor}>
                      Remove from Group
                    </Text>
                    <Text fontSize={12} color={subtitleColor}>
                      They can join again later
                    </Text>
                  </YStack>
                </XStack>
              </Button>

              <Button
                backgroundColor="transparent"
                borderWidth={1}
                borderColor={borderColor}
                borderRadius={10}
                height={50}
                onPress={handleBlockMember}
                pressStyle={{ opacity: 0.8, scale: 0.98 }}
              >
                <XStack alignItems="center" gap="$3" flex={1}>
                  <Ban size={20} color={dangerColor} />
                  <YStack flex={1}>
                    <Text fontSize={15} fontWeight="600" color={dangerColor}>
                      Block Member
                    </Text>
                    <Text fontSize={12} color={subtitleColor}>
                      Permanently prevent from joining
                    </Text>
                  </YStack>
                </XStack>
              </Button>
            </YStack>
          </YStack>
        </Pressable>
      </Pressable>
    </Modal>
  )
}
