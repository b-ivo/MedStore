import { useState, useEffect } from 'react';
import api from '../api/axios';
import { 
    Plus, 
    Search, 
    Filter, 
    MoreVertical, 
    Edit, 
    Trash2, 
    AlertCircle,
    Download
} from 'lucide-react';
import toast from 'react-hot-toast';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Medicines = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q') || '';
    
    const [medicines, setMedicines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState(query);
    const { user } = useAuth();

    useEffect(() => {
        setSearchTerm(query);
    }, [query]);

    useEffect(() => {
        fetchMedicines();
    }, []);

    const fetchMedicines = async () => {
        try {
            const { data } = await api.get('/medicines');
            setMedicines(data);
        } catch (error) {
            toast.error('Failed to fetch medicines');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        toast((t) => (
            <div className="flex items-center gap-3">
                <span className="text-sm font-medium">Delete this medicine?</span>
                <button
                    onClick={async () => {
                        toast.dismiss(t.id);
                        try {
                            await api.delete(`/medicines/${id}`);
                            toast.success('Medicine deleted');
                            fetchMedicines();
                        } catch {
                            toast.error('Failed to delete medicine');
                        }
                    }}
                    className="px-3 py-1 bg-rose-600 text-white text-xs rounded-lg font-semibold"
                >
                    Delete
                </button>
                <button onClick={() => toast.dismiss(t.id)} className="px-3 py-1 bg-slate-100 text-slate-700 text-xs rounded-lg font-semibold">
                    Cancel
                </button>
            </div>
        ), { duration: 6000 });
    };

    const filteredMedicines = medicines.filter(m => 
        m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.batchNumber.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Medicine Inventory</h1>
                    <p className="text-slate-500">Manage and track your pharmaceutical stock</p>
                </div>
                {(user?.role === 'Admin' || user?.role === 'Inventory Manager') && (
                    <Link to="/medicines/add" className="btn-primary flex items-center gap-2 w-fit">
                        <Plus size={20} />
                        Add Medicine
                    </Link>
                )}
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search by name or batch number..." 
                            className="input-field w-full pl-10"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <button className="flex items-center gap-2 px-4 py-2 bg-slate-50 text-slate-600 rounded-lg hover:bg-slate-100 transition-all font-medium border border-slate-200">
                            <Filter size={18} />
                            Filter
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-slate-50 text-slate-600 rounded-lg hover:bg-slate-100 transition-all font-medium border border-slate-200">
                            <Download size={18} />
                            Export
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50">
                                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Medicine Name</th>
                                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Category</th>
                                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Stock</th>
                                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Price</th>
                                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Expiry Date</th>
                                <th className="px-6 py-4 text-sm font-semibold text-slate-600 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-slate-500">Loading medicines...</td>
                                </tr>
                            ) : filteredMedicines.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-slate-500">No medicines found</td>
                                </tr>
                            ) : (
                                filteredMedicines.map((medicine) => (
                                    <tr key={medicine._id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div>
                                                <div className="font-semibold text-slate-900">{medicine.name}</div>
                                                <div className="text-xs text-slate-500">Batch: {medicine.batchNumber}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600">{medicine.category?.name || 'Uncategorized'}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <span className={`font-semibold ${medicine.stockQuantity <= medicine.reorderLevel ? 'text-amber-600' : 'text-slate-900'}`}>
                                                    {medicine.stockQuantity}
                                                </span>
                                                {medicine.stockQuantity <= medicine.reorderLevel && (
                                                    <AlertCircle size={14} className="text-amber-500" title="Low Stock" />
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium text-slate-900">${medicine.price.toFixed(2)}</td>
                                        <td className="px-6 py-4">
                                            <span className={`text-sm ${new Date(medicine.expiryDate) < new Date() ? 'text-red-500 font-bold' : 'text-slate-600'}`}>
                                                {new Date(medicine.expiryDate).toLocaleDateString()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                {(user?.role === 'Admin' || user?.role === 'Inventory Manager') && (
                                                    <>
                                                        <Link to={`/medicines/edit/${medicine._id}`} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                                            <Edit size={18} />
                                                        </Link>
                                                        {user?.role === 'Admin' && (
                                                            <button 
                                                                onClick={() => handleDelete(medicine._id)}
                                                                className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                                                            >
                                                                <Trash2 size={18} />
                                                            </button>
                                                        )}
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Medicines;
