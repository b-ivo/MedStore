import { useState, useEffect } from 'react';
import api from '../api/axios';
import { 
    BarChart3, 
    PieChart as PieChartIcon, 
    Download, 
    TrendingUp, 
    TrendingDown,
    Calendar,
    Filter
} from 'lucide-react';
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, LineChart, Line, Legend
} from 'recharts';
import toast from 'react-hot-toast';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

const Reports = () => {
    const [salesData, setSalesData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = async () => {
        try {
            const { data } = await api.get('/reports/sales');
            setSalesData(data);
        } catch (error) {
            toast.error('Failed to load reports');
        } finally {
            setLoading(false);
        }
    };

    // Transform sales data for charts
    const salesByDay = salesData.reduce((acc, sale) => {
        const date = new Date(sale.saleDate).toLocaleDateString('en-US', { weekday: 'short' });
        acc[date] = (acc[date] || 0) + sale.totalAmount;
        return acc;
    }, {});

    const chartData = Object.keys(salesByDay).map(day => ({ name: day, revenue: salesByDay[day] }));

    const categorySales = [
        { name: 'Antibiotics', value: 400 },
        { name: 'Painkillers', value: 300 },
        { name: 'Supplements', value: 300 },
        { name: 'First Aid', value: 200 },
    ];

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Business Analytics</h1>
                    <p className="text-slate-500">Comprehensive overview of pharmacy performance</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white text-slate-600 rounded-lg hover:bg-slate-50 transition-all font-semibold border border-slate-200">
                        <Calendar size={18} />
                        Last 30 Days
                    </button>
                    <button className="btn-primary flex items-center gap-2">
                        <Download size={18} />
                        Download Report
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                <TrendingUp size={20} className="text-blue-600" />
                                Revenue Trends
                            </h3>
                            <div className="flex items-center gap-2 text-sm font-medium text-emerald-500 bg-emerald-50 px-2 py-1 rounded">
                                <TrendingUp size={14} />
                                +14.5%
                            </div>
                        </div>
                        <div className="h-[350px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                                    <Tooltip 
                                        contentStyle={{backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #f1f5f9', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                                    />
                                    <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={4} dot={{r: 6, fill: '#3b82f6', strokeWidth: 3, stroke: '#fff'}} activeDot={{r: 8}} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                            <h3 className="text-lg font-bold text-slate-900 mb-6">Sales by Channel</h3>
                            <div className="h-[250px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={chartData}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                        <XAxis dataKey="name" hide />
                                        <YAxis hide />
                                        <Tooltip cursor={{fill: '#f8fafc'}} />
                                        <Bar dataKey="revenue" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                            <h3 className="text-lg font-bold text-slate-900 mb-6">Customer Retention</h3>
                            <div className="flex flex-col items-center justify-center h-[250px] space-y-4">
                                <div className="text-5xl font-extrabold text-slate-900">84%</div>
                                <div className="text-slate-500 text-center text-sm">Of customers returned for refills<br/>this month.</div>
                                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                    <div className="bg-blue-600 h-full w-[84%]"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-8">
                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                        <h3 className="text-lg font-bold text-slate-900 mb-8 flex items-center gap-2">
                            <PieChartIcon size={20} className="text-emerald-600" />
                            Category Distribution
                        </h3>
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={categorySales}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={100}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {categorySales.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="bg-slate-900 p-8 rounded-2xl text-white">
                        <h4 className="text-slate-400 font-bold mb-2">Total Monthly Revenue</h4>
                        <div className="text-4xl font-bold mb-6">$42,850.00</div>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-slate-400">Target</span>
                                <span>$50,000.00</span>
                            </div>
                            <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                                <div className="bg-blue-500 h-full w-[85%]"></div>
                            </div>
                            <p className="text-xs text-slate-400 italic">You are $7,150 away from your monthly goal.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Reports;
