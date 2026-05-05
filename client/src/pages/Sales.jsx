import { useState, useEffect } from 'react';
import api from '../api/axios';
import { 
    Search, 
    MoreVertical, 
    Eye, 
    Download,
    Plus,
    Calendar,
    ArrowUpRight,
    X,
    FileText,
    User,
    Clock,
    CreditCard
} from 'lucide-react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const Sales = () => {
    const [sales, setSales] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSale, setSelectedSale] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchSales();
    }, []);

    const fetchSales = async () => {
        try {
            const { data } = await api.get('/sales');
            setSales(data);
        } catch (error) {
            toast.error('Failed to fetch sales history');
        } finally {
            setLoading(false);
        }
    };

    const handleViewDetails = (sale) => {
        setSelectedSale(sale);
        setIsModalOpen(true);
    };

    const filteredSales = sales.filter(s => 
        (s.customerName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        s._id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleExport = () => {
        const exportData = filteredSales.map(s => ({
            OrderID: s._id,
            Customer: s.customerName || 'Walk-in',
            Pharmacist: s.processedBy?.fullName || 'N/A',
            Date: new Date(s.saleDate).toLocaleString(),
            Items: s.items.length,
            TotalAmount: s.totalAmount,
            PaymentMethod: s.paymentMethod
        }));
        import('../utils/exportUtils').then(module => {
            module.exportToCSV(exportData, 'MedStore_Sales_History');
        });
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Sales Records</h1>
                    <p className="text-slate-500 font-medium">Monitor and audit all pharmaceutical transactions</p>
                </div>
                <div className="flex items-center gap-3">
                    <button 
                        onClick={handleExport}
                        className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-white text-slate-700 rounded-2xl hover:bg-slate-50 transition-all font-bold border-2 border-slate-100 shadow-sm"
                    >
                        <Download size={20} />
                        <span>Export</span>
                    </button>
                    <Link to="/sales/new" className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-all font-bold shadow-xl shadow-blue-100">
                        <Plus size={20} />
                        <span>New Sale</span>
                    </Link>
                </div>
            </div>

            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden">
                <div className="p-6 md:p-8 border-b border-slate-50 flex flex-col md:flex-row gap-6 items-center justify-between bg-slate-50/30">
                    <div className="relative flex-1 w-full group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                        <input 
                            type="text" 
                            placeholder="Search by Invoice ID or Customer Name..." 
                            className="w-full bg-white border-2 border-slate-100 rounded-2xl py-3.5 pl-12 pr-4 focus:border-blue-200 focus:ring-4 focus:ring-blue-50 outline-none transition-all font-semibold text-slate-700"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-slate-200">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className="bg-slate-50/50">
                                <th className="px-8 py-5 text-[11px] font-black uppercase tracking-[0.15em] text-slate-400">Invoice</th>
                                <th className="px-6 py-5 text-[11px] font-black uppercase tracking-[0.15em] text-slate-400">Processed By</th>
                                <th className="px-6 py-5 text-[11px] font-black uppercase tracking-[0.15em] text-slate-400">Timestamp</th>
                                <th className="px-6 py-5 text-[11px] font-black uppercase tracking-[0.15em] text-slate-400 text-center">Volume</th>
                                <th className="px-6 py-5 text-[11px] font-black uppercase tracking-[0.15em] text-slate-400">Value</th>
                                <th className="px-8 py-5 text-[11px] font-black uppercase tracking-[0.15em] text-slate-400 text-right">Audit</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="px-8 py-20 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Accessing Sales Ledger...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredSales.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-8 py-24 text-center">
                                        <div className="max-w-xs mx-auto">
                                            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-200">
                                                <FileText size={40} />
                                            </div>
                                            <h3 className="text-lg font-bold text-slate-900 mb-1">No transactions found</h3>
                                            <p className="text-slate-500 text-sm">Your search did not match any sales records in our database.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredSales.map((sale) => (
                                    <tr key={sale._id} className="hover:bg-blue-50/30 transition-all duration-200 group">
                                        <td className="px-8 py-5">
                                            <span className="font-mono text-xs font-black text-slate-400 bg-slate-100 px-2 py-1 rounded-md group-hover:bg-white transition-colors">
                                                #{sale._id.slice(-8).toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 text-slate-600 flex items-center justify-center text-xs font-black group-hover:from-blue-500 group-hover:to-blue-600 group-hover:text-white transition-all">
                                                    {(sale.processedBy?.fullName || sale.customerName || 'W').charAt(0)}
                                                </div>
                                                <span className="text-sm font-bold text-slate-700 group-hover:text-blue-600 transition-colors">
                                                    {sale.processedBy?.fullName || sale.customerName || 'Walk-in Customer'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-slate-600 flex items-center gap-1.5">
                                                    <Calendar size={14} className="text-slate-400" />
                                                    {new Date(sale.saleDate).toLocaleDateString()}
                                                </span>
                                                <span className="text-[10px] font-black text-slate-400 uppercase ml-5">
                                                    {new Date(sale.saleDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-center">
                                            <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-xl text-xs font-black">
                                                {sale.items.length} Items
                                            </span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="text-sm font-black text-slate-900 bg-emerald-50 text-emerald-600 px-3 py-1 rounded-xl">
                                                ${sale.totalAmount.toFixed(2)}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <button 
                                                onClick={() => handleViewDetails(sale)}
                                                className="w-10 h-10 flex items-center justify-center bg-white text-slate-400 border border-slate-100 shadow-sm rounded-xl hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all group-hover:translate-x-0"
                                            >
                                                <Eye size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Sale Details Modal */}
            {isModalOpen && selectedSale && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-3xl overflow-hidden animate-in fade-in zoom-in duration-300">
                        <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-100">
                                    <FileText size={24} />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">Transaction Receipt</h3>
                                    <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">ID: #{selectedSale._id.toUpperCase()}</p>
                                </div>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 flex items-center justify-center bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-rose-500 transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                        
                        <div className="p-10 space-y-10">
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-8 text-sm">
                                <div className="space-y-1">
                                    <p className="text-slate-400 font-black uppercase text-[10px] tracking-widest flex items-center gap-2">
                                        <User size={12} className="text-blue-500" />
                                        Issuer
                                    </p>
                                    <p className="font-bold text-slate-900 text-lg">{selectedSale.processedBy?.fullName || 'System'}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-slate-400 font-black uppercase text-[10px] tracking-widest flex items-center gap-2">
                                        <Clock size={12} className="text-blue-500" />
                                        Date
                                    </p>
                                    <p className="font-bold text-slate-900 text-lg">{new Date(selectedSale.saleDate).toLocaleDateString()}</p>
                                </div>
                                <div className="space-y-1 col-span-2 md:col-span-1">
                                    <p className="text-slate-400 font-black uppercase text-[10px] tracking-widest flex items-center gap-2">
                                        <CreditCard size={12} className="text-blue-500" />
                                        Method
                                    </p>
                                    <p className="font-bold text-slate-900 text-lg">{selectedSale.paymentMethod || 'Cash'}</p>
                                </div>
                            </div>

                            <div className="rounded-[1.5rem] border-2 border-slate-50 overflow-hidden bg-slate-50/30">
                                <table className="w-full text-left text-sm">
                                    <thead>
                                        <tr className="bg-slate-50">
                                            <th className="px-6 py-4 font-black text-slate-400 uppercase text-[10px] tracking-widest">Inventory Item</th>
                                            <th className="px-6 py-4 font-black text-slate-400 uppercase text-[10px] tracking-widest text-center">Qty</th>
                                            <th className="px-6 py-4 font-black text-slate-400 uppercase text-[10px] tracking-widest text-right">Unit Price</th>
                                            <th className="px-6 py-4 font-black text-slate-400 uppercase text-[10px] tracking-widest text-right">Extended</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {selectedSale.items.map((item, idx) => (
                                            <tr key={idx} className="bg-white">
                                                <td className="px-6 py-4 font-bold text-slate-900">{item.medicine?.name}</td>
                                                <td className="px-6 py-4 text-center font-black text-slate-500">{item.quantity}</td>
                                                <td className="px-6 py-4 text-right font-bold text-slate-400">${item.unitPrice.toFixed(2)}</td>
                                                <td className="px-6 py-4 text-right font-black text-slate-900">${(item.unitPrice * item.quantity).toFixed(2)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot>
                                        <tr className="bg-blue-600 text-white">
                                            <td colSpan="3" className="px-8 py-5 text-right font-black uppercase text-xs tracking-widest">Total Transaction Value</td>
                                            <td className="px-8 py-5 text-right font-black text-xl">${selectedSale.totalAmount.toFixed(2)}</td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                <button 
                                    className="flex-1 py-4 rounded-2xl bg-white border-2 border-slate-100 text-slate-600 font-bold hover:bg-slate-50 transition-all flex items-center justify-center gap-3"
                                    onClick={() => window.print()}
                                >
                                    <Download size={20} />
                                    <span>Print Statement</span>
                                </button>
                                <button 
                                    className="flex-1 py-4 rounded-2xl bg-slate-900 text-white font-black shadow-xl shadow-slate-200 hover:bg-slate-800 transition-all"
                                    onClick={() => setIsModalOpen(false)}
                                >
                                    Close Auditor
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Sales;

