import React, { useEffect, useState } from "react";
import { API_BASE } from "../config";
import "./CarsPage.css";

function CarsPage() {
  const [cars, setCars] = useState([]);
  const [selectedCarId, setSelectedCarId] = useState(null);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchCars();
  }, []);

  async function fetchCars() {
    try {
      const creds = localStorage.getItem("basicCreds") || "";
      if (!creds) {
        setError("Нет авторизации!");
        return;
      }
      const resp = await fetch(`${API_BASE}/api/auto/get/list`, {
        headers: { Authorization: `Basic ${creds}` },
      });
      if (!resp.ok) {
        throw new Error(`Ошибка при получении списка машин: ${resp.status}`);
      }
      const data = await resp.json();
      setCars(data);
    } catch (err) {
      setError(err.message);
    }
  }

  function handleSelectCar(id) {
    setSelectedCarId(id === selectedCarId ? null : id);
  }
  const filteredCars = cars.filter((car) =>
    car.vin?.toLowerCase().includes(search.toLowerCase()) ||
    car.brand?.name?.toLowerCase().includes(search.toLowerCase()) ||
    car.model?.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="cars-page">
      <h1>Машины</h1>
      <div className="cars-top-bar">
        <input
          type="text"
          placeholder="Поиск (VIN, бренд, модель)"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {error && <div className="error">{error}</div>}
      <div className="car-tags-container">
        {filteredCars.map((car) => (
          <span
            key={car.id}
            className="car-tag blue-tag"
            onClick={() => handleSelectCar(car.id)}
          >
            {car.model?.name || "NoName"}-{car.id}
          </span>
        ))}
      </div>
      <div className="cars-details-container">
        {filteredCars.map((car) => {
          const isOpen = car.id === selectedCarId;
          return (
            <div
              key={car.id}
              className={`car-details ${isOpen ? "open" : ""}`}
            >
              <div
                className="car-header"
                onClick={() => handleSelectCar(car.id)}
              >
                {car.model?.name} ({car.brand?.name})
                <span>VIN: {car.vin}</span>
                <span className="arrow">{isOpen ? "▲" : "▼"}</span>
              </div>
              {isOpen && (
                <div className="car-steps">
                  <ul>
                    <li>
                      <strong>Год:</strong>{" "}
                      {car.year?.year ?? "Не указан"}
                    </li>
                    <li>
                      <strong>Цвет:</strong>{" "}
                      {car.color?.name ?? "Не указан"}
                    </li>
                    <li>
                      <strong>Тип кузова:</strong>{" "}
                      {car.bodyType?.name ?? "Не указан"}
                    </li>
                    <li>
                      <strong>Текущее местоположение:</strong>{" "}
                      {car.currentLocation || "Не указано"}
                    </li>
                    <li>
                      <strong>Статус:</strong>{" "}
                      {car.status || "Не указан"}
                    </li>
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default CarsPage;
