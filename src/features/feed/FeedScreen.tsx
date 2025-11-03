import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchFeed, likePost } from "@/api/clients";
import { FlatList, View, StatusBar, RefreshControl } from "react-native";
import StoryBar from "./components/StoryBar";
import PostCard from "./components/PostCard";

export default function FeedScreen() {
  const qc = useQueryClient();

  const feedQ = useInfiniteQuery({
    queryKey: ["feed"],
    queryFn: ({ pageParam }) => fetchFeed(pageParam ?? null),
    initialPageParam: null as string | null,
    getNextPageParam: (last) => last.nextCursor ?? undefined,
  });

  const likeM = useMutation({
    mutationFn: (postId: string) => likePost(postId),
    onMutate: async (postId) => {
      await qc.cancelQueries({ queryKey: ["feed"] });
      const prev = qc.getQueryData<any>(["feed"]);
      qc.setQueryData<any>(["feed"], (old: any) => {
        if (!old) return old;
        const copy = structuredClone(old);
        copy.pages.forEach((p: any) =>
          p.items.forEach((it: any) => {
            if (it.id === postId) {
              it.liked = !it.liked;
              it.likeCount += it.liked ? 1 : -1;
            }
          })
        );
        return copy;
      });
      return { prev };
    },
    onError: (_e, _id, ctx) => {
      if (ctx?.prev) qc.setQueryData(["feed"], ctx.prev);
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["feed"] });
    },
  });

  const data = feedQ.data?.pages.flatMap((p) => p.items) ?? [];

  return (
    <View className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />
      <FlatList
        data={data}
        keyExtractor={(it) => it.id}
        ListHeaderComponent={<StoryBar />}
        renderItem={({ item }) => (
          <PostCard
            post={item}
            onLike={() => likeM.mutate(item.id)}
            onPressComments={() => {}}
          />
        )}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        onEndReachedThreshold={0.4}
        onEndReached={() => feedQ.hasNextPage && feedQ.fetchNextPage()}
        refreshControl={
          <RefreshControl refreshing={feedQ.isRefetching} onRefresh={() => feedQ.refetch()} />
        }
      />
    </View>
  );
}
