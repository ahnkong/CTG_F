import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import "styles/ctg/detailPage.css";
// import BackButton from "components/BackButton";
import IconMenu from "assets/icon/IconMenu.png";
import IconBackButton from "assets/icon/IconBackButton.png";
import Background from "context/Background";
import Page from "components/styles/Page";


const DetailPage = () => {
  const { type, id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [catechismList, setCatechismList] = useState([]);
  const [catechism, setCatechism] = useState(null);
  const [selectedVerse, setSelectedVerse] = useState(null);
  const [isFlipped, setIsFlipped] = useState(false); // 카드 뒤집기 상태
  const [menuOpen, setMenuOpen] = useState(false); // ✅ 메뉴 상태 추가


  useEffect(() => {
    const catechismFile =
      type === "larger-catechism" ? "/data/largerCatechism.json" : "/data/shorterCatechism.json";

    fetch(catechismFile)
      .then((response) => response.json())
      .then((data) => {
        console.log("✅ JSON 데이터 확인:", data); // ✅ 데이터 로드 확인
        const catechismData = type === "larger-catechism" ? data.largerCatechism : data.shorterCatechism;
        console.log("✅ 선택된 문답 목록:", catechismData); // ✅ 변환된 데이터 확인

        setCatechismList(catechismData);

        const selectedCatechism = catechismData.find((q) => q.id === parseInt(id));
        console.log("✅ 선택된 문답:", selectedCatechism); // ✅ 선택된 문답 확인
        setCatechism(selectedCatechism);

        if (selectedCatechism?.verses?.length > 0) {
          setSelectedVerse(selectedCatechism.verses[0]);
        }
      })
      .catch((error) => console.error("🚨 JSON 로드 오류:", error));
  }, [type, id]);



  const handleVerseClick = (verse) => {
    setSelectedVerse(verse); // ✅ 클릭하면 해당 구절 표시
  };

  const toggleFlip = () => {
    setIsFlipped(!isFlipped); // ✅ 카드 뒤집기 토글
  };

  if (!catechism) {
    return <p>문답 데이터를 불러오는 중...</p>;
  }


  return (
    <Background type="white">
        <header className="detail-header">
          <img
            className="back-button"
            src={IconBackButton}
            alt="뒤로 가기"
            onClick={() => navigate(-1)} // ✅ 뒤로 가기 경로 수정
          />
          <h1 className="title">Christian to God</h1>
          <div className="menu-container">
            <img
              src={IconMenu} alt="메뉴 아이콘" className="IconMenu"
              onClick={() => setMenuOpen(!menuOpen)} // ✅ 메뉴 열기/닫기
            />
            {menuOpen && (
              <div className="dropdown-menu">
                <button onClick={() => navigate("/bibleStudy")}>📚선택하기</button>
                <button onClick={() => navigate("/shorter-catechism")}>🔍 검색</button>
              </div>
            )}
          </div>
        </header>

        {/* 메인 */}
        <section className="detailMain-container">
          {/* <h2 className="shortcate-title">웨스트민스터 소요리문답</h2> */}
          <h2 className="main-title">
            <span className="pin">📌 {catechism.id}문<br /></span>
            <p className="pin-content">{catechism.question}</p>
          </h2>
        </section>

        <section className="detailMain-answer-container">
          <div className="detail-content">
            <p className="detail-answer">{catechism.answer}</p>
            {/* <span className="pin_moreExplain"> + 해설보기</span> */}
          </div>
        </section>


        {/* ✅ 성경 구절 태그 버튼 */}
        <section className="tag-container">
          <div className="verses-scroll">
            {catechism.verses.map((verse, index) => (
              <button
                key={index}
                className={`verse-tag ${selectedVerse === verse ? "active" : ""}`}
                onClick={() => handleVerseClick(verse)}
              >
                {verse.book} {verse.chapter}:{verse.verse}
              </button>
            ))}
          </div>

          {/* ✅ 선택된 성경 구절 기본 표시 */}
          {selectedVerse && (
            <div className="verse-box">
              <p className="verse-reference">{selectedVerse.book} {selectedVerse.chapter}:{selectedVerse.verse}</p>
              <p className="verse-text">{selectedVerse.text}</p>
            </div>
          )}

        </section>
        {/* <div className="detail-buttons">
            <button className="prev-button" disabled={parseInt(id) === 1}>이전</button>
            <button className="next-button" disabled={parseInt(id) === catechismList.length}>다음</button>
          </div> */}

        <section className="buttons-container">
          <div className="button-container">
            <p> * 문답 이동 버튼 * </p>
            <div className="detail-buttons">
              {/* ✅ 이전 버튼 (첫 번째 문답이면 비활성화) */}
              <button
                className="prev-button"
                onClick={() => navigate(`/${type}/${parseInt(id) - 1}`)}
                disabled={parseInt(id) === 1}
              >
                이전
              </button>
              <button
                className="next-button"
                onClick={() => navigate(`/${type}/${parseInt(id) + 1}`)}
                disabled={parseInt(id) === catechismList.length}
              >
                다음
              </button>
            </div>
          </div>
        </section>
    </Background>
  );
};

export default DetailPage;
