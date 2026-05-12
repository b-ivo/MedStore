import { useState, useEffect } from "react";
import api from "../api/axios";
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  AlertCircle,
  Download,
  ChevronRight,
} from "lucide-react";
import toast from "react-hot-toast";
import { Link, useSearchParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const Medicines = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const categoryParam = searchParams.get("category") || "";

  const [medicines, setMedicines] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(query);
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const { user } = useAuth();

  useEffect(() => {
    setSearchTerm(query);
  }, [query]);

  useEffect(() => {
    setSelectedCategory(categoryParam);
  }, [categoryParam]);

  useEffect(() => {
    fetchMedicines();
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data } = await api.get("/categories");
      setCategories(data);
    } catch (error) {
      console.error("Failed to fetch categories");
    }
  };

  const fetchMedicines = async () => {
    try {
      const { data } = await api.get("/medicines");
      setMedicines(data);
    } catch (error) {
      toast.error("Failed to fetch medicines");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    toast(
      (t) => (
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium">Delete this medicine?</span>
          <button
            onClick={async () => {
              toast.dismiss(t.id);
              try {
                await api.delete(`/medicines/${id}`);
                toast.success("Medicine deleted");
                fetchMedicines();
              } catch {
                toast.error("Failed to delete medicine");
              }
            }}
            className="px-3 py-1 bg-rose-600 text-white text-xs rounded-lg font-semibold"
          >
            Delete
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-3 py-1 bg-slate-100 text-slate-700 text-xs rounded-lg font-semibold"
          >
            Cancel
          </button>
        </div>
      ),
      { duration: 6000 },
    );
  };

  const filteredMedicines = medicines.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.batchNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "" || m.category?._id === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleExport = () => {
    const exportData = filteredMedicines.map((m) => ({
      Name: m.name,
      Category: m.category?.name || "Uncategorized",
      BatchNumber: m.batchNumber,
      Stock: m.stockQuantity,
      Price: m.price,
      ExpiryDate: new Date(m.expiryDate).toLocaleDateString(),
      Supplier: m.supplier?.companyName || "N/A",
    }));
    import("../utils/exportUtils").then((module) => {
      module.exportToCSV(exportData, "MedStore_Inventory");
    });
  };

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Medicine Inventory
          </h1>
          <p className="text-slate-500 font-medium">
            Track and manage your pharmaceutical stock with ease
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleExport}
            className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-white text-slate-700 rounded-2xl hover:bg-slate-50 transition-all font-bold border-2 border-slate-100 shadow-sm"
          >
            <Download size={20} />
            <span>Export</span>
          </button>
          {(user?.role === "Admin" || user?.role === "Inventory Manager") && (
            <Link
              to="/medicines/add"
              className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-all font-bold shadow-lg shadow-blue-100"
            >
              <Plus size={20} />
              <span>Add New</span>
            </Link>
          )}
        </div>
      </div>

      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden">
        <div className="p-6 md:p-8 border-b border-slate-50 flex flex-col xl:flex-row gap-6 items-stretch xl:items-center justify-between bg-slate-50/30">
          <div className="relative flex-1 group">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors"
              size={20}
            />
            <input
              type="text"
              placeholder="Search by name, batch or supplier..."
              className="w-full bg-white border-2 border-slate-100 rounded-2xl py-3 pl-12 pr-4 focus:border-blue-200 focus:ring-4 focus:ring-blue-50 outline-none transition-all font-medium text-slate-700"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="relative w-full sm:w-64">
              <Filter
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                size={18}
              />
              <select
                className="w-full pl-11 pr-10 py-3 bg-white border-2 border-slate-100 rounded-2xl appearance-none focus:border-blue-200 focus:ring-4 focus:ring-blue-50 outline-none transition-all font-semibold text-slate-600 cursor-pointer"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="text-sm font-bold text-slate-400 bg-slate-100 px-4 py-3 rounded-2xl w-full sm:w-auto text-center">
              {filteredMedicines.length} Items Found
            </div>
          </div>
        </div>

        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-slate-200">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-5 text-[11px] font-black uppercase tracking-[0.15em] text-slate-400">
                  Medicine Details
                </th>
                <th className="px-6 py-5 text-[11px] font-black uppercase tracking-[0.15em] text-slate-400">
                  Category
                </th>
                <th className="px-6 py-5 text-[11px] font-black uppercase tracking-[0.15em] text-slate-400">
                  Inventory State
                </th>
                <th className="px-6 py-5 text-[11px] font-black uppercase tracking-[0.15em] text-slate-400">
                  Pricing
                </th>
                <th className="px-6 py-5 text-[11px] font-black uppercase tracking-[0.15em] text-slate-400">
                  Expiration
                </th>
                <th className="px-8 py-5 text-[11px] font-black uppercase tracking-[0.15em] text-slate-400 text-right">
                  Control
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                      <p className="text-slate-400 font-bold">
                        Synchronizing data...
                      </p>
                    </div>
                  </td>
                </tr>
              ) : filteredMedicines.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-8 py-24 text-center">
                    <div className="max-w-xs mx-auto">
                      <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Search size={32} className="text-slate-300" />
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 mb-1">
                        No results found
                      </h3>
                      <p className="text-slate-500 text-sm">
                        We couldn't find any medicines matching your search
                        criteria.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredMedicines.map((medicine) => (
                  <tr
                    key={medicine._id}
                    className="hover:bg-blue-50/30 transition-all duration-200 group"
                  >
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-white group-hover:shadow-sm transition-all"></div>
                        <div>
                          <div className="font-bold text-slate-900 leading-tight group-hover:text-blue-600 transition-colors">
                            {medicine.name}
                          </div>
                          <div className="text-xs font-black text-slate-400 uppercase tracking-wider mt-1">
                            Batch #{medicine.batchNumber}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="px-3 py-1.5 bg-slate-100 text-slate-600 rounded-xl text-xs font-bold">
                        {medicine.category?.name || "Uncategorized"}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            "px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-2",
                            medicine.stockQuantity <= medicine.reorderLevel
                              ? "bg-rose-50 text-rose-600"
                              : "bg-emerald-50 text-emerald-600",
                          )}
                        >
                          <div
                            className={cn(
                              "w-1.5 h-1.5 rounded-full animate-pulse",
                              medicine.stockQuantity <= medicine.reorderLevel
                                ? "bg-rose-600"
                                : "bg-emerald-600",
                            )}
                          />
                          {medicine.stockQuantity} Units
                        </div>
                        {medicine.stockQuantity <= medicine.reorderLevel && (
                          <AlertCircle size={16} className="text-rose-500" />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-5 text-sm font-black text-slate-900">
                      ${medicine.price.toFixed(2)}
                    </td>
                    <td className="px-6 py-5">
                      <span
                        className={cn(
                          "text-xs font-bold px-3 py-1.5 rounded-xl",
                          new Date(medicine.expiryDate) < new Date()
                            ? "bg-red-600 text-white shadow-lg shadow-red-100"
                            : "bg-slate-100 text-slate-600",
                        )}
                      >
                        {new Date(medicine.expiryDate).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex items-center justify-end gap-2 sm:opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                        {(user?.role === "Admin" ||
                          user?.role === "Inventory Manager") && (
                          <>
                            <Link
                              to={`/medicines/edit/${medicine._id}`}
                              className="w-10 h-10 flex items-center justify-center bg-white text-blue-600 border border-slate-100 shadow-sm rounded-xl hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all"
                            >
                              <Edit size={18} />
                            </Link>
                            {user?.role === "Admin" && (
                              <button
                                onClick={() => handleDelete(medicine._id)}
                                className="w-10 h-10 flex items-center justify-center bg-white text-rose-600 border border-slate-100 shadow-sm rounded-xl hover:bg-rose-600 hover:text-white hover:border-rose-600 transition-all"
                              >
                                <Trash2 size={18} />
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {!loading && filteredMedicines.length > 0 && (
          <div className="p-6 bg-slate-50/50 border-t border-slate-50 flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-widest">
            <span>
              Showing {filteredMedicines.length} of {medicines.length} records
            </span>
            <div className="flex gap-2">
              <button
                className="px-4 py-2 bg-white rounded-xl border border-slate-200 disabled:opacity-50"
                disabled
              >
                Previous
              </button>
              <button
                className="px-4 py-2 bg-white rounded-xl border border-slate-200 disabled:opacity-50"
                disabled
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Medicines;
