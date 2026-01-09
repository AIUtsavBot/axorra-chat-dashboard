'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import Sidebar from '@/components/Sidebar'
import LoadingSpinner from '@/components/LoadingSpinner'

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const { user, loading } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (!loading && !user) {
            router.push('/')
        }
    }, [user, loading, router])

    if (loading) {
        return <LoadingSpinner />
    }

    if (!user) {
        return <LoadingSpinner />
    }

    return (
        <div className="flex min-h-screen bg-slate-950 bg-grid-pattern">
            <Sidebar />
            <main className="flex-1 ml-64 min-h-screen">
                {children}
            </main>
        </div>
    )
}
