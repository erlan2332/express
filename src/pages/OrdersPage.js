import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ordersPage.css";

function OrdersPage() {
  const [autoId, setAutoId] = useState("");
  const [autos, setAutos] = useState([]);
  const [orderCode, setOrderCode] = useState("");
  const [orderId, setOrderId] = useState("");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const API = "http://5.59.233.108:8081";

  useEffect(() => {
    fetchAutos();
  }, []);

  const fetchAutos = async () => {
    try {
      const creds = localStorage.getItem("basicCreds") || "";
      const response = await axios.get(`${API}/api/auto/get/list`, {
        headers: {
          Authorization: `Basic ${creds}`,
        },
      });
      setAutos(response.data);
    } catch (err) {
      console.error("Ошибка загрузки списка автомобилей:", err);
      setError("Не удалось загрузить список машин");
    }
  };

  const handleCreateOrder = async () => {
    const token = localStorage.getItem("basicCreds");
    if (!token) return setError("Не авторизован");

    if (!autoId || isNaN(autoId)) return setError("Выберите автомобиль");

    try {
      setLoading(true);
      setError("");

      const res = await axios.post(
        `${API}/api/orders`,
        {
          autoIds: [parseInt(autoId)],
          description: "Новый заказ",
          vin: "1HGCM82633A123456",
        },
        {
          headers: {
            Authorization: `Basic ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const [code, id] = res.data;
      setOrderCode(code);
      setOrderId(id);

      console.log("✅ Заказ успешно создан:");
      console.log("🔢 Код:", code);
      console.log("🆔 ID:", id);
    } catch (err) {
      console.error("❌ Ошибка создания заказа:", err.response?.data || err.message);
      setError("Ошибка при создании заказа");
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (status) => {
    const token = localStorage.getItem("basicCreds");
    if (!token || !orderId) return setError("Нет ID заказа или токена");

    try {
      const response = await axios.put(
        `${API}/api/orders/${status}/${orderId}`,
        {},
        {
          headers: {
            Authorization: `Basic ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log(`✅ Статус успешно обновлён на "${status}"`);
      console.log("📦 Ответ сервера:", response.status, response.statusText);
    } catch (err) {
      console.error("❌ Ошибка при смене статуса:", err.response?.data || err.message);
      setError("Ошибка при смене статуса");
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(orderCode)
      .then(() => setCopied(true))
      .catch(() => setError("Ошибка копирования"))
      .finally(() => setTimeout(() => setCopied(false), 1500));
  };

  return (
    <div className="orders-container">
      <h2>Создать заказ</h2>

      <div className="input-group">
        <select value={autoId} onChange={(e) => setAutoId(e.target.value)}>
          <option value="">-- Выберите авто --</option>
          {autos.map((auto) => (
            <option key={auto.id} value={auto.id}>
              {auto.id} - {auto.brand?.name} {auto.model?.name} {auto.year?.year} {auto.color?.name}
            </option>
          ))}
        </select>
        <button onClick={handleCreateOrder} disabled={loading}>
          {loading ? "Создание..." : "Создать заказ"}
        </button>
      </div>

      {error && <div className="error-box">{error}</div>}

      {orderCode && (
        <div className="order-info">
          <h3>Код заказа:</h3>
          <div className="code-copy">
            <span>{orderCode}</span>
            <button onClick={copyToClipboard}>
              {copied ? "✓ Скопировано" : "📋 Копировать"}
            </button>
          </div>

          <div className="info-line">
            <strong>ID заказа:</strong> {orderId}
          </div>

          <h4>Изменить статус:</h4>
          <div className="status-buttons">
            <button onClick={() => updateOrderStatus("sklad")}>На складе</button>
            <button onClick={() => updateOrderStatus("onway")}>В пути</button>
            <button onClick={() => updateOrderStatus("comed")}>Прибыл</button>
            <button onClick={() => updateOrderStatus("finished")}>Завершён</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default OrdersPage;
