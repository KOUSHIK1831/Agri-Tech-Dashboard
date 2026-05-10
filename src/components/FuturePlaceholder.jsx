import { Brain, CloudRain, Mic, MapPin } from 'lucide-react'

const features = [
  { icon: Brain, label: 'AI Price Prediction', labelTe: 'AI ధర అంచనా', color: 'purple', desc: 'ML-powered 7-day price forecast' },
  { icon: CloudRain, label: 'Weather Alerts', labelTe: 'వాతావరణ హెచ్చరికలు', color: 'blue', desc: 'Real-time weather impact on crops' },
  { icon: Mic, label: 'Voice Assistant', labelTe: 'వాయిస్ అసిస్టెంట్', color: 'orange', desc: 'Ask prices in Telugu/Hindi' },
  { icon: MapPin, label: 'Nearby Mandi', labelTe: 'సమీప మండి', color: 'green', desc: 'Find nearest market by GPS' },
]

const colors = {
  purple: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800',
  blue: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800',
  orange: 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-800',
  green: 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800',
}

export default function FuturePlaceholder({ lang = 'en' }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {features.map(({ icon: Icon, label, labelTe, color, desc }) => (
        <div key={label} className={`card p-4 border ${colors[color]} opacity-80 hover:opacity-100 transition-opacity cursor-not-allowed`}>
          <Icon className="w-6 h-6 mb-2" />
          <p className="font-semibold text-sm">{lang === 'te' ? labelTe : label}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{desc}</p>
          <span className="mt-2 inline-block text-xs bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-full">
            Coming Soon
          </span>
        </div>
      ))}
    </div>
  )
}
