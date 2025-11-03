import { Tabs } from "expo-router";
import { Home, Search, PlusSquare, Bell, User } from "lucide-react-native";
import { View } from "react-native";

export default function TabsLayout() {
  const icon = (I: any, focused: boolean) => (
    <View className="items-center justify-center">
      <I size={22} color={focused ? "#111" : "#666"} />
    </View>
  );
  return (
    <Tabs screenOptions={{ headerShown: false, tabBarStyle: { height: 56 } }}>
      <Tabs.Screen name="index" options={{ tabBarIcon: ({ focused }) => icon(Home, focused), title: "Home" }} />
      <Tabs.Screen name="search" options={{ tabBarIcon: ({ focused }) => icon(Search, focused), title: "Search" }} />
      <Tabs.Screen name="create" options={{ tabBarIcon: ({ focused }) => icon(PlusSquare, focused), title: "Create" }} />
      <Tabs.Screen name="activity" options={{ tabBarIcon: ({ focused }) => icon(Bell, focused), title: "Activity" }} />
      <Tabs.Screen name="profile" options={{ tabBarIcon: ({ focused }) => icon(User, focused), title: "Profile" }} />
    </Tabs>
  );
}
