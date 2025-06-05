import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import IconBackButton from "assets/icon/IconBackButton.png";
import IconMenu from "assets/icon/IconMenu.png";
import IconSearch from "assets/icon/IconSearch.png";

const CatechismHeader = ({ searchTerm, setSearchTerm }) => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="catechism-fixed-header">
      <div className="header-container">
        <img
          src={IconBackButton}
          alt="뒤로 가기"
          className="back-button"
          onClick={() => navigate("/home")}
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

      {/* 검색창은 선택적 렌더링 */}
      {typeof setSearchTerm === "function" && (
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
      )}
    </div>
  );
};

export default CatechismHeader;
