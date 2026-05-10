export default function StatCard({ icon: Icon, label, value, sub, color = 'green', onClick }) {
  const colors = {
    green: 'from-green-500 to-green-600',
    blue: 'from-blue-500 to-blue-600',
    orange: 'from-orange-500 to-orange-600',
    red: 'from-red-500 to-red-600',
    purple: 'from-purple-500 to-purple-600',
  }
  return (
    <div onClick={onClick} className={`card p-4 cursor-pointer hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 ${onClick ? 'active:scale-95' : ''}`}>
      <div className="flex items-start gap-3">
        <div className={`p-2.5 rounded-xl bg-gradient-to-br ${colors[color]} text-white shrink-0`}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{label}</p>
          <p className="text-lg font-bold text-gray-900 dark:text-white truncate">{value}</p>
          {sub && <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">{sub}</p>}
        </div>
      </div>
    </div>
  )
}
