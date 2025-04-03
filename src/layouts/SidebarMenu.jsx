import React from "react";
import { Drawer, Box, Grid, IconButton, Typography, Button } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";
// import Main from "../main/main";
import { useLocation } from 'react-router-dom';

// 메뉴 데이터 정의
const menuData = [
  // { label: "지옥도", path: "/sevenHell", icon: "/hellIcon.png" },
  // { label: "유튜브VOD", path: "/YouTubeEmbed", icon: "/thumbnail.png" },
  // { label: "Live", path: "/YoutubeLive", icon: "/Vod.png" },
  // { label: "메인으로", path: "/main", icon : "/casper.png"},
  { label: "마이페이지", path: "/MyPage", icon : "/fireboyreal.png" },
];




const SidebarMenu = ({ isOpen, toggleSidebar}) => {
  const location = useLocation();
  const navigate = useNavigate();

    const handleLogoClick = () => {
      const currentPath = window.location.pathname;

      if(currentPath === './main'){
        toggleSidebar();
        console.log('이미 메인페이지이므로, 사이드바를 닫습니다.');
      } else {
        //다른 페이지라면 메인으로 이동
        navigate('/main'); // 메인페이지로 이동
        console.log('Logo clicked! 메인으로 이동');
      }
    };
  
    

  // 메뉴 클릭 핸들러
  const handleMenuClick = (path) => {
    navigate(path); // 선택한 메뉴 경로로 이동
    toggleSidebar(); // 사이드바 닫기
  };

  

  return (
    <>
      {/* 메뉴 아이콘 */}
      <div
        style={{
          position: "absolute",
          top: "18px",
          left: "12px",
          cursor: "pointer",
          fontSize: "20px",
          display: "flex", // Flexbox 활성화
          alignItems: "center", // 수직 정렬
          justifyContent: "center", // 가로 정렬
          color: "#83E3E9",
          zIndex: 1,
        }}
        onClick={toggleSidebar}
      > 
        <MenuIcon fontSize="large" />
      </div>

      {/* Drawer */}
      <Drawer
        anchor="left"
        open={isOpen}
        onClose={toggleSidebar}
        sx={{
          "& .MuiDrawer-paper": {
            width: "100vw", // Drawer 너비
            // maxWidth: "500px",
            backgroundColor: "#1E1E1E", // 배경 색상
            backgroundImage: `url(./loading_background)`,
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
          }}
        >
          {/* 상단 영역 */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              px: 2,
              py: 1,
              height: "10vh",
            }}
          >
            <img
              src="/logo.png"
              alt="Logo"
              style={{ height: "70px", cursor: "pointer" }}
              onClick={() => {
                console.log("Click event triggered!");
                handleLogoClick();
              }}
            />
            <IconButton onClick={toggleSidebar} sx={{ color: "#83E3E9" }}>
              <CloseIcon sx={{ fontSize: 30 }} />
            </IconButton>
          </Box>

          {/* 첫 번째 박스 */}
            <Box
              sx={{
                display: "flex",
                position: "relative",
                backgroundImage: `url('/hellmap8.png')`,
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                backgroundColor: "rgba(0, 0, 0, 0.5)", // 투명한 배경색
                backgroundBlendMode: "overlay", // 배경 이미지와 색상 혼합
                flexDirection: "column", // 세로 방향 정렬
                alignItems: "center", // 가로 중앙 정렬
                justifyContent: "center", // 세로 중앙 정렬
                backgroundColor: "#444",
                borderRadius: "16px",
                padding: "24px",
                margin: "16px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
              }}
              onClick={() => handleMenuClick(menuData[0].path)}
            >
              <img
                src={menuData[0].icon}
                alt={menuData[0].label}
                style={{
                  width: "80px",
                  height: "80px",
                  marginBottom: "8px", // 아이콘과 텍스트 사이 간격
                }}
              />
              <Typography
                variant="body6"
                sx={{
                  padding : "6px 10px 6px 10px",
                  fontWeight : "bold",
                  color: "white",
                  backgroundColor : "black",
                  borderRadius : "20px",
                  textAlign: "center",
                }}
              >
                {menuData[0].label}
              </Typography>
            </Box>


          {/* 두 번째 박스 */}
          <Box
            sx={{
              display: "flex",
              backgroundImage: `url('/hellmap4.png')`,
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              backgroundColor: "rgba(0, 0, 0, 0.5)", // 투명한 배경색
              backgroundBlendMode: "overlay", // 배경 이미지와 색상 혼합
              justifyContent: "space-around",
              backgroundColor: "#444",
              borderRadius: "16px",
              padding: "24px",
              margin: "16px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
            }}
          >
            {/* slice(시작, 끝_포함되지는 않음) -> 1,2를 포함하고 싶으면 1,3 이렇게 설정하면 3은 포함되지 않으므로 1,2만 저장됨 */}
            {menuData.slice(1, 3).map((menu, index) => (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  cursor: "pointer",
                }}
                onClick={() => handleMenuClick(menu.path)}
              > 
                <img
                  src={menu.icon}
                  alt={menu.label}
                  style={{
                    width: "80px",
                    height: "80px",
                    marginBottom: "8px",
                    borderRadius : "20px",
                  }}
                />
                <Typography
                  variant="body2"
                  sx={{
                    padding : "6px 10px 6px 10px",
                    fontWeight : "bold",
                    color: "white",
                    backgroundColor : "black",
                    borderRadius : "20px",
                    textAlign: "center",
                  }}
                >
                  {menu.label}
                </Typography>
              </Box>
            ))}
          </Box>


          {/* 세 번째 박스 */}
          <Box
            sx={{
              display: "flex",
              backgroundImage: `url('/hellmap3.png')`,
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              backgroundColor: "rgba(0, 0, 0, 0.5)", // 투명한 배경색
              backgroundBlendMode: "overlay", // 배경 이미지와 색상 혼합
              justifyContent: "space-around",
              backgroundColor: "#444",
              borderRadius: "16px",
              padding: "24px",
              margin: "16px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
            }}
          >
            {menuData.slice(3, 5).map((menu, index) => (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  cursor: "pointer",
                }}
                onClick={() => handleMenuClick(menu.path)}
              >
                <img
                  src={menu.icon}
                  alt={menu.label}
                  style={{
                    width: "80px",
                    height: "80px",
                    marginBottom: "8px",
                    borderRadius : "20px",
                  }}
                />
                <Typography
                  variant="body2"
                  sx={{
                    padding : "6px 10px 6px 10px",
                    fontWeight : "bold",
                    color: "white",
                    backgroundColor : "black",
                    borderRadius : "20px",
                    textAlign: "center",
                  }}
                >
                  {menu.label}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Drawer>
    </>
  );
};

export default SidebarMenu;










