import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import Background from "context/Background";
import Page from "components/styles/Page";
import BottomNav from "layouts/BottomNav";
import BackButton from "components/Buttons/BackButton"; // 뒤로 가기 버튼 추가

import imageRamen from "assets/image/imageRamen.png";
import imageMilk from "assets/image/imageMilk.png";
import imageSnack from "assets/image/imageSnack.png";
import Coin from "assets/image/coin.png";

import "styles/pointMarket/productDetail.css";


// 더미 상품 데이터 (실제 API 연결 가능)
const products = [
  { id: 1, image: imageRamen, title: "농심 육개장", price: 2000, store: "GS 편의점" },
  { id: 2, image: imageMilk, title: "서울 우유", price: 4000, store: "GS 편의점" },
  { id: 3, image: imageSnack, title: "돌아온 썬칩", price: 3000, store: "CU 편의점" },
];

const ProductDetail = () => {
  const [userData, setUserData] = useState({
    name: "",
    nickname: "",
    email: "",
    info: "안녕하세요! 사용자 정보를 불러오는 중입니다.",
    profileImage: "https://via.placeholder.com/150",
  });
  const [loading, setLoading] = useState(true); // 로딩 상태 관리
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
          name: userData.name || "이름 없음",
          nickname: userData.nickname || "닉네임 없음",
          email: userData.email || "이메일 없음",
          info: userData.info || "자기소개가 없습니다.",
          profileImage: userData.profileImage || "https://via.placeholder.com/150",
          tell: userData.tell || "",
          marketing: userData.marketing === 1,
          point: userData.point,
          password: "",
        });

        setLoading(false); // 로딩 상태 해제
      } catch (error) {
        console.error("Error:", error.message);
      }
    };

    fetchUserData();
  }, [dispatch]);

  const { id } = useParams(); // URL에서 상품 ID 가져오기
  const navigate = useNavigate(); // 🔥 뒤로 가기 기능 추가
  const product = products.find((p) => p.id === Number(id));

  if (!product) {
    return <p>상품을 찾을 수 없습니다.</p>;
  }

  return (
    <Background type="white">
      <Page scrollable={false}>
        <section className="section-product-detail-page">
          <div className="product-detail-header">
            <BackButton className="back-button-fixed"/>
            <p>상품 상세 페이지</p>
          </div>

          <div className="user-point-container">
            <p className="user-point-label">사용 가능 포인트</p>
            <p className="user-point-value">{userData.point}
              <img src={Coin} alt="Coin" /></p>
          </div>

          <div className="product-detail-content-container">
            <div className="product-detail-container">
              <img src={product.image} alt={product.title} className="product-detail-image" />
              <div className="product-detail-info">
                <p className="product-detail-store">{product.store}</p>
                <h2 className="product-detail-title">{product.title}</h2>
              </div>
            </div>
          </div>
          <div className="product-detail-scroll">
            <p className="product-detail-content">
              사용 방법<br />
              매장에서 기프티콘을 직원에게 제시하면 사용 가능합니다. 온라인 결제 시, 결제 페이지에서 쿠폰 번호를 입력하세요.
              유효 기간 기프티콘의 유효 기간은 발행일로부터 XX일입니다.
              유효 기간 연장은 불가능하며, 기간 내에 사용해 주세요.
              유의 사항 일부 매장에서는 사용이 제한될 수 있습니다.
              매장에서 기프티콘을 직원에게 제시하면 사용 가능합니다. 온라인 결제 시, 결제 페이지에서 쿠폰 번호를 입력하세요.
              유효 기간 기프티콘의 유효 기간은 발행일로부터 XX일입니다.
              유효 기간 연장은 불가능하며, 기간 내에 사용해 주세요.
              유의 사항 일부 매장에서는 사용이 제한될 수 있습니다.
              매장에서 기프티콘을 직원에게 제시하면 사용 가능합니다. 온라인 결제 시, 결제 페이지에서 쿠폰 번호를 입력하세요.
              유효 기간 기프티콘의 유효 기간은 발행일로부터 XX일입니다.
              유효 기간 연장은 불가능하며, 기간 내에 사용해 주세요.
              유의 사항 일부 매장에서는 사용이 제한될 수 있습니다.
              유의 사항 일부 매장에서는 사용이 제한될 수 있습니다.
              매장에서 기프티콘을 직원에게 제시하면 사용 가능합니다. 온라인 결제 시, 결제 페이지에서 쿠폰 번호를 입력하세요.
              유효 기간 기프티콘의 유효 기간은 발행일로부터 XX일입니다.
              유효 기간 연장은 불가능하며, 기간 내에 사용해 주세요.
              유의 사항 일부 매장에서는 사용이
              유의 사항 일부 매장에서는 사용이 제한될 수 있습니다.
              매장에서 기프티콘을 직원에게 제시하면 사용 가능합니다. 온라인 결제 시, 결제 페이지에서 쿠폰 번호를 입력하세요.
              유효 기간 기프티콘의 유효 기간은 발행일로부터 XX일입니다.
              유효 기간 연장은 불가능하며, 기간 내에 사용해 주세요.
              유의 사항 일부 매장에서는 사용이
              유의 사항 일부 매장에서는 사용이 제한될 수 있습니다.
              매장에서 기프티콘을 직원에게 제시하면 사용 가능합니다. 온라인 결제 시, 결제 페이지에서 쿠폰 번호를 입력하세요.
              유효 기간 기프티콘의 유효 기간은 발행일로부터 XX일입니다.
              유효 기간 연장은 불가능하며, 기간 내에 사용해 주세요.
              유의 사항 일부 매장에서는 사용이
              <br />역삼점은 앙대요.
            </p>
          </div>
          <div className="product-detail-footer">
            <p className="footer-product-detail-price">
              {product.price}
              <img src={Coin} alt="Coin" />
            </p>
            <button className="footer-exchange-button">교환하기</button>
          </div>
          {/* ✅ 하단 (고정) */}
        </section>


      </Page>
      {/* <BottomNav /> */}
    </Background>
  );
};

export default ProductDetail;
