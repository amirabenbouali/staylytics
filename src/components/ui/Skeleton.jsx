function Skeleton({ className = '' }) {
  return <div className={`animate-pulse rounded-xl bg-[#EEE9E1] ${className}`} />
}

export function ChartSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-5 w-48" />
      <Skeleton className="h-[320px] w-full" />
    </div>
  )
}

export default Skeleton
