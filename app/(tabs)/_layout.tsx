import type { ComponentProps } from 'react'
import { Tabs, useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { View } from 'react-native'
import { YStack, useTheme } from 'tamagui'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useEffect, useState } from 'react'
import Avatar from '@/components/Avatar'
import { getAccessToken } from '@/api/token'

export default function TabsLayout() {
  const theme = useTheme()
  const router = useRouter()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await getAccessToken()
        if (!token) {
          router.replace('/(auth)/signin')
        }
      } catch (error) {
        router.replace('/(auth)/signin')
      } finally {
        setIsChecking(false)
      }
    }

    checkAuth()
  }, [])

  if (isChecking) {
    return null
  }

  const icon = (
    iconName: ComponentProps<typeof Ionicons>['name'],
    focused: boolean
  ) => {
    const iconUsername = (
      focused ? iconName : `${iconName}-outline`
    ) as ComponentProps<typeof Ionicons>['name']

    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Ionicons
          name={iconUsername}
          size={25}
          color={theme?.color?.val ?? '#111'}
        />
      </View>
    )
  }

  const userAvatar = 'https://i.pravatar.cc/100?img=40'

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
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
          options={{
            tabBarIcon: ({ focused }) => icon('add-circle', focused),
          }}
        />
        <Tabs.Screen
          name="activity"
          options={{
            tabBarIcon: ({ focused }) => icon('notifications', focused),
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
                <Avatar uri={userAvatar} size={25} />
              </YStack>
            ),
          }}
        />
      </Tabs>
    </SafeAreaView>
  )
}
