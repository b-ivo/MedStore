# MedStore - Pharmacy Inventory Management System

MedStore is a professional, full-stack pharmacy management solution built with the MERN stack (MongoDB, Express.js, React.js, Node.js). It streamlines pharmacy operations including medicine inventory, supplier management, purchase tracking, sales processing, and business reporting.

## Key Features

- **Inventory Tracking**: Monitor stock levels, batch numbers, and expiry dates.
- **Role-Based Access**: Secure access for Admin, Pharmacist, and Inventory Manager.
- **Sales Management**: Process transactions with automatic stock updates and receipt generation.
- **Purchase Orders**: Manage restocking from suppliers and increase inventory automatically.
- **Dashboard Analytics**: Real-time business insights with interactive charts.
- **Responsive UI**: Modern, premium design built with Tailwind CSS.

## FURPS Quality Model Compliance

This system is built following the **FURPS** model to ensure high software quality:
- **Functionality**: Complete pharmacy modules, role-based security, and data validation.
- **Usability**: Intuitive navigation, professional aesthetics, and consistent feedback (loaders, 404).
- **Reliability**: Server-side stock validation, robust error handling, and input sanitization.
- **Performance**: Optimized database queries with `.lean()`, fast Vite-powered frontend.
- **Supportability**: Modular architecture, comprehensive documentation, and easy installation.

## Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS, Recharts, Lucide Icons, React Hot Toast.
- **Backend**: Node.js, Express.js, MongoDB (Mongoose), JWT, BcryptJS.

## Getting Started

### Prerequisites

- Node.js installed.
- MongoDB running locally or a MongoDB Atlas URI.

### Installation

1. **Clone the project**
   ```bash
   git clone <repository-url>
   cd medstore
   ```

2. **Setup Backend**
   ```bash
   cd server
   npm install
   ```
   Create a `.env` file in the `server` directory:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/medstore
   JWT_SECRET=your_jwt_secret
   NODE_ENV=development
   ```

3. **Setup Frontend**
   ```bash
   cd ../client
   npm install
   ```

### Running the Application

1. **Start the Backend Server**
   ```bash
   cd server
   npm run dev
   ```

2. **Start the Frontend Application**
   ```bash
   cd client
   npm run dev
   ```

3. **Access the App**
   Open [http://localhost:5173](http://localhost:5173) in your browser.

## User Roles

- **Admin**: Full system control, employee management, and financial reports.
- **Inventory Manager**: Medicine registration, stock updates, and supplier management.
- **Pharmacist**: Sales processing and inventory lookup.

---
Built with ❤️ for professional pharmacy management.
