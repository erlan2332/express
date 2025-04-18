import React, { useEffect, useState, useMemo } from "react";
import { API_BASE } from "../config";
import "./LogisticsClientsPage.css";

function LogisticsClientsPage() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [sortConfig, setSortConfig] = useState({ 
    key: "status", 
    direction: "asc" 
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    setLoading(true);
    try {
      const creds = localStorage.getItem("basicCreds") || "";
      const resp = await fetch(`${API_BASE}/api/orders/filtered`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${creds}`,
        },
        body: JSON.stringify({ page: 0, size: 100 }),
      });

      if (!resp.ok) throw new Error(`Ошибка загрузки: ${resp.status}`);
      
      const result = await resp.json();
      setOrders(result.content);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const statusMap = {
    sklad: "На складе",
    onway: "В пути",
    comed: "Прибыл",
    finished: "Завершён"
  };

  const sortedOrders = useMemo(() => {
    return [...orders].sort((a, b) => {
      const statusA = statusMap[a.status?.code] || "";
      const statusB = statusMap[b.status?.code] || "";
      return sortConfig.direction === "asc" 
        ? statusA.localeCompare(statusB) 
        : statusB.localeCompare(statusA);
    });
  }, [orders, sortConfig]);

  const filteredOrders = sortedOrders.filter(order =>
    Object.values(order).some(value =>
      String(value).toLowerCase().includes(search.toLowerCase())
    )
  );

  const handleSort = () => {
    setSortConfig(prev => ({
      key: "status",
      direction: prev.direction === "asc" ? "desc" : "asc"
    }));
  };

  const updateOrderStatus = async (orderId, statusCode) => {
    try {
      setError("");
      const creds = localStorage.getItem("basicCreds") || "";
      
      const endpoint = statusCode;
      if (!endpoint) throw new Error("Неверный статус");

      const resp = await fetch(
        `${API_BASE}/api/orders/${endpoint}/${orderId}`,
        {
          method: "PUT",
          headers: { Authorization: `Basic ${creds}` },
        }
      );

      console.log("URL:", `${API_BASE}/api/orders/${endpoint}/${orderId}`);
      console.log("Response status:", resp.status);

      if (!resp.ok) throw new Error(`HTTP error! Status: ${resp.status}`);

      await fetchOrders();
    } catch (err) {
      console.error("Ошибка запроса:", err);
      setError(err.message);
    }
  };

  return (
    <div className="logistics-clients-page">
      <h1>Управление заказами</h1>

      <div className="controls">
        <input
          type="text"
          placeholder="Поиск по заказам..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {error && <div className="error-banner">{error}</div>}
      {loading && <div className="loader">Загрузка данных...</div>}

      <div className="orders-table-container">
        <table className="orders-table">
          <thead>
            <tr>
              <th>#</th>
              <th>ID</th>
              <th>Код заказа</th>
              <th>Описание</th>
              <th>VIN</th>
              <th onClick={handleSort} className="sortable-header">
                Статус {sortConfig.direction === "asc" ? "↑" : "↓"}
              </th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order, index) => (
              <tr key={order.id}>
                <td>{index + 1}</td>
                <td>{order.id}</td>
                <td>{order.orderCode}</td>
                <td>{order.description}</td>
                <td>{order.vin}</td>
                <td>{statusMap[order.status?.code] || order.status?.name}</td>
                <td>
                  <div className="status-actions">
                    <button onClick={() => updateOrderStatus(order.id, "sklad")}>На складе</button>
                    <button onClick={() => updateOrderStatus(order.id, "onway")}>В пути</button>
                    <button onClick={() => updateOrderStatus(order.id, "comed")}>Прибыл</button>
                    <button onClick={() => updateOrderStatus(order.id, "finished")}>Завершён</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default LogisticsClientsPage;
