// 원복한거 클린한 코드
import React, { useState } from "react";
import { CSSTransition } from "react-transition-group";
import Page from "components/styles/Page";
import "styles/login/loginPage.css";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import ImageSheep from "assets/image/imageSheep.png";
import axios from "axios";
import BackButton from "components/Buttons/BackButton.jsx";
import Background from "context/Background.jsx";

const LoginPage = () => {
  const [inProp, setInProp] = useState(false);
  const [userId, setUserIdInput] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  React.useEffect(() => {
    setInProp(true); // 페이지 마운트 시 애니메이션 시작
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    localStorage.removeItem("persist:root"); // ✅ Redux persist 저장값 초기화
    setInProp(false); // 로그인 시 애니메이션 종료
 


    setTimeout(async () => {
      try {
        const response = await axios.post(
          "http://localhost:8080/api/v1/auth/login",
          { userId, password },
          { withCredentials: true }
        );
        if (response.data.token) {
          console.log("✅ 로그인 성공, 받아온 데이터:", response.data); // 👈 콘솔로 확인해보기

          // ✅ 이전 로그인 정보 초기화
          localStorage.removeItem("persist:root");
          localStorage.removeItem("user");
          console.log("🧹 삭제 후 localStorage 상태:");
          console.log("persist:root →", localStorage.getItem("persist:root"));
          console.log("user →", localStorage.getItem("user"));


          // ✅ 새 로그인 정보 저장
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("userId", response.data.userId); // ✅ userId도 저장
          localStorage.setItem("nickname", response.data.nickname || ""); // 선택사항

          console.log("💾 저장 후 localStorage 상태:");
          console.log("token →", localStorage.getItem("token"));
          console.log("userId →", localStorage.getItem("userId"));
          console.log("nickname →", localStorage.getItem("nickname"));

          // ✅ Redux 상태도 업데이트
          dispatch({ 
            type: "SET_USER_ID", 
            payload: {
              userId: response.data.userId,
              nickname: response.data.nickname,
              token: response.data.token,
              }
          });
          navigate("/Menu");
        } else {
          alert("로그인 실패");
        }
      } catch (error) {
        console.error("Login error:", error);
      }
    }, 500); // 애니메이션 후 이동
  };

  return (
    <Background type="white">
      <Page className="login-page" scrollable={false} >
        {/* <div className="login-page-backbutton">
          <BackButton onClick={() => navigate(-1)} />
        </div> */}
        <div>
          <BackButton variant="middle" />
        </div>
        <div id="login-page">
          <div className="fade-in">
            <div className="login-container">
              <div className="login-header"><h1>Christian to God</h1>
              </div>
              <div className="login-logo"><img src={ImageSheep} alt="ctg_logo" /></div>
              <form className="login-form" onSubmit={handleLogin}>
                <div className="input-group">
                  <label htmlFor="userId">ID</label>
                  <input
                    type="text"
                    id="userId"
                    placeholder="아이디를 입력하세요"
                    value={userId}
                    onChange={(e) => setUserIdInput(e.target.value)}
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
                  <a href="/find-account">아이디/비밀번호 찾기</a></div>
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