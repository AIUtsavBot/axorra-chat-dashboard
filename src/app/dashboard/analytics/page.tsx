'use client'

import { useMemo } from 'react'
import { useChatData } from '@/hooks/useChatData'

interface ChartData {
    [key: string]: number
}

function DonutChart({ data, colors }: { data: ChartData; colors: string[] }) {
    const total = Object.values(data).reduce((a, b) => a + b, 0)

    if (total === 0) {
        return (
            <div className="flex items-center justify-center h-48 text-slate-500">
                No data available
            </div>
        )
    }

    let offset = 0
    const segments = Object.entries(data).map(([label, value], i) => {
        const percent = (value / total) * 100
        const segment = {
            label,
            value,
            percent,
            dashArray: `${percent} ${100 - percent}`,
            dashOffset: -offset,
            color: colors[i % colors.length]
        }
        offset += percent
        return segment
    })

    return (
        <div className="flex flex-col items-center gap-6">
            <svg viewBox="0 0 36 36" className="w-40 h-40 -rotate-90">
                {segments.map((seg, i) => (
                    <circle
                        key={i}
                        cx="18"
                        cy="18"
                        r="15.915"
                        fill="transparent"
                        stroke={seg.color}
                        strokeWidth="3"
                        strokeDasharray={seg.dashArray}
                        strokeDashoffset={seg.dashOffset}
                        className="transition-all duration-500"
                    />
                ))}
            </svg>
            <div className="space-y-2">
                {segments.map((seg, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm">
                        <div className="w-3 h-3 rounded" style={{ backgroundColor: seg.color }} />
                        <span className="text-slate-400 flex-1">{seg.label}</span>
                        <span className="font-medium text-white">{seg.percent.toFixed(1)}%</span>
                    </div>
                ))}
            </div>
        </div>
    )
}

function BarChart({ data }: { data: { date: string; count: number }[] }) {
    const maxVal = Math.max(...data.map(d => d.count), 1)

    if (data.length === 0) {
        return (
            <div className="flex items-center justify-center h-48 text-slate-500">
                No data available
            </div>
        )
    }

    return (
        <div className="flex items-end justify-around h-48 pt-8 gap-2">
            {data.map((item, i) => (
                <div key={i} className="flex flex-col items-center flex-1 max-w-[50px]">
                    <div
                        className="w-full max-w-8 bg-gradient-to-t from-indigo-500 to-purple-500 rounded-t-md transition-all duration-500 relative group"
                        style={{ height: `${(item.count / maxVal) * 100}%`, minHeight: '4px' }}
                    >
                        <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-medium text-white opacity-0 group-hover:opacity-100 transition-opacity">
                            {item.count}
                        </span>
                    </div>
                    <span className="mt-2 text-[10px] text-slate-500 text-center">
                        {new Date(item.date).toLocaleDateString('en', { month: 'short', day: 'numeric' })}
                    </span>
                </div>
            ))}
        </div>
    )
}

export default function AnalyticsPage() {
    const { messages, loading, error, refresh } = useChatData()

    const agentData = useMemo(() => {
        const counts: ChartData = {}
        messages.forEach(m => {
            const type = m.Agent_type || 'Unknown'
            counts[type] = (counts[type] || 0) + 1
        })
        return counts
    }, [messages])

    const platformData = useMemo(() => {
        const counts: ChartData = {}
        messages.forEach(m => {
            const platform = m.messaging_platform || 'Unknown'
            counts[platform] = (counts[platform] || 0) + 1
        })
        return counts
    }, [messages])

    const timelineData = useMemo(() => {
        const days: { [key: string]: number } = {}
        messages.forEach(m => {
            const date = new Date(m.timestamp).toLocaleDateString()
            days[date] = (days[date] || 0) + 1
        })

        return Object.entries(days)
            .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime())
            .slice(-14)
            .map(([date, count]) => ({ date, count }))
    }, [messages])

    return (
        <div className="p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-white">Analytics</h1>
                <button
                    onClick={refresh}
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 border border-white/10 rounded-xl text-slate-400 hover:text-white hover:border-indigo-500/50 transition-all disabled:opacity-50"
                >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`}>
                        <path d="M23 4v6h-6" />
                        <path d="M1 20v-6h6" />
                        <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
                    </svg>
                    Refresh
                </button>
            </div>

            {/* Error State */}
            {error && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400">
                    {error}
                </div>
            )}

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Timeline Chart */}
                <div className="lg:col-span-2 bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-6">Messages Over Time</h3>
                    {loading ? (
                        <div className="h-48 bg-slate-800/50 rounded-xl animate-pulse" />
                    ) : (
                        <BarChart data={timelineData} />
                    )}
                </div>

                {/* Agent Type Chart */}
                <div className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-6">Agent Type Distribution</h3>
                    {loading ? (
                        <div className="h-64 bg-slate-800/50 rounded-xl animate-pulse" />
                    ) : (
                        <DonutChart
                            data={agentData}
                            colors={['#6366f1', '#8b5cf6', '#a855f7', '#d946ef']}
                        />
                    )}
                </div>

                {/* Platform Chart */}
                <div className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-6">Platform Distribution</h3>
                    {loading ? (
                        <div className="h-64 bg-slate-800/50 rounded-xl animate-pulse" />
                    ) : (
                        <DonutChart
                            data={platformData}
                            colors={['#22c55e', '#14b8a6', '#06b6d4', '#0ea5e9']}
                        />
                    )}
                </div>
            </div>
        </div>
    )
}
