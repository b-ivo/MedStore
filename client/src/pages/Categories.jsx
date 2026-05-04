import { useState, useEffect } from 'react';
import api from '../api/axios';
import { Plus, Edit, Trash2, Tag, X, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentCategory, setCurrentCategory] = useState({ name: '', description: '' });
    const [editId, setEditId] = useState(null);
    const { user } = useAuth();

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const { data } = await api.get('/categories');
            setCategories(data);
        } catch (error) {
            toast.error('Failed to fetch categories');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editId) {
                await api.put(`/categories/${editId}`, currentCategory);
                toast.success('Category updated');
            } else {
                await api.post('/categories', currentCategory);
                toast.success('Category created');
            }
            setIsModalOpen(false);
            setCurrentCategory({ name: '', description: '' });
            setEditId(null);
            fetchCategories();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Operation failed');
        }
    };

    const handleEdit = (category) => {
        setEditId(category._id);
        setCurrentCategory({ name: category.name, description: category.description });
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure? This may affect medicines in this category.')) {
            try {
                await api.delete(`/categories/${id}`);
                toast.success('Category removed');
                fetchCategories();
            } catch (error) {
                toast.error('Failed to delete category');
            }
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Categories</h1>
                    <p className="text-slate-500">Manage medicine classifications</p>
                </div>
                <button 
                    onClick={() => {
                        setEditId(null);
                        setCurrentCategory({ name: '', description: '' });
                        setIsModalOpen(true);
                    }}
                    className="btn-primary flex items-center gap-2"
                >
                    <Plus size={20} />
                    New Category
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <p className="col-span-full text-center py-12 text-slate-500">Loading categories...</p>
                ) : categories.length === 0 ? (
                    <p className="col-span-full text-center py-12 text-slate-500">No categories found</p>
                ) : (
                    categories.map((cat) => (
                        <div key={cat._id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
                            <div className="flex items-start justify-between mb-4">
                                <div className="p-3 rounded-xl bg-blue-50 text-blue-600">
                                    <Tag size={24} />
                                </div>
                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => handleEdit(cat)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                        <Edit size={16} />
                                    </button>
                                    <button onClick={() => handleDelete(cat._id)} className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-1">{cat.name}</h3>
                            <p className="text-slate-500 text-sm line-clamp-2">{cat.description || 'No description provided.'}</p>
                        </div>
                    ))
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                            <h3 className="text-xl font-bold text-slate-900">{editId ? 'Edit Category' : 'New Category'}</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700">Category Name</label>
                                <input 
                                    type="text" 
                                    required
                                    className="input-field w-full"
                                    placeholder="e.g. Antibiotics"
                                    value={currentCategory.name}
                                    onChange={(e) => setCurrentCategory({...currentCategory, name: e.target.value})}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700">Description</label>
                                <textarea 
                                    rows="4"
                                    className="input-field w-full"
                                    placeholder="Enter category details..."
                                    value={currentCategory.description}
                                    onChange={(e) => setCurrentCategory({...currentCategory, description: e.target.value})}
                                ></textarea>
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button 
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition-all"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit"
                                    className="flex-1 btn-primary flex items-center justify-center gap-2"
                                >
                                    <Save size={18} />
                                    {editId ? 'Update' : 'Create'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Categories;
