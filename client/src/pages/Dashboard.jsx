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
    History
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

const StatCard = ({ title, value, icon: Icon, color, trend, trendValue }) => (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
        <div className="flex items-start justify-between mb-4">
            <div className={`p-3 rounded-xl ${color} text-white shadow-lg shadow-current/10`}>
                <Icon size={24} />
            </div>
            {trend && (
                <div className={`flex items-center gap-1 text-sm font-medium ${trend === 'up' ? 'text-emerald-500' : 'text-rose-500'}`}>
                    {trend === 'up' ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                    {trendValue}%
                </div>
            )}
        </div>
        <h3 className="text-slate-500 text-sm font-medium mb-1 group-hover:text-slate-900 transition-colors">{title}</h3>
        <p className="text-2xl font-bold text-slate-900">{value}</p>
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

    if (loading) return <div className="flex items-center justify-center h-64"><p className="text-slate-500 font-medium">Loading summary...</p></div>;

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">System Dashboard</h1>
                    <p className="text-slate-500">Real-time overview of your pharmacy operations</p>
                </div>
                <div className="flex items-center gap-2">
                    <Link to="/sales/new" className="btn-primary flex items-center gap-2 py-2 px-4 text-sm">
                        <PlusCircle size={18} />
                        New Sale
                    </Link>
                    {user?.role === 'Admin' && (
                        <Link to="/medicines/add" className="bg-slate-900 text-white hover:bg-slate-800 flex items-center gap-2 py-2 px-4 rounded-xl text-sm font-semibold transition-all">
                            <PlusCircle size={18} />
                            Add Medicine
                        </Link>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard 
                    title="Total Medicines" 
                    value={summary?.medicinesCount || 0} 
                    icon={Pill} 
                    color="bg-blue-600"
                    trend="up"
                    trendValue="12"
                />
                <StatCard 
                    title="Daily Sales" 
                    value={`$${summary?.dailySales || 0}`} 
                    icon={TrendingUp} 
                    color="bg-emerald-600"
                    trend="up"
                    trendValue="8"
                />
                <StatCard 
                    title="Low Stock Alert" 
                    value={summary?.lowStockCount || 0} 
                    icon={AlertTriangle} 
                    color="bg-amber-500"
                    trend="down"
                    trendValue="5"
                />
                <StatCard 
                    title="Expiring Soon" 
                    value={summary?.expiringCount || 0} 
                    icon={Calendar} 
                    color="bg-rose-500"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                        <TrendingUp size={20} className="text-blue-600" />
                        Revenue Analysis
                    </h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                                <Tooltip 
                                    contentStyle={{backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #f1f5f9', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                                />
                                <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                        <ShoppingCart size={20} className="text-emerald-600" />
                        Sales Performance
                    </h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                                <Tooltip 
                                    cursor={{fill: '#f8fafc'}}
                                    contentStyle={{backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #f1f5f9', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                                />
                                <Bar dataKey="sales" fill="#10b981" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Low Stock Alerts */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                    <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                        <h3 className="font-bold text-slate-900 flex items-center gap-2">
                            <AlertTriangle size={18} className="text-amber-500" />
                            Low Stock Inventory
                        </h3>
                        <Link to="/medicines" className="text-xs font-semibold text-blue-600 hover:underline">View All</Link>
                    </div>
                    <div className="p-0">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-slate-50/50">
                                <tr>
                                    <th className="px-5 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Medicine</th>
                                    <th className="px-5 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Stock</th>
                                    <th className="px-5 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-right">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {summary?.criticalAlerts?.lowStock?.map(med => (
                                    <tr key={med._id} className="hover:bg-slate-50/30 transition-colors">
                                        <td className="px-5 py-3 text-sm font-medium text-slate-700">{med.name}</td>
                                        <td className="px-5 py-3 text-sm text-slate-600">{med.stockQuantity} units</td>
                                        <td className="px-5 py-3 text-right">
                                            <span className="px-2 py-1 bg-amber-100 text-amber-700 text-[10px] font-bold rounded-md uppercase">Critical</span>
                                        </td>
                                    </tr>
                                ))}
                                {(!summary?.criticalAlerts?.lowStock || summary.criticalAlerts.lowStock.length === 0) && (
                                    <tr>
                                        <td colSpan="3" className="px-5 py-8 text-center text-slate-400 text-sm italic">No low stock items</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Expiring Soon */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                    <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                        <h3 className="font-bold text-slate-900 flex items-center gap-2">
                            <Calendar size={18} className="text-rose-500" />
                            Expiring Soon
                        </h3>
                        <Link to="/medicines" className="text-xs font-semibold text-blue-600 hover:underline">Manage Stock</Link>
                    </div>
                    <div className="p-0">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-slate-50/50">
                                <tr>
                                    <th className="px-5 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Medicine</th>
                                    <th className="px-5 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-right">Expiry Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {summary?.criticalAlerts?.expiring?.map(med => (
                                    <tr key={med._id} className="hover:bg-slate-50/30 transition-colors">
                                        <td className="px-5 py-3 text-sm font-medium text-slate-700">{med.name}</td>
                                        <td className="px-5 py-3 text-right">
                                            <span className={`px-2 py-1 ${new Date(med.expiryDate) < new Date() ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-700'} text-[10px] font-bold rounded-md uppercase`}>
                                                {new Date(med.expiryDate).toLocaleDateString()}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                                {(!summary?.criticalAlerts?.expiring || summary.criticalAlerts.expiring.length === 0) && (
                                    <tr>
                                        <td colSpan="2" className="px-5 py-8 text-center text-slate-400 text-sm italic">No near-expiry items</td>
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
