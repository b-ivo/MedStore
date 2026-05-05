import { useState, useEffect } from 'react';
import api from '../api/axios';
import { Search, Plus, Trash2, ShoppingCart, CreditCard, Receipt, User } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const NewSale = () => {
    const [medicines, setMedicines] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchMedicines();
    }, []);

    const fetchMedicines = async () => {
        try {
            const { data } = await api.get('/medicines');
            setMedicines(data);
        } catch (error) {
            toast.error('Failed to fetch medicines');
        }
    };

    const addToCart = (medicine) => {
        if (medicine.stockQuantity <= 0) {
            toast.error('Out of stock');
            return;
        }

        const existingItem = cart.find(item => item.medicine === medicine._id);
        if (existingItem) {
            if (existingItem.quantity >= medicine.stockQuantity) {
                toast.error('Cannot exceed available stock');
                return;
            }
            setCart(cart.map(item => 
                item.medicine === medicine._id 
                ? { ...item, quantity: item.quantity + 1 } 
                : item
            ));
        } else {
            setCart([...cart, { 
                medicine: medicine._id, 
                name: medicine.name, 
                unitPrice: medicine.price, 
                quantity: 1,
                maxStock: medicine.stockQuantity
            }]);
        }
    };

    const removeFromCart = (id) => {
        setCart(cart.filter(item => item.medicine !== id));
    };

    const updateQuantity = (id, q) => {
        const item = cart.find(i => i.medicine === id);
        if (q > item.maxStock) {
            toast.error('Cannot exceed stock');
            return;
        }
        if (q <= 0) return removeFromCart(id);
        
        setCart(cart.map(item => 
            item.medicine === id ? { ...item, quantity: q } : item
        ));
    };

    const totalAmount = cart.reduce((acc, item) => acc + (item.unitPrice * item.quantity), 0);

    const handleSubmit = async () => {
        if (cart.length === 0) return toast.error('Cart is empty');
        setLoading(true);
        try {
            const saleData = {
                items: cart.map(i => ({ medicine: i.medicine, quantity: i.quantity, unitPrice: i.unitPrice })),
                totalAmount
            };
            await api.post('/sales', saleData);
            toast.success('Sale processed successfully');
            setCart([]);
            navigate('/sales');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Sale failed');
        } finally {
            setLoading(false);
        }
    };

    const filteredMedicines = medicines.filter(m => 
        m.name.toLowerCase().includes(searchTerm.toLowerCase()) && m.stockQuantity > 0
    );

    return (
        <div className="flex flex-col lg:grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">New Sale</h1>
                        <p className="text-slate-500">Search and add medicines to customer cart</p>
                    </div>
                </div>

                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input 
                        type="text" 
                        placeholder="Search medicines by name..." 
                        className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-100 outline-none transition-all text-lg"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {filteredMedicines.slice(0, 8).map((med) => (
                        <div key={med._id} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between hover:border-blue-200 transition-all group">
                            <div>
                                <h4 className="font-bold text-slate-900">{med.name}</h4>
                                <p className="text-sm text-slate-500">${med.price.toFixed(2)} • {med.stockQuantity} in stock</p>
                            </div>
                            <button 
                                onClick={() => addToCart(med)}
                                className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                            >
                                <Plus size={20} />
                            </button>
                        </div>
                    ))}
                    {filteredMedicines.length === 0 && <p className="col-span-full text-center py-8 text-slate-500">No available medicines found.</p>}
                </div>
            </div>

            <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl border border-slate-100 shadow-lg overflow-hidden flex flex-col">
                    <div className="p-6 bg-slate-900 text-white flex items-center gap-3">
                        <ShoppingCart size={24} />
                        <h3 className="text-xl font-bold">Cart Summary</h3>
                    </div>
                    
                    <div className="p-6 flex-1 overflow-y-auto max-h-[400px] space-y-4">
                        {cart.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                                    <ShoppingCart size={32} />
                                </div>
                                <p className="text-slate-500">Cart is empty</p>
                            </div>
                        ) : cart.map((item) => (
                            <div key={item.medicine} className="flex items-start justify-between gap-4 group">
                                <div className="flex-1">
                                    <h5 className="font-bold text-slate-900 leading-tight">{item.name}</h5>
                                    <p className="text-sm text-slate-500">${item.unitPrice.toFixed(2)} each</p>
                                    <div className="flex items-center gap-3 mt-2">
                                        <button onClick={() => updateQuantity(item.medicine, item.quantity - 1)} className="w-6 h-6 flex items-center justify-center rounded bg-slate-100 text-slate-600 hover:bg-slate-200">-</button>
                                        <span className="font-semibold text-sm w-6 text-center">{item.quantity}</span>
                                        <button onClick={() => updateQuantity(item.medicine, item.quantity + 1)} className="w-6 h-6 flex items-center justify-center rounded bg-slate-100 text-slate-600 hover:bg-slate-200">+</button>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-slate-900">${(item.unitPrice * item.quantity).toFixed(2)}</p>
                                    <button onClick={() => removeFromCart(item.medicine)} className="text-rose-500 p-1 hover:bg-rose-50 rounded mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="p-6 border-t border-slate-100 bg-slate-50 space-y-4">
                        <div className="flex items-center justify-between text-slate-500">
                            <span>Subtotal</span>
                            <span>${totalAmount.toFixed(2)}</span>
                        </div>
                        <div className="flex items-center justify-between text-slate-500">
                            <span>Tax (0%)</span>
                            <span>$0.00</span>
                        </div>
                        <div className="flex items-center justify-between text-xl font-bold text-slate-900">
                            <span>Total</span>
                            <span>${totalAmount.toFixed(2)}</span>
                        </div>
                        
                        <button 
                            onClick={handleSubmit}
                            disabled={cart.length === 0 || loading}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                        >
                            <CreditCard size={20} />
                            {loading ? 'Processing...' : 'Complete Sale'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NewSale;
