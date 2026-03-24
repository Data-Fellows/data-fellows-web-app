export const SkeletonBox = ({ className = "" }: { className?: string }) => (
  <div className={`animate-pulse bg-muted rounded-md ${className}`} />
);
