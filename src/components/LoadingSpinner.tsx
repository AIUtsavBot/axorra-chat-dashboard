export default function LoadingSpinner() {
    return (
        <div className="fixed inset-0 bg-slate-950 flex items-center justify-center z-50">
            <div className="relative w-28 h-28 flex items-center justify-center">
                {/* Spinning rings */}
                <div className="absolute inset-0 border-[3px] border-transparent border-t-indigo-500 rounded-full animate-spin" />
                <div className="absolute inset-3 border-[3px] border-transparent border-t-purple-500 rounded-full animate-spin" style={{ animationDuration: '1.2s', animationDirection: 'reverse' }} />
                <div className="absolute inset-6 border-[3px] border-transparent border-t-pink-500 rounded-full animate-spin" style={{ animationDuration: '0.9s' }} />

                {/* Logo text */}
                <span className="text-sm font-bold tracking-widest bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                    AXORRA
                </span>
            </div>
        </div>
    )
}
