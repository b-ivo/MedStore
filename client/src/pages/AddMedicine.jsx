import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { Pill, Save, X, ArrowLeft } from 'lucide-react';

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
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <button 
                    onClick={() => navigate('/medicines')}
                    className="p-2 hover:bg-slate-100 rounded-full transition-all text-slate-500"
                >
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">{isEdit ? 'Edit Medicine' : 'Add New Medicine'}</h1>
                    <p className="text-slate-500">Fill in the details below to {isEdit ? 'update' : 'register'} medicine</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4 md:col-span-2">
                        <label className="block text-sm font-semibold text-slate-700">Medicine Name</label>
                        <input 
                            type="text" 
                            name="name"
                            required
                            className="input-field w-full"
                            placeholder="e.g. Paracetamol 500mg"
                            value={formData.name}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="space-y-4 md:col-span-2">
                        <label className="block text-sm font-semibold text-slate-700">Description</label>
                        <textarea 
                            name="description"
                            rows="3"
                            className="input-field w-full"
                            placeholder="Brief description of the medicine..."
                            value={formData.description}
                            onChange={handleChange}
                        ></textarea>
                    </div>

                    <div className="space-y-4">
                        <label className="block text-sm font-semibold text-slate-700">Category</label>
                        <select 
                            name="category"
                            required
                            className="input-field w-full"
                            value={formData.category}
                            onChange={handleChange}
                        >
                            <option value="">Select Category</option>
                            {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                        </select>
                    </div>

                    <div className="space-y-4">
                        <label className="block text-sm font-semibold text-slate-700">Supplier</label>
                        <select 
                            name="supplier"
                            required
                            className="input-field w-full"
                            value={formData.supplier}
                            onChange={handleChange}
                        >
                            <option value="">Select Supplier</option>
                            {suppliers.map(s => <option key={s._id} value={s._id}>{s.companyName}</option>)}
                        </select>
                    </div>

                    <div className="space-y-4">
                        <label className="block text-sm font-semibold text-slate-700">Unit Price ($)</label>
                        <input 
                            type="number" 
                            name="price"
                            step="0.01"
                            required
                            className="input-field w-full"
                            placeholder="0.00"
                            value={formData.price}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="space-y-4">
                        <label className="block text-sm font-semibold text-slate-700">Initial Stock</label>
                        <input 
                            type="number" 
                            name="stockQuantity"
                            required
                            className="input-field w-full"
                            placeholder="0"
                            value={formData.stockQuantity}
                            onChange={handleChange}
                            disabled={isEdit} // Stock should be updated via Purchases
                        />
                    </div>

                    <div className="space-y-4">
                        <label className="block text-sm font-semibold text-slate-700">Reorder Level</label>
                        <input 
                            type="number" 
                            name="reorderLevel"
                            required
                            className="input-field w-full"
                            value={formData.reorderLevel}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="space-y-4">
                        <label className="block text-sm font-semibold text-slate-700">Batch Number</label>
                        <input 
                            type="text" 
                            name="batchNumber"
                            required
                            className="input-field w-full"
                            placeholder="BT-001"
                            value={formData.batchNumber}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="space-y-4">
                        <label className="block text-sm font-semibold text-slate-700">Expiry Date</label>
                        <input 
                            type="date" 
                            name="expiryDate"
                            required
                            className="input-field w-full"
                            value={formData.expiryDate}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                    <button 
                        type="button"
                        onClick={() => navigate('/medicines')}
                        className="px-6 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-white transition-all"
                    >
                        Cancel
                    </button>
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="btn-primary px-8 flex items-center gap-2"
                    >
                        {loading ? 'Saving...' : (
                            <>
                                <Save size={18} />
                                {isEdit ? 'Update Medicine' : 'Save Medicine'}
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddMedicine;
