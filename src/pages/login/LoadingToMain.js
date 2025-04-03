import React, { useEffect } from "react";
import "styles/login/loadingScreen.css"; // 로딩 화면 전용 스타일
import Page from "components/styles/Page";
import Background from "context/Background";
import whiteLogo from "assets/logo/white_hand_logo.png";
import { useNavigate } from "react-router-dom";

const LoadingToMain = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/Menu"); // 로딩 완료 후 메인 페이지로 이동
    }, 3000); // 3초 후 이동

    return () => clearTimeout(timer); // 컴포넌트 언마운트 시 타이머 초기화
  }, [navigate]);

  return (
    <div className="loading">
      <div className="header">
        <h1>
          사랑과 관심이 <br /> 가치가 되는 곳 <br /> 훌훌 😎
        </h1>
      </div>
      <div className="image-logo">
        <img src={whiteLogo} alt="whiteLogo" />
      </div>
    </div>
  );
};

export default LoadingToMain;
