import { useState, useEffect } from 'react';
import api from '../api/axios';
import { Plus, Search, Eye, Download, Truck, Calendar, X, FileText } from 'lucide-react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

const Purchases = () => {
    const [purchases, setPurchases] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedPurchase, setSelectedPurchase] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchPurchases();
    }, []);

    const fetchPurchases = async () => {
        try {
            const { data } = await api.get('/purchases');
            setPurchases(data);
        } catch (error) {
            toast.error('Failed to fetch purchase history');
        } finally {
            setLoading(false);
        }
    };

    const handleViewDetails = (purchase) => {
        setSelectedPurchase(purchase);
        setIsModalOpen(true);
    };

    const filteredPurchases = purchases.filter(p => 
        p.supplier?.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p._id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleExport = () => {
        const exportData = filteredPurchases.map(p => ({
            OrderID: p._id,
            Supplier: p.supplier?.companyName || 'N/A',
            Date: new Date(p.purchaseDate).toLocaleString(),
            Items: p.items.length,
            TotalAmount: p.totalAmount,
            RecordedBy: p.recordedBy?.fullName || 'N/A'
        }));
        import('../utils/exportUtils').then(module => {
            module.exportToCSV(exportData, 'MedStore_Purchase_History');
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Purchase Orders</h1>
                    <p className="text-slate-500">Track and manage inventory restocking from suppliers</p>
                </div>
                <Link to="/purchases/new" className="btn-primary flex items-center gap-2 w-fit">
                    <Plus size={20} />
                    New Purchase
                </Link>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="relative w-full md:w-96">
                        {/* <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} /> */}
                        <input 
                            type="text" 
                            placeholder="Search by ID or supplier..." 
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
                            Export CSV
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50">
                                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Order ID</th>
                                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Supplier</th>
                                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Date</th>
                                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Total Items</th>
                                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Total Cost</th>
                                <th className="px-6 py-4 text-sm font-semibold text-slate-600 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-slate-500">Loading purchases...</td>
                                </tr>
                            ) : filteredPurchases.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-slate-500">No purchase records found</td>
                                </tr>
                            ) : (
                                filteredPurchases.map((purchase) => (
                                    <tr key={purchase._id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-6 py-4 font-mono text-xs text-slate-500">#{purchase._id.slice(-8).toUpperCase()}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <Truck size={16} className="text-blue-500" />
                                                <span className="text-sm font-medium text-slate-900">{purchase.supplier?.companyName}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600">
                                            {new Date(purchase.purchaseDate).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600">
                                            {purchase.items.length} medicines
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm font-bold text-slate-900">${purchase.totalAmount.toFixed(2)}</span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button 
                                                onClick={() => handleViewDetails(purchase)}
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

            {/* Purchase Details Modal */}
            {isModalOpen && selectedPurchase && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                                    <FileText size={20} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900">Purchase Order</h3>
                                    <p className="text-xs text-slate-500 font-mono">#{selectedPurchase._id.toUpperCase()}</p>
                                </div>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                                <X size={24} />
                            </button>
                        </div>
                        
                        <div className="p-8 space-y-8">
                            <div className="flex justify-between text-sm">
                                <div>
                                    <p className="text-slate-500 uppercase font-bold text-[10px] tracking-widest mb-1">Supplier</p>
                                    <p className="font-bold text-slate-900">{selectedPurchase.supplier?.companyName}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-slate-500 uppercase font-bold text-[10px] tracking-widest mb-1">Recorded By</p>
                                    <p className="font-bold text-slate-900">{selectedPurchase.recordedBy?.fullName || 'N/A'}</p>
                                </div>
                            </div>

                            <div className="border border-slate-100 rounded-xl overflow-hidden">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-slate-50">
                                        <tr>
                                            <th className="px-4 py-3 font-bold text-slate-700">Medicine</th>
                                            <th className="px-4 py-3 font-bold text-slate-700 text-center">Qty</th>
                                            <th className="px-4 py-3 font-bold text-slate-700 text-right">Unit Price</th>
                                            <th className="px-4 py-3 font-bold text-slate-700 text-right">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {selectedPurchase.items.map((item, idx) => (
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
                                            <td colSpan="3" className="px-4 py-4 text-right font-bold text-slate-500">Total Investment</td>
                                            <td className="px-4 py-4 text-right font-black text-blue-600 text-lg">${selectedPurchase.totalAmount.toFixed(2)}</td>
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

export default Purchases;
