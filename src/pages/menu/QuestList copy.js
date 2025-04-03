import React, { useState } from "react";
import "styles/menu/questList.css"; // 스타일 파일 import
import { useNavigate } from "react-router-dom";

import Background from "context/Background";
import Page from "components/styles/Page";
import money from "assets/image/money.png";
import cart from "assets/image/cart.png";
import note from "assets/image/note.png";
import trophy from "assets/image/trophy.png";
import people from "assets/image/people.png"; // 하단 이미지
import Coin from "assets/icon/IconCoin.png"
import BackButton from "components/Buttons/BackButton";


// 퀘스트 데이터 (백엔드 연동 시 API 호출로 대체 가능)
const initialQuests = [
    {
        id: 1,
        image: money,
        title: "댓글 달기",
        description: "댓글 달기",
        total: 5, // 1단계일 경우, 한 칸만 존재하지만 꽉 차게 표시
        progress: 0,
        point: 20,
    },
    {
        id: 2,
        image: cart,
        title: "기프티콘 교환하기",
        description: "포인트 사용",
        total: 1,
        progress: 0,
        point: 20,

    },
    {
        id: 3,
        image: note,
        title: "게시글 작성하기",
        description: "활동 기록 남기기",
        total: 3,
        progress: 0,
        point: 20,
    },
    {
        id: 4,
        image: trophy,
        title: "주간 훌훌 선정되기",
        description: "주간 인기 선정",
        total: 1,
        progress: 0,
        point: 20,

    },
    {
        id: 5,
        image: people,
        title: "친구 초대하기",
        description: "초대 링크 공유",
        total: 5,
        progress: 0,
        point: 20,

    },
];

const QuestList = () => {
    const [quests, setQuests] = useState(initialQuests);
    const navigate = useNavigate();
    // 진행도 증가 함수
    const handleIncrease = (id) => {
        setQuests((prevQuests) =>
            prevQuests.map((quest) =>
                quest.id === id && quest.progress < quest.total
                    ? { ...quest, progress: quest.progress + 1 }
                    : quest
            )
        );
    };

    // 진행도 감소 함수
    const handleDecrease = (id) => {
        setQuests((prevQuests) =>
            prevQuests.map((quest) =>
                quest.id === id && quest.progress > 0
                    ? { ...quest, progress: quest.progress - 1 }
                    : quest
            )
        );
    };

    return (
        <Background type="white">
            <Page scrollable={true}>
                <div className="login-page-backbutton">
                    <BackButton onClick={() => navigate(-1)} />
                </div>
                <section className="quest-page">
                    <header className="quest-header"><h2 className="quest-title">오늘의 퀘스트</h2></header>

                    <section className="quest-list">
                        {quests.map((quest) => (
                            <article key={quest.id} className="quest-card">
                                <img src={quest.image} alt={quest.title} className="quest-icon" />
                                <div className="quest-content">
                                    <div className="quest-layout">
                                        <h2 className="quest-title">{quest.title}</h2>
                                        {/* ✅ 진행도 증가 / 감소 버튼 */}
                                        <div className="button-group">
                                            <button className="decrease-button"
                                                onClick={() => handleDecrease(quest.id)}
                                                disabled={quest.progress <= 0}
                                            >
                                                🧤
                                            </button>
                                            <button className="increase-button"
                                                onClick={() => handleIncrease(quest.id)}
                                                disabled={quest.progress >= quest.total}
                                            >
                                                😍
                                            </button>
                                            <p className="getCoin">{quest.point}<img src={Coin} alt="Coin" />
                                            </p>
                                        </div>
                                    </div>
                                    <p className="quest-description">{quest.description}</p>

                                    {/* ✅ Step 간격이 있는 진행도 바 + 진척도 표시 */}
                                    <div className="progress-step-container">
                                        {Array.from({ length: quest.requiredAttempts }).map((_, index) => (
                                            <div
                                                key={index}
                                                className={`progress-step ${index < quest.progress ? "active" : ""}`}
                                                style={{ width: `${100 / quest.requiredAttempts}%` }} // ✅ 진행도 개수에 맞춰 블록 크기 자동 조정
                                            ></div>
                                        ))}
                                    </div>
                                    <p className="progress-text">
                                        {quest.progress}/{quest.requiredAttempts}
                                    </p>
                                </div>
                            </article>
                        ))}
                    </section>
                </section>
            </Page>
        </Background>
    );
};

export default QuestList;
