import { posts } from "../mock/db";
import type { Post } from "../types/models";

function sleep(ms = 400) {
  return new Promise((res) => setTimeout(res, ms));
}

export type CursorPage<T> = { items: T[]; nextCursor?: string | null };

export async function fetchFeed(cursor?: string | null): Promise<CursorPage<Post>> {
  await sleep(350);
  // demo: chia thành từng “trang” 2 items
  const pageSize = 2;
  const start = cursor ? Number(cursor) : 0;
  const slice = posts.slice(start, start + pageSize);
  const next = start + pageSize < posts.length ? String(start + pageSize) : null;
  return { items: slice, nextCursor: next };
}

export async function likePost(id: string): Promise<{ ok: true }> {
  await sleep(200);
  // cập nhật giả
  const p = posts.find(p => p.id === id);
  if (p) {
    p.liked = !p.liked;
    p.likeCount += p.liked ? 1 : -1;
  }
  return { ok: true };
}
