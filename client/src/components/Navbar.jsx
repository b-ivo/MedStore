import { useAuth } from '../contexts/AuthContext';
import { Search, Menu, Bell } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NotificationDropdown from './NotificationDropdown';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility for merging tailwind classes
 */
function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const Navbar = ({ onMenuClick }) => {
    const { user } = useAuth();
    const [search, setSearch] = useState('');
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        if (search.trim()) navigate(`/medicines?q=${search}`);
    };

    return (
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-4 md:px-8 sticky top-0 z-30 gap-4">
            <div className="flex items-center gap-4">
                {/* Hamburger — mobile only */}
                <button
                    onClick={onMenuClick}
                    className="lg:hidden w-10 h-10 flex items-center justify-center bg-slate-50 text-slate-500 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all flex-shrink-0"
                >
                    <Menu size={22} />
                </button>

                {/* Search - hidden on very small screens, expandable or full on md */}
                <form onSubmit={handleSearch} className="relative flex-1 min-w-0 max-w-md group hidden sm:block">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                    <input
                        type="text"
                        placeholder="Search anything..."
                        className="w-full bg-slate-50 border-transparent border-2 rounded-2xl py-2.5 pl-12 pr-4 focus:bg-white focus:border-blue-100 focus:ring-4 focus:ring-blue-50 outline-none transition-all text-sm font-medium"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </form>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-3 md:gap-6 flex-shrink-0">
                <button className="sm:hidden w-10 h-10 flex items-center justify-center bg-slate-50 text-slate-500 rounded-xl">
                    <Search size={20} />
                </button>
                
                <NotificationDropdown />

                <div className="h-8 w-px bg-slate-100 hidden md:block" />

                <div className="flex items-center gap-3 group cursor-pointer">
                    <div className="text-right hidden md:block">
                        <p className="text-sm font-bold text-slate-900 leading-tight group-hover:text-blue-600 transition-colors">{user?.fullName}</p>
                        <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">{user?.role}</p>
                    </div>
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 text-white rounded-xl flex items-center justify-center font-bold border-2 border-white shadow-lg shadow-blue-100 text-sm flex-shrink-0">
                        {user?.fullName?.charAt(0)}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;

