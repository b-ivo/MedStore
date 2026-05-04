import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import DashboardLayout from './layouts/DashboardLayout';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Medicines from './pages/Medicines';
import AddMedicine from './pages/AddMedicine';
import Categories from './pages/Categories';
import Suppliers from './pages/Suppliers';
import NewSale from './pages/NewSale';
import Sales from './pages/Sales';
import Purchases from './pages/Purchases';
import NewPurchase from './pages/NewPurchase';
import Reports from './pages/Reports';
import Users from './pages/Users';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';

const App = () => {
    return (
        <Router>
            <AuthProvider>
                <Toaster position="top-right" reverseOrder={false} />
                <Routes>
                    {/* Public Routes */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    {/* Private Routes */}
                    <Route path="/" element={<DashboardLayout />}>
                        <Route index element={<Navigate to="/dashboard" replace />} />
                        <Route path="dashboard" element={<Dashboard />} />
                        <Route path="medicines" element={<Medicines />} />
                        <Route path="medicines/add" element={<AddMedicine />} />
                        <Route path="medicines/edit/:id" element={<AddMedicine />} />
                        <Route path="categories" element={<Categories />} />
                        <Route path="suppliers" element={<Suppliers />} />
                        <Route path="sales" element={<Sales />} />
                        <Route path="sales/new" element={<NewSale />} />
                        <Route path="purchases" element={<Purchases />} />
                        <Route path="purchases/new" element={<NewPurchase />} />
                        <Route path="reports" element={<Reports />} />
                        <Route path="users" element={<Users />} />
                        <Route path="profile" element={<Profile />} />
                    </Route>

                    {/* Fallback */}
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </AuthProvider>
        </Router>
    );
};

export default App;
