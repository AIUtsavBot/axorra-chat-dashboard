interface FilterChipsProps {
    label: string
    options: string[]
    selected: string
    onChange: (value: string) => void
}

export default function FilterChips({ label, options, selected, onChange }: FilterChipsProps) {
    return (
        <div className="flex-1 min-w-[200px]">
            <label className="block text-xs font-medium uppercase tracking-wide text-slate-500 mb-3">
                {label}
            </label>
            <div className="flex flex-wrap gap-2">
                <button
                    onClick={() => onChange('all')}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selected === 'all'
                            ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg'
                            : 'bg-slate-800/50 text-slate-400 border border-white/10 hover:border-indigo-500/50 hover:text-white'
                        }`}
                >
                    All
                </button>
                {options.map((option) => (
                    <button
                        key={option}
                        onClick={() => onChange(option)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selected === option
                                ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg'
                                : 'bg-slate-800/50 text-slate-400 border border-white/10 hover:border-indigo-500/50 hover:text-white'
                            }`}
                    >
                        {option}
                    </button>
                ))}
            </div>
        </div>
    )
}
