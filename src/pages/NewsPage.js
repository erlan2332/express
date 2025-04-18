
import React, { useEffect, useState } from "react";
import { API_BASE } from "../config";
import "./NewsAdminPage.css";

function NewsAdminPage() {
  const [items, setItems] = useState([]);    
  const [error, setError] = useState("");
  const [showNewsForm, setShowNewsForm] = useState(false);
  const [showStoryForm, setShowStoryForm] = useState(false);

  useEffect(() => {
    fetchAllData();
  }, []);

  async function fetchAllData() {
    try {
      setError("");
      const creds = localStorage.getItem("basicCreds") || "";
      if (!creds) throw new Error("Нет авторизации! Залогиньтесь.");
      const respNews = await fetch(`${API_BASE}/api/news?page=0&size=100`, {
        headers: { Authorization: `Basic ${creds}` },
      });
      if (!respNews.ok) {
        throw new Error(`Ошибка загрузки новостей: ${respNews.status}`);
      }
      const newsPageData = await respNews.json();
      const newsArray = (newsPageData?.content || []).map((n) => ({
        id: n.id,
        date: n.createdAt,           
        title: n.title,
        subtitle: n.subtitle,
        type: "news",                
        description: n.description,
        coverImagePath: n.coverImagePath,
      }));

      const respStories = await fetch(`${API_BASE}/api/stories`, {
        headers: { Authorization: `Basic ${creds}` },
      });
      if (!respStories.ok) {
        throw new Error(`Ошибка загрузки сториз: ${respStories.status}`);
      }
      const storiesData = await respStories.json();
      const storyArray = (storiesData || []).map((s) => ({
        id: s.id,
        date: s.createdAt,           
        title: s.filePath,           
        type: "story",               
        format: s.format,
        size: s.size,
        duration: s.duration,
      }));

      const all = [...newsArray, ...storyArray];
      all.sort((a, b) => {
        return new Date(b.date) - new Date(a.date);
      });

      setItems(all);
    } catch (err) {
      setError(err.message);
    }
  }

  function handleDelete(item) {
    if (!window.confirm(`Удалить «${item.title}»?`)) return;
    if (item.type === "news") {
      deleteNews(item.id);
    } else {
      deleteStory(item.id);
    }
  }

  async function deleteNews(id) {
    try {
      const creds = localStorage.getItem("basicCreds") || "";
      const resp = await fetch(`${API_BASE}/api/news/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Basic ${creds}` },
      });
      if (!resp.ok) {
        throw new Error(`Ошибка удаления новости: ${resp.status}`);
      }
      fetchAllData();
    } catch (err) {
      setError(err.message);
    }
  }

  async function deleteStory(id) {
    try {
      const creds = localStorage.getItem("basicCreds") || "";
      const resp = await fetch(`${API_BASE}/api/stories/deleted/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Basic ${creds}` },
      });
      if (!resp.ok) {
        throw new Error(`Ошибка удаления сториз: ${resp.status}`);
      }
      fetchAllData();
    } catch (err) {
      setError(err.message);
    }
  }
  function formatDate(isoString) {
    if (!isoString) return "";
    const dateObj = new Date(isoString);
    const dd = String(dateObj.getDate()).padStart(2, "0");
    const mm = String(dateObj.getMonth() + 1).padStart(2, "0");
    const yyyy = dateObj.getFullYear();
    return `${dd}.${mm}.${yyyy}`;
  }

  return (
    <div className="news-admin-page">
      <h1>Новости</h1>
      <div className="top-buttons">
        <button className="primary-btn" onClick={() => setShowNewsForm(true)}>
          Добавить новость
        </button>
        <button className="primary-btn" onClick={() => setShowStoryForm(true)}>
          Добавить Сториз
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <table className="news-table">
        <thead>
          <tr>
            <th>№</th>
            <th>Дата новости</th>
            <th>Наименование</th>
            <th>Статус <span>⇅</span></th>
            <th>Тип <span>⇅</span></th>
            <th>Setting</th>
            <th>Кол-во просмотров <span>⇅</span></th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, idx) => {
            const statusLabel = "Опубликован";  
            const statusClass = "green-badge";  
            const typeLabel = item.type === "news" ? "Новость" : "Сториз";
            const typeClass = "green-badge";

            return (
              <tr key={item.id}>
                <td>{idx + 1}</td>
                <td>{formatDate(item.date)}</td>
                <td>{item.title}</td>
                <td>
                  <span className={statusClass}>{statusLabel}</span>
                </td>
                <td>
                  <span className={typeClass}>{typeLabel}</span>
                </td>
                <td>
                  <button className="gray-btn" onClick={() => handleDelete(item)}>
                    Удалить
                  </button>
                </td>
                <td>12</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {showNewsForm && (
        <CreateNewsModal
          onClose={() => {
            setShowNewsForm(false);
            fetchAllData();
          }}
        />
      )}

      {showStoryForm && (
        <CreateStoryModal
          onClose={() => {
            setShowStoryForm(false);
            fetchAllData();
          }}
        />
      )}
    </div>
  );
}

export default NewsAdminPage;



function CreateNewsModal({ onClose }) {
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [description, setDescription] = useState("");
  const [coverImage, setCoverImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [error, setError] = useState("");

  function handleFileChange(e) {
    const file = e.target.files?.[0] || null;
    setCoverImage(file);
    setPreviewUrl(file ? URL.createObjectURL(file) : null);
  }

  async function handleSave() {
    try {
      const creds = localStorage.getItem("basicCreds") || "";
      if (!creds) throw new Error("Нет авторизации!");

      const formData = new FormData();
      formData.append("title", title);
      formData.append("subtitle", subtitle);
      formData.append("description", description);
      if (coverImage) {
        formData.append("coverImage", coverImage);
      }

      const resp = await fetch(`${API_BASE}/api/news`, {
        method: "POST",
        headers: {
          Authorization: `Basic ${creds}`,
        },
        body: formData,
      });
      if (!resp.ok) {
        const txt = await resp.text();
        throw new Error(`Ошибка создания новости: ${resp.status}\n${txt}`);
      }

      alert("Новость добавлена!");
      if (previewUrl) URL.revokeObjectURL(previewUrl);

      onClose();
    } catch (err) {
      setError(err.message);
    }
  }


  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Добавление новости</h2>
        {error && <div className="error-message">{error}</div>}

        <label>Заголовок</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <label>Подзаголовок</label>
        <input
          type="text"
          value={subtitle}
          onChange={(e) => setSubtitle(e.target.value)}
        />

        <label>Тип новости (по желанию)</label>
        <input
          type="text"
          placeholder="Напр. «Новинка» или «Акция»"
          onChange={() => {}}
        />

        <label>Описание новости</label>
        <textarea
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <label>Галерея (обложка)</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
        />

        {previewUrl && (
          <div className="file-preview">
            <img src={previewUrl} alt="Preview" />
          </div>
        )}

        <div className="modal-actions">
          <button className="primary-btn" onClick={handleSave}>
            Сохранить
          </button>
          <button className="outline-btn" onClick={onClose}>
            Отмена
          </button>
        </div>
      </div>
    </div>
  );
}



function CreateStoryModal({ onClose }) {
  const [title, setTitle] = useState(""); 
  const [storyFile, setStoryFile] = useState(null);
  const [error, setError] = useState("");

  async function handleSave() {
    try {
      const creds = localStorage.getItem("basicCreds") || "";
      if (!creds) throw new Error("Нет авторизации!");
      if (!storyFile) throw new Error("Не выбран файл для сториз!");

      const formData = new FormData();
      formData.append("file", storyFile);

      const resp = await fetch(`${API_BASE}/api/stories/upload`, {
        method: "POST",
        headers: {
          Authorization: `Basic ${creds}`,
        },
        body: formData,
      });
      if (!resp.ok) {
        const txt = await resp.text();
        throw new Error(`Ошибка создания сториз: ${resp.status}\n${txt}`);
      }
      alert("Сториз добавлена!");
      onClose();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Добавление Сториза</h2>
        {error && <div className="error-message">{error}</div>}

        <label>Название (для себя)</label>
        <input
          type="text"
          placeholder="Например, «Новая реклама»"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <label>Файл сториз (видео/картинка)</label>
        <input
          type="file"
          onChange={(e) => setStoryFile(e.target.files?.[0] ?? null)}
        />

        <div className="modal-actions">
          <button className="primary-btn" onClick={handleSave}>
            Сохранить
          </button>
          <button className="outline-btn" onClick={onClose}>
            Отмена
          </button>
        </div>
      </div>
    </div>
  );
}
