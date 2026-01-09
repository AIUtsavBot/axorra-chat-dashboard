// Platform color configuration
export const platformColors: Record<string, { bg: string; text: string; border: string }> = {
    WHATSAPP: {
        bg: 'bg-green-500/15',
        text: 'text-green-400',
        border: 'border-green-500'
    },
    TELEGRAM: {
        bg: 'bg-blue-500/15',
        text: 'text-blue-400',
        border: 'border-blue-500'
    },
    MESSENGER: {
        bg: 'bg-purple-500/15',
        text: 'text-purple-400',
        border: 'border-purple-500'
    },
    SMS: {
        bg: 'bg-orange-500/15',
        text: 'text-orange-400',
        border: 'border-orange-500'
    },
    WEB: {
        bg: 'bg-indigo-500/15',
        text: 'text-indigo-400',
        border: 'border-indigo-500'
    },
    UNKNOWN: {
        bg: 'bg-slate-500/15',
        text: 'text-slate-400',
        border: 'border-slate-500'
    }
}

// Agent type color configuration
export const agentColors: Record<string, { bg: string; text: string }> = {
    AI: {
        bg: 'bg-purple-500/15',
        text: 'text-purple-400'
    },
    HUMAN: {
        bg: 'bg-cyan-500/15',
        text: 'text-cyan-400'
    },
    BOT: {
        bg: 'bg-pink-500/15',
        text: 'text-pink-400'
    },
    UNKNOWN: {
        bg: 'bg-slate-500/15',
        text: 'text-slate-400'
    }
}

// Get platform color with fallback
export function getPlatformColor(platform: string | null | undefined) {
    const normalizedPlatform = (platform || 'UNKNOWN').toUpperCase()
    return platformColors[normalizedPlatform] || platformColors.UNKNOWN
}

// Get agent type color with fallback
export function getAgentColor(agentType: string | null | undefined) {
    const normalizedAgent = (agentType || 'UNKNOWN').toUpperCase()
    return agentColors[normalizedAgent] || agentColors.UNKNOWN
}

// Format platform name for display
export function formatPlatformName(platform: string | null | undefined): string {
    if (!platform) return 'Unknown'
    return platform.charAt(0).toUpperCase() + platform.slice(1).toLowerCase()
}

// Format agent type for display
export function formatAgentType(agentType: string | null | undefined): string {
    if (!agentType) return 'Unknown'
    return agentType.toUpperCase()
}
