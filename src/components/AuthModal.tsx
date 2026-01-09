'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'

export default function AuthModal() {
    const [mode, setMode] = useState<'login' | 'signup'>('login')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)

    // Form fields
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [fullName, setFullName] = useState('')

    const { signIn, signUp } = useAuth()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setSuccess(null)

        // Validation
        if (!email || !password) {
            setError('Please fill in all fields')
            return
        }

        if (mode === 'signup') {
            if (!fullName) {
                setError('Please enter your full name')
                return
            }
            if (password.length < 6) {
                setError('Password must be at least 6 characters')
                return
            }
        }

        setLoading(true)

        try {
            if (mode === 'login') {
                const { error } = await signIn(email, password)
                if (error) throw error
            } else {
                const { error, needsConfirmation } = await signUp(email, password, fullName)
                if (error) throw error
                if (needsConfirmation) {
                    setSuccess('Account created! Please check your email to confirm your account.')
                    setEmail('')
                    setPassword('')
                    setFullName('')
                }
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

            {/* Modal */}
            <div className="relative z-10 w-full max-w-md mx-4">
                <div className="bg-slate-900/90 border border-white/10 rounded-3xl p-8 backdrop-blur-xl shadow-2xl">
                    {/* Logo */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 mb-4 shadow-lg shadow-purple-500/30">
                            <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M12 2L2 7L12 12L22 7L12 2Z" />
                                <path d="M2 17L12 22L22 17" />
                                <path d="M2 12L12 17L22 12" />
                            </svg>
                        </div>
                        <h1 className="text-3xl font-bold tracking-wider bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                            AXORRA
                        </h1>
                        <p className="text-slate-400 mt-2">Chat Analytics Dashboard</p>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-2 mb-6 p-1.5 bg-slate-800/50 rounded-xl">
                        <button
                            onClick={() => { setMode('login'); setError(null); setSuccess(null); }}
                            className={`flex-1 py-3 rounded-lg font-medium transition-all ${mode === 'login'
                                    ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg'
                                    : 'text-slate-400 hover:text-white'
                                }`}
                        >
                            Sign In
                        </button>
                        <button
                            onClick={() => { setMode('signup'); setError(null); setSuccess(null); }}
                            className={`flex-1 py-3 rounded-lg font-medium transition-all ${mode === 'signup'
                                    ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg'
                                    : 'text-slate-400 hover:text-white'
                                }`}
                        >
                            Sign Up
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {mode === 'signup' && (
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-2">Full Name</label>
                                <input
                                    type="text"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    placeholder="Enter your name"
                                    className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                                />
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder={mode === 'signup' ? 'Create a password' : 'Enter your password'}
                                className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3.5 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold rounded-xl shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                        >
                            {loading
                                ? (mode === 'login' ? 'Signing in...' : 'Creating account...')
                                : (mode === 'login' ? 'Sign In' : 'Create Account')
                            }
                        </button>
                    </form>

                    {/* Error/Success Messages */}
                    {error && (
                        <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm text-center">
                            {error}
                        </div>
                    )}
                    {success && (
                        <div className="mt-4 p-3 bg-green-500/10 border border-green-500/30 rounded-xl text-green-400 text-sm text-center">
                            {success}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
