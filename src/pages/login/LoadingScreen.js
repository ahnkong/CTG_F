import React, { useEffect } from "react";
import "styles/login/loadingScreen.css"; // 로딩 화면 전용 스타일
import Page from "components/styles/Page";
import Background from "context/Background";
import whiteLogo from "assets/logo/white_hand_logo.png";
import { useNavigate } from "react-router-dom";

const LoadingScreen = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/InitScreen"); // 로딩 완료 후 메인 페이지로 이동
    }, 3000); // 3초 후 이동

    return () => clearTimeout(timer); // 컴포넌트 언마운트 시 타이머 초기화
  }, [navigate]);

  return (
    <Background type="coin">
      <Page scrollable={true} className="default">
        <div id="LodingScreen-loading">
          <div className="LodingScreen-header">
            <h1>
              사랑과 관심이 <br /> 가치가 되는 곳 <br /> 훌훌 😎
            </h1>
          </div>
          <div className="LodingScreen-imageLogo">
            <img src={whiteLogo} alt="whiteLogo" />
          </div>
        </div>
      </Page>
    </Background>
  );
};

export default LoadingScreen;
