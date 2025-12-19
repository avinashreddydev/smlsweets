export default function Loading() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-2 border-gray-100 border-t-black rounded-full animate-spin" />
                <span className="text-xs font-bold uppercase tracking-widest text-gray-400 animate-pulse">
                    Loading
                </span>
            </div>
        </div>
    );
}
