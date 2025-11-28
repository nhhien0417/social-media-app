import { Modal, Pressable, FlatList } from 'react-native'
import { YStack, XStack, Text, Input } from 'tamagui'
import {
  X,
  Search,
  Users,
  FileText,
  Image as ImageIcon,
} from '@tamagui/lucide-icons'
import { useState } from 'react'

type SearchCategory = 'all' | 'posts' | 'members' | 'media'

interface GroupSearchModalProps {
  visible: boolean
  onClose: () => void
  isDark: boolean
  groupName: string
}

interface SearchResult {
  id: string
  type: 'post' | 'member' | 'media'
  title: string
  subtitle?: string
  thumbnail?: string
}

export function GroupSearchModal({
  visible,
  onClose,
  isDark,
  groupName,
}: GroupSearchModalProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState<SearchCategory>('all')

  const backgroundColor = isDark ? '#000000' : '#ffffff'
  const textColor = isDark ? '#f5f5f5' : '#111827'
  const subtitleColor = isDark ? 'rgba(255,255,255,0.6)' : '#6b7280'
  const borderColor = isDark ? '#2a2a2a' : '#e5e7eb'
  const searchBackground = isDark ? '#1a1a1a' : '#f0f2f5'
  const categoryActiveBackground = isDark ? '#2a2a2a' : '#e4e6eb'

  // Mock search results
  const mockResults: SearchResult[] = [
    {
      id: '1',
      type: 'post',
      title: 'How to optimize FlatList performance?',
      subtitle: 'Posted by John Developer · 2 hours ago',
    },
    {
      id: '2',
      type: 'member',
      title: 'Sarah Wilson',
      subtitle: 'Mobile developer · 234 mutual friends',
    },
    {
      id: '3',
      type: 'post',
      title: 'New React Native library released!',
      subtitle: 'Posted by Mike Johnson · 5 hours ago',
    },
    {
      id: '4',
      type: 'member',
      title: 'Emily Chen',
      subtitle: 'Frontend engineer · 156 mutual friends',
    },
  ]

  const filteredResults = searchQuery
    ? mockResults.filter(
        result =>
          (activeCategory === 'all' ||
            (activeCategory === 'posts' && result.type === 'post') ||
            (activeCategory === 'members' && result.type === 'member') ||
            (activeCategory === 'media' && result.type === 'media')) &&
          result.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : []

  const categories: { key: SearchCategory; label: string; icon: any }[] = [
    { key: 'all', label: 'All', icon: Search },
    { key: 'posts', label: 'Posts', icon: FileText },
    { key: 'members', label: 'Members', icon: Users },
    { key: 'media', label: 'Media', icon: ImageIcon },
  ]

  const renderSearchResult = ({ item }: { item: SearchResult }) => (
    <Pressable>
      <XStack
        paddingHorizontal="$4"
        paddingVertical="$3"
        alignItems="center"
        gap="$3"
      >
        <YStack
          width={48}
          height={48}
          borderRadius={item.type === 'member' ? 24 : 8}
          backgroundColor={subtitleColor}
          alignItems="center"
          justifyContent="center"
        >
          {item.type === 'post' ? (
            <FileText size={20} color="#fff" />
          ) : (
            <Text fontSize={18} fontWeight="600" color="#fff">
              {item.title.charAt(0)}
            </Text>
          )}
        </YStack>

        <YStack flex={1}>
          <Text fontSize={15} fontWeight="600" color={textColor}>
            {item.title}
          </Text>
          {item.subtitle && (
            <Text fontSize={13} color={subtitleColor}>
              {item.subtitle}
            </Text>
          )}
        </YStack>
      </XStack>
    </Pressable>
  )

  return (
    <Modal
      visible={visible}
      transparent={false}
      animationType="slide"
      onRequestClose={onClose}
    >
      <YStack flex={1} backgroundColor={backgroundColor}>
        {/* Header */}
        <XStack
          paddingHorizontal="$4"
          paddingVertical="$3"
          alignItems="center"
          gap="$3"
          borderBottomColor={borderColor}
          borderBottomWidth={1}
        >
          <Pressable onPress={onClose} hitSlop={8}>
            <X size={24} color={textColor} />
          </Pressable>

          {/* Search Input */}
          <XStack
            flex={1}
            backgroundColor={searchBackground}
            borderRadius={10}
            paddingHorizontal="$3"
            paddingVertical="$2"
            alignItems="center"
            gap="$2"
          >
            <Search size={20} color={subtitleColor} />
            <Input
              flex={1}
              placeholder={`Search in ${groupName}`}
              placeholderTextColor={subtitleColor}
              value={searchQuery}
              onChangeText={setSearchQuery}
              backgroundColor="transparent"
              borderWidth={0}
              fontSize={16}
              color={textColor}
              padding={0}
            />
          </XStack>
        </XStack>

        {/* Category Tabs */}
        <XStack
          paddingHorizontal="$3"
          paddingVertical="$2"
          gap="$2"
          borderBottomColor={borderColor}
          borderBottomWidth={1}
        >
          {categories.map(category => {
            const Icon = category.icon
            const isActive = activeCategory === category.key
            return (
              <Pressable
                key={category.key}
                onPress={() => setActiveCategory(category.key)}
              >
                <XStack
                  backgroundColor={
                    isActive ? categoryActiveBackground : 'transparent'
                  }
                  borderRadius={20}
                  paddingHorizontal="$3"
                  paddingVertical="$2"
                  alignItems="center"
                  gap="$2"
                >
                  <Icon
                    size={16}
                    color={isActive ? textColor : subtitleColor}
                  />
                  <Text
                    fontSize={14}
                    fontWeight={isActive ? '600' : '400'}
                    color={isActive ? textColor : subtitleColor}
                  >
                    {category.label}
                  </Text>
                </XStack>
              </Pressable>
            )
          })}
        </XStack>

        {/* Search Results */}
        {searchQuery ? (
          filteredResults.length > 0 ? (
            <FlatList
              data={filteredResults}
              renderItem={renderSearchResult}
              keyExtractor={item => item.id}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <YStack flex={1} alignItems="center" justifyContent="center">
              <Text fontSize={15} color={subtitleColor}>
                No results found
              </Text>
            </YStack>
          )
        ) : (
          <YStack flex={1} alignItems="center" justifyContent="center" gap="$2">
            <Search size={48} color={subtitleColor} />
            <Text fontSize={15} color={subtitleColor}>
              Search for posts, members, or media
            </Text>
          </YStack>
        )}
      </YStack>
    </Modal>
  )
}
