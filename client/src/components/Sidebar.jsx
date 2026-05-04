import { Link, useLocation } from 'react-router-dom';
import { 
    LayoutDashboard, 
    Pill, 
    Tags, 
    Truck, 
    ShoppingCart, 
    ClipboardList, 
    BarChart3, 
    Users, 
    UserCircle,
    LogOut
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const SidebarItem = ({ to, icon: Icon, label, active }) => (
    <Link 
        to={to} 
        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
            active 
            ? 'bg-blue-600 text-white shadow-md shadow-blue-200' 
            : 'text-slate-600 hover:bg-slate-100 hover:text-blue-600'
        }`}
    >
        <Icon size={20} />
        <span className="font-medium">{label}</span>
    </Link>
);

const Sidebar = () => {
    const { user, logout } = useAuth();
    const location = useLocation();

    const menuItems = [
        { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', roles: ['Admin', 'Pharmacist', 'Inventory Manager'] },
        { to: '/medicines', icon: Pill, label: 'Medicines', roles: ['Admin', 'Pharmacist', 'Inventory Manager'] },
        { to: '/categories', icon: Tags, label: 'Categories', roles: ['Admin', 'Inventory Manager'] },
        { to: '/suppliers', icon: Truck, label: 'Suppliers', roles: ['Admin', 'Inventory Manager'] },
        { to: '/purchases', icon: ShoppingCart, label: 'Purchases', roles: ['Admin', 'Inventory Manager'] },
        { to: '/sales', icon: ClipboardList, label: 'Sales', roles: ['Admin', 'Pharmacist'] },
        { to: '/reports', icon: BarChart3, label: 'Reports', roles: ['Admin'] },
        { to: '/users', icon: Users, label: 'Employees', roles: ['Admin'] },
        { to: '/profile', icon: UserCircle, label: 'Profile', roles: ['Admin', 'Pharmacist', 'Inventory Manager'] },
    ];

    const filteredItems = menuItems.filter(item => item.roles.includes(user?.role));

    return (
        <aside className="w-64 bg-white border-r border-slate-200 h-screen flex flex-col transition-all duration-300">
            <div className="p-6">
                <h1 className="text-2xl font-bold text-blue-600 flex items-center gap-2">
                    <Pill size={28} />
                    <span>MedStore</span>
                </h1>
            </div>

            <nav className="flex-1 px-4 space-y-1 overflow-y-auto py-4">
                {filteredItems.map((item) => (
                    <SidebarItem 
                        key={item.to}
                        to={item.to}
                        icon={item.icon}
                        label={item.label}
                        active={location.pathname === item.to || location.pathname.startsWith(item.to + '/')}
                    />
                ))}
            </nav>

            <div className="p-4 border-t border-slate-100">
                <button 
                    onClick={logout}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-500 hover:bg-red-50 w-full transition-all font-medium"
                >
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
