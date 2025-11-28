import { useState, useMemo } from 'react'
import {
  ScrollView,
  Image,
  StyleSheet,
  Pressable,
  RefreshControl,
} from 'react-native'
import { YStack, XStack, Text, useThemeName, Button, Separator } from 'tamagui'
import {
  ChevronLeft,
  Users,
  Lock,
  Globe,
  Settings,
  Share2,
  Bell,
} from '@tamagui/lucide-icons'
import { router } from 'expo-router'
import { formatNumber } from '@/utils/FormatNumber'
import { Group } from '@/types/Group'
import PostCard from '../feed/components/PostCard'
import { groupPosts } from '@/mock/groupPosts'

type GroupTab = 'discussion' | 'members' | 'about'

interface GroupDetailScreenProps {
  groupId: string
}

export default function GroupDetailScreen({ groupId }: GroupDetailScreenProps) {
  const [activeTab, setActiveTab] = useState<GroupTab>('discussion')
  const [isRefreshing, setIsRefreshing] = useState(false)
  const themeName = useThemeName()
  const isDark = themeName === 'dark'

  // Mock group data - in real app, fetch from API
  const group: Group = {
    id: groupId,
    name: 'React Native Developers',
    description:
      'A community for React Native developers to share knowledge and help each other',
    coverUrl: 'https://picsum.photos/seed/group1/800/400',
    avatarUrl:
      'https://ui-avatars.com/api/?name=React+Native&background=61dafb&color=fff&size=200',
    privacy: 'PUBLIC',
    memberCount: 15420,
    status: 'JOINED',
    createdAt: '2024-01-15T10:00:00Z',
    category: 'Technology',
  }

  const backgroundColor = isDark ? '#000000' : '#FAFAFA'
  const textColor = isDark ? '#f5f5f5' : '#111827'
  const subtitleColor = isDark ? 'rgba(255,255,255,0.6)' : '#6b7280'
  const cardBackground = isDark ? '#1a1a1a' : '#ffffff'
  const borderColor = isDark ? '#2a2a2a' : '#e5e7eb'

  const onRefresh = async () => {
    setIsRefreshing(true)
    // Simulate refresh
    setTimeout(() => setIsRefreshing(false), 1000)
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'discussion':
        return (
          <YStack gap="$2" paddingTop="$2">
            {/* Create Post Section */}
            <YStack
              backgroundColor={cardBackground}
              borderColor={borderColor}
              borderWidth={1}
              borderRadius={12}
              padding="$3"
              marginHorizontal="$3"
            >
              <XStack gap="$3" alignItems="center">
                <YStack
                  width={40}
                  height={40}
                  borderRadius={20}
                  backgroundColor={subtitleColor}
                  alignItems="center"
                  justifyContent="center"
                >
                  <Text fontSize={16} fontWeight="600" color="#fff">
                    U
                  </Text>
                </YStack>
                <Pressable style={{ flex: 1 }}>
                  <YStack
                    backgroundColor={isDark ? '#2a2a2a' : '#f0f2f5'}
                    borderRadius={20}
                    paddingHorizontal="$4"
                    paddingVertical="$2.5"
                  >
                    <Text color={subtitleColor}>What's on your mind?</Text>
                  </YStack>
                </Pressable>
              </XStack>
            </YStack>

            {/* Posts */}
            {groupPosts.map(post => (
              <PostCard key={post.id} post={post} />
            ))}
          </YStack>
        )

      case 'members':
        return (
          <YStack padding="$3" gap="$3">
            <YStack
              backgroundColor={cardBackground}
              borderRadius={12}
              padding="$4"
              borderColor={borderColor}
              borderWidth={1}
            >
              <Text
                fontSize={16}
                fontWeight="600"
                color={textColor}
                marginBottom="$3"
              >
                Members · {formatNumber(group.memberCount)}
              </Text>

              {/* Sample members */}
              {[1, 2, 3, 4, 5].map(i => (
                <XStack
                  key={i}
                  paddingVertical="$2"
                  alignItems="center"
                  gap="$3"
                >
                  <YStack
                    width={48}
                    height={48}
                    borderRadius={24}
                    backgroundColor={subtitleColor}
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Text fontSize={18} fontWeight="600" color="#fff">
                      M{i}
                    </Text>
                  </YStack>
                  <YStack flex={1}>
                    <Text fontSize={15} fontWeight="600" color={textColor}>
                      Member {i}
                    </Text>
                    <Text fontSize={13} color={subtitleColor}>
                      Joined 2 weeks ago
                    </Text>
                  </YStack>
                </XStack>
              ))}
            </YStack>
          </YStack>
        )

      case 'about':
        return (
          <YStack padding="$3" gap="$3">
            <YStack
              backgroundColor={cardBackground}
              borderRadius={12}
              padding="$4"
              borderColor={borderColor}
              borderWidth={1}
              gap="$3"
            >
              <Text fontSize={16} fontWeight="600" color={textColor}>
                About this group
              </Text>
              <Text fontSize={14} color={textColor} lineHeight={20}>
                {group.description}
              </Text>

              <Separator borderColor={borderColor} />

              <XStack alignItems="center" gap="$2">
                {group.privacy === 'PUBLIC' ? (
                  <Globe size={20} color={subtitleColor} />
                ) : (
                  <Lock size={20} color={subtitleColor} />
                )}
                <YStack flex={1}>
                  <Text fontSize={15} fontWeight="600" color={textColor}>
                    {group.privacy === 'PUBLIC' ? 'Public' : 'Private'}
                  </Text>
                  <Text fontSize={13} color={subtitleColor}>
                    Anyone can see who's in the group and what they post
                  </Text>
                </YStack>
              </XStack>

              <XStack alignItems="center" gap="$2">
                <Users size={20} color={subtitleColor} />
                <YStack flex={1}>
                  <Text fontSize={15} fontWeight="600" color={textColor}>
                    General
                  </Text>
                  <Text fontSize={13} color={subtitleColor}>
                    {group.category}
                  </Text>
                </YStack>
              </XStack>
            </YStack>
          </YStack>
        )
    }
  }

  return (
    <YStack flex={1} backgroundColor={backgroundColor}>
      {/* Header */}
      <XStack
        paddingHorizontal="$3"
        paddingVertical="$3"
        alignItems="center"
        justifyContent="space-between"
        backgroundColor={cardBackground}
        borderBottomColor={borderColor}
        borderBottomWidth={1}
      >
        <XStack alignItems="center" gap="$3" flex={1}>
          <Pressable onPress={() => router.back()} hitSlop={8}>
            <ChevronLeft size={25} color={textColor} />
          </Pressable>
          <Text fontSize={18} fontWeight="700" color={textColor} flex={1}>
            {group.name}
          </Text>
        </XStack>
        <XStack gap="$2">
          <Pressable hitSlop={8}>
            <Bell size={22} color={textColor} />
          </Pressable>
          <Pressable hitSlop={8}>
            <Settings size={22} color={textColor} />
          </Pressable>
        </XStack>
      </XStack>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        }
      >
        {/* Cover Photo */}
        {group.coverUrl && (
          <YStack height={200}>
            <Image source={{ uri: group.coverUrl }} style={styles.coverImage} />
          </YStack>
        )}

        {/* Group Info */}
        <YStack
          backgroundColor={cardBackground}
          padding="$4"
          gap="$3"
          borderBottomColor={borderColor}
          borderBottomWidth={1}
        >
          <XStack alignItems="center" gap="$3">
            {group.avatarUrl && (
              <Image
                source={{ uri: group.avatarUrl }}
                style={styles.groupAvatar}
              />
            )}
            <YStack flex={1}>
              <XStack alignItems="center" gap="$2">
                {group.privacy === 'PRIVATE' ? (
                  <Lock size={16} color={subtitleColor} />
                ) : (
                  <Globe size={16} color={subtitleColor} />
                )}
                <Text fontSize={13} color={subtitleColor}>
                  {group.privacy === 'PUBLIC'
                    ? 'Public group'
                    : 'Private group'}{' '}
                  · {formatNumber(group.memberCount)} members
                </Text>
              </XStack>
            </YStack>
          </XStack>

          {/* Action Buttons */}
          <XStack gap="$2">
            <Button
              flex={1}
              backgroundColor="#1877F2"
              color="#ffffff"
              borderRadius={8}
              fontWeight="600"
              fontSize={15}
              pressStyle={{ opacity: 0.9 }}
            >
              Joined
            </Button>
            <Button
              backgroundColor={isDark ? 'rgba(255,255,255,0.1)' : '#e4e6eb'}
              color={textColor}
              borderRadius={8}
              fontWeight="600"
              fontSize={15}
              paddingHorizontal="$4"
              icon={<Share2 size={18} color={textColor} />}
              pressStyle={{ opacity: 0.9 }}
            >
              Share
            </Button>
          </XStack>
        </YStack>

        {/* Tabs */}
        <XStack
          backgroundColor={cardBackground}
          borderBottomColor={borderColor}
          borderBottomWidth={1}
        >
          {[
            { key: 'discussion', label: 'Discussion' },
            { key: 'members', label: 'Members' },
            { key: 'about', label: 'About' },
          ].map(tab => (
            <Pressable
              key={tab.key}
              onPress={() => setActiveTab(tab.key as GroupTab)}
              style={{ flex: 1 }}
            >
              <YStack
                paddingVertical="$3"
                alignItems="center"
                borderBottomWidth={2}
                borderBottomColor={
                  activeTab === tab.key ? '#1877F2' : 'transparent'
                }
              >
                <Text
                  fontSize={15}
                  fontWeight={activeTab === tab.key ? '600' : '400'}
                  color={activeTab === tab.key ? '#1877F2' : subtitleColor}
                >
                  {tab.label}
                </Text>
              </YStack>
            </Pressable>
          ))}
        </XStack>

        {/* Tab Content */}
        {renderTabContent()}
      </ScrollView>
    </YStack>
  )
}

const styles = StyleSheet.create({
  coverImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  groupAvatar: {
    width: 60,
    height: 60,
    borderRadius: 8,
    resizeMode: 'cover',
  },
})
