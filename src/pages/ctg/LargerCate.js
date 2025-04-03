
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Background from "context/Background";
import Page from "components/styles/Page";

import IconBackButton from "assets/icon/IconBackButton.png"
import "styles/ctg/largerCate.css";
import IconMenu from "assets/icon/IconMenu.png"
import IconSearch from "assets/icon/IconSearch.png"

const LargerCate = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false); // ✅ 메뉴 상태 추가
  const [largeCatechism, setLargeCatechism] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetch("/data/largeCatechism.json")
      .then((response) => response.json())
      .then((data) => {
        console.log("✅ JSON 로드 성공:", data); // 데이터 출력
        setLargeCatechism(data.largeCatechism);
      })
      .catch((error) => console.error("🚨 JSON 로드 오류:", error));
  }, []);
  

  // 🔍 검색어 입력 시 필터링
  const filteredQuestions = largeCatechism.filter((q) =>
    q.question.includes(searchTerm) || (q.answer && q.answer.includes(searchTerm))
  );

  return (
    <Background type="white">
        <div className="large-section-container">
          <header className="large-section-header">
            <div className="header-container">
              <img
                src={IconBackButton} alt="뒤로 가기" className="back-button"
                onClick={() => navigate("/large-catechism")}
              />
              <h1 className="title">Christian to God</h1>
              <div className="menu-container">
                <img
                  src={IconMenu} alt="메뉴 아이콘" className="IconMenu"
                  onClick={() => setMenuOpen(!menuOpen)}
                />
                {menuOpen && (
                  <div className="dropdown-menu">
                    <button onClick={() => navigate("/")}>🏠 홈으로</button>
                    <button onClick={() => navigate("/large-catechism")}>🔍 검색</button>
                  </div>
                )}
              </div>
            </div>

            {/* ✅ 두 번째 줄: 검색창 */}
            <div className="search-container">
              <input
                className="search-input"
                type="text"
                placeholder="검색어를 입력하세요"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <img
                src={IconSearch} alt="뒤로 가기" className="search-button"
                onClick={() => navigate("/large-catechism")}
              />
            </div>
          </header>
        </div>

        {/* ✅ 문답 목록 */}
        <main className="large-container">
          <p className="large-title">웨스트민스터 소요리문답</p>
          <ul className="large-list">
            {filteredQuestions.map((q) => (
              <p key={q.id} className="large-item" onClick={() => navigate(`/large-catechism/${q.id}`)}>
                <span className="pin">📌 </span>
                <span className="question" style={{ whiteSpace: "normal", wordBreak: "break-word" }}>
                  {q.id}문 {q.question}
                </span>
                <div className="item-divider" />
              </p>
            ))}
          </ul>
        </main>
    </Background>
  );
};

export default LargerCate;
