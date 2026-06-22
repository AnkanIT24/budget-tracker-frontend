const shimmer = `relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.6s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/5 before:to-transparent`

export function Skeleton({ className = '' }) {
  return <div className={`bg-silver-border rounded-lg ${shimmer} ${className}`} />
}

export function StatCardSkeleton() {
  return (
    <div className="card space-y-3">
      <div className="flex items-start justify-between">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-8 w-8 rounded-xl" />
      </div>
      <Skeleton className="h-8 w-36" />
      <Skeleton className="h-3 w-24" />
    </div>
  )
}

export function RowSkeleton() {
  return (
    <div className="flex items-center gap-3 py-3.5 px-4">
      <Skeleton className="h-9 w-9 rounded-xl flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-3 w-32" />
        <Skeleton className="h-2.5 w-20" />
      </div>
      <Skeleton className="h-4 w-16" />
    </div>
  )
}

export function BudgetCardSkeleton() {
  return (
    <div className="card space-y-3">
      <div className="flex items-start justify-between">
        <div className="space-y-1.5">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-3 w-40" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-7 w-7 rounded-lg" />
          <Skeleton className="h-7 w-7 rounded-lg" />
        </div>
      </div>
      <Skeleton className="h-2 w-full rounded-full" />
      <div className="flex justify-between">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-3 w-20" />
      </div>
    </div>
  )
}

export function CategorySectionSkeleton() {
  return (
    <div className="card p-0 overflow-hidden">
      <div className="px-4 py-3 border-b border-silver-border flex items-center gap-2">
        <Skeleton className="h-2 w-2 rounded-full" />
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-3 w-4 ml-auto" />
      </div>
      <div className="p-2 space-y-1">
        {[0,1,2].map(i => (
          <div key={i} className="flex items-center gap-3 px-2 py-2.5">
            <Skeleton className="h-8 w-8 rounded-xl flex-shrink-0" />
            <Skeleton className="h-3 flex-1 max-w-[120px]" />
            <div className="flex gap-1 ml-auto">
              <Skeleton className="h-6 w-6 rounded-lg" />
              <Skeleton className="h-6 w-6 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function DashboardBudgetSkeleton() {
  return (
    <div className="space-y-4">
      {[0,1,2].map(i => (
        <div key={i} className="space-y-2">
          <div className="flex justify-between">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-3 w-28" />
          </div>
          <Skeleton className="h-1.5 w-full rounded-full" />
        </div>
      ))}
    </div>
  )
}

export function SettingsSkeleton() {
  return (
    <div className="max-w-lg space-y-4">
      <div className="card space-y-4">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4 rounded" />
          <Skeleton className="h-3 w-16" />
        </div>
        <div className="flex items-center gap-4">
          <Skeleton className="h-12 w-12 rounded-2xl flex-shrink-0" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-44" />
          </div>
        </div>
      </div>
      <div className="card space-y-4">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4 rounded" />
          <Skeleton className="h-3 w-24" />
        </div>
        {[0,1,2].map(i => (
          <div key={i} className="space-y-1.5">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-10 w-full rounded-lg" />
          </div>
        ))}
        <Skeleton className="h-10 w-full rounded-lg" />
      </div>
    </div>
  )
}
