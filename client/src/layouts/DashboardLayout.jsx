import { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { useAuth } from '../contexts/AuthContext';

const DashboardLayout = () => {
    const { user } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    if (!user) return <Navigate to="/login" />;

    return (
        <div className="flex h-screen bg-slate-50/50 overflow-hidden font-sans">
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            
            <div className="flex flex-col flex-1 min-w-0 h-full relative">
                <Navbar onMenuClick={() => setSidebarOpen(true)} />
                
                <main className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-10 scroll-smooth">
                    <div className="max-w-7xl mx-auto">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;

