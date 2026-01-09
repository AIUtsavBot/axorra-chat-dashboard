export interface ChatMessage {
    id: number;
    session_id: string;
    message: string;
    timestamp: string;
    Agent_type: string;
    messaging_platform: string | null;
}

export interface ChatSession {
    id: string;
    messages: ChatMessage[];
    agentType: string;
    platform: string | null;
    lastMessage: string;
    messageCount: number;
}

export interface User {
    id: string;
    email: string;
    user_metadata?: {
        full_name?: string;
    };
}
