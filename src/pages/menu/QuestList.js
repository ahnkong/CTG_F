import React, { useState, useEffect } from "react";
import "styles/menu/questList.css"; // 스타일 파일 import
import { useNavigate } from "react-router-dom";
import axios from "axios";

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
const imageMap = {
    "게시글 작성 ": money,
    "마케팅 동의": cart,
    "게시글 작성하기": note,
    "주간 훌훌 선정되기": trophy,
    "친구 초대하기": people,
};



const QuestList = () => {
    const [quests, setQuests] = useState([]);
    const navigate = useNavigate();
    const userData = JSON.parse(localStorage.getItem("user")); // user = { userId: "ahncoco", ... }
    const userId = userData?.userId;

    // ✅ 퀘스트 목록 불러오기 (userId 포함)
    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem("user"));
        const userId = userData?.userId; // ✅ 로그인된 유저 ID

        axios.get("http://localhost:8080/api/v1/quest/list", {
            params: { userId: userId } // ✅ 유저 ID 추가
        })
            .then((res) => {
                console.log("퀘스트 데이터 확인:", res.data); // 🔍 콘솔에서 구조 확인
                setQuests(res.data);
            })
            .catch((err) => {
                console.error("퀘스트 목록 불러오기 실패", err);
            });
    }, []);



    // // 진행도 증가 함수
    // const handleIncrease = (id) => {
    //     setQuests((prevQuests) =>
    //         prevQuests.map((quest) =>
    //             quest.id === id && quest.progress < quest.total
    //                 ? { ...quest, progress: quest.progress + 1 }
    //                 : quest
    //         )
    //     );
    // };

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


    const handleIncrease = (questId) => {
        const userData = JSON.parse(localStorage.getItem("user"));
        const userId = userData?.userId; // ✅ userId를 여기서 꺼내줘야 함!

        if (!userId) {
            alert("로그인이 필요합니다.");
            return;
        }

        axios.post(`http://localhost:8080/api/v1/quest/progress`, null, {
            params: {
                userId: userId,
                questId: questId,
            }
        })
            .then((res) => {
                console.log("✅ 퀘스트 진행 성공:", res.data);
                console.log("➡️ 보내는 유저 ID:", userId);
                console.log("➡️ 보내는 퀘스트 ID:", questId);
                // ✅ 여기에 진행도 UI 업데이트 or 다시 요청 로직 넣어도 됨
            })
            .catch((err) => {
                console.error("❌ 퀘스트 진행 실패:", err);
            });
    };




    return (
        <Background type="white">
            <Page scrollable={true}>
                <div>
                    <BackButton variant="middle" />
                </div>
                <section className="quest-page">
                    <header className="quest-header"><h2 className="quest-title">오늘의 퀘스트</h2></header>

                    <section className="quest-list">
                        {quests.map((quest) => (
                            <article key={quest.questId} className="quest-card">
                                <img
                                    src={imageMap[quest.qname] || money}
                                    alt={quest.qname}
                                    className="quest-icon"
                                />
                                <div className="quest-content">
                                    <div className="quest-layout">
                                        <h2 className="quest-title">{quest.qname}</h2>
                                        {/* ✅ 진행도 증가 / 감소 버튼 */}
                                        <div className="button-group">
                                            <button className="decrease-button"
                                                onClick={() => handleDecrease(quest.id)}
                                                disabled={quest.progress <= 0}
                                            >
                                                ➖
                                            </button>
                                            <button
                                                className="increase-button"
                                                onClick={() => handleIncrease(quest.questId)}
                                                disabled={quest.status === "COMPLETED"} // 이 조건 추가!
                                            >
                                                ➕
                                            </button>
                                        </div>
                                        <div className="button-group">
                                            {/* 버튼은 나중에 서버 연동으로 대체 */}
                                            <p className="getCoin">{quest.rewardPoint}<img src={Coin} alt="coin" /></p>
                                        </div>
                                    </div>
                                    <p className="quest-description">{quest.qDescription}</p>
                                    {/* ✅ Step 간격이 있는 진행도 바 + 진척도 표시 */}
                                    <div className="progress-step-container">
                                        {Array.from({ length: quest.total ?? quest.requiredAttempts }).map((_, index) => (
                                            <div
                                                key={index}
                                                className={`progress-step ${index < quest.progress ? "active" : ""}`}
                                                style={{ width: `${100 / (quest.total ?? quest.requiredAttempts)}%` }}
                                            ></div>
                                        ))}
                                    </div>
                                    <p className="progress-text">
                                        {quest.progress}/{quest.total ?? quest.requiredAttempts}
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




// import React, { useState, useEffect } from "react";
// import "styles/menu/questList.css"; // 스타일 파일 import
// import { useNavigate } from "react-router-dom";
// import axios from "axios";

// import Background from "context/Background";
// import Page from "components/styles/Page";
// import money from "assets/image/money.png";
// import cart from "assets/image/cart.png";
// import note from "assets/image/note.png";
// import trophy from "assets/image/trophy.png";
// import people from "assets/image/people.png"; // 하단 이미지
// import Coin from "assets/icon/IconCoin.png"
// import BackButton from "components/Buttons/BackButton";


// // 퀘스트 데이터 (백엔드 연동 시 API 호출로 대체 가능)
// const imageMap = {
//     "게시글 작성 ": money,
//     "마케팅 동의": cart,
//     "게시글 작성하기": note,
//     "주간 훌훌 선정되기": trophy,
//     "친구 초대하기": people,
// };



// const QuestList = () => {
//     const [quests, setQuests] = useState([]);
//     const navigate = useNavigate();


//     // ✅ 퀘스트 목록 불러오기
//     useEffect(() => {
//         axios.get("http://localhost:8080/api/v1/quest/list")
//             .then((res) => {
//                 setQuests(res.data);
//             })
//             .catch((err) => {
//                 console.error("퀘스트 목록 불러오기 실패", err);
//             });
//     }, []);



//     // 진행도 증가 함수
//     const handleIncrease = (id) => {
//         setQuests((prevQuests) =>
//             prevQuests.map((quest) =>
//                 quest.id === id && quest.progress < quest.total
//                     ? { ...quest, progress: quest.progress + 1 }
//                     : quest
//             )
//         );
//     };

//     // 진행도 감소 함수
//     const handleDecrease = (id) => {
//         setQuests((prevQuests) =>
//             prevQuests.map((quest) =>
//                 quest.id === id && quest.progress > 0
//                     ? { ...quest, progress: quest.progress - 1 }
//                     : quest
//             )
//         );
//     };

//     return (
//         <Background type="white">
//             <Page scrollable={true}>
//                 <div>
//                     <BackButton variant="middle" />
//                 </div>
//                 <section className="quest-page">
//                     <header className="quest-header"><h2 className="quest-title">오늘의 퀘스트</h2></header>

//                     <section className="quest-list">
//                         {quests.map((quest) => (
//                             <article key={quest.questId} className="quest-card">
//                                 <img
//                                     src={imageMap[quest.qName] || money}
//                                     alt={quest.qName}
//                                     className="quest-icon"
//                                 />
//                                 <div className="quest-content">
//                                     <div className="quest-layout">
//                                         <h2 className="quest-title">{quest.qName}</h2>
//                                         <div className="button-group">
//                                             {/* 버튼은 나중에 서버 연동으로 대체 */}
//                                             <p className="getCoin">{quest.rewardPoint}<img src={Coin} alt="coin" /></p>
//                                         </div>
//                                     </div>
//                                     <p className="quest-description">{quest.qDescription}</p>
//                                     <div className="progress-step-container">
//                                         {Array.from({ length: quest.requiredAttempts }).map((_, index) => (
//                                             <div
//                                                 key={index}
//                                                 className={`progress-step ${index < 0 ? "active" : ""}`} // 실제 진행도 연동 필요
//                                                 style={{ width: `${100 / quest.requiredAttempts}%` }}
//                                             ></div>
//                                         ))}
//                                     </div>
//                                     <p className="progress-text">0 / {quest.requiredAttempts}</p>
//                                 </div>
//                             </article>
//                         ))}
//                     </section>
//                 </section>
//             </Page>
//         </Background>
//     );
// };

// export default QuestList;
