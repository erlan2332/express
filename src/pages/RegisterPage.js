import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE } from "../config";
import "./registerPage.css";

function RegisterPage() {
  const [form, setForm] = useState({
    login: "",
    password: "",
    phoneNumber: "",
    name: "",
    surname: "",
    patronymic: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const url = `${API_BASE}/api/v1/auth/register`;
      console.log("REGISTER: sending POST to", url);
      const resp = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      console.log("REGISTER: status:", resp.status);
      if (!resp.ok) {
        const text = await resp.text();
        throw new Error(`Ошибка регистрации: ${resp.status} - ${text}`);
      }

      const contentType = resp.headers.get("Content-Type");
      let userId;

      if (contentType && contentType.includes("application/json")) {
        const result = await resp.json();
        userId = result?.id || result?.userId || JSON.stringify(result);
      } else {
        const text = await resp.text();
        userId = text;
      }

      console.log("✅ Пользователь успешно зарегистрирован. ID:", userId);

      alert("Регистрация успешна! Ваш ID: " + userId + ". Дождитесь подтверждения администратора.");
      navigate("/login");
    } catch (err) {
      console.error("REGISTER: caught error:", err);
      setError(err.message);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="register-page">
      <h1>Регистрация</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Логин:</label>
          <input
            name="login"
            value={form.login}
            onChange={handleChange}
            required
          />
        </div>
        <div style={{ marginTop: 12 }}>
          <label>Пароль:</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>
        <div style={{ marginTop: 12 }}>
          <label>Телефон:</label>
          <input
            name="phoneNumber"
            value={form.phoneNumber}
            onChange={handleChange}
          />
        </div>
        <div style={{ marginTop: 12 }}>
          <label>Имя:</label>
          <input name="name" value={form.name} onChange={handleChange} />
        </div>
        <div style={{ marginTop: 12 }}>
          <label>Фамилия:</label>
          <input name="surname" value={form.surname} onChange={handleChange} />
        </div>
        <div style={{ marginTop: 12 }}>
          <label>Отчество:</label>
          <input
            name="patronymic"
            value={form.patronymic}
            onChange={handleChange}
          />
        </div>

        {error && <p style={{ color: "red", marginTop: 12 }}>{error}</p>}

        <button type="submit" style={{ marginTop: 16 }}>
          Зарегистрироваться
        </button>
      </form>
    </div>
  );
}

export default RegisterPage;
