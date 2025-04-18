import React, { useEffect, useState } from "react";
import { API_BASE } from "../config";
import "./DashboardPage.css";

function DashboardPage() {
  const [cars, setCars] = useState([]);
  const [orders, setOrders] = useState([]);
  const [news, setNews] = useState([]);
  const [error, setError] = useState("");

  const carsInTransit = cars.filter((car) => car.status === "IN_TRANSIT").length;
  const draftOrdersCount = orders.filter(
    (o) => o.status?.name === "ContractDraft"
  ).length;

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const creds = localStorage.getItem("basicCreds");
      if (!creds) {
        setError("Нет сохранённых Basic Auth кредов. Сначала войдите в систему!");
        return;
      }

      const carsResp = await fetch(`${API_BASE}/api/auto/get/list`, {
        headers: { Authorization: `Basic ${creds}` },
      });
      if (!carsResp.ok) {
        throw new Error(`Ошибка /auto/get/list: ${carsResp.status}`);
      }
      const carsData = await carsResp.json();
      setCars(carsData);

      const ordersResp = await fetch(`${API_BASE}/api/orders/my`, {
        headers: { Authorization: `Basic ${creds}` },
      });
      if (!ordersResp.ok) {
        throw new Error(`Ошибка /orders/my: ${ordersResp.status}`);
      }
      const ordersData = await ordersResp.json();
      setOrders(ordersData);

      const newsResp = await fetch(`${API_BASE}/api/news?page=0&size=20`, {
        headers: { Authorization: `Basic ${creds}` },
      });
      if (!newsResp.ok) {
        throw new Error(`Ошибка /news: ${newsResp.status}`);
      }
      const newsJson = await newsResp.json();
      setNews(newsJson.content || []);
    } catch (err) {
      console.error("fetchData error:", err);
      setError(err.message);
    }
  }

  return (
    <div className="dashboard-page">
      <h1 className="dashboard-title">Dashboard</h1>
      {error && <p className="dashboard-error">{error}</p>}

      <h2 className="section-title">Логистика машин</h2>
      <div className="cards-grid five-columns">
        <div className="card">
          <div className="card-number">{carsInTransit}</div>
          <div className="card-label">Машин в пути</div>
        </div>
        <div className="card">
          <div className="card-number">{draftOrdersCount}</div>
          <div className="card-label">Составление договора</div>
        </div>
        <div className="card">
          <div className="card-number">52</div>
          <div className="card-label">Договор с китайской стороной</div>
        </div>
        <div className="card">
          <div className="card-number">22</div>
          <div className="card-label">Оплата в Китай (SWIFT)</div>
        </div>
        <div className="card">
          <div className="card-number">19</div>
          <div className="card-label">Составление контракта с китайцами</div>
        </div>
      </div>
      <div className="cards-grid five-columns">
        <div className="card">
          <div className="card-number">0</div>
          <div className="card-label">Подтверждение оплаты</div>
        </div>
        <div className="card">
          <div className="card-number">23</div>
          <div className="card-label">Подготовка автомобиля</div>
        </div>
        <div className="card">
          <div className="card-number">8</div>
          <div className="card-label">Подготовка экспортных документов</div>
        </div>
        <div className="card">
          <div className="card-number">11</div>
          <div className="card-label">Погрузка на трал</div>
        </div>
        <div className="card">
          <div className="card-number">52</div>
          <div className="card-label">Отправка из Китая в Казахстан</div>
        </div>
      </div>
      <div className="cards-grid five-columns">
        <div className="card">
          <div className="card-number">12</div>
          <div className="card-label">Принятие в СВХ в Казахстане</div>
        </div>
        <div className="card">
          <div className="card-number">55</div>
          <div className="card-label">Подготовка транзитных документов</div>
        </div>
        <div className="card">
          <div className="card-number">1</div>
          <div className="card-label">Выезд из СВХ</div>
        </div>
        <div className="card">
          <div className="card-number">9</div>
          <div className="card-label">Доставка до клиента</div>
        </div>
        <div className="card">
          <div className="card-number">9</div>
          <div className="card-label">Принятие автомобиля клиентом</div>
        </div>
      </div>

      <h2 className="section-title">Логистика машин (Доп. статистика)</h2>
      <div className="cards-grid three-columns">
        <div className="card">
          <div className="card-number">12</div>
          <div className="card-label">Активных пользователей</div>
        </div>
        <div className="card">
          <div className="card-number">265</div>
          <div className="card-label">Ждут одобрения</div>
        </div>
        <div className="card">
          <div className="card-number">12</div>
          <div className="card-label">Клиентов с VIN</div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
