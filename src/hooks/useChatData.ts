'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { ChatMessage, ChatSession } from '@/types'

const CHAT_TABLE = 'axorra_chat_sessions_histories'

export function useChatData() {
    const [messages, setMessages] = useState<ChatMessage[]>([])
    const [sessions, setSessions] = useState<ChatSession[]>([])
    const [agentTypes, setAgentTypes] = useState<string[]>([])
    const [platforms, setPlatforms] = useState<string[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const supabase = createClient()

    const fetchData = useCallback(async () => {
        setLoading(true)
        setError(null)

        try {
            const { data, error: fetchError } = await supabase
                .from(CHAT_TABLE)
                .select('*')
                .order('timestamp', { ascending: false })

            if (fetchError) throw fetchError

            const fetchedMessages = data || []
            setMessages(fetchedMessages)

            // Extract unique agent types and platforms
            const types = new Set<string>()
            const plats = new Set<string>()

            fetchedMessages.forEach((msg: ChatMessage) => {
                if (msg.Agent_type) types.add(msg.Agent_type)
                if (msg.messaging_platform) plats.add(msg.messaging_platform)
            })

            setAgentTypes(Array.from(types))
            setPlatforms(Array.from(plats))

            // Group messages by session
            const sessionMap = new Map<string, ChatSession>()
            fetchedMessages.forEach((msg: ChatMessage) => {
                if (!sessionMap.has(msg.session_id)) {
                    sessionMap.set(msg.session_id, {
                        id: msg.session_id,
                        messages: [],
                        agentType: msg.Agent_type,
                        platform: msg.messaging_platform,
                        lastMessage: msg.timestamp,
                        messageCount: 0
                    })
                }
                const session = sessionMap.get(msg.session_id)!
                session.messages.push(msg)
                session.messageCount = session.messages.length
            })

            setSessions(Array.from(sessionMap.values()))
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch data')
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchData()
    }, [fetchData])

    const getStats = useCallback(() => {
        const today = new Date().toDateString()
        const todayMessages = messages.filter(m =>
            new Date(m.timestamp).toDateString() === today
        ).length

        return {
            totalMessages: messages.length,
            totalSessions: sessions.length,
            totalPlatforms: platforms.length,
            todayMessages
        }
    }, [messages, sessions, platforms])

    const getFilteredSessions = useCallback((agentTypeFilter: string, platformFilter: string) => {
        return sessions.filter(session => {
            const agentMatch = agentTypeFilter === 'all' || session.agentType === agentTypeFilter
            const platformMatch = platformFilter === 'all' || session.platform === platformFilter
            return agentMatch && platformMatch
        })
    }, [sessions])

    return {
        messages,
        sessions,
        agentTypes,
        platforms,
        loading,
        error,
        refresh: fetchData,
        getStats,
        getFilteredSessions
    }
}
