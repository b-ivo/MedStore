import { useState, useEffect } from 'react';
import api from '../api/axios';
import { Plus, Trash2, ShoppingBag, Truck, Pill, Save, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const NewPurchase = () => {
    const [medicines, setMedicines] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [selectedSupplier, setSelectedSupplier] = useState('');
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [medRes, supRes] = await Promise.all([
                    api.get('/medicines'),
                    api.get('/suppliers')
                ]);
                setMedicines(medRes.data);
                setSuppliers(supRes.data);
            } catch (error) {
                toast.error('Failed to load data');
            }
        };
        fetchData();
    }, []);

    const addItem = () => {
        setItems([...items, { medicine: '', quantity: 1, unitPrice: 0 }]);
    };

    const removeItem = (index) => {
        setItems(items.filter((_, i) => i !== index));
    };

    const updateItem = (index, field, value) => {
        const newItems = [...items];
        newItems[index][field] = value;
        
        if (field === 'medicine') {
            const med = medicines.find(m => m._id === value);
            if (med) newItems[index].unitPrice = med.price;
        }
        
        setItems(newItems);
    };

    const totalAmount = items.reduce((acc, item) => acc + (item.unitPrice * item.quantity), 0);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedSupplier) return toast.error('Please select a supplier');
        if (items.length === 0) return toast.error('Please add at least one item');
        
        setLoading(true);
        try {
            const purchaseData = {
                supplier: selectedSupplier,
                items,
                totalAmount
            };
            await api.post('/purchases', purchaseData);
            toast.success('Purchase recorded successfully');
            navigate('/purchases');
        } catch (error) {
            toast.error('Failed to record purchase');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <button onClick={() => navigate('/purchases')} className="p-2 hover:bg-slate-100 rounded-full transition-all text-slate-500">
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Record New Purchase</h1>
                    <p className="text-slate-500">Restock your inventory by recording supplier purchases</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <div className="max-w-md space-y-4">
                        <label className="block text-sm font-semibold text-slate-700 flex items-center gap-2">
                            <Truck size={18} className="text-blue-500" />
                            Select Supplier
                        </label>
                        <select 
                            required
                            className="input-field w-full"
                            value={selectedSupplier}
                            onChange={(e) => setSelectedSupplier(e.target.value)}
                        >
                            <option value="">Choose Supplier</option>
                            {suppliers.map(s => <option key={s._id} value={s._id}>{s.companyName}</option>)}
                        </select>
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                            <Pill size={20} className="text-emerald-500" />
                            Purchase Items
                        </h3>
                        <button 
                            type="button"
                            onClick={addItem}
                            className="flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors"
                        >
                            <Plus size={18} />
                            Add Item
                        </button>
                    </div>

                    <div className="p-6 overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="text-slate-500 text-sm border-b border-slate-100">
                                    <th className="pb-4 font-semibold">Medicine</th>
                                    <th className="pb-4 font-semibold w-32">Quantity</th>
                                    <th className="pb-4 font-semibold w-40">Unit Price ($)</th>
                                    <th className="pb-4 font-semibold w-40">Subtotal</th>
                                    <th className="pb-4 w-12"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {items.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="py-8 text-center text-slate-400">No items added yet. Click "Add Item" to begin.</td>
                                    </tr>
                                ) : items.map((item, index) => (
                                    <tr key={index}>
                                        <td className="py-4 pr-4">
                                            <select 
                                                required
                                                className="input-field w-full"
                                                value={item.medicine}
                                                onChange={(e) => updateItem(index, 'medicine', e.target.value)}
                                            >
                                                <option value="">Select Medicine</option>
                                                {medicines.map(m => <option key={m._id} value={m._id}>{m.name}</option>)}
                                            </select>
                                        </td>
                                        <td className="py-4 pr-4">
                                            <input 
                                                type="number" required min="1"
                                                className="input-field w-full text-center"
                                                value={item.quantity}
                                                onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value))}
                                            />
                                        </td>
                                        <td className="py-4 pr-4">
                                            <input 
                                                type="number" required step="0.01"
                                                className="input-field w-full"
                                                value={item.unitPrice}
                                                onChange={(e) => updateItem(index, 'unitPrice', parseFloat(e.target.value))}
                                            />
                                        </td>
                                        <td className="py-4 pr-4 font-bold text-slate-900">
                                            ${(item.unitPrice * item.quantity).toFixed(2)}
                                        </td>
                                        <td className="py-4">
                                            <button 
                                                type="button" onClick={() => removeItem(index)}
                                                className="text-rose-500 hover:bg-rose-50 p-2 rounded-lg"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="p-6 bg-slate-50 flex items-center justify-between">
                        <div className="text-slate-500 text-sm">
                            Total Items: <span className="font-bold text-slate-900">{items.length}</span>
                        </div>
                        <div className="text-right">
                            <span className="text-slate-500 mr-4">Total Amount:</span>
                            <span className="text-2xl font-bold text-slate-900">${totalAmount.toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-4">
                    <button 
                        type="button" onClick={() => navigate('/purchases')}
                        className="px-8 py-3 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-white transition-all"
                    >
                        Discard
                    </button>
                    <button 
                        type="submit" disabled={loading || items.length === 0}
                        className="btn-primary px-10 flex items-center gap-2"
                    >
                        <Save size={20} />
                        {loading ? 'Recording...' : 'Finalize Purchase'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default NewPurchase;
