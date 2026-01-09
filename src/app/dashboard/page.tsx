'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useChatData } from '@/hooks/useChatData'
import StatsCard from '@/components/StatsCard'
import SessionCard from '@/components/SessionCard'
import FilterChips from '@/components/FilterChips'

export default function DashboardPage() {
    const router = useRouter()
    const { sessions, agentTypes, platforms, loading, error, refresh, getStats, getFilteredSessions } = useChatData()
    const [agentFilter, setAgentFilter] = useState('all')
    const [platformFilter, setPlatformFilter] = useState('all')

    const stats = getStats()
    const filteredSessions = getFilteredSessions(agentFilter, platformFilter)

    return (
        <div className="p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-white">Dashboard</h1>
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

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatsCard
                    title="Total Messages"
                    value={stats.totalMessages}
                    gradient="blue"
                    icon={
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-7 h-7 text-white">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                        </svg>
                    }
                />
                <StatsCard
                    title="Active Sessions"
                    value={stats.totalSessions}
                    gradient="purple"
                    icon={
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-7 h-7 text-white">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                            <circle cx="9" cy="7" r="4" />
                        </svg>
                    }
                />
                <StatsCard
                    title="Platforms"
                    value={stats.totalPlatforms}
                    gradient="green"
                    icon={
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-7 h-7 text-white">
                            <path d="M12 2L2 7l10 5 10-5-10-5z" />
                            <path d="M2 17l10 5 10-5" />
                            <path d="M2 12l10 5 10-5" />
                        </svg>
                    }
                />
                <StatsCard
                    title="Today's Messages"
                    value={stats.todayMessages}
                    gradient="orange"
                    icon={
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-7 h-7 text-white">
                            <circle cx="12" cy="12" r="10" />
                            <polyline points="12 6 12 12 16 14" />
                        </svg>
                    }
                />
            </div>

            {/* Filters */}
            <div className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6 mb-8">
                <div className="flex items-center gap-3 mb-6">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 text-indigo-400">
                        <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                    </svg>
                    <h2 className="text-lg font-semibold text-white">Filter Chats</h2>
                </div>
                <div className="flex flex-wrap gap-8">
                    <FilterChips
                        label="Agent Type"
                        options={agentTypes}
                        selected={agentFilter}
                        onChange={setAgentFilter}
                    />
                    <FilterChips
                        label="Platform"
                        options={platforms}
                        selected={platformFilter}
                        onChange={setPlatformFilter}
                    />
                </div>
            </div>

            {/* Recent Sessions */}
            <div>
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 text-indigo-400">
                            <circle cx="12" cy="12" r="10" />
                            <polyline points="12 6 12 12 16 14" />
                        </svg>
                        <h2 className="text-lg font-semibold text-white">Recent Chat Sessions</h2>
                    </div>
                    <button
                        onClick={() => router.push('/dashboard/sessions')}
                        className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
                    >
                        View All →
                    </button>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="h-48 bg-slate-900/50 rounded-2xl animate-pulse" />
                        ))}
                    </div>
                ) : filteredSessions.length === 0 ? (
                    <div className="text-center py-16 text-slate-500">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-16 h-16 mx-auto mb-4 opacity-50">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                        </svg>
                        <p>No sessions found</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredSessions.slice(0, 6).map((session) => (
                            <SessionCard
                                key={session.id}
                                session={session}
                                onClick={() => router.push(`/dashboard/sessions?session=${session.id}`)}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
