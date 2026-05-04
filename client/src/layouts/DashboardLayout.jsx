import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { useAuth } from '../contexts/AuthContext';

const DashboardLayout = () => {
    const { user } = useAuth();

    if (!user) {
        return <Navigate to="/login" />;
    }

    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden">
            <Sidebar />
            <div className="flex flex-col flex-1 overflow-y-auto">
                <Navbar />
                <main className="p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
