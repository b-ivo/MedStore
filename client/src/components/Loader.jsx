import { Loader2 } from 'lucide-react';

const Loader = ({ fullPage = false, size = 40 }) => {
    const content = (
        <div className="flex flex-col items-center justify-center gap-3">
            <Loader2 className="text-blue-600 animate-spin" size={size} />
            <p className="text-slate-500 font-medium text-sm animate-pulse">Processing...</p>
        </div>
    );

    if (fullPage) {
        return (
            <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-[100] flex items-center justify-center">
                {content}
            </div>
        );
    }

    return content;
};

export default Loader;
