import React, { useContext, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { UserContext } from "../pages/UserContext";
import logo from "../img/Frame 20.png";
import "./Sidebar.css";

function Sidebar() {
  const { user, setUser } = useContext(UserContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("basicCreds");
    localStorage.removeItem("user");
    setUser(null);
    setIsMenuOpen(false);
    navigate("/login");
  }

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <img className="sidebar-logo-img" src={logo} alt="Logo" />
      </div>

      <nav className="sidebar-menu">
        {/* --- основные пункты --- */}
        <NavLink
          to="/dashboard"
          className={({ isActive }) => "menu-item" + (isActive ? " active" : "")}
        >
          <span className="icon icon-dashboard" />
          <span>Dashboard</span>
        </NavLink>

        <NavLink
          to="/logistics"
          className={({ isActive }) => "menu-item" + (isActive ? " active" : "")}
        >
          <span className="icon icon-logistics" />
          <span>Логистика + Клиенты</span>
        </NavLink>

        <NavLink
          to="/cars"
          className={({ isActive }) => "menu-item" + (isActive ? " active" : "")}
        >
          <span className="icon icon-cars" />
          <span>Машины</span>
        </NavLink>

        <NavLink
          to="/news"
          className={({ isActive }) => "menu-item" + (isActive ? " active" : "")}
        >
          <span className="icon icon-news" />
          <span>Новости</span>
        </NavLink>

        <NavLink
          to="/orders"
          className={({ isActive }) => "menu-item" + (isActive ? " active" : "")}
        >
          <span className="icon icon-orders" />
          <span>Заказы</span>
        </NavLink>

        {/* --- админ‑раздел --- */}
        {user?.role?.name === "ADMIN" && (
          <>
            <div className="menu-divider" />

            <NavLink
              to="/admin/add"
              className={({ isActive }) =>
                "menu-item" + (isActive ? " active" : "")
              }
            >
              <span className="icon icon-add-admin" />
              <span>Добавить админа</span>
            </NavLink>
          </>
        )}
      </nav>

      {/* --- профиль / выход --- */}
      <div className="sidebar-user">
        {user ? (
          <div className="user-dropdown-wrapper">
            <button className="user-btn" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {user.name || user.login}
              <span className="arrow-down">▼</span>
            </button>

            {isMenuOpen && (
              <div className="user-dropdown">
                <button className="user-dropdown-item" onClick={handleLogout}>
                  Выйти
                </button>
              </div>
            )}
          </div>
        ) : (
          <ul className="auth-links">
            <li>
              <NavLink to="/login" className="menu-item">
                Войти
              </NavLink>
            </li>
            <li>
              <NavLink to="/register" className="menu-item">
                Регистрация
              </NavLink>
            </li>
          </ul>
        )}
      </div>
    </div>
  );
}

export default Sidebar;
