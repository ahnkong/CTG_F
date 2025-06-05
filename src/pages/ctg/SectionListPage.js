// src/pages/ctg/SectionListPage.js
import CatechismHeader from "components/CatechismHeader";
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Background from "context/Background";
import IconBackButton from "assets/icon/IconBackButton.png";
import "styles/ctg/section-list.css";

const SectionListPage = () => {
  const { chapter } = useParams();
  const navigate = useNavigate();
  const [sections, setSections] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

  useEffect(() => {
    fetch(`/api/books/chapter/${chapter}`)
      .then(res => res.ok ? res.json() : Promise.reject("네트워크 오류"))
      .then(data => setSections(data))
      .catch(err => setError(err))
      .finally(() => setLoading(false));
  }, [chapter]);

  if (loading) {
    return (
      <Background type="white">
        <p className="loading-text">Loading sections…</p>
      </Background>
    );
  }
  if (error) {
    return (
      <Background type="white">
        <p className="error-text">Error: {error}</p>
      </Background>
    );
  }

  return (
    <Background type="white">
      <CatechismHeader/>
      <div className="section-list-container">
        
        <h2 className="chapter-header">{chapter}장</h2>

        <ul className="section-list">
          {sections.map(sec => (
            <li
              key={`${chapter}-${sec.sectionNumber}`}      // <-- 중복 방지를 위해 복합 키 사용
              className="section-item"
              onClick={() => navigate(`/confession/${chapter}/${sec.sectionNumber}`)}
            >
              <span className="section-emoji">📖</span>
              <span className="section-label">{sec.sectionNumber}문</span>
              <span className="section-preview">
                {(sec.question ?? sec.content ?? "").slice(0, 20)}…
              </span>
            </li>
          ))}
        </ul>
      </div>
    </Background>
  );
};

export default SectionListPage;
