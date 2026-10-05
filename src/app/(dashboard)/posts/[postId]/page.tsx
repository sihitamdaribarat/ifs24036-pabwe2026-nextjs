import { DetailPage } from "@/features/posts/pages/DetailPage";

export default async function Page({
  params,
}: {
  params: Promise<{ postId: string }> | { postId: string };
}) {
  const resolvedParams = await Promise.resolve(params);
  return <DetailPage postId={Number(resolvedParams.postId)} />;
}
