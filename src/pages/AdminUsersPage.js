// src/pages/AdminUsersPage.jsx

import React, { useEffect, useState } from "react";
import { API_BASE } from "../config";

function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    try {
      const adminCreds = localStorage.getItem("basicCreds") || "";
      const resp = await fetch(`${API_BASE}/api/v1/users/all`, {
        headers: {
          Authorization: `Basic ${adminCreds}`,
        },
      });
      if (!resp.ok) {
        throw new Error(`Ошибка загрузки пользователей: ${resp.status}`);
      }
      const data = await resp.json();
      setUsers(data);
    } catch (err) {
      setError(err.message);
    }
  }

  async function confirmUser(userId) {
    try {
      const adminCreds = localStorage.getItem("basicCreds") || "";
      const resp = await fetch(`${API_BASE}/api/v1/auth/confirm/${userId}`, {
        method: "POST",
        headers: {
          Authorization: `Basic ${adminCreds}`,
        },
      });
      if (!resp.ok) {
        throw new Error(`Ошибка активации: ${resp.status}`);
      }
      alert(`Пользователь (id=${userId}) теперь accepted=true`);
      fetchUsers();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div>
      <h1>Админка: пользователи</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <table border="1" cellPadding="6" style={{ marginTop: 20 }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Login</th>
            <th>Accepted?</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.login}</td>
              <td>{u.accepted ? "Да" : "Нет"}</td>
              <td>
                {!u.accepted && (
                  <button onClick={() => confirmUser(u.id)}>Активировать</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminUsersPage;
