import { View, Text, Image, Pressable, Dimensions, FlatList } from "react-native";
import Avatar from "@/components/Avatar";
import type { Post } from "@/types/models";
import { Heart, MessageCircle, Bookmark } from "lucide-react-native";

const W = Dimensions.get("window").width;

export default function PostCard({ post, onLike, onPressComments }: {
  post: Post;
  onLike: () => void;
  onPressComments: () => void;
}) {
  return (
    <View className="bg-white">
      {/* Header */}
      <View className="flex-row items-center justify-between px-3 py-2">
        <View className="flex-row items-center gap-2">
          <Avatar uri={post.author.avatarUrl} size={32} />
          <Text className="font-semibold">{post.author.username}</Text>
        </View>
        <Text className="text-neutral-500">•••</Text>
      </View>

      {/* Media (carousel nếu >1) */}
      {post.media.length > 1 ? (
        <FlatList
          horizontal
          pagingEnabled
          data={post.media}
          keyExtractor={(m) => m.id}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <Image
              source={{ uri: item.url }}
              style={{ width: W, height: W / item.ratio, backgroundColor: "#ddd" }}
              resizeMode="cover"
            />
          )}
        />
      ) : (
        <Image
          source={{ uri: post.media[0].url }}
          style={{ width: W, height: W / post.media[0].ratio, backgroundColor: "#ddd" }}
          resizeMode="cover"
        />
      )}

      {/* Actions */}
      <View className="flex-row items-center justify-between px-3 py-2">
        <View className="flex-row items-center gap-4">
          <Pressable onPress={onLike} hitSlop={12}>
            <Heart size={24} color={post.liked ? "#ef4444" : "#111"} fill={post.liked ? "#ef4444" : "transparent"} />
          </Pressable>
          <Pressable onPress={onPressComments} hitSlop={12}>
            <MessageCircle size={24} color="#111" />
          </Pressable>
        </View>
        <Pressable hitSlop={12}>
          <Bookmark size={24} color={post.saved ? "#111" : "#111"} />
        </Pressable>
      </View>

      {/* Meta */}
      <View className="px-3 pb-3">
        <Text className="font-semibold">{post.likeCount.toLocaleString()} likes</Text>
        {!!post.caption && (
          <Text className="mt-1">
            <Text className="font-semibold">{post.author.username} </Text>
            {post.caption}
          </Text>
        )}
        <Pressable onPress={onPressComments}>
          <Text className="text-neutral-500 mt-1">View all {post.commentCount} comments</Text>
        </Pressable>
        <Text className="text-neutral-400 mt-1 text-xs">• just now</Text>
      </View>
    </View>
  );
}
