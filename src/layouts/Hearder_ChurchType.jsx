import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import IconMenu from "assets/icon/IconBurger.png";
import IconHome from "assets/icon/IconHome.png";
import IconPen from "assets/icon/IconPen.png";
import "styles/layouts/hearderChurchType.css";

const Hearder_ChuchType = () => {
  const [userData, setUserData] = useState({
    nickname: "",
    churchName: "",
  });

  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.auth?.userId || null);

  // ✅ Redux 초기화
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUserId = localStorage.getItem("userId");

    if (!userId && token && storedUserId) {
      dispatch({ type: "SET_USER_ID", payload: storedUserId });
    }
  }, [userId, dispatch]);

  // ✅ 사용자 정보 가져오기
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await fetch("http://localhost:8080/api/v1/auth/check", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error("사용자 인증 실패");

        const { userId } = await response.json();
        dispatch({ type: "SET_USER_ID", payload: userId });

        const userResponse = await fetch(`http://localhost:8080/api/v1/user/${userId}`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!userResponse.ok) throw new Error("사용자 정보를 가져올 수 없습니다.");

        const data = await userResponse.json(); // ✅ 여기!
        setUserData({
          nickname: data.nickname || "닉네임 없음",
          churchName: data.churchName || "교회가 없음",
        });
      } catch (error) {
        console.error("Error:", error.message);
      }
    };

    fetchUserData();
  }, [dispatch]);

  return (
    <div className="church-header-wrapper">
     <div className="church-header">
        <p className="church-title">{userData.churchName || "교회 이름"}</p>

        <div className="church-icons">
          <img
            src={IconHome}
            alt="홈"
            className="icon-button"
            onClick={() => navigate("/menu")}
          />
          <img
            src={IconPen}
            alt="홈"
            className="icon-button"
            onClick={() => navigate("/create")}
          />
          <img
            src={IconMenu}
            alt="메뉴"
            className="icon-button"
            onClick={() => setMenuOpen(!menuOpen)}
          />
        </div>
      </div>


      {/* {menuOpen && (
        <div className="dropdown-menu">
          <button onClick={() => navigate("/bibleStudy")}>🏠 주제 선택</button>
          <button onClick={() => navigate("/search")}>🔍 리스트로</button>
        </div>
      )} */}
    </div>
  );
};

export default Hearder_ChuchType;
