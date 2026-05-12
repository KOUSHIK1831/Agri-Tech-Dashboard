import type { LucideIcon } from 'lucide-react'

interface StatCardProps {
  icon: LucideIcon
  label: string
  value: string | number
  sub?: string
  color?: 'green' | 'blue' | 'red' | 'orange'
}

export default function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  color = 'green',
}: StatCardProps) {
  const colors = {
    green:
      'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400',
    blue: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
    red: 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400',
    orange:
      'bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400',
  }

  return (
    <div className="card p-4 flex items-center gap-4">
      <div className={`p-3 rounded-2xl ${colors[color]}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1.5">
          {label}
        </p>
        <p className="text-lg font-black text-gray-900 dark:text-white truncate leading-tight">
          {value}
        </p>
        {sub && (
          <p className="text-[10px] font-medium text-gray-400 truncate mt-0.5">
            {sub}
          </p>
        )}
      </div>
    </div>
  )
}
