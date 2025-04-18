import React, { useState } from "react";
import { API_BASE } from "../config";
import { useNavigate } from "react-router-dom";
import "./AddAdminPage.css"; // можешь переименовать, если хочешь

export default function ConfirmAdminPage() {
  const [userId, setUserId] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleConfirm = async () => {
    setError("");
    setSuccess("");

    if (!userId || isNaN(userId)) {
      setError("Введите корректный ID пользователя");
      return;
    }

    try {
      const creds = localStorage.getItem("basicCreds") || "";
      const resp = await fetch(`${API_BASE}/api/v1/auth/confirm/${userId}`, {
        method: "POST",
        headers: {
          Authorization: `Basic ${creds}`,
        },
      });

      if (!resp.ok) {
        const txt = await resp.text();
        throw new Error(`Ошибка: ${resp.status} – ${txt}`);
      }

      setSuccess(`Пользователь с ID ${userId} успешно подтверждён.`);
      setUserId("");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="add-admin-page">
      <h1>Подтвердить пользователя по ID</h1>

      <div className="input-group">
        <input
          type="number"
          placeholder="Введите ID пользователя"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />
        <button className="primary-btn" onClick={handleConfirm}>
          Подтвердить
        </button>
      </div>

      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}

      <button
        className="outline-btn"
        style={{ marginTop: 20 }}
        onClick={() => navigate(-1)}
      >
        Назад
      </button>
    </div>
  );
}
