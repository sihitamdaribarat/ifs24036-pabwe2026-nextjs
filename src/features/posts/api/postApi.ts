import { fetchApi } from "@/helpers/apiHelper";
import {
  ApiResult,
  PostsResponseData,
  PostDetailResponseData,
  PostCreateResponseData,
} from "@/types";
import {
  AddCommentPayload,
  AddPostPayload,
  LikePostPayload,
  UpdatePostPayload,
} from "@/types/action";

export async function getPosts(
  is_me?: number | boolean
): Promise<ApiResult<PostsResponseData>> {
  return fetchApi<ApiResult<PostsResponseData>>("/posts", {
    params: is_me ? { is_me: 1 } : undefined,
  });
}

export async function getPostDetail(
  id: number
): Promise<ApiResult<PostDetailResponseData>> {
  return fetchApi<ApiResult<PostDetailResponseData>>(`/posts/${id}`);
}

export async function postPost(
  payload: AddPostPayload
): Promise<ApiResult<PostCreateResponseData>> {
  return fetchApi<ApiResult<PostCreateResponseData>>("/posts", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function putPost(
  payload: UpdatePostPayload
): Promise<ApiResult<unknown>> {
  return fetchApi<ApiResult<unknown>>(`/posts/${payload.id}`, {
    method: "PUT",
    body: JSON.stringify({ description: payload.description }),
  });
}

export async function postCover(
  id: number,
  formData: FormData
): Promise<ApiResult<unknown>> {
  return fetchApi<ApiResult<unknown>>(`/posts/${id}/cover`, {
    method: "POST",
    body: formData,
  });
}

export async function deletePost(id: number): Promise<ApiResult<unknown>> {
  return fetchApi<ApiResult<unknown>>(`/posts/${id}`, {
    method: "DELETE",
  });
}

export async function postLike(
  payload: LikePostPayload
): Promise<ApiResult<unknown>> {
  return fetchApi<ApiResult<unknown>>(`/posts/${payload.id}/likes`, {
    method: "POST",
    body: JSON.stringify({ like: payload.like }),
  });
}

export async function postComment(
  payload: AddCommentPayload
): Promise<ApiResult<unknown>> {
  return fetchApi<ApiResult<unknown>>(`/posts/${payload.id}/comments`, {
    method: "POST",
    body: JSON.stringify({ comment: payload.comment }),
  });
}

export async function deleteComment(id: number): Promise<ApiResult<unknown>> {
  return fetchApi<ApiResult<unknown>>(`/posts/${id}/comments`, {
    method: "DELETE",
  });
}

export async function deleteAllPosts(): Promise<ApiResult<unknown>> {
  return fetchApi<ApiResult<unknown>>("/posts", {
    method: "DELETE",
  });
}

export const postApi = {
  getPosts,
  getPostDetail,
  postPost,
  putPost,
  postCover,
  deletePost,
  postLike,
  postComment,
  deleteComment,
  deleteAllPosts,
};

export default postApi;
