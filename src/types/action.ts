export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface UpdateProfilePayload {
  name: string;
  email: string;
}

export interface ChangePasswordPayload {
  password: string;
  new_password: string;
  new_password_confirmation: string;
}

export interface AddPostPayload {
  description: string;
}

export interface UpdatePostPayload {
  id: number;
  description: string;
}

export interface ChangePostCoverPayload {
  id: number;
  cover: FormData;
}

export interface LikePostPayload {
  id: number;
  like: 0 | 1;
}

export interface AddCommentPayload {
  id: number;
  comment: string;
}

export interface DeleteCommentPayload {
  id: number;
}
