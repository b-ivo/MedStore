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
    FileText
} from 'lucide-react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

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
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Sales Transactions</h1>
                    <p className="text-slate-500">View and manage all pharmaceutical sales</p>
                </div>
                <Link to="/sales/new" className="btn-primary flex items-center gap-2 w-fit">
                    <Plus size={20} />
                    New Sale
                </Link>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="relative w-full md:w-96">
                        {/* <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} /> */}
                        <input 
                            type="text" 
                            placeholder="Search by ID or customer..." 
                            className="input-field w-full pl-10"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <button 
                            onClick={handleExport}
                            className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-all font-medium border border-slate-900"
                        >
                            <Download size={18} />
                            Export
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50">
                                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Order ID</th>
                                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Pharmacist</th>
                                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Date</th>
                                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Items</th>
                                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Total Amount</th>
                                <th className="px-6 py-4 text-sm font-semibold text-slate-600 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-slate-500">Loading sales history...</td>
                                </tr>
                            ) : filteredSales.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-slate-500">No sales transactions found</td>
                                </tr>
                            ) : (
                                filteredSales.map((sale) => (
                                    <tr key={sale._id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-6 py-4 font-mono text-xs text-slate-500">#{sale._id.slice(-8).toUpperCase()}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-xs font-bold uppercase">
                                                    {(sale.processedBy?.fullName || sale.customerName || 'W').charAt(0)}
                                                </div>
                                                <span className="text-sm font-medium text-slate-900">{sale.processedBy?.fullName || sale.customerName || 'Walk-in'}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600">
                                            {new Date(sale.saleDate).toLocaleDateString()}
                                            <div className="text-xs text-slate-400">{new Date(sale.saleDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600">{sale.items.length} items</td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm font-bold text-slate-900">${sale.totalAmount.toFixed(2)}</span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button 
                                                onClick={() => handleViewDetails(sale)}
                                                className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
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
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                                    <FileText size={20} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900">Sale Receipt</h3>
                                    <p className="text-xs text-slate-500 font-mono">#{selectedSale._id.toUpperCase()}</p>
                                </div>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                                <X size={24} />
                            </button>
                        </div>
                        
                        <div className="p-8 space-y-8">
                            <div className="flex justify-between text-sm">
                                <div>
                                    <p className="text-slate-500 uppercase font-bold text-[10px] tracking-widest mb-1">Pharmacist</p>
                                    <p className="font-bold text-slate-900">{selectedSale.processedBy?.fullName || 'N/A'}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-slate-500 uppercase font-bold text-[10px] tracking-widest mb-1">Date & Time</p>
                                    <p className="font-bold text-slate-900">{new Date(selectedSale.saleDate).toLocaleString()}</p>
                                </div>
                            </div>

                            <div className="border border-slate-100 rounded-xl overflow-hidden">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-slate-50">
                                        <tr>
                                            <th className="px-4 py-3 font-bold text-slate-700">Medicine</th>
                                            <th className="px-4 py-3 font-bold text-slate-700 text-center">Qty</th>
                                            <th className="px-4 py-3 font-bold text-slate-700 text-right">Price</th>
                                            <th className="px-4 py-3 font-bold text-slate-700 text-right">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {selectedSale.items.map((item, idx) => (
                                            <tr key={idx}>
                                                <td className="px-4 py-3 font-medium text-slate-900">{item.medicine?.name}</td>
                                                <td className="px-4 py-3 text-center text-slate-600">{item.quantity}</td>
                                                <td className="px-4 py-3 text-right text-slate-600">${item.unitPrice.toFixed(2)}</td>
                                                <td className="px-4 py-3 text-right font-bold text-slate-900">${(item.unitPrice * item.quantity).toFixed(2)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot className="bg-slate-50/50">
                                        <tr className="border-t border-slate-100">
                                            <td colSpan="3" className="px-4 py-4 text-right font-bold text-slate-500">Total Amount</td>
                                            <td className="px-4 py-4 text-right font-black text-blue-600 text-lg">${selectedSale.totalAmount.toFixed(2)}</td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button 
                                    className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                                    onClick={() => window.print()}
                                >
                                    <Download size={18} />
                                    Download PDF
                                </button>
                                <button 
                                    className="flex-1 btn-primary py-3 rounded-xl shadow-lg shadow-blue-200"
                                    onClick={() => setIsModalOpen(false)}
                                >
                                    Done
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
