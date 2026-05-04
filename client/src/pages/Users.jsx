import { useState, useEffect } from 'react';
import api from '../api/axios';
import { Plus, Edit, Trash2, User, Mail, Shield, X, Save, Lock } from 'lucide-react';
import toast from 'react-hot-toast';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState({
        fullName: '',
        email: '',
        password: '',
        role: 'Pharmacist'
    });
    const [editId, setEditId] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const { data } = await api.get('/users');
            setUsers(data);
        } catch (error) {
            toast.error('Failed to fetch employees');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editId) {
                const updateData = { ...currentUser };
                if (!updateData.password) delete updateData.password;
                await api.put(`/users/${editId}`, updateData);
                toast.success('Employee updated');
            } else {
                await api.post('/users', currentUser);
                toast.success('Employee registered');
            }
            setIsModalOpen(false);
            setEditId(null);
            setCurrentUser({ fullName: '', email: '', password: '', role: 'Pharmacist' });
            fetchUsers();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Operation failed');
        }
    };

    const handleEdit = (user) => {
        setEditId(user._id);
        setCurrentUser({
            fullName: user.fullName,
            email: user.email,
            password: '',
            role: user.role
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Remove this employee from the system?')) {
            try {
                await api.delete(`/users/${id}`);
                toast.success('Employee removed');
                fetchUsers();
            } catch (error) {
                toast.error('Failed to delete');
            }
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Employee Management</h1>
                    <p className="text-slate-500">Manage pharmacy staff and their access levels</p>
                </div>
                <button 
                    onClick={() => {
                        setEditId(null);
                        setCurrentUser({ fullName: '', email: '', password: '', role: 'Pharmacist' });
                        setIsModalOpen(true);
                    }}
                    className="btn-primary flex items-center gap-2"
                >
                    <Plus size={20} />
                    Register Employee
                </button>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-slate-50/50">
                            <th className="px-6 py-4 text-sm font-semibold text-slate-600">Employee</th>
                            <th className="px-6 py-4 text-sm font-semibold text-slate-600">Email</th>
                            <th className="px-6 py-4 text-sm font-semibold text-slate-600">Role</th>
                            <th className="px-6 py-4 text-sm font-semibold text-slate-600">Joined Date</th>
                            <th className="px-6 py-4 text-sm font-semibold text-slate-600 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {loading ? (
                            <tr><td colSpan="5" className="px-6 py-12 text-center text-slate-500">Loading staff...</td></tr>
                        ) : users.map((u) => (
                            <tr key={u._id} className="hover:bg-slate-50/50 transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                                            {u.fullName.charAt(0)}
                                        </div>
                                        <span className="font-bold text-slate-900">{u.fullName}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-600">{u.email}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                                        u.role === 'Admin' ? 'bg-indigo-100 text-indigo-700' :
                                        u.role === 'Inventory Manager' ? 'bg-emerald-100 text-emerald-700' :
                                        'bg-blue-100 text-blue-700'
                                    }`}>
                                        {u.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-500">
                                    {new Date(u.createdAt).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => handleEdit(u)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                                            <Edit size={18} />
                                        </button>
                                        <button onClick={() => handleDelete(u._id)} className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                            <h3 className="text-xl font-bold text-slate-900">{editId ? 'Edit Employee' : 'New Employee'}</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500 uppercase">Full Name</label>
                                <input 
                                    type="text" required className="input-field w-full"
                                    value={currentUser.fullName}
                                    onChange={(e) => setCurrentUser({...currentUser, fullName: e.target.value})}
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500 uppercase">Email Address</label>
                                <input 
                                    type="email" required className="input-field w-full"
                                    value={currentUser.email}
                                    onChange={(e) => setCurrentUser({...currentUser, email: e.target.value})}
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500 uppercase">Role</label>
                                <select 
                                    className="input-field w-full"
                                    value={currentUser.role}
                                    onChange={(e) => setCurrentUser({...currentUser, role: e.target.value})}
                                >
                                    <option value="Admin">Admin</option>
                                    <option value="Pharmacist">Pharmacist</option>
                                    <option value="Inventory Manager">Inventory Manager</option>
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500 uppercase">{editId ? 'New Password (Optional)' : 'Password'}</label>
                                <input 
                                    type="password" required={!editId} className="input-field w-full"
                                    placeholder={editId ? '••••••••' : ''}
                                    value={currentUser.password}
                                    onChange={(e) => setCurrentUser({...currentUser, password: e.target.value})}
                                />
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 font-bold text-slate-600">Cancel</button>
                                <button type="submit" className="flex-1 btn-primary">Save Employee</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Users;
