import { FlatList, View, Text, Image, Pressable } from "react-native";
import { stories } from "@/mock/db";

export default function StoryBar() {
  return (
    <FlatList
      data={stories}
      horizontal
      showsHorizontalScrollIndicator={false}
      keyExtractor={(it) => it.id}
      contentContainerStyle={{ paddingHorizontal: 12, paddingVertical: 8, gap: 12 }}
      renderItem={({ item }) => (
        <Pressable className="items-center">
          <View className={`p-[2px] rounded-full ${item.hasNew ? "border-2 border-blue-500" : ""}`}>
            <Image
              source={{ uri: item.thumbUrl }}
              style={{ width: 64, height: 64, borderRadius: 999 }}
            />
          </View>
          <Text className="text-xs mt-1 text-neutral-700" numberOfLines={1}>
            {item.author.username}
          </Text>
        </Pressable>
      )}
    />
  );
}
