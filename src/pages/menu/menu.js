import React from "react";
import { useNavigate } from "react-router-dom";
import Page from "components/styles/Page";
import Background from "context/Background.jsx";
import BottomNav from "layouts/BottomNav";
import IconPen from "assets/icon/IconPen.png"
import "styles/menu/menu.css"; // Menu 전용 스타일
import "styles/page.css"; // 공통 스타일

/* 이미지 import */
import money from "assets/image/money.png";
import cart from "assets/image/cart.png";
import note from "assets/image/note.png";
import trophy from "assets/image/trophy.png";
import people from "assets/image/people.png"; // 하단 이미지
import bible from "assets/image/imageBible.png";
import sheep from "assets/image/imageSheep.png"
const cardData = [
  {
    image: money,
    title: "퀘스트",
    description: "오늘의 퀘스트\n 목록을 확인해\n 주세요!",
    url : "/questList",
  },
  {
    image: note,
    title: "심리테스트",
    description: "자신에 대해서\n알아봅시다.",
    url : "/questPage",
  },
  // {
  //   image: cart,
  //   title: "쇼핑",
  //   description: "포인트를 쿠폰으로\n교환하세요~",
  //   url : "/pointMarket",
  // },
  {
    image: bible,
    title: "성경공부",
    description: "포인트 리워드를\n확인하세요~!",
    url : "/bibleStudy",
  },
  {
    image: IconPen,
    title: "게시판",
    description: "마음을 나누고\n확인하세요~!",
    url : "/main",
  },
];

const Menu = () => {
  const navigate = useNavigate(); // ✅ 네비게이션 함수 사용

  const handleCardClick = (url) => {
    navigate(url); // ✅ 해당 URL로 이동
  };

  return (
    <Background type="white">
      <Page id="menuPage" className="menuPage" scrollable={false}>
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
          <img src={sheep} alt="people" />
        </section> */}
      </Page>
      <BottomNav />
    </Background>
  );
};

export default Menu;
