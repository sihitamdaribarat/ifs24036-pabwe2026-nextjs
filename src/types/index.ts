export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  photo?: string | null;
  created_at: string;
  updated_at: string;
}

export interface PostAuthor {
  name: string;
  photo: string | null;
}

export interface PostComment {
  id: number;
  comment: string;
  created_at: string;
  updated_at: string;
}

export interface Post {
  id: number;
  user_id: number;
  cover: string | null;
  description: string;
  created_at: string;
  updated_at: string;
  author: PostAuthor;
  likes: number[];
  comments: (PostComment | number)[];
  my_comment?: PostComment | null;
}

export interface ApiResult<T = unknown> {
  status: "success" | "fail" | "error";
  message: string;
  data: T;
}

export interface AuthLoginResponseData {
  user: User;
  token: string;
}

export interface PostsResponseData {
  posts: Post[];
}

export interface PostDetailResponseData {
  post: Post;
}

export interface UsersResponseData {
  users: User[];
}

export interface UserResponseData {
  user: User;
}

export interface PostCreateResponseData {
  post_id: number;
}
