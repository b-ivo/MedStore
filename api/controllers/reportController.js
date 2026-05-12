const Sale = require('../models/Sale');
const Purchase = require('../models/Purchase');
const Medicine = require('../models/Medicine');

const getDashboardStats = async (req, res) => {
  try {
    const medicines = await Medicine.find({});
    const sales = await Sale.find({});
    const purchases = await Purchase.find({});

    // Total metrics
    const totalSales = sales.reduce((acc, sale) => acc + sale.totalAmount, 0);
    const totalPurchases = purchases.reduce((acc, p) => acc + p.totalAmount, 0);

    // Today's sales
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todaySales = sales
      .filter(s => new Date(s.saleDate) >= today)
      .reduce((acc, s) => acc + s.totalAmount, 0);

    // Weekly sales for charts
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const weeklySales = days.map(day => {
      const daySales = sales.filter(s => {
        const d = new Date(s.saleDate);
        return days[d.getDay()] === day;
      });
      return {
        name: day,
        sales: daySales.length,
        revenue: daySales.reduce((acc, s) => acc + s.totalAmount, 0)
      };
    });

    // Detailed alerts for dashboard
    const lowStockMeds = medicines
      .filter(m => m.stockQuantity <= (m.reorderLevel || 10))
      .map(m => ({ _id: m._id, name: m.name, stockQuantity: m.stockQuantity, reorderLevel: m.reorderLevel }))
      .slice(0, 5);

    const ninetyDays = new Date();
    ninetyDays.setDate(ninetyDays.getDate() + 90);
    const expiringMeds = medicines
      .filter(m => new Date(m.expiryDate) <= ninetyDays)
      .sort((a, b) => new Date(a.expiryDate) - new Date(b.expiryDate))
      .map(m => ({ _id: m._id, name: m.name, expiryDate: m.expiryDate }))
      .slice(0, 5);

    res.json({
      medicinesCount: medicines.length,
      totalSales,
      totalPurchases,
      dailySales: todaySales.toFixed(2),
      lowStockCount: medicines.filter(m => m.stockQuantity <= (m.reorderLevel || 10)).length,
      expiringCount: medicines.filter(m => new Date(m.expiryDate) <= ninetyDays).length,
      weeklySales,
      criticalAlerts: {
        lowStock: lowStockMeds,
        expiring: expiringMeds
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getSalesReport = async (req, res) => {
  try {
    const sales = await Sale.find({}).populate('items.medicine').populate('processedBy', 'fullName');
    res.json(sales);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getDashboardStats, getSalesReport };
