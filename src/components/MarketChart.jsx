import { useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Legend,
} from 'recharts'
import { topN, groupBy } from '../utils/helpers'

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl p-3 shadow-lg text-sm">
      <p className="font-semibold text-gray-800 dark:text-white mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }}>
          {p.name}: ₹{Number(p.value).toLocaleString('en-IN')}
        </p>
      ))}
    </div>
  )
}

function CommodityChart({ data }) {
  const top = topN(data, 'modal_price', 8).map(r => ({
    name: r.commodity?.length > 12 ? r.commodity.slice(0, 12) + '…' : r.commodity,
    Min: Number(r.min_price),
    Modal: Number(r.modal_price),
    Max: Number(r.max_price),
  }))
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={top} margin={{ top: 5, right: 10, left: 0, bottom: 40 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey="name" tick={{ fontSize: 11 }} angle={-30} textAnchor="end" />
        <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`} />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Bar dataKey="Min" fill="#f87171" radius={[4, 4, 0, 0]} />
        <Bar dataKey="Modal" fill="#4ade80" radius={[4, 4, 0, 0]} />
        <Bar dataKey="Max" fill="#60a5fa" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

function DistrictChart({ data }) {
  const grouped = groupBy(data, 'district')
  const chartData = Object.entries(grouped).slice(0, 8).map(([district, records]) => ({
    name: district?.length > 10 ? district.slice(0, 10) + '…' : district,
    avg: Math.round(records.reduce((s, r) => s + Number(r.modal_price), 0) / records.length),
    count: records.length,
  }))
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 40 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey="name" tick={{ fontSize: 11 }} angle={-30} textAnchor="end" />
        <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`} />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="avg" name="Avg Modal Price" fill="#818cf8" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

function MarketModalChart({ data }) {
  const top = topN(data, 'modal_price', 8).map(r => ({
    name: r.market?.length > 12 ? r.market.slice(0, 12) + '…' : r.market,
    modal: Number(r.modal_price),
    commodity: r.commodity,
  }))
  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={top} margin={{ top: 5, right: 10, left: 0, bottom: 40 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey="name" tick={{ fontSize: 11 }} angle={-30} textAnchor="end" />
        <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`} />
        <Tooltip content={<CustomTooltip />} />
        <Line type="monotone" dataKey="modal" name="Modal Price" stroke="#f59e0b" strokeWidth={2} dot={{ r: 4 }} />
      </LineChart>
    </ResponsiveContainer>
  )
}

export default function MarketChart({ data, t }) {
  const [tab, setTab] = useState(0)
  if (!data.length) return null

  const TABS = [t.priceComparison, t.districtChart, t.marketChart]

  return (
    <div className="card p-4">
      <div className="flex gap-2 mb-4 flex-wrap">
        {TABS.map((label, i) => (
          <button key={i} onClick={() => setTab(i)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${tab === i ? 'bg-green-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}>
            {label}
          </button>
        ))}
      </div>
      {tab === 0 && <CommodityChart data={data} />}
      {tab === 1 && <DistrictChart data={data} />}
      {tab === 2 && <MarketModalChart data={data} />}
    </div>
  )
}
