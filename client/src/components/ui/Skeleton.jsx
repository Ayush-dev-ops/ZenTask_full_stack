export function Skeleton({ className = '' }) {
  return <div className={`skeleton ${className}`} />
}

export function TaskCardSkeleton() {
  return (
    <div className="glass rounded-xl p-4 space-y-3">
      <div className="flex items-start justify-between gap-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-5 w-14 rounded-lg" />
      </div>
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-2/3" />
      <div className="flex items-center justify-between">
        <Skeleton className="w-6 h-6 rounded-full" />
        <Skeleton className="h-3 w-16" />
      </div>
    </div>
  )
}

export function ProjectCardSkeleton() {
  return (
    <div className="card space-y-4">
      <div className="flex items-start justify-between">
        <div className="space-y-2 flex-1">
          <Skeleton className="h-5 w-2/3" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-3/4" />
        </div>
        <Skeleton className="w-10 h-10 rounded-xl" />
      </div>
      <div className="flex items-center gap-2">
        {[1, 2, 3].map(i => <Skeleton key={i} className="w-7 h-7 rounded-full" />)}
      </div>
      <Skeleton className="h-1.5 w-full rounded-full" />
      <div className="flex items-center justify-between">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-3 w-16" />
      </div>
    </div>
  )
}

export function StatCardSkeleton() {
  return (
    <div className="card space-y-3">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="w-10 h-10 rounded-xl" />
      </div>
      <Skeleton className="h-8 w-16" />
      <Skeleton className="h-3 w-28" />
    </div>
  )
}

export function TableRowSkeleton({ cols = 4 }) {
  return (
    <tr>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <Skeleton className="h-4 w-full" />
        </td>
      ))}
    </tr>
  )
}
