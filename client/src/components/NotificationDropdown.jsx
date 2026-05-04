import { useState, useEffect, useRef } from 'react';
import api from '../api/axios';
import { Bell, AlertTriangle, Calendar, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const NotificationDropdown = () => {
    const [notifications, setNotifications] = useState([]);
    const [readIds, setReadIds] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        fetchNotifications();
        
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const fetchNotifications = async () => {
        try {
            const [lowRes, expRes] = await Promise.all([
                api.get('/medicines/low-stock'),
                api.get('/medicines/expiring')
            ]);

            const lowStock = lowRes.data.map(m => ({
                id: `low-${m._id}`,
                type: 'low-stock',
                title: 'Low Stock Alert',
                message: `${m.name} is below reorder level (${m.stockQuantity} left)`,
                date: new Date(),
                link: '/medicines'
            }));

            const expiring = expRes.data.map(m => ({
                id: `exp-${m._id}`,
                type: 'expiring',
                title: 'Expiry Warning',
                message: `${m.name} is expiring on ${new Date(m.expiryDate).toLocaleDateString()}`,
                date: new Date(),
                link: '/medicines'
            }));

            setNotifications([...lowStock, ...expiring]);
        } catch (error) {
            console.error('Failed to fetch notifications');
        }
    };

    const handleMarkAllRead = () => {
        const allIds = notifications.map(n => n.id);
        setReadIds(allIds);
    };

    const activeNotifications = notifications.filter(n => !readIds.includes(n.id));

    return (
        <div className="relative" ref={dropdownRef}>
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-all relative"
            >
                <Bell size={20} />
                {activeNotifications.length > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white">
                        {activeNotifications.length}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                        <h3 className="font-bold text-slate-900">Notifications</h3>
                        <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600">
                            <X size={18} />
                        </button>
                    </div>

                    <div className="max-h-96 overflow-y-auto">
                        {activeNotifications.length === 0 ? (
                            <div className="p-8 text-center">
                                <Bell className="mx-auto text-slate-200 mb-2" size={32} />
                                <p className="text-slate-500 text-sm">No new notifications</p>
                            </div>
                        ) : (
                            activeNotifications.map((n) => (
                                <Link 
                                    key={n.id} 
                                    to={n.link}
                                    onClick={() => setIsOpen(false)}
                                    className="p-4 border-b border-slate-50 flex gap-4 hover:bg-slate-50 transition-colors group"
                                >
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                                        n.type === 'low-stock' ? 'bg-amber-100 text-amber-600' : 'bg-rose-100 text-rose-600'
                                    }`}>
                                        {n.type === 'low-stock' ? <AlertTriangle size={20} /> : <Calendar size={20} />}
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-slate-900">{n.title}</h4>
                                        <p className="text-xs text-slate-500 leading-relaxed mt-0.5">{n.message}</p>
                                        <span className="text-[10px] text-slate-400 mt-2 block uppercase font-bold tracking-wider">Just now</span>
                                    </div>
                                </Link>
                            ))
                        )}
                    </div>

                    {activeNotifications.length > 0 && (
                        <div className="p-3 bg-slate-50 text-center">
                            <button 
                                onClick={handleMarkAllRead}
                                className="text-xs font-bold text-blue-600 hover:underline"
                            >
                                Mark all as read
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default NotificationDropdown;
