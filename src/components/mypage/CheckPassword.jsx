

import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import "styles/components/checkPassword.css";
import Background from "context/Background.jsx";
import Page from "components/styles/Page.jsx";
import BackButton from "components/Buttons/BackButton";

const CheckPassword = () => {
  const navigate = useNavigate();
  const { field } = useParams(); // ✅ 수정하려는 항목 받기
  const userId = useSelector((state) => state.auth?.userId || null);
  const [inputPassword, setInputPassword] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const passwordInputRef = useRef(null); // ✅ input 요소 참조

  useEffect(() => {
    passwordInputRef.current?.focus(); // ✅ 페이지 진입 시 자동 포커스
  }, []);


  const handlePasswordCheck = async () => {
    if (!userId) {
      console.error("userId가 없습니다.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("토큰이 없습니다. 다시 로그인해주세요.");
        return;
      }

      const response = await fetch(
        `http://localhost:8080/api/v1/user/${userId}/checkPassword`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // ✅ 토큰 추가
          },
          body: JSON.stringify({ password: inputPassword }),
        }
      );

      if (!response.ok) {
        throw new Error("비밀번호를 다시 확인해주세요.");
      }

      const result = await response.json();

      if (result.isValid === "true") {
        navigate(`/ProfileInfo`); // ✅ 프로필 페이지로 이동
      } else {
        setPasswordError(true);
      }
    } catch (error) {
      console.error("Error checking password:", error.message);
      setPasswordError(true);
    }
  };


  return (
    <Background type="gray">
      <Page scrollable={false} id="checkPassword">
        <section className="check-password-container">
            <div>
              <BackButton className="back-button"/>
            </div>
          <h2 className="check-password-title">비밀번호 확인</h2>
          <p className="check-password-description">개인정보 보호를 위해 비밀번호를 다시 입력해주세요.</p>

          <input
            type="password"
            className="check-password-input"
            placeholder="비밀번호 입력"
            value={inputPassword}
            onChange={(e) => setInputPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handlePasswordCheck()} // ✅ 엔터 키 입력 시 확인 버튼 실행
            ref={passwordInputRef} // ✅ 자동 포커스 설정
          />

          {passwordError && (
            <p className="check-password-error">비밀번호가 일치하지 않습니다.</p>
          )}
          <div className="check-password-buttons">
            <button className="check-password-cancel" onClick={() => navigate(-1)}>취소</button>
            <button className="check-password-submit" onClick={handlePasswordCheck}>확인</button>
          </div>
        </section>
      </Page>
    </Background>
  );
};

export default CheckPassword;
