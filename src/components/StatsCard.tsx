interface StatsCardProps {
    title: string
    value: number | string
    icon: React.ReactNode
    gradient: 'blue' | 'purple' | 'green' | 'orange'
}

const gradients = {
    blue: 'from-blue-500 to-indigo-500',
    purple: 'from-purple-500 to-pink-500',
    green: 'from-green-500 to-teal-500',
    orange: 'from-orange-500 to-yellow-500'
}

export default function StatsCard({ title, value, icon, gradient }: StatsCardProps) {
    return (
        <div className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-white/20 hover:-translate-y-1 transition-all duration-300 group">
            <div className="flex items-center gap-5">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${gradients[gradient]} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                    {icon}
                </div>
                <div>
                    <p className="text-3xl font-bold text-white">{typeof value === 'number' ? value.toLocaleString() : value}</p>
                    <p className="text-sm text-slate-400">{title}</p>
                </div>
            </div>
        </div>
    )
}
