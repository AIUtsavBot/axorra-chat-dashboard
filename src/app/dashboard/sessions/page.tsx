'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { useChatData } from '@/hooks/useChatData'
import { ChatSession, ChatMessage } from '@/types'
import { getPlatformColor, getAgentColor, formatPlatformName, formatAgentType } from '@/lib/colors'

function formatDateTime(timestamp: string): string {
  return new Date(timestamp).toLocaleString()
}

function formatTime(timestamp: string): string {
  const date = new Date(timestamp)
  const now = new Date()
  const diff = now.getTime() - date.getTime()

  if (diff < 60000) return 'Just now'
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`
  return date.toLocaleDateString()
}

// Platform icon components
function PlatformIcon({ platform }: { platform: string | null }) {
  const platformName = (platform || '').toUpperCase()
  
  if (platformName === 'WHATSAPP') {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
    )
  }
  
  if (platformName === 'TELEGRAM') {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
      </svg>
    )
  }
  
  // Default chat icon
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  )
}

export default function SessionsPage() {
  const searchParams = useSearchParams()
  const { sessions, loading, error, refresh } = useChatData()
  const [selectedSession, setSelectedSession] = useState<ChatSession | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  // Handle URL parameter for session selection
  useEffect(() => {
    const sessionId = searchParams.get('session')
    if (sessionId && sessions.length > 0) {
      const session = sessions.find(s => s.id === sessionId)
      if (session) setSelectedSession(session)
    }
  }, [searchParams, sessions])

  const filteredSessions = sessions.filter(session =>
    session.id.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const sortedMessages = selectedSession?.messages
    .slice()
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())

  return (
    <div className="p-8 h-screen flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-white">Chat Sessions</h1>
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

      {/* Main Content */}
      <div className="flex-1 grid grid-cols-[360px_1fr] gap-6 min-h-0">
        {/* Sessions List */}
        <div className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-2xl flex flex-col overflow-hidden">
          <div className="p-4 border-b border-white/10">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-white">All Sessions</h3>
              <span className="text-sm text-slate-500">{sessions.length} sessions</span>
            </div>
            <div className="relative">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500">
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
              <input
                type="text"
                placeholder="Search sessions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-white/10 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {loading ? (
              [...Array(8)].map((_, i) => (
                <div key={i} className="h-20 bg-slate-800/50 rounded-xl animate-pulse" />
              ))
            ) : filteredSessions.length === 0 ? (
              <div className="text-center py-8 text-slate-500">No sessions found</div>
            ) : (
              filteredSessions.map((session) => {
                const platformColor = getPlatformColor(session.platform)
                const agentColor = getAgentColor(session.agentType)
                
                return (
                  <button
                    key={session.id}
                    onClick={() => setSelectedSession(session)}
                    className={`w-full text-left p-4 rounded-xl transition-all ${
                      selectedSession?.id === session.id
                        ? 'bg-indigo-500/15 border border-indigo-500/50'
                        : 'hover:bg-white/5 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-sm text-indigo-400">
                        {session.id.substring(0, 12)}...
                      </span>
                      <span className="text-xs text-slate-500">
                        {formatTime(session.lastMessage)}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <span className={`text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded ${agentColor.bg} ${agentColor.text}`}>
                        {formatAgentType(session.agentType)}
                      </span>
                      <span className={`text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded flex items-center gap-1 ${platformColor.bg} ${platformColor.text}`}>
                        <PlatformIcon platform={session.platform} />
                        {formatPlatformName(session.platform)}
                      </span>
                    </div>
                    <div className="mt-2 text-xs text-slate-500">
                      {session.messageCount} message{session.messageCount !== 1 ? 's' : ''}
                    </div>
                  </button>
                )
              })
            )}
          </div>
        </div>

        {/* Chat Detail */}
        <div className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-2xl flex flex-col overflow-hidden">
          {selectedSession ? (
            <>
              <div className="p-5 border-b border-white/10">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-white mb-1">
                      Session: {selectedSession.id.substring(0, 20)}...
                    </h3>
                    <p className="text-xs text-slate-500">
                      User ID: {selectedSession.id}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {(() => {
                      const agentColor = getAgentColor(selectedSession.agentType)
                      return (
                        <span className={`text-xs font-semibold uppercase tracking-wide px-2.5 py-1 rounded-lg ${agentColor.bg} ${agentColor.text}`}>
                          {formatAgentType(selectedSession.agentType)}
                        </span>
                      )
                    })()}
                    {(() => {
                      const platformColor = getPlatformColor(selectedSession.platform)
                      return (
                        <span className={`text-xs font-semibold uppercase tracking-wide px-2.5 py-1 rounded-lg flex items-center gap-1 ${platformColor.bg} ${platformColor.text}`}>
                          <PlatformIcon platform={selectedSession.platform} />
                          {formatPlatformName(selectedSession.platform)}
                        </span>
                      )
                    })()}
                  </div>
                </div>
              </div>

              {/* Messages with platform color-coding */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {sortedMessages?.map((msg, index) => {
                  const platformColor = getPlatformColor(msg.messaging_platform)
                  const isUser = msg.Agent_type?.toUpperCase() === 'HUMAN'
                  const isAI = msg.Agent_type?.toUpperCase() === 'AI'
                  
                  return (
                    <div
                      key={msg.id}
                      className={`rounded-xl p-4 border-l-4 ${platformColor.border} ${
                        isUser 
                          ? 'bg-slate-700/50 ml-8' 
                          : isAI 
                            ? 'bg-slate-800/70 mr-8'
                            : 'bg-slate-800/50'
                      }`}
                    >
                      {/* Message Header */}
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {/* Platform indicator */}
                          <span className={`flex items-center gap-1 ${platformColor.text}`}>
                            <PlatformIcon platform={msg.messaging_platform} />
                            <span className="text-xs font-medium">
                              {formatPlatformName(msg.messaging_platform)}
                            </span>
                          </span>
                          {/* Agent type indicator */}
                          <span className={`text-xs px-1.5 py-0.5 rounded ${getAgentColor(msg.Agent_type).bg} ${getAgentColor(msg.Agent_type).text}`}>
                            {formatAgentType(msg.Agent_type)}
                          </span>
                        </div>
                        <span className="text-xs text-slate-500">
                          {formatDateTime(msg.timestamp)}
                        </span>
                      </div>
                      
                      {/* Message Content */}
                      <p className="text-sm text-white leading-relaxed whitespace-pre-wrap">
                        {msg.message}
                      </p>
                    </div>
                  )
                })}
              </div>

              {/* Legend */}
              <div className="p-4 border-t border-white/10 bg-slate-900/50">
                <p className="text-xs text-slate-500 mb-2">Platform Colors:</p>
                <div className="flex flex-wrap gap-3">
                  <div className="flex items-center gap-1.5 text-green-400 text-xs">
                    <div className="w-3 h-3 rounded bg-green-500"></div>
                    WhatsApp
                  </div>
                  <div className="flex items-center gap-1.5 text-blue-400 text-xs">
                    <div className="w-3 h-3 rounded bg-blue-500"></div>
                    Telegram
                  </div>
                  <div className="flex items-center gap-1.5 text-purple-400 text-xs">
                    <div className="w-3 h-3 rounded bg-purple-500"></div>
                    Messenger
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-400 text-xs">
                    <div className="w-3 h-3 rounded bg-slate-500"></div>
                    Other
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-500">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-16 h-16 mb-4 opacity-50">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              <p>Select a session to view messages</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
