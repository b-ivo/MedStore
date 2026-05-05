import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { Pill, Save, X, ArrowLeft, Info } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const AddMedicine = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = Boolean(id);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        category: '',
        supplier: '',
        price: '',
        stockQuantity: '',
        reorderLevel: 10,
        expiryDate: '',
        batchNumber: ''
    });

    const [categories, setCategories] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchInitialData();
        if (isEdit) {
            fetchMedicine();
        }
    }, [id]);

    const fetchInitialData = async () => {
        try {
            const [catRes, supRes] = await Promise.all([
                api.get('/categories'),
                api.get('/suppliers')
            ]);
            setCategories(catRes.data);
            setSuppliers(supRes.data);
        } catch (error) {
            toast.error('Failed to load categories/suppliers');
        }
    };

    const fetchMedicine = async () => {
        try {
            const { data } = await api.get(`/medicines/${id}`);
            setFormData({
                ...data,
                category: data.category?._id || '',
                supplier: data.supplier?._id || '',
                expiryDate: data.expiryDate ? data.expiryDate.split('T')[0] : ''
            });
        } catch (error) {
            toast.error('Failed to load medicine details');
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (isEdit) {
                await api.put(`/medicines/${id}`, formData);
                toast.success('Medicine updated successfully');
            } else {
                await api.post('/medicines', formData);
                toast.success('Medicine added successfully');
            }
            navigate('/medicines');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Operation failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-6">
                <button 
                    onClick={() => navigate('/medicines')}
                    className="w-12 h-12 flex items-center justify-center bg-white border-2 border-slate-100 rounded-2xl hover:bg-slate-50 hover:border-blue-200 text-slate-500 hover:text-blue-600 transition-all shadow-sm"
                >
                    <ArrowLeft size={24} />
                </button>
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">{isEdit ? 'Edit Medicine' : 'Add New Medicine'}</h1>
                    <p className="text-slate-500 font-medium">Complete the pharmacy record details below</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-200/50 overflow-hidden">
                <div className="p-8 md:p-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                        <div className="space-y-3 md:col-span-2">
                            <label className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <Info size={14} className="text-blue-500" />
                                Basic Information
                            </label>
                            <div className="h-px bg-slate-100 w-full mb-4" />
                        </div>

                        <div className="space-y-3 md:col-span-2">
                            <label className="block text-sm font-bold text-slate-700 ml-1">Medicine Name</label>
                            <input 
                                type="text" 
                                name="name"
                                required
                                className="w-full bg-slate-50 border-2 border-transparent rounded-2xl py-4 px-6 focus:bg-white focus:border-blue-100 focus:ring-4 focus:ring-blue-50 outline-none transition-all font-semibold text-slate-700"
                                placeholder="e.g. Paracetamol 500mg"
                                value={formData.name}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="space-y-3 md:col-span-2">
                            <label className="block text-sm font-bold text-slate-700 ml-1">Description</label>
                            <textarea 
                                name="description"
                                rows="3"
                                className="w-full bg-slate-50 border-2 border-transparent rounded-2xl py-4 px-6 focus:bg-white focus:border-blue-100 focus:ring-4 focus:ring-blue-50 outline-none transition-all font-semibold text-slate-700 resize-none"
                                placeholder="Brief description of clinical use, storage, etc..."
                                value={formData.description}
                                onChange={handleChange}
                            ></textarea>
                        </div>

                        <div className="space-y-3">
                            <label className="block text-sm font-bold text-slate-700 ml-1">Category</label>
                            <select 
                                name="category"
                                required
                                className="w-full bg-slate-50 border-2 border-transparent rounded-2xl py-4 px-6 focus:bg-white focus:border-blue-100 focus:ring-4 focus:ring-blue-50 outline-none transition-all font-semibold text-slate-700 cursor-pointer appearance-none"
                                value={formData.category}
                                onChange={handleChange}
                            >
                                <option value="">Select Category</option>
                                {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                            </select>
                        </div>

                        <div className="space-y-3">
                            <label className="block text-sm font-bold text-slate-700 ml-1">Supplier</label>
                            <select 
                                name="supplier"
                                required
                                className="w-full bg-slate-50 border-2 border-transparent rounded-2xl py-4 px-6 focus:bg-white focus:border-blue-100 focus:ring-4 focus:ring-blue-50 outline-none transition-all font-semibold text-slate-700 cursor-pointer appearance-none"
                                value={formData.supplier}
                                onChange={handleChange}
                            >
                                <option value="">Select Supplier</option>
                                {suppliers.map(s => <option key={s._id} value={s._id}>{s.companyName}</option>)}
                            </select>
                        </div>

                        <div className="space-y-3 md:col-span-2 mt-4">
                            <label className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <Info size={14} className="text-emerald-500" />
                                Inventory & Pricing
                            </label>
                            <div className="h-px bg-slate-100 w-full mb-4" />
                        </div>

                        <div className="space-y-3">
                            <label className="block text-sm font-bold text-slate-700 ml-1">Unit Price ($)</label>
                            <input 
                                type="number" 
                                name="price"
                                step="0.01"
                                required
                                className="w-full bg-slate-50 border-2 border-transparent rounded-2xl py-4 px-6 focus:bg-white focus:border-blue-100 focus:ring-4 focus:ring-blue-50 outline-none transition-all font-semibold text-slate-700"
                                placeholder="0.00"
                                value={formData.price}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="space-y-3">
                            <label className="block text-sm font-bold text-slate-700 ml-1">Initial Stock</label>
                            <input 
                                type="number" 
                                name="stockQuantity"
                                required
                                className={cn(
                                    "w-full border-2 rounded-2xl py-4 px-6 outline-none transition-all font-semibold",
                                    isEdit ? "bg-slate-100 border-transparent text-slate-400 cursor-not-allowed" : "bg-slate-50 border-transparent focus:bg-white focus:border-blue-100 focus:ring-4 focus:ring-blue-50 text-slate-700"
                                )}
                                placeholder="0"
                                value={formData.stockQuantity}
                                onChange={handleChange}
                                disabled={isEdit}
                            />
                        </div>

                        <div className="space-y-3">
                            <label className="block text-sm font-bold text-slate-700 ml-1">Reorder Level</label>
                            <input 
                                type="number" 
                                name="reorderLevel"
                                required
                                className="w-full bg-slate-50 border-2 border-transparent rounded-2xl py-4 px-6 focus:bg-white focus:border-blue-100 focus:ring-4 focus:ring-blue-50 outline-none transition-all font-semibold text-slate-700"
                                value={formData.reorderLevel}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="space-y-3">
                            <label className="block text-sm font-bold text-slate-700 ml-1">Batch Number</label>
                            <input 
                                type="text" 
                                name="batchNumber"
                                required
                                className="w-full bg-slate-50 border-2 border-transparent rounded-2xl py-4 px-6 focus:bg-white focus:border-blue-100 focus:ring-4 focus:ring-blue-50 outline-none transition-all font-semibold text-slate-700"
                                placeholder="BT-001"
                                value={formData.batchNumber}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="space-y-3">
                            <label className="block text-sm font-bold text-slate-700 ml-1">Expiry Date</label>
                            <input 
                                type="date" 
                                name="expiryDate"
                                required
                                className="w-full bg-slate-50 border-2 border-transparent rounded-2xl py-4 px-6 focus:bg-white focus:border-blue-100 focus:ring-4 focus:ring-blue-50 outline-none transition-all font-semibold text-slate-700"
                                value={formData.expiryDate}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                </div>

                <div className="p-8 md:p-10 bg-slate-50/50 border-t border-slate-100 flex flex-col sm:flex-row justify-end gap-4">
                    <button 
                        type="button"
                        onClick={() => navigate('/medicines')}
                        className="px-10 py-4 rounded-2xl bg-white border-2 border-slate-100 text-slate-600 font-bold hover:bg-slate-50 hover:border-slate-200 transition-all"
                    >
                        Discard Changes
                    </button>
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="px-12 py-4 rounded-2xl bg-blue-600 text-white font-black shadow-xl shadow-blue-100 hover:bg-blue-700 hover:shadow-2xl transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            <>
                                <Save size={20} />
                                {isEdit ? 'Update Record' : 'Register Medicine'}
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddMedicine;

