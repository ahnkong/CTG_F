import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "styles/layouts/bottomNav.css";
import IconHome from "assets/icon/IconHome.png";
import IconMenu from "assets/icon/IconMenu.png";
import IconUser from "assets/icon/IconUser.png";
import IconShopping from "assets/icon/IconShopping.png";
import Logo_positive from "assets/logo/logo_positive.png";
import Logo_negative from "assets/logo/logo_negative.png";
import IconSearch from "assets/icon/IconSearch.png"

const BottomNav = ({ onLogoClick }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ 로고 상태를 관리 (true: Positive, false: Negative)
  const [isPositiveLogo, setIsPositiveLogo] = useState(true);

  const navItems = [
    { name: "메뉴", path: "/menu", icon: IconMenu },
    { name: "검색", path: "/search", icon: IconSearch },
    { name: "", path: "/menu", icon: isPositiveLogo ? Logo_positive : Logo_negative }, // ✅ 로고 변경
    { name: "쇼핑", path: "/pointMarket", icon: IconShopping },
    // { name: "", path: "/main", icon: isPositiveLogo ? Logo_positive : Logo_negative },
    // { name: "메뉴", path: "/menu", icon: IconMenu },
    { name: "마이페이지", path: "/mypage", icon: IconUser },
  ];

  // ✅ 로고 클릭 시 상태 변경 (Positive ↔ Negative)

  const toggleLogo = () => {
    setIsPositiveLogo((prev) => !prev);
    if (typeof onLogoClick === "function") {
      onLogoClick(isPositiveLogo ? "NEGATIVE" : "POSITIVE");
    } else {
      console.error("❌ onLogoClick is not a function!");
    }
  };
  

  return (
    <nav className="bottom-nav">
      {navItems.map((item, index) => (
        <button
          key={index}
          className={`nav-item
            ${item.icon === Logo_positive || item.icon === Logo_negative ? "logo-button" : ""}
            ${location.pathname === item.path ? "active" : ""}`}
          onClick={() => {
            if (item.name === "") {
              toggleLogo();
            } else {
              navigate(item.path);
            }
          }}
        >
          <img
            src={item.icon}
            alt={item.name}
            className={`nav-icon ${item.icon === Logo_positive || item.icon === Logo_negative ? "logo-icon" : ""}`}
          />
        </button>
      ))}
    </nav>
  );
};

export default BottomNav;