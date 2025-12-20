import type { ComponentProps } from 'react'
import { Tabs, useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { View } from 'react-native'
import { YStack, useTheme, Text } from 'tamagui'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useEffect, useState } from 'react'
import Avatar from '@/components/Avatar'
import { getAccessToken } from '@/utils/SecureStore'
import { useInitProfile, useCurrentUser } from '@/hooks/useProfile'
import { useNotificationStore } from '@/stores/notificationStore'

export default function TabsLayout() {
  const theme = useTheme()
  const router = useRouter()
  const [isChecking, setIsChecking] = useState(true)

  useInitProfile()
  const currentUser = useCurrentUser()
  const unreadCount = useNotificationStore(state => state.unreadCount)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await getAccessToken()
        if (!token) {
          router.replace('/auth/signin')
        }
      } catch (error) {
        router.replace('/auth/signin')
      } finally {
        setIsChecking(false)
      }
    }

    checkAuth()
  }, [])

  if (isChecking) return null

  const icon = (
    iconName: ComponentProps<typeof Ionicons>['name'],
    focused: boolean
  ) => {
    const iconNameFinal = (
      focused ? iconName : `${iconName}-outline`
    ) as ComponentProps<typeof Ionicons>['name']

    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Ionicons
          name={iconNameFinal}
          size={25}
          color={theme?.color?.val ?? '#111'}
        />
      </View>
    )
  }

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: 'transparent' }}
      edges={['top', 'bottom']}
    >
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            height: 50,
            paddingBottom: 0,
            backgroundColor: theme?.background?.val ?? 'white',
            borderTopColor: theme?.borderColor?.val ?? '#ededed',
          },
          tabBarShowLabel: false,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            tabBarIcon: ({ focused }) => icon('home', focused),
          }}
        />

        <Tabs.Screen
          name="search"
          options={{
            tabBarIcon: ({ focused }) => icon('search', focused),
          }}
        />

        <Tabs.Screen
          name="create"
          listeners={{
            tabPress: e => {
              e.preventDefault()
              router.push({
                pathname: '/create',
                params: { mode: 'POST' },
              })
            },
          }}
          options={{
            tabBarIcon: ({ focused }) => icon('add-circle', focused),
          }}
        />

        <Tabs.Screen
          name="activity"
          options={{
            tabBarIcon: ({ focused }) => (
              <View>
                {icon('notifications', focused)}
                {unreadCount > 0 && (
                  <View
                    style={{
                      position: 'absolute',
                      right: -10,
                      top: -5,
                      borderRadius: 10,
                      minWidth: 16,
                      height: 16,
                      justifyContent: 'center',
                      alignItems: 'center',
                      paddingHorizontal: 2,
                    }}
                  >
                    <YStack
                      backgroundColor="$red10"
                      borderRadius="$10"
                      paddingHorizontal="$2"
                      paddingVertical="$1"
                      minWidth={20}
                      alignItems="center"
                    >
                      <Text fontSize="$2" fontWeight="700" color="white">
                        {unreadCount > 99 ? '99+' : unreadCount}
                      </Text>
                    </YStack>
                  </View>
                )}
              </View>
            ),
          }}
        />

        <Tabs.Screen
          name="profile"
          options={{
            tabBarIcon: ({ focused }) => (
              <YStack
                alignItems="center"
                justifyContent="center"
                borderWidth={focused ? 2 : 0}
                borderColor={
                  focused ? (theme?.color?.val ?? '#111') : 'transparent'
                }
                borderRadius={999}
              >
                <Avatar uri={currentUser?.avatarUrl || undefined} size={25} />
              </YStack>
            ),
          }}
        />
      </Tabs>
    </SafeAreaView>
  )
}
