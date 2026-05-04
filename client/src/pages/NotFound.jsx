import { Link } from 'react-router-dom';
import { Pill, Home, ArrowLeft } from 'lucide-react';

const NotFound = () => {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
            <div className="text-center space-y-6 max-w-md">
                <div className="flex justify-center">
                    <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 animate-bounce">
                        <Pill size={48} />
                    </div>
                </div>
                
                <h1 className="text-6xl font-black text-slate-900">404</h1>
                <h2 className="text-2xl font-bold text-slate-800">Page Not Found</h2>
                <p className="text-slate-500">
                    Oops! The medicine you're looking for doesn't seem to be in our inventory. 
                    It might have been moved or deleted.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 pt-6">
                    <button 
                        onClick={() => window.history.back()}
                        className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-xl text-slate-600 font-bold hover:bg-slate-50 transition-all"
                    >
                        <ArrowLeft size={18} />
                        Go Back
                    </button>
                    <Link 
                        to="/dashboard"
                        className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 rounded-xl text-white font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
                    >
                        <Home size={18} />
                        Dashboard
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default NotFound;
