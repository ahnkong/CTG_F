import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser, clearUser } from "reducers/userReducer"; // ✅ 반드시 필요
import Page from "components/styles/Page";
import "styles/login/loginPage.css";
import axios from "axios";
import ImageSheep from "assets/image/imageSheep.png";
import BackButton from "components/Buttons/BackButton.jsx";
import Background from "context/Background.jsx";

const LoginPage = () => {
  const [inProp, setInProp] = useState(false);
  const [email, setEmailInput] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  // ✅ 애니메이션 효과
  useEffect(() => {
    setInProp(true);
    dispatch(clearUser()); // ✅ 로그인 페이지 진입 시 리덕스 초기화
  }, []);

  useEffect(() => {
    const persistRoot = JSON.parse(localStorage.getItem("persist:root"));
    const auth = JSON.parse(persistRoot.auth);
    console.log("🔍 현재 로그인 상태:", auth);
  }, []);

  useEffect(() => {
    const persistRoot = localStorage.getItem("persist:root");
    if (persistRoot) {
      try {
        const parsedRoot = JSON.parse(persistRoot);
        if (parsedRoot.auth) {
          const auth = JSON.parse(parsedRoot.auth);
          console.log("🔍 현재 로그인 상태:", auth);
        } else {
          console.warn("auth 데이터가 없습니다.");
        }
      } catch (error) {
        console.error("persist:root 파싱 중 오류:", error);
      }
    } else {
      console.warn("persist:root가 localStorage에 없습니다.");
    }
  }, []);
  


  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true); // 로딩 시작
    try {
        const response = await axios.post('http://localhost:8080/api/v1/auth/login', { email, password }, { withCredentials: true });
      console.log(response.data.userId)
      
      if (response.data.token) {
        // 서버에서 반환한 데이터
        const { userId, nickname, profilePicture, token, domainId } = response.data;

        // 토큰을 로컬 스토리지에 저장
        localStorage.setItem("token", token);
        localStorage.setItem("userId", userId);
        localStorage.setItem("nickname", nickname);
        localStorage.setItem("profilePicture", profilePicture);
        localStorage.setItem("domainId", domainId); // domainId 저장

        // Redux에 사용자 정보 저장
        dispatch(
          setUser({
            email: response.data.email,
            nickname: response.data.nickname,
            token: response.data.token,
            profileImage: response.data.profileImage, // 선택
            domainId: response.data.domainId,
          })
        );

        // 페이드 아웃 애니메이션 및 페이지 전환
        setTimeout(() => {
            setFadeOut(true); // 페이드 아웃 시작
            setTimeout(() => navigate('/MyPage'), 500); // 마이페이지로 이동
        }, 2000); // 로딩 지속 시간
      }  else {
        alert("로그인 실패");
        setIsLoading(false); // 로딩 종료
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("로그인 중 오류가 발생했습니다.");
      setIsLoading(false); // 로딩 종료
    }
  };

  return (
    <Background type="white">
      <Page className="login-page" scrollable={false}>
        <div>
          <BackButton variant="middle" />
        </div>
        <div id="login-page">
          <div className="fade-in">
            <div className="login-container">
              <div className="login-header"><h1>Christian to God</h1></div>
              <div className="login-logo"><img src={ImageSheep} alt="ctg_logo" /></div>
              <form className="login-form" onSubmit={handleLogin}>
                <div className="input-group">
                  <label htmlFor="email">ID</label>
                  <input
                    type="text"
                    id="email"
                    placeholder="이메일을 입력하세요"
                    value={email}
                    onChange={(e) => setEmailInput(e.target.value)}
                  />
                </div>
                <div className="input-group">
                  <label htmlFor="password">PW</label>
                  <input
                    type="password"
                    id="password"
                    placeholder="비밀번호를 입력하세요"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <button type="submit" className="login-button">로그인</button>
              </form>
              <div className="loginPage-buttons">
                <div className="login-find">
                  <a href="/find-account">아이디/비밀번호 찾기</a>
                </div>
              </div>
              <div className="footer_InitScreen">
                <p>© 2024-{new Date().getFullYear()} CodeQuest. All rights reserved.</p>
              </div>
            </div>
          </div>
        </div>
      </Page>
    </Background>
  );
};

export default LoginPage;
