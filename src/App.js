import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { UserContext } from "./pages/UserContext";
import Sidebar from "./components/Sidebar";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import CarsPage from "./pages/CarsPage";
import LogisticsClientsPage from "./pages/LogisticsClientsPage";
import NewsPage from "./pages/NewsPage";
import MarketPage from "./pages/MarketPage";
import ReviewsPage from "./pages/ReviewsPage";
import ContestsPage from "./pages/ContestsPage";
import AdminUsersPage from "./pages/AdminUsersPage";
import AddAdminPage from "./pages/AddAdminPage";
import OrdersPage from "./pages/OrdersPage"; // ← НОВЫЙ импорт

import "./App.css";

function App() {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <Router>
        <div className="app-container">
          <Sidebar />
          <div className="main-content">
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/" element={<DashboardPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/cars" element={<CarsPage />} />
              <Route path="/logistics" element={<LogisticsClientsPage />} />
              <Route path="/news" element={<NewsPage />} />
              <Route path="/market" element={<MarketPage />} />
              <Route path="/reviews" element={<ReviewsPage />} />
              <Route path="/contests" element={<ContestsPage />} />
              <Route path="/orders" element={<OrdersPage />} /> {/* ← НОВЫЙ маршрут */}
              <Route path="/admin/users" element={<AdminUsersPage />} />
              <Route path="/admin/add" element={<AddAdminPage />} />
            </Routes>
          </div>
        </div>
      </Router>
    </UserContext.Provider>
  );
}

export default App;
