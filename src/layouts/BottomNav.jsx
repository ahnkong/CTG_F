import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "styles/layouts/bottomNav.css";
import IconMenu from "assets/icon/IconMenu.png";
import IconUser from "assets/icon/IconUser.png";
import IconSearch from "assets/icon/IconSearch.png"
import IconStudy from "assets/icon/IconStudyButton.png"
import IconCompany from "assets/icon/IconCompany.png"

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { name: "메뉴", path: "/menu", icon: IconMenu },
    { name: "성경공부", path: "/BibleStudy", icon: IconStudy},
    { name: "검색", path: "/search", icon: IconSearch },
    { name: "회사소개", path: "/company", icon: IconCompany },
    { name: "마이페이지", path: "/mypage", icon: IconUser },
  ];

  return (
    <nav className="bottom-nav">
      {navItems.map((item, index) => (
        <button
          key={index}
          className={`nav-item ${location.pathname === item.path ? "active" : ""}`}
          onClick={() => navigate(item.path)}
        >
          <img
            src={item.icon}
            alt={item.name}
            className="nav-icon"
          />
        </button>
      ))}
    </nav>
  );
};

export default BottomNav;