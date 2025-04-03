import React, { useState, useEffect } from "react";
import {useDispatch} from "react-redux";
import { useNavigate } from "react-router-dom"; // ✅ useNavigate 추가

import "styles/menu/menu.css";
import "styles/pointMarket/pointMarket.css";
import imageRamen from "assets/image/imageRamen.png";
import imageMilk from "assets/image/imageMilk.png";
import imageSnack from "assets/image/imageSnack.png";
import Background from "context/Background";
import Page from "components/styles/Page";
import Hooltto from "assets/image/imageHooltto.png";
import BackButton from "components/Buttons/BackButton";

/* 이미지 import */
import IconCoffee from "assets/icon/IconCoffee.png";
import IconCoke from "assets/icon/IconCoke.png";
import IconHealth from "assets/icon/IconHealth.png";
import IconCoupon from "assets/icon/IconCoupon.png";
import BottomNav from "layouts/BottomNav";
import Coin from "assets/image/coin.png"


const PointMarket = () => {
  const [userData, setUserData] = useState({
    name : "",
    nickname: "",
    email: "",
    info: "안녕하세요! 사용자 정보를 불러오는 중입니다.",
    profileImage: "https://via.placeholder.com/150",
  });
  const [loading, setLoading] = useState(true); // 로딩 상태 관리
  const navigate = useNavigate();
  const dispatch = useDispatch(); // Redux의 dispatch 함수 가져오기 
useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token"); // JWT 가져오기
        if (!token) {
          console.error("토큰이 없습니다. 다시 로그인해주세요.");
          return;
        }
  
        const response = await fetch("http://localhost:8080/api/v1/auth/check", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`, // JWT 전달
          },
        });
  
        if (!response.ok) {
          throw new Error("사용자 인증 실패");
        }
  
        const { userId } = await response.json(); // 서버에서 userId 추출
        dispatch({ type: "SET_USER_ID", payload: userId }); // Redux 상태 업데이트
  
        // 사용자 정보를 가져오기
        const userResponse = await fetch(`http://localhost:8080/api/v1/user/${userId}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`, // JWT 전달
          },
        });
  
        if (!userResponse.ok) {                           
          throw new Error("사용자 정보를 가져올 수 없습니다.");
        }
  
        const userData = await userResponse.json();
        setUserData({
          name : userData.name || "이름 없음",
          nickname: userData.nickname || "닉네임 없음",
          email: userData.email || "이메일 없음",
          info: userData.info || "자기소개가 없습니다.",
          profileImage: userData.profileImage || "https://via.placeholder.com/150",
          tell: userData.tell || "",
          marketing: userData.marketing === 1,
          point : userData.point,
          password: "", 
        });
        
        setLoading(false); // 로딩 상태 해제
      } catch (error) {
        console.error("Error:", error.message);
      }
    };
  
    fetchUserData();
  }, [dispatch]); 


  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [selectedFilter, setSelectedFilter] = useState("전체"); // 🔥 필터 상태 선언 순서 수정
  const categories = ["카페/베이커리", "상품권", "편의점", "뷰티/헬스"];
  const filters = ["전체", "오늘의 특가", "발렌타인데이"];

  const products = [
    { id: 1, image: imageRamen, title: "농심 육개장", price: 2000, store: "gs 편의점" },
    { id: 2, image: imageMilk, title: "서울 우유", price: 4000, store: "gs 편의점" },
    { id: 3, image: imageSnack, title: "돌아온 썬칩", price: 3000, store: "cu 편의점" },
    { id: 4, image: imageSnack, title: "돌아온 썬칩", price: 3000, store: "cu 편의점" },
    { id: 5, image: imageSnack, title: "돌아온 썬칩", price: 3000, store: "cu 편의점" }
  ];

  const filteredProducts = products.filter(product => {
    if (selectedFilter === "전체") return true;
    if (selectedFilter === "오늘의 특가") return product.price < 3000;
    if (selectedFilter === "발렌타인데이") return product.title.includes("썬칩");
    return true;
  });

  const cardData = [
    { image: IconCoffee, title: "커피/베이커리" },
    { image: IconCoupon, title: "상품권" },
    { image: IconCoke, title: "편의점" },
    { image: IconHealth, title: "건강/뷰티" }
  ];

  const handleFilterClick = (filter) => {
    setSelectedFilter(filter);
  };

  const handleCardClick = (title) => {
    setSelectedCategory(title);
  };


  const handleProductClick = (productId) =>{
    navigate(`/pointMarket/product/${productId}`);// 상품 클릭 시 상세 페이지로 이동
  }

  return (
    <Background type="mypage">
      <Page scrollable={true} className="default">
        <div id="pointMarket-page">
          <p>모바일 교환권</p>
        </div>
        
        {/* 검색창 & 유저 정보 */}
        <div className="pointMarket-search-container">
          <input type="text" placeholder="찾는 상품이 있습니까?" className="search-bar" />
        </div>
          <div className="user-info">
            {/* 왼쪽: 사용자 이름 */}
            <p>{userData.name}</p>

              <div className="points-container">
                <span className="points">{userData.point}</span>
                  <img src={Coin} alt="Coin" />
                <button className="history-button">사용내역</button>
              </div> 
          </div>

        {/* 배너 */}
        <section className="pointMarket-banner">
          <img src={Hooltto} alt="훌또" />
        </section>

        {/* 카테고리 카드 */}
        <section className="pointMarket-card-section">
          {cardData.map((card, index) => (
            <div key={index} className="pointMarket-card-wrapper">
              <div 
                className={`pointMarket-card-item ${selectedCategory === card.title ? "selected" : ""}`} 
                onClick={() => handleCardClick(card.title)}
                style={{ cursor: "pointer" }} 
              >
                <img src={card.image} alt={card.title} />
              </div>
              <p className="card-title">{card.title}</p>
            </div>
          ))}
        </section>

        {/* 필터 버튼 */}
        <div className="pointMarket-filter-section">
          {filters.map((filter, index) => (
            <button
              key={index}
              className={`pointMarket-filter-button ${selectedFilter === filter ? "selected" : ""}`}
              onClick={() => handleFilterClick(filter)}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* 필터링된 상품 리스트 */}
        <div className="product-section">
          <div className="product-list">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <div 
                className="product-detail" 
                key={product.id}
                onClick={() => handleProductClick(product.id)} // 클릭 이벤트 추가
                style={{ cursor: "pointer" }} // 클릭 가능하도록 커서 변경
                >
                  <img src={product.image} alt={product.title} className="product-image" />
                  <div className="product-info">
                    <div className="product-text">
                      <p className="product-store">{product.store}</p>
                      <p className="product-title">{product.title}</p>
                    </div>
                    <p className="product-price">{product.price}
                     <img src={Coin} alt="Coin" />
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-products">상품이 없습니다.</p>
            )}
          </div>
        </div>
      </Page>
      <BottomNav/>
    </Background>

  );
};

export default PointMarket;
