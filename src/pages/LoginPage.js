import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE } from "../config";
import { UserContext } from "../pages/UserContext";
import "./loginPage.css";


function LoginPage() {
  const { setUser } = useContext(UserContext);

  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const url = `${API_BASE}/api/v1/auth/login`;
      console.log("LOGIN: sending POST to", url);

      const resp = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ login, password }),
      });

      console.log("LOGIN: response status =", resp.status);

      if (!resp.ok) {
        const errText = await resp.text();
        console.error("LOGIN: error text:", errText);
        setError(`Ошибка входа: ${resp.status} - ${errText}`);
        return;
      }

      const userJson = await resp.json();
      console.log("LOGIN: server says:", userJson);

      if (userJson.accepted === false) {
        setError("Ваш аккаунт ещё не подтверждён. Обратитесь к администратору.");
        return;
      }
      const base64Creds = btoa(`${login}:${password}`);
      localStorage.setItem("basicCreds", base64Creds);
      localStorage.setItem("user", JSON.stringify(userJson));
      setUser(userJson);

      navigate("/dashboard");
    } catch (err) {
      console.error("LOGIN: network error:", err);
      setError("Ошибка сети: " + err.message);
    }
  };

  return (
    <div className="login-page">
      <h1>Страница входа</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Логин:</label>
          <input
            type="text"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            required
          />
        </div>

        <div style={{ marginTop: 12 }}>
          <label>Пароль:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {error && <p style={{ color: "red", marginTop: 12 }}>{error}</p>}

        <button type="submit" style={{ marginTop: 16 }}>
          Войти
        </button>
      </form>
    </div>
  );
}

export default LoginPage;
