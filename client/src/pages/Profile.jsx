import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User, Mail, Shield, Key, Save, Camera } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/axios';

const Profile = () => {
    const { user, updateProfile } = useAuth();
    const [formData, setFormData] = useState({
        fullName: user?.fullName || '',
        email: user?.email || '',
        password: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password && formData.password !== formData.confirmPassword) {
            return toast.error('Passwords do not match');
        }

        setLoading(true);
        try {
            const { data } = await api.put('/users/me', {
                fullName: formData.fullName,
                ...(formData.password && { password: formData.password })
            });
            updateProfile(data);
            toast.success('Profile updated successfully');
        } catch (error) {
            toast.error('Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">My Profile</h1>
                <p className="text-slate-500">Manage your account settings and preferences</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-1">
                    <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm text-center">
                        <div className="relative inline-block mb-4">
                            <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-blue-200">
                                {user?.fullName?.charAt(0)}
                            </div>
                            <button className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-md border border-slate-100 text-blue-600 hover:bg-slate-50 transition-all">
                                <Camera size={16} />
                            </button>
                        </div>
                        <h3 className="text-xl font-bold text-slate-900">{user?.fullName}</h3>
                        <p className="text-slate-500 text-sm mb-4">{user?.email}</p>
                        <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold uppercase tracking-wider">
                            {user?.role}
                        </span>
                    </div>
                </div>

                <div className="md:col-span-2">
                    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                        <div className="p-8 space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                        <User size={16} className="text-slate-400" />
                                        Full Name
                                    </label>
                                    <input 
                                        type="text" 
                                        className="input-field w-full"
                                        value={formData.fullName}
                                        onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                        <Mail size={16} className="text-slate-400" />
                                        Email Address
                                    </label>
                                    <input 
                                        type="email" 
                                        className="input-field w-full bg-slate-50 text-slate-500 cursor-not-allowed"
                                        value={formData.email}
                                        readOnly
                                    />
                                </div>
                            </div>

                            <hr className="border-slate-100" />

                            <div className="space-y-4">
                                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                                    <Key size={18} className="text-blue-500" />
                                    Change Password
                                </h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-slate-700">New Password</label>
                                        <input 
                                            type="password" 
                                            className="input-field w-full"
                                            placeholder="••••••••"
                                            value={formData.password}
                                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-slate-700">Confirm New Password</label>
                                        <input 
                                            type="password" 
                                            className="input-field w-full"
                                            placeholder="••••••••"
                                            value={formData.confirmPassword}
                                            onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end">
                            <button 
                                type="submit" 
                                disabled={loading}
                                className="btn-primary flex items-center gap-2 px-8"
                            >
                                <Save size={18} />
                                {loading ? 'Saving Changes...' : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Profile;
