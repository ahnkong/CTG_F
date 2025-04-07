import { useNavigate } from "react-router-dom";
import React, { useState } from "react";

import IconBackButton from "assets/icon/IconBackButton.png";
import IconMenu from "assets/icon/IconMenu.png";
import "styles/layouts/hearderChurchType.css"; // 따로 CSS 분리

const Hearder_ChuchType = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="chuch-header-wrapper">
      <div className="chuch-header">
        {/* <img
          src={IconBackButton}
          alt="뒤로 가기"
          className="back-button"
          onClick={() => navigate("/menu")}
        /> */}
        <p className="chuch-title">숭신교회</p>
        <div className="chuch-menu">
          <img
            src={IconMenu}
            alt="메뉴 아이콘"
            className="IconMenu"
            onClick={() => setMenuOpen(!menuOpen)}
          />
        </div>
      </div>

      {menuOpen && (
        <div className="dropdown-menu">
          <button onClick={() => navigate("/bibleStudy")}>🏠 주제 선택</button>
          <button onClick={() => navigate("/search")}>🔍 리스트로</button>
        </div>
      )}
    </div>

  );
};

export default Hearder_ChuchType;
