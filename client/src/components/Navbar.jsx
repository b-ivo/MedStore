import { useAuth } from '../contexts/AuthContext';
import { Search, User } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NotificationDropdown from './NotificationDropdown';

const Navbar = () => {
    const { user } = useAuth();
    const [search, setSearch] = useState('');
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        if (search.trim()) {
            navigate(`/medicines?q=${search}`);
        }
    };

    return (
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-10">
            <div className="flex items-center gap-4 flex-1 max-w-xl">
                <form onSubmit={handleSearch} className="relative w-full group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search medicines, orders, customers..." 
                        className="w-full bg-slate-50 border-none rounded-full py-2 pl-10 pr-4 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </form>
            </div>

            <div className="flex items-center gap-4">
                <NotificationDropdown />
                
                <div className="h-8 w-px bg-slate-200 mx-1"></div>

                <div className="flex items-center gap-3">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-semibold text-slate-900">{user?.fullName}</p>
                        <p className="text-xs text-slate-500">{user?.role}</p>
                    </div>
                    <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold border border-blue-200 shadow-sm">
                        {user?.fullName?.charAt(0)}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
