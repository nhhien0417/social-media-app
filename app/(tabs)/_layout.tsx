import type { ComponentProps } from 'react'
import { Tabs } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { View } from 'react-native'

export default function TabsLayout() {
  const icon = (
    iconName: ComponentProps<typeof Ionicons>['name'],
    focused: boolean
  ) => {
    const iconFullName = (
      focused ? iconName : `${iconName}-outline`
    ) as ComponentProps<typeof Ionicons>['name']
    const color = focused ? '#111' : '#666'

    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Ionicons name={iconFullName} size={25} color={color} />
      </View>
    )
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { height: 50 },
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
          tabBarIcon: ({ focused }) => icon('person-circle', focused),
        }}
      />
    </Tabs>
  )
}
