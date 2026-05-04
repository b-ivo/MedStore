import { useState, useEffect } from 'react';
import api from '../api/axios';
import { Plus, Edit, Trash2, Truck, Mail, Phone, MapPin, X, Save } from 'lucide-react';
import toast from 'react-hot-toast';

const Suppliers = () => {
    const [suppliers, setSuppliers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentSupplier, setCurrentSupplier] = useState({
        companyName: '',
        contactPerson: '',
        phone: '',
        email: '',
        address: ''
    });
    const [editId, setEditId] = useState(null);

    useEffect(() => {
        fetchSuppliers();
    }, []);

    const fetchSuppliers = async () => {
        try {
            const { data } = await api.get('/suppliers');
            setSuppliers(data);
        } catch (error) {
            toast.error('Failed to fetch suppliers');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editId) {
                await api.put(`/suppliers/${editId}`, currentSupplier);
                toast.success('Supplier updated');
            } else {
                await api.post('/suppliers', currentSupplier);
                toast.success('Supplier added');
            }
            setIsModalOpen(false);
            setEditId(null);
            setCurrentSupplier({ companyName: '', contactPerson: '', phone: '', email: '', address: '' });
            fetchSuppliers();
        } catch (error) {
            toast.error('Operation failed');
        }
    };

    const handleEdit = (supplier) => {
        setEditId(supplier._id);
        setCurrentSupplier(supplier);
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this supplier?')) {
            try {
                await api.delete(`/suppliers/${id}`);
                toast.success('Supplier removed');
                fetchSuppliers();
            } catch (error) {
                toast.error('Failed to delete');
            }
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Suppliers</h1>
                    <p className="text-slate-500">Manage medicine suppliers and distributors</p>
                </div>
                <button 
                    onClick={() => {
                        setEditId(null);
                        setCurrentSupplier({ companyName: '', contactPerson: '', phone: '', email: '', address: '' });
                        setIsModalOpen(true);
                    }}
                    className="btn-primary flex items-center gap-2"
                >
                    <Plus size={20} />
                    Add Supplier
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {loading ? (
                    <p className="col-span-full text-center py-12 text-slate-500">Loading suppliers...</p>
                ) : suppliers.map((sup) => (
                    <div key={sup._id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group relative">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-2xl bg-blue-100 text-blue-600">
                                    <Truck size={28} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900">{sup.companyName}</h3>
                                    <p className="text-slate-500 font-medium">{sup.contactPerson}</p>
                                </div>
                            </div>
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => handleEdit(sup)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                                    <Edit size={18} />
                                </button>
                                <button onClick={() => handleDelete(sup._id)} className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg">
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                            <div className="flex items-center gap-3 text-slate-600">
                                <Mail size={16} className="text-slate-400" />
                                <span className="text-sm truncate">{sup.email}</span>
                            </div>
                            <div className="flex items-center gap-3 text-slate-600">
                                <Phone size={16} className="text-slate-400" />
                                <span className="text-sm">{sup.phone}</span>
                            </div>
                            <div className="flex items-start gap-3 text-slate-600 sm:col-span-2">
                                <MapPin size={16} className="text-slate-400 mt-1 flex-shrink-0" />
                                <span className="text-sm">{sup.address}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden">
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                            <h3 className="text-xl font-bold text-slate-900">{editId ? 'Edit Supplier' : 'Add Supplier'}</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2 md:col-span-2">
                                <label className="text-sm font-semibold text-slate-700">Company Name</label>
                                <input 
                                    type="text" required className="input-field w-full"
                                    value={currentSupplier.companyName}
                                    onChange={(e) => setCurrentSupplier({...currentSupplier, companyName: e.target.value})}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700">Contact Person</label>
                                <input 
                                    type="text" required className="input-field w-full"
                                    value={currentSupplier.contactPerson}
                                    onChange={(e) => setCurrentSupplier({...currentSupplier, contactPerson: e.target.value})}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700">Phone Number</label>
                                <input 
                                    type="text" required className="input-field w-full"
                                    value={currentSupplier.phone}
                                    onChange={(e) => setCurrentSupplier({...currentSupplier, phone: e.target.value})}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700">Email Address</label>
                                <input 
                                    type="email" required className="input-field w-full"
                                    value={currentSupplier.email}
                                    onChange={(e) => setCurrentSupplier({...currentSupplier, email: e.target.value})}
                                />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <label className="text-sm font-semibold text-slate-700">Address</label>
                                <textarea 
                                    required rows="2" className="input-field w-full"
                                    value={currentSupplier.address}
                                    onChange={(e) => setCurrentSupplier({...currentSupplier, address: e.target.value})}
                                ></textarea>
                            </div>
                            <div className="md:col-span-2 flex gap-4 pt-4">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 rounded-xl border border-slate-200 font-semibold">Cancel</button>
                                <button type="submit" className="flex-1 btn-primary flex items-center justify-center gap-2"><Save size={18} /> {editId ? 'Update' : 'Save'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Suppliers;
