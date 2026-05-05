import { useState, useEffect } from 'react';
import api from '../api/axios';
import { 
    Pill, 
    Truck, 
    TrendingUp, 
    AlertTriangle, 
    Calendar,
    ArrowUpRight,
    ArrowDownRight,
    ShoppingCart,
    ArrowRight,
    PlusCircle,
    UserPlus,
    History,
    ChevronRight,
    DollarSign
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
    AreaChart, 
    Area, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer,
    BarChart,
    Bar
} from 'recharts';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const StatCard = ({ title, value, icon: Icon, color, trend, trendValue }) => (
    <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/40 hover:shadow-2xl hover:shadow-slate-200 transition-all group relative overflow-hidden">
        <div className="relative z-10">
            <div className="flex items-start justify-between mb-6">
                <div className={cn("p-4 rounded-2xl text-white shadow-xl shadow-current/20", color)}>
                    <Icon size={28} />
                </div>
                {trend && (
                    <div className={cn(
                        "flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-black tracking-tight",
                        trend === 'up' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                    )}>
                        {trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                        {trendValue}%
                    </div>
                )}
            </div>
            <h3 className="text-slate-400 text-xs font-black uppercase tracking-[0.15em] mb-2 group-hover:text-slate-900 transition-colors">{title}</h3>
            <p className="text-4xl font-black text-slate-900 tracking-tighter">{value}</p>
        </div>
        <div className={cn("absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity", color.replace('bg-', 'text-'))}>
            <Icon size={120} />
        </div>
    </div>
);

const Dashboard = () => {
    const { user } = useAuth();
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSummary = async () => {
            try {
                const { data } = await api.get('/reports/dashboard');
                setSummary(data);
            } catch (error) {
                console.error('Error fetching dashboard summary', error);
            } finally {
                setLoading(false);
            }
        };

        fetchSummary();
    }, []);

    const chartData = summary?.weeklySales || [
        { name: 'Mon', sales: 0, revenue: 0 },
        { name: 'Tue', sales: 0, revenue: 0 },
        { name: 'Wed', sales: 0, revenue: 0 },
        { name: 'Thu', sales: 0, revenue: 0 },
        { name: 'Fri', sales: 0, revenue: 0 },
        { name: 'Sat', sales: 0, revenue: 0 },
        { name: 'Sun', sales: 0, revenue: 0 },
    ];

    if (loading) return (
        <div className="flex flex-col items-center justify-center h-96 gap-4">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">Orchestrating Dashboard...</p>
        </div>
    );

    return (
        <div className="space-y-10 pb-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header Section */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Pharmacy Insights</h1>
                    <p className="text-slate-500 font-medium text-lg">Good day, <span className="text-blue-600 font-bold">{user?.fullName}</span>. Here's what's happening today.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Link to="/sales/new" className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-all font-bold shadow-xl shadow-blue-100">
                        <PlusCircle size={20} />
                        <span>New Sale</span>
                    </Link>
                    {user?.role === 'Admin' && (
                        <Link to="/medicines/add" className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-8 py-4 bg-slate-900 text-white hover:bg-slate-800 rounded-2xl transition-all font-bold shadow-xl shadow-slate-200">
                            <PlusCircle size={20} />
                            <span>Add Medicine</span>
                        </Link>
                    )}
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                <StatCard 
                    title="Total Medicines" 
                    value={summary?.medicinesCount || 0} 
                    icon={Pill} 
                    color="bg-blue-600"
                    trend="up"
                    trendValue="12"
                />
                <StatCard 
                    title="Daily Revenue" 
                    value={`$${summary?.dailySales || 0}`} 
                    icon={DollarSign} 
                    color="bg-emerald-600"
                    trend="up"
                    trendValue="8"
                />
                <StatCard 
                    title="Low Stock" 
                    value={summary?.lowStockCount || 0} 
                    icon={AlertTriangle} 
                    color="bg-amber-500"
                    trend="down"
                    trendValue="5"
                />
                <StatCard 
                    title="Expiring" 
                    value={summary?.expiringCount || 0} 
                    icon={Calendar} 
                    color="bg-rose-500"
                />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
                <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/40">
                    <div className="flex items-center justify-between mb-10">
                        <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                                <TrendingUp size={22} />
                            </div>
                            Revenue Analysis
                        </h3>
                        <select className="bg-slate-50 border-none rounded-xl px-4 py-2 text-sm font-bold text-slate-500 outline-none">
                            <option>Last 7 Days</option>
                            <option>Last 30 Days</option>
                        </select>
                    </div>
                    <div style={{ width: '100%', height: 320 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 700}} dy={15} />
                                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 700}} />
                                <Tooltip 
                                    contentStyle={{backgroundColor: '#1e293b', borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', color: '#fff'}}
                                    itemStyle={{color: '#fff', fontWeight: 700}}
                                />
                                <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#colorRev)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/40">
                    <div className="flex items-center justify-between mb-10">
                        <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                            <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                                <ShoppingCart size={22} />
                            </div>
                            Sales Performance
                        </h3>
                        <div className="flex gap-2">
                            <div className="w-3 h-3 bg-emerald-500 rounded-full" />
                            <span className="text-[10px] font-black uppercase text-slate-400">Transaction Volume</span>
                        </div>
                    </div>
                    <div style={{ width: '100%', height: 320 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 700}} dy={15} />
                                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 700}} />
                                <Tooltip 
                                    cursor={{fill: '#f8fafc', radius: 12}}
                                    contentStyle={{backgroundColor: '#1e293b', borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', color: '#fff'}}
                                />
                                <Bar dataKey="sales" fill="#10b981" radius={[8, 8, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Bottom Section - Critical Alerts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden">
                    <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
                        <h3 className="font-black text-slate-900 flex items-center gap-3 tracking-tight">
                            <div className="w-8 h-8 bg-amber-100 text-amber-600 rounded-lg flex items-center justify-center">
                                <AlertTriangle size={18} />
                            </div>
                            Low Stock Inventory
                        </h3>
                        <Link to="/medicines" className="text-xs font-black uppercase tracking-widest text-blue-600 hover:text-blue-700 flex items-center gap-1 group">
                            Full Report
                            <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50">
                                    <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Medicine</th>
                                    <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Current Stock</th>
                                    <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Severity</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {summary?.criticalAlerts?.lowStock?.map(med => (
                                    <tr key={med._id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-8 py-5">
                                            <div className="font-bold text-slate-700 group-hover:text-blue-600 transition-colors">{med.name}</div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <span className="text-sm font-black text-slate-900">{med.stockQuantity} units</span>
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <span className="px-3 py-1 bg-rose-50 text-rose-600 text-[10px] font-black rounded-lg uppercase tracking-tighter">Critical</span>
                                        </td>
                                    </tr>
                                ))}
                                {(!summary?.criticalAlerts?.lowStock || summary.criticalAlerts.lowStock.length === 0) && (
                                    <tr>
                                        <td colSpan="3" className="px-8 py-12 text-center text-slate-400 text-sm font-medium italic">All stock levels optimized</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden">
                    <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
                        <h3 className="font-black text-slate-900 flex items-center gap-3 tracking-tight">
                            <div className="w-8 h-8 bg-rose-100 text-rose-600 rounded-lg flex items-center justify-center">
                                <Calendar size={18} />
                            </div>
                            Expiring Batches
                        </h3>
                        <Link to="/medicines" className="text-xs font-black uppercase tracking-widest text-blue-600 hover:text-blue-700 flex items-center gap-1 group">
                            Management
                            <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50">
                                    <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Medicine</th>
                                    <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Expiration</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {summary?.criticalAlerts?.expiring?.map(med => (
                                    <tr key={med._id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-8 py-5">
                                            <div className="font-bold text-slate-700 group-hover:text-blue-600 transition-colors">{med.name}</div>
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <span className={cn(
                                                "px-3 py-1 text-[10px] font-black rounded-lg uppercase tracking-tighter",
                                                new Date(med.expiryDate) < new Date() ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-600'
                                            )}>
                                                {new Date(med.expiryDate).toLocaleDateString()}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                                {(!summary?.criticalAlerts?.expiring || summary.criticalAlerts.expiring.length === 0) && (
                                    <tr>
                                        <td colSpan="2" className="px-8 py-12 text-center text-slate-400 text-sm font-medium italic">No batches near expiration</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;

