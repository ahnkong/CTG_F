

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "styles/ctg/catechism.css"
import Page from "components/styles/Page";
import Background from "context/Background";
// import Header from "../components/Header.jsx";

import IconBackButton from "assets/icon/IconBackButton.png";
import IconMenu from "assets/icon/IconMenu.png";
import IconSearch from "assets/icon/IconSearch.png";

const CatechismPage = () => {
    const { type } = useParams(); // 🔥 URL에서 type 받아오기 (shorter-catechism / large-catechism)
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);
    const [catechismList, setCatechismList] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const catechismFile =
            type === "larger-catechism"
                ? "/data/largerCatechism.json"
                : "/data/shorterCatechism.json"; // 🔥 type에 따라 JSON 파일 선택

        fetch(catechismFile)
            .then((response) => response.json())
            .then((data) => {
                console.log("✅ JSON 로드 성공:", data);
                setCatechismList(
                    type === "larger-catechism" ? data.largerCatechism : data.shorterCatechism
                );
            })
            .catch((error) => console.error("🚨 JSON 로드 오류:", error));
    }, [type]);

    // 🔍 검색어 필터링
    const filteredQuestions = catechismList.filter(
        (q) =>
            q.question.includes(searchTerm) ||
            (q.answer && q.answer.includes(searchTerm))
    );

    return (
        <Background type="white">
                {/* ✅ 공통 클래스명 사용 */}
                <div className="catechism-container">
                    {/* <header className={`catechism-header ${type}`}> */}
                    <div className="header-container">
                        <img
                            src={IconBackButton}
                            alt="뒤로 가기"
                            className="back-button"
                            onClick={() => navigate("/bibleStudy")}
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
                                    <button onClick={() => navigate("/bibleStudy")}>🏠 홈으로</button>
                                    <button onClick={() => navigate(`/${type}`)}>🔍 검색</button>
                                </div>
                            )}
                        </div>
                    </div>
                    {/* ✅ 헤더 분리 후 적용 */}
                    {/* <Header title="Christian to God" backPath={`/${type}`} /> */}

                    {/* ✅ 검색창 */}
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
                            onClick={() => navigate(`/${type}`)}
                        />
                    </div>
                    {/* </header> */}
                </div>

                {/* ✅ 문답 목록 */}
                <main className="catechism-content">
                    <p className="catechism-title">
                        {type === "larger-catechism" ? "웨스트민스터 대요리문답" : "웨스트민스터 소요리문답"}
                    </p>
                    <ul className="catechism-list">
                        {filteredQuestions.map((q) => (
                            <p
                                key={q.id}
                                className="catechism-item"
                                onClick={() => navigate(`/${type}/${q.id}`)}
                            >
                                <span className="pin">📌 </span>
                                <span
                                    className="question"
                                    style={{ whiteSpace: "normal", wordBreak: "break-word" }}
                                >
                                    {q.id}문 {q.question}
                                </span>
                                {/* <div className="item-divider" /> */}
                            </p>
                        ))}
                    </ul>
                </main>
        </Background>
    );
};

export default CatechismPage;
