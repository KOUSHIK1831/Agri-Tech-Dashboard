export default function LoadingSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="card p-5 h-28 bg-gray-200 dark:bg-gray-700 rounded-2xl"
          />
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="card p-5 h-40 bg-gray-200 dark:bg-gray-700 rounded-2xl"
          />
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card p-5 h-48 bg-gray-200 dark:bg-gray-700 rounded-2xl" />
        <div className="card p-5 h-48 bg-gray-200 dark:bg-gray-700 rounded-2xl" />
      </div>
      <div className="card p-5 h-80 bg-gray-200 dark:bg-gray-700 rounded-2xl" />
    </div>
  )
}
