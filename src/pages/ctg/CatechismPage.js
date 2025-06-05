import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "styles/ctg/catechism.css";
import Background from "context/Background";
import IconBackButton from "assets/icon/IconBackButton.png";
import IconMenu from "assets/icon/IconMenu.png";
import IconSearch from "assets/icon/IconSearch.png";

const CatechismPage = () => {
  const navigate = useNavigate();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    fetch("/api/books")
      .then((res) => (res.ok ? res.json() : Promise.reject("네트워크 오류")))
      .then((data) => {
        const chapters = Array.from(
          new Map(
            data.map((item) => [item.chapterNumber, item.chapterTitle])
          ).entries(),
          ([chapterNumber, chapterTitle]) => ({ chapterNumber, chapterTitle })
        ).sort((a, b) => a.chapterNumber - b.chapterNumber);
        setEntries(chapters);
      })
      .catch((e) => setError(e))
      .finally(() => setLoading(false));
  }, []);

  const filteredEntries = entries.filter((entry) =>
    entry.chapterTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Background type="white">
      <div className="catechism-container">
        {/* Fixed Header + Search + Title */}
        <div className="catechism-fixed-header">
          {/* Header */}
          <div className="header-container">
            <img
              src={IconBackButton}
              alt="뒤로 가기"
              className="back-button"
              onClick={() => navigate("/BibleStudy")}
            />
            <h1 className="title">Christian to God</h1>
            <div className="menu-container">
              <img
                src={IconMenu}
                alt="메뉴 아이콘"
                className="IconMenu"
                onClick={() => setMenuOpen(!menuOpen)}
              />
              {menuOpen && (
                <div className="dropdown-menu">
                  <button onClick={() => navigate("/Menu")}>🏠 홈으로</button>
                  <button onClick={() => navigate("/confession")}>🔍 검색</button>
                </div>
              )}
            </div>
          </div>

          {/* Search Bar */}
          <div className="search-container">
            <input
              className="search-input"
              type="text"
              placeholder="검색어를 입력하세요"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <img
              src={IconSearch}
              alt="검색 버튼"
              className="search-button"
              onClick={() => {}}
            />
          </div>
          </div>
          {/* Centered Title */}
          <p className="section-title">표준 신앙 고백서</p>
        

        {/* Scrollable Content */}
        <main className="catechism-list">
          {loading && <p>Loading chapters…</p>}
          {error && <p className="text-red-500">Error: {error}</p>}

          {filteredEntries.map((ch) => (
            <li
              key={ch.chapterNumber}
              className="catechism-item"
              onClick={() => navigate(`/confession/${ch.chapterNumber}`)}
            >
              <span className="emoji">📌</span>
              <span className="chapter-title">
                <span className="chapter-number"> {ch.chapterNumber}장</span>. {ch.chapterTitle}
              </span>
            </li>
          ))}
        </main>
      </div>
    </Background>
  );
};

export default CatechismPage;
