import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import IconBackButton from "assets/icon/IconBackButton.png"; // 이미지 파일을 가져오기
import "styles/components/BackButton.css";

const BackButton = ({ variant = "top" }) => {  // const navigate = useNavigate();

  // const handleBack = () => {
  //   navigate(-1); // 전 페이지로 이동
  // };



// 같은 레이아웃의 버튼 위치 동일하게 유지보수하게 하기 위해서, 
// <BackButton variant="middle" /> = > 고정
  //--
// <BackButton variant="top" /> => 기본
  //--  
// 타입별로 .css 따로 관리
  
  
  const navigate = useNavigate();
  const location = useLocation();

  // const handleBack = () => {
  //   const currentPath = location.pathname;
  //   const from = location.state?.from;

  //   if (currentPath === "/NewRegister") {
  //     // 회원가입 페이지라면 → 로그인 페이지로
  //     navigate("/loginPage");
  //   } else if (currentPath === "/mypage") {
  //     // 마이페이지라면 → 그냥 뒤로 가기
  //     navigate(-1);
  //   } else if (currentPath === "/pointMarket/product/:id") {
  //     // 마이페이지라면 → 그냥 뒤로 가기
  //     navigate(-1);
  //   } else if (from === "onboarding") {
  //     // 특정 조건(state에 따라) 이동
  //     navigate("/welcome");
  //   } else {
  //     navigate(-1);
  //   }
  // };
  const handleBack = () => {
    const path = location.pathname;

    // ✅ 현재 경로 기준으로만 처리
    switch (path) {
      case "/register":
        navigate("/loginPage");
        break;
      case "/check-password":
        navigate("/mypage");
        break;
      case "/pointMarket/product/:id":
        navigate("/mypage");
        break;
      default:
        navigate(-1); // 기본 동작
    }
  };


  return (
    // <button className="back-button" onClick={handleBack}>
    //   <img src={IconBackButton} alt="뒤로 가기" />
    // </button>
    <button
      className={variant === "top" ? "back-button-top" : "back-button-middle"}
      onClick={handleBack}
    >
      <img src={IconBackButton} alt="뒤로 가기" />
    </button>
  );
};

export default BackButton;
