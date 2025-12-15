import React from 'react'
import { Modal, Pressable } from 'react-native'
import { YStack, XStack, Text, Button } from 'tamagui'
import { X, UserX, Crown, Shield } from '@tamagui/lucide-icons'
import { GroupMember, GroupRole } from '@/types/Group'
import Avatar from '@/components/Avatar'

interface GroupMemberManagementModalProps {
  visible: boolean
  onClose: () => void
  member: GroupMember
  currentUserRole: GroupRole
  currentUserId: string
  isDark: boolean
  onUpdateRole: (memberId: string, newRole: GroupRole) => void
  onRemoveMember: (memberId: string) => void
}

export const GroupMemberManagementModal: React.FC<
  GroupMemberManagementModalProps
> = ({
  visible,
  onClose,
  member,
  currentUserRole,
  currentUserId,
  isDark,
  onUpdateRole,
  onRemoveMember,
}) => {
  const backgroundColor = isDark ? '#242526' : '#ffffff'
  const textColor = isDark ? '#e4e6eb' : '#050505'
  const subtitleColor = isDark ? '#b0b3b8' : '#65676b'
  const borderColor = isDark ? '#3e4042' : '#e4e6eb'
  const overlayColor = isDark ? 'rgba(0,0,0,0.85)' : 'rgba(0,0,0,0.7)'
  const dangerColor = '#ef4444'
  const successColor = '#10b981'
  const warningColor = '#f59e0b'

  // Prevent managing self
  const isSelf = member.user.id === currentUserId

  // Prevent managing owner
  const isTargetOwner = member.role === 'OWNER'

  // Owner can change MEMBER↔ADMIN (but NOT to OWNER)
  const ownerCanPromote =
    currentUserRole === 'OWNER' && member.role === 'MEMBER' && !isSelf
  const ownerCanDemote =
    currentUserRole === 'OWNER' && member.role === 'ADMIN' && !isSelf

  // Admin can only promote MEMBER to ADMIN
  const adminCanPromote =
    currentUserRole === 'ADMIN' && member.role === 'MEMBER'

  // Both owner and admin can remove members (but not owner)
  const canRemove =
    !isTargetOwner &&
    !isSelf &&
    (currentUserRole === 'OWNER' || currentUserRole === 'ADMIN')

  // Don't show modal if nothing can be done
  if (
    isSelf ||
    isTargetOwner ||
    (!ownerCanPromote && !ownerCanDemote && !adminCanPromote && !canRemove)
  ) {
    return null
  }

  const handleUpdateRole = (newRole: GroupRole) => {
    onUpdateRole(member.user.id, newRole)
    onClose()
  }

  const handleRemoveMember = () => {
    onRemoveMember(member.user.id)
    onClose()
  }

  const getRoleLabel = (role: GroupRole) => {
    switch (role) {
      case 'OWNER':
        return 'Owner'
      case 'ADMIN':
        return 'Admin'
      case 'MEMBER':
        return 'Member'
    }
  }

  const getRoleIcon = (role: GroupRole) => {
    switch (role) {
      case 'OWNER':
        return <Crown size={16} color="#f59e0b" />
      case 'ADMIN':
        return <Shield size={16} color="#10b981" />
      default:
        return null
    }
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
              <Avatar uri={member.user.avatarUrl || undefined} size={48} />
              <YStack flex={1}>
                <XStack alignItems="center" gap="$2">
                  <Text fontSize={16} fontWeight="600" color={textColor}>
                    {member.user.username}
                  </Text>
                  {member.role !== 'MEMBER' && getRoleIcon(member.role)}
                </XStack>
                <Text fontSize={13} color={subtitleColor}>
                  {getRoleLabel(member.role)}
                </Text>
              </YStack>
            </XStack>

            {/* Actions */}
            <YStack gap="$2">
              {/* Owner - Promote MEMBER to ADMIN */}
              {ownerCanPromote && (
                <Button
                  backgroundColor="transparent"
                  borderWidth={1}
                  borderColor={borderColor}
                  borderRadius={10}
                  height={50}
                  onPress={() => handleUpdateRole('ADMIN')}
                  pressStyle={{ opacity: 0.8, scale: 0.98 }}
                >
                  <XStack alignItems="center" gap="$3" flex={1}>
                    <Shield size={20} color={successColor} />
                    <YStack flex={1}>
                      <Text fontSize={15} fontWeight="600" color={textColor}>
                        Promote to Admin
                      </Text>
                      <Text fontSize={12} color={subtitleColor}>
                        Can manage members and posts
                      </Text>
                    </YStack>
                  </XStack>
                </Button>
              )}

              {/* Owner - Demote ADMIN to MEMBER */}
              {ownerCanDemote && (
                <Button
                  backgroundColor="transparent"
                  borderWidth={1}
                  borderColor={borderColor}
                  borderRadius={10}
                  height={50}
                  onPress={() => handleUpdateRole('MEMBER')}
                  pressStyle={{ opacity: 0.8, scale: 0.98 }}
                >
                  <XStack alignItems="center" gap="$3" flex={1}>
                    <Shield size={20} color={warningColor} />
                    <YStack flex={1}>
                      <Text fontSize={15} fontWeight="600" color={textColor}>
                        Demote to Member
                      </Text>
                      <Text fontSize={12} color={subtitleColor}>
                        Remove admin privileges
                      </Text>
                    </YStack>
                  </XStack>
                </Button>
              )}

              {/* Admin - Promote to Admin */}
              {adminCanPromote && (
                <Button
                  backgroundColor="transparent"
                  borderWidth={1}
                  borderColor={borderColor}
                  borderRadius={10}
                  height={50}
                  onPress={() => handleUpdateRole('ADMIN')}
                  pressStyle={{ opacity: 0.8, scale: 0.98 }}
                >
                  <XStack alignItems="center" gap="$3" flex={1}>
                    <Shield size={20} color={successColor} />
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
              )}

              {/* Remove from Group */}
              {canRemove && (
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
              )}
            </YStack>
          </YStack>
        </Pressable>
      </Pressable>
    </Modal>
  )
}
