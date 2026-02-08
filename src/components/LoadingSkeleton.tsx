import { MessageSkeleton } from "./MessageSkeleton";

interface LoadingSkeletonProps {
  skeletonCount?: number;
}

export function LoadingSkeleton({ skeletonCount = 50 }: LoadingSkeletonProps) {
  const skeletons = Array.from({ length: skeletonCount }, (_, index) => index);

  return (
    <>
      {skeletons.map((id) => (
        <MessageSkeleton key={`skeleton-${id}`} />
      ))}
    </>
  );
}
