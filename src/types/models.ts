export type User = {
  id: string;
  username: string;
  name?: string;
  avatarUrl?: string;
  isPrivate?: boolean;
  followed?: boolean;
};

export type Media = {
  id: string;
  type: "image" | "video";
  url: string;
  ratio: number;
  thumbUrl?: string;
};

export type Post = {
  id: string;
  author: User;
  media: Media[];
  caption?: string;
  likeCount: number;
  commentCount: number;
  createdAt: string;
  liked?: boolean;
  saved?: boolean;
};
