import { useTranslation } from 'react-i18next'
import { Filter, X, ChevronDown, Check } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

export default function FilterPanel({
  tempFilters,
  setTempFilters,
  onFetch,
  states,
  districts,
  commodities,
}: any) {
  const { t } = useTranslation()
  const [open, setOpen] = useState<string | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(null)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const Select = ({
    label,
    value,
    options,
    onSelect,
    isOpen,
    onToggle,
    placeholder,
  }: any) => (
    <div className="relative flex-1 min-w-[140px]">
      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 ml-1">
        {label}
      </label>
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-3 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm transition-all hover:border-green-500 focus:ring-2 focus:ring-green-500/20"
      >
        <span
          className={`truncate ${!value ? 'text-gray-400' : 'text-gray-900 dark:text-white font-medium'}`}
        >
          {value || placeholder}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl z-[60] py-1 max-h-60 overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
          <button
            onClick={() => {
              onSelect('')
              onToggle()
            }}
            className="w-full flex items-center justify-between px-3 py-2 text-sm text-left text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            {placeholder}
            {!value && <Check className="w-3.5 h-3.5 text-green-600" />}
          </button>
          {options.map((opt: string) => (
            <button
              key={opt}
              onClick={() => {
                onSelect(opt)
                onToggle()
              }}
              className={`w-full flex items-center justify-between px-3 py-2 text-sm text-left transition-colors ${
                value === opt
                  ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 font-medium'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <span className="truncate">{opt}</span>
              {value === opt && <Check className="w-3.5 h-3.5" />}
            </button>
          ))}
        </div>
      )}
    </div>
  )

  return (
    <div className="flex flex-wrap gap-3 items-end flex-1" ref={dropdownRef}>
      <Select
        label={t('state')}
        value={tempFilters.state}
        options={states}
        onSelect={(v: string) =>
          setTempFilters((f: any) => ({
            ...f,
            state: v,
            district: '',
            commodity: '',
          }))
        }
        isOpen={open === 'state'}
        onToggle={() => setOpen(open === 'state' ? null : 'state')}
        placeholder={t('allStates')}
      />
      <Select
        label={t('district')}
        value={tempFilters.district}
        options={districts}
        onSelect={(v: string) =>
          setTempFilters((f: any) => ({ ...f, district: v, commodity: '' }))
        }
        isOpen={open === 'district'}
        onToggle={() => setOpen(open === 'district' ? null : 'district')}
        placeholder={t('allDistricts')}
      />
      <Select
        label={t('commodity')}
        value={tempFilters.commodity}
        options={commodities}
        onSelect={(v: string) =>
          setTempFilters((f: any) => ({ ...f, commodity: v }))
        }
        isOpen={open === 'commodity'}
        onToggle={() => setOpen(open === 'commodity' ? null : 'commodity')}
        placeholder={t('allCommodities')}
      />
      <button
        onClick={onFetch}
        className="h-[42px] px-6 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-green-600/20 transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
      >
        <Filter className="w-4 h-4" />
        {t('fetch')}
      </button>
      {(tempFilters.state || tempFilters.district || tempFilters.commodity) && (
        <button
          onClick={() =>
            setTempFilters({ state: '', district: '', commodity: '' })
          }
          className="h-[42px] px-3 text-gray-400 hover:text-red-500 transition-colors"
          title="Clear Filters"
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </div>
  )
}
