import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User, Mail, Shield, Key, Save, Camera, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/axios';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

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
        <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Account Configuration</h1>
                <p className="text-slate-500 font-medium">Manage your personal information and security settings</p>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
                <div className="xl:col-span-1">
                    <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 text-center relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-full h-2 bg-blue-600" />
                        <div className="relative inline-block mb-6">
                            <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-blue-700 rounded-[2.5rem] flex items-center justify-center text-white text-5xl font-black shadow-2xl shadow-blue-200 rotate-3 group-hover:rotate-0 transition-transform duration-500">
                                {user?.fullName?.charAt(0)}
                            </div>
                            <button className="absolute -bottom-2 -right-2 p-3 bg-white rounded-2xl shadow-xl border border-slate-100 text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300">
                                <Camera size={20} />
                            </button>
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 mb-1">{user?.fullName}</h3>
                        <p className="text-slate-400 font-bold text-sm mb-6 uppercase tracking-widest">{user?.email}</p>
                        
                        <div className="flex items-center justify-center gap-2 mb-8">
                            <span className="px-4 py-2 bg-blue-50 text-blue-700 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-sm">
                                {user?.role}
                            </span>
                            <span className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-sm flex items-center gap-1">
                                <Check size={12} /> Active
                            </span>
                        </div>

                        <div className="pt-6 border-t border-slate-50 grid grid-cols-2 gap-4">
                            <div className="text-center">
                                <p className="text-xl font-black text-slate-900">12</p>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Actions Today</p>
                            </div>
                            <div className="text-center border-l border-slate-50">
                                <p className="text-xl font-black text-slate-900">1.2k</p>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Total Tasks</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="xl:col-span-2">
                    <form onSubmit={handleSubmit} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden">
                        <div className="p-8 md:p-12 space-y-10">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-sm font-bold text-slate-700 flex items-center gap-2 ml-1">
                                        <User size={16} className="text-blue-500" />
                                        Full Name
                                    </label>
                                    <input 
                                        type="text" 
                                        className="w-full bg-slate-50 border-2 border-transparent rounded-2xl py-4 px-6 focus:bg-white focus:border-blue-100 focus:ring-4 focus:ring-blue-50 outline-none transition-all font-semibold text-slate-700"
                                        value={formData.fullName}
                                        onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-sm font-bold text-slate-700 flex items-center gap-2 ml-1">
                                        <Mail size={16} className="text-slate-400" />
                                        Email Address
                                    </label>
                                    <input 
                                        type="email" 
                                        className="w-full bg-slate-100 border-2 border-transparent rounded-2xl py-4 px-6 text-slate-400 font-semibold cursor-not-allowed"
                                        value={formData.email}
                                        readOnly
                                    />
                                </div>
                            </div>

                            <div className="h-px bg-slate-100 w-full" />

                            <div className="space-y-6">
                                <h4 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-3">
                                    <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
                                        <Key size={18} />
                                    </div>
                                    Security Credentials
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className="text-sm font-bold text-slate-700 ml-1">New Password</label>
                                        <input 
                                            type="password" 
                                            className="w-full bg-slate-50 border-2 border-transparent rounded-2xl py-4 px-6 focus:bg-white focus:border-blue-100 focus:ring-4 focus:ring-blue-50 outline-none transition-all font-semibold text-slate-700"
                                            placeholder="••••••••"
                                            value={formData.password}
                                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-sm font-bold text-slate-700 ml-1">Confirm New Password</label>
                                        <input 
                                            type="password" 
                                            className="w-full bg-slate-50 border-2 border-transparent rounded-2xl py-4 px-6 focus:bg-white focus:border-blue-100 focus:ring-4 focus:ring-blue-50 outline-none transition-all font-semibold text-slate-700"
                                            placeholder="••••••••"
                                            value={formData.confirmPassword}
                                            onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-8 md:p-10 bg-slate-50/50 border-t border-slate-100 flex flex-col sm:flex-row justify-end gap-4">
                            <button 
                                type="submit" 
                                disabled={loading}
                                className="w-full sm:w-auto px-12 py-4 rounded-2xl bg-blue-600 text-white font-black shadow-xl shadow-blue-100 hover:bg-blue-700 hover:shadow-2xl transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                            >
                                {loading ? (
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                    <>
                                        <Save size={20} />
                                        Update Profile
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Profile;

