import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";


const FloatingButton = () => {
  const [expanded, setExpanded] = useState(false); // 확장 상태
  const userId = useSelector((state) => state.auth.userId);
  const navigate = useNavigate();

  if (!userId) {
    return null; // 로그인되지 않은 경우 버튼 렌더링 안 함
  }
  

  const handleClick = () => {
    if (!expanded) {
      // 버튼 확장
      setExpanded(true);
    } else {
      // 확장 상태에서 클릭 시 이동
      navigate("/create");
    }
  };

  return (
    <button
      onClick={handleClick}
      onMouseLeave={() => setExpanded(false)} // 마우스 떠나면 축소
      style={{
        position: "fixed",
        bottom: "40px",
        right: "40px",
        padding: "10px",
        borderRadius: expanded ? "30px" : "50%", // 확장 시 둥글기 변경
        backgroundColor: "transparent",
        color: "white",
        border: "none",
        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
        cursor: "pointer",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: expanded ? "200px" : "60px", // 확장 시 너비 증가
        height: "60px",
        transition: "all 0.3s ease-in-out", // 부드러운 애니메이션
      }}
    >
      <img
        src={`${process.env.PUBLIC_URL}/fireboyreal.png`} // public 경로 이미지
        alt="icon"
        style={{
          width: "80px",
          height: "80px",
          marginRight: expanded ? "10px" : "0", // 확장 시 간격 추가
          transition: "margin 0.3s ease-in-out", // 부드러운 이동
        }}
      />
      {expanded && <span style={{ color: "white", fontSize: "16px" }}>글쓰기</span>}
    </button>
  );
};

export default FloatingButton;
