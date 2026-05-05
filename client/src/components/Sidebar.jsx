import { Link, useLocation } from 'react-router-dom';
import { 
    LayoutDashboard, Pill, Tags, Truck, ShoppingCart, 
    ClipboardList, BarChart3, Users, UserCircle, LogOut, X
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility for merging tailwind classes
 */
function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const SidebarItem = ({ to, icon: Icon, label, active, onClick }) => (
    <Link
        to={to}
        onClick={onClick}
        className={cn(
            "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
            active
            ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 translate-x-1'
            : 'text-slate-600 hover:bg-blue-50 hover:text-blue-600'
        )}
    >
        <Icon size={20} className={cn(
            "transition-transform duration-200",
            active ? "scale-110" : "group-hover:scale-110"
        )} />
        <span className="font-semibold tracking-tight">{label}</span>
    </Link>
);

const Sidebar = ({ isOpen, onClose }) => {
    const { user, logout } = useAuth();
    const location = useLocation();

    const menuItems = [
        { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard',        roles: ['Admin', 'Pharmacist', 'Inventory Manager'] },
        { to: '/medicines', icon: Pill,            label: 'Medicines',         roles: ['Admin', 'Pharmacist', 'Inventory Manager'] },
        { to: '/categories',icon: Tags,            label: 'Categories',        roles: ['Admin', 'Inventory Manager'] },
        { to: '/suppliers',  icon: Truck,           label: 'Suppliers',         roles: ['Admin', 'Inventory Manager'] },
        { to: '/purchases',  icon: ShoppingCart,    label: 'Purchases',         roles: ['Admin', 'Inventory Manager'] },
        { to: '/sales',      icon: ClipboardList,   label: 'Sales',             roles: ['Admin', 'Pharmacist'] },
        { to: '/reports',    icon: BarChart3,        label: 'Reports',           roles: ['Admin'] },
        { to: '/users',      icon: Users,            label: 'Employees',         roles: ['Admin'] },
        { to: '/profile',    icon: UserCircle,       label: 'Profile',           roles: ['Admin', 'Pharmacist', 'Inventory Manager'] },
    ];

    const filteredItems = menuItems.filter(item => item.roles.includes(user?.role));

    return (
        <>
            {/* Mobile overlay */}
            <div
                className={cn(
                    "fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300",
                    isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                )}
                onClick={onClose}
            />

            <aside className={cn(
                "fixed lg:static inset-y-0 left-0 z-50",
                "w-72 bg-white border-r border-slate-100 h-full flex flex-col",
                "transition-all duration-300 ease-in-out shadow-2xl lg:shadow-none",
                isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
            )}>
                <div className="p-8 flex items-center justify-between">
                    <h1 className="text-2xl font-black text-blue-600 flex items-center gap-3 tracking-tighter">
                        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-100">
                            <Pill size={24} />
                        </div>
                        <span>MedStore</span>
                    </h1>
                    <button 
                        onClick={onClose} 
                        className="lg:hidden w-10 h-10 flex items-center justify-center bg-slate-50 text-slate-500 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <nav className="flex-1 px-6 space-y-2 overflow-y-auto py-4 scrollbar-hide">
                    <p className="px-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4">Main Menu</p>
                    {filteredItems.map((item) => (
                        <SidebarItem
                            key={item.to}
                            to={item.to}
                            icon={item.icon}
                            label={item.label}
                            active={location.pathname === item.to || location.pathname.startsWith(item.to + '/')}
                            onClick={onClose}
                        />
                    ))}
                </nav>

                <div className="p-6 border-t border-slate-50">
                    <div className="bg-slate-50 rounded-2xl p-4 mb-4 flex items-center gap-3 lg:hidden">
                        <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center font-bold">
                            {user?.fullName?.charAt(0)}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-bold text-slate-900 truncate">{user?.fullName}</p>
                            <p className="text-xs text-slate-500 truncate">{user?.role}</p>
                        </div>
                    </div>
                    <button
                        onClick={logout}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-rose-500 hover:bg-rose-50 w-full transition-all font-bold group"
                    >
                        <LogOut size={20} className="group-hover:translate-x-1 transition-transform" />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;

