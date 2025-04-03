import React from "react";
import Background from "context/Background.jsx";
import Page from "components/styles/Page";
import cuteBoyImage from "assets/image/imageJesus.png";
import "styles/login/initScreen.css"; // InitScreen 전용 스타일
import { useNavigate } from "react-router-dom";

const InitScreen = () => {
  const navigate = useNavigate();


  const handleClick = () => {
    navigate("/NewRegister");
  };


  return (
    <Background type="white">
      <Page scrollable={false}>
        <div className="fade-in">
          <header className="initScreen-container">
            <p className="initScreen-header">Christian to God</p>
            <p className="main-content">바른 신학, 바른 교회, 바른 생활</p>
          </header>


            <main className="image-logo">
              <img src={cuteBoyImage} alt="귀여운 소년 이미지" />
              <button className="start-button" onClick={handleClick}>시작하기</button>
              <p className="login-link">이미 회원가입을 하셨나요? <a href="/LoginPage">로그인</a></p>
            </main>


          <footer className="footer_InitScreen">
            <p>© 2024-{new Date().getFullYear()} CodeQuest. All rights reserved.</p>
          </footer>
        </div>
      </Page>
    </Background>
  );
};

export default InitScreen;
