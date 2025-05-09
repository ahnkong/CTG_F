import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Page from "components/styles/Page";
import Background from "context/Background.jsx";
import BottomNav from "layouts/BottomNav";
import IconPen from "assets/icon/IconPen.png"
import "styles/menu/menu.css"; // Menu 전용 스타일
// import "styles/page.css"; // 공통 스타일
import Hearder_ChuchType from "layouts/Hearder_ChurchType";
import CloseIcon from "assets/icon/IconClose.png"; // 닫기 아이콘

/* 이미지 import */
import money from "assets/image/money.png";
import cart from "assets/image/cart.png";
import note from "assets/image/note.png";
import trophy from "assets/image/trophy.png";
import people from "assets/image/people.png"; // 하단 이미지
import bible from "assets/image/imageBible.png";
import sheep from "assets/image/imageSheep.png";
import notice from "assets/image/imageNotice.png";
import churchImage from "assets/image/churhch_img.png"; // 상대경로 또는 절대경로
import board from "assets/image/imageBoard.png"

const cardData = [

  // {
  //   image: note,
  //   title: "심리테스트",
  //   description: "자신에 대해서\n알아봅시다.",
  //   url : "/questPage",
  // },
  // {
  //   image: cart,
  //   title: "쇼핑",
  //   description: "포인트를 쿠폰으로\n교환하세요~",
  //   url : "/pointMarket",
  // },
  {
    image: board,
    title: "게시판",
    description: "마음을 함께\n나누세요~!",
    url : "/main",
  },
  {
    image: notice,
    title: "교회 공지",
    description: "교회 공지를\n확인하세요~!",
    url : "/boardNotice",
  },
  {
    image: sheep,
    title: "예배 영상",
    description: "예배 영상을\n 확인해 주세요!\n",
    url : "/questList",
  },
];

const Menu = () => {
  const [showModal, setShowModal] = useState(false); // 모달 상태 추가
  const navigate = useNavigate(); // ✅ 네비게이션 함수 사용
  const [latestNotices, setLatestNotices] = useState([]);
  
  useEffect(() => {
    const fetchLatestNotices = async () => {
      try {
        const response = await axios.get("/api/v1/boards", {
          params: {
            type: "NOTICE",       // 공지 타입만
            sort: "cDate,desc",   // 최신순
            page: 0,
            size: 2               // 2개만
          }
        });
        setLatestNotices(response.data.content || []);
      } catch (error) {
        console.error("공지 불러오기 실패", error);
      }
    };
  
    fetchLatestNotices();
  }, []);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const diff = (Date.now() - date.getTime()) / 1000;
  
    if (diff < 60) return "방금 전";
    if (diff < 3600) return `${Math.floor(diff / 60)}분 전`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;
    return date.toLocaleDateString();
  };
  

  const handleCardClick = (url) => {
    navigate(url); // ✅ 해당 URL로 이동
  };

  const handleWriteClick = (type) => {
    navigate(`/create?type=${type}`);
    setShowModal(false); // 모달 닫기
  };

  {/* 교회 공지 */}

  return (
    <Background type="white">
      <Hearder_ChuchType />
        <Page id="menuPage" className="menuPage" scrollable={true}>
          <section className="menu-church-section">
            <div className="menu-church-img"><img src={churchImage} alt="교회 대표 이미지"/></div>
          </section>

          {/* 교회 공지 */}
          <section className="menu-notice-preview">
            <h3 className="notice-title">📢 최신 공지</h3>
            <ul className="notice-list">
              {latestNotices.map((notice) => (
                <li key={notice.boardId} onClick={() => navigate(`/board/${notice.boardId}`)}>
                  <p className="notice-item-title">{notice.title}</p>
                  <p className="notice-item-date">{formatDate(notice.cDate)}</p>
                  </li>
              ))}
            </ul>
          </section>
          {/* 카드 섹션 */}
          <section className="menu-card-section">
            {cardData.map((card, index) => (
                <div 
                className="menu-card-grid" 
                key={index} 
                onClick={() => handleCardClick(card.url)} // ✅ 카드 클릭 시 이동
                style={{ cursor: "pointer" }} // ✅ 마우스 포인터 변경
              >
                <img src={card.image} alt={card.title} />
                <h3>{card.title}</h3>
                <p style={{ whiteSpace: "pre-line" }}>{card.description}</p>
              </div>
            ))}
          </section>

          {/* 하단 이미지 섹션 */}
          {/* <section className="menu-image-section">
            <img src={sheep} alt="sheep" />
          </section> */}
        </Page>

        {/* 플로팅 글쓰기 버튼 */}
        {/* <button className="floating-write-btn" onClick={() => navigate("/create")}>
          <img src={IconPen} alt="글쓰기" />
        </button> */}
          {/* 플로팅 버튼 */}
          <button
            className="floating-write-btn"
            onClick={() => setShowModal(!showModal)}
          >
            <img
              src={showModal ? CloseIcon : IconPen}
              alt={showModal ? "닫기" : "글쓰기"}
            />
          </button>

          {/* 모달 */}
          {showModal && (
            <div className="write-modal-overlay" onClick={() => setShowModal(false)}>
              <div className="write-modal" onClick={(e) => e.stopPropagation()}>
                {/* <h3>글쓰기 종류 선택</h3> */}
                <button onClick={() => handleWriteClick("board")}>게시판 글쓰기</button>
                <button onClick={() => handleWriteClick("notice")}>공지 글쓰기</button>
                <button onClick={() => handleWriteClick("worship")}>예배 영상 글쓰기</button>
              </div>
            </div>
          )}
      <BottomNav />
    </Background>
  );
};

export default Menu;
