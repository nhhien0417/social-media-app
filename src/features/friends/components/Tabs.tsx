import { Pressable } from 'react-native'
import { XStack, Text, YStack } from 'tamagui'

export type TabValue = 'friends' | 'requests' | 'sent'

export interface Tab {
  value: TabValue
  label: string
  count?: number
}

interface TabBarProps {
  activeTab: TabValue
  tabs: Tab[]
  onTabChange: (tab: TabValue) => void
  isDark: boolean
}

export function TabBar({ activeTab, tabs, onTabChange, isDark }: TabBarProps) {
  const textColor = isDark ? '#f5f5f5' : '#111827'
  const inactiveTextColor = isDark ? 'rgba(255,255,255,0.5)' : '#6b7280'
  const badgeBackgroundColor = isDark ? 'rgba(255,255,255,0.15)' : '#e5e7eb'

  return (
    <XStack>
      {tabs.map(tab => {
        const isActive = activeTab === tab.value

        return (
          <Pressable
            key={tab.value}
            onPress={() => onTabChange(tab.value)}
            style={{ flex: 1 }}
          >
            <YStack
              paddingVertical="$3"
              paddingHorizontal="$3"
              alignItems="center"
              borderBottomWidth={2}
              borderBottomColor={isActive ? textColor : 'transparent'}
            >
              <XStack gap="$2" alignItems="center">
                <Text
                  fontSize={15}
                  fontWeight={isActive ? '700' : '500'}
                  color={isActive ? textColor : inactiveTextColor}
                >
                  {tab.label}
                </Text>
                {tab.count !== undefined && tab.count > 0 && (
                  <YStack
                    backgroundColor={badgeBackgroundColor}
                    borderRadius={10}
                    paddingHorizontal={2}
                    paddingVertical={2}
                    minWidth={20}
                    alignItems="center"
                  >
                    <Text
                      fontSize={12}
                      fontWeight="600"
                      color={isActive ? textColor : inactiveTextColor}
                    >
                      {tab.count}
                    </Text>
                  </YStack>
                )}
              </XStack>
            </YStack>
          </Pressable>
        )
      })}
    </XStack>
  )
}
