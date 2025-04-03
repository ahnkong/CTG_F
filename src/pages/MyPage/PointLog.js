import React, {useState} from "react";
import { useNavigate } from "react-router-dom";
import "styles/MyPage/pointLog.css"; // CSS 파일 import
import { FaArrowLeft } from "react-icons/fa";
import IconMoney2 from "assets/icon/IconMoney2.png"; // 포인트 아이콘 (적절한 이미지 사용)
import IconCart from "assets/icon/IconCart.png"; // 포인트 아이콘 (적절한 이미지 사용)
import IconHealth from "assets/icon/IconHealth.png"; // 포인트 아이콘 (적절한 이미지 사용)
import Background from "context/Background";
import Page from "components/styles/Page";
import BackButton from "components/Buttons/BackButton";

import IconCoupon from "assets/icon/IconCoupon.png"; // 포인트 아이콘 (적절한 이미지 사용)



const pointsHistory = [
    { id: 1, text: "공감 누르기 3회", points: "+ 50 포인트", type: "plus" },
    { id: 2, text: "고민 나누기", points: "+ 100 포인트", type: "plus" },
    { id: 3, text: "하트 주기", points: "+ 70 포인트", type: "plus" },
    { id: 4, text: "친구 초대", points: "+ 500 포인트", type: "plus" },
    { id: 5, text: "기프티콘", points: "- 1,000 포인트", type: "minus" },
    { id: 6, text: "심리테스트 하기", points: "+ 500 포인트", type: "plus" },
];

const cardData = [
    {
        image: IconCoupon,
        title: "쿠폰함",
    },
    {
        image: IconCart,
        title: "복권",  // \n을 사용하여 줄바꿈

    },
    {
        image: IconMoney2,
        title: "훌또!!",

    },
];

const PointLog = () => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState({
        nickname: "",
        email: "",
        info: "안녕하세요! 사용자 정보를 불러오는 중입니다.",
        profileImage: "https://via.placeholder.com/150",
    });

    const handleCardClick = (title) => {
        if (title === "개인정보\n수정") {
          navigate("/check-password"); //  비밀번호 확인 페이지로 이동
        }
        if (title === "대시보드\n훌훌") {
          navigate("/pointLog"); //  비밀번호 확인 페이지로 이동
        }
      };
      
  
  
    return (
        <Background type="white">
            <Page scrollable={true} className="pointLog-page">
                {/* 상단 네비게이션 */}
                <header className="pointLog-header">
                    <BackButton onClick={() => navigate(-1)} />
                    <h4>포인트 사용내역</h4>
                </header>

                {/* 보유 포인트 */}
                <section className="pointLog-balance">
                    <img src={IconMoney2} alt="포인트 아이콘" className="pointLog-icon" />
                    <p className="pointLog-label">보유 포인트</p>
                    <h1 className="pointLog-amount">4,095 포인트</h1>
                </section>

                {/* 포인트 내역 */}
                <div className="pointLog-notice"><p> ※ 내역은 최신 기준으로 보여집니다.</p></div>
                <section className="pointLog-history"><h3>포인트 내역</h3>
                    <ul className="history-list">
                        {pointsHistory.map((item) => (
                            <li key={item.id} className="history-item">
                                <span className="history-text">{item.text}</span>
                                <span className={`history-points ${item.type}`}>{item.points}</span>
                            </li>
                        ))}
                    </ul>
                </section>

                {/* 카드 섹션 */}
                <section className="pointLog-card-section">
                    {cardData.map((card, index) => (
                        <div className="poingLog-card-item"
                            key={index}
                            onClick={() => handleCardClick(card.title)} // 클릭 시 이동
                            style={{ cursor: "pointer" }} // 클릭 가능하도록 스타일 추가
                        >
                            {card.title === "포인트" && <p className="point">{userData.point} </p>}
                            {card.title === "개인정보\n수정" && <p className="content"></p>}
                            {card.title === "대시보드\n훌훌" && <p className="content"></p>}

                            {/* <p className="point">{card.description}</p> */}
                            <h3>{card.title}</h3>
                            <img src={card.image} alt={card.title} />
                        </div>
                    ))}
                </section>

            </Page>
        </Background>
    );
};

export default PointLog;
