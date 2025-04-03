import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import SidebarMenu from "./SidebarMenu";
import CreateIcon from "@mui/icons-material/Create";

const Header = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // 사이드바 토글
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // 공통 스타일 정의
  const commonIconStyle = {
    position: "absolute",
    cursor: "pointer",
    display: "flex", // Flexbox 활성화
    alignItems: "center", // 수직 정렬
    justifyContent: "center", // 가로 정렬
    fontSize: "20px",
    color: "#83E3E9",
    zIndex: 1,
  };

  return (
    <header style={{ position: "relative", height: "8vh", width: "100vw" }}>
      {/* 메뉴 아이콘 */}
      <div
        style={{
          ...commonIconStyle,
          top: "18px",
          left: "12px",
        }}
        onClick={toggleSidebar}
      >
        <MenuIcon fontSize="large" />
      </div>

      {/* 사이드바 컴포넌트 */}
      <SidebarMenu isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* 배경 이미지 */}
      <img
        src="/assets/image/loading_background.gif"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100vw",
          height: "8vh",
          objectFit: "cover",
          zIndex: -1,
        }}
      />

      {/* 로고 */}
      <img
        // src="/fireboyreal.png"
        src="assets/image/logo.png"
        alt="Logo"
        style={{
          position: "absolute",
          height: "50px",
          top: "10px" ,
          left : "10px",
          display: "flex", // Flexbox 활성화
          alignItems: "center", // 수직 정렬
          justifyContent: "center", // 가로 정렬
          marginLeft: "50px",
          cursor: "pointer",
          zIndex: 1,
        }}
      />

      {/* '/main' 경로에서만 Create 아이콘 표시 */}
      {location.pathname === "/main" && (
        <div
          style={{
            ...commonIconStyle,
            top: "25px",
            right: "20px",
          }}
          onClick={() => navigate("/create")}
        >
          <CreateIcon fontSize="medium" />
        </div>
      )}
    </header>
  );
};

export default Header;
