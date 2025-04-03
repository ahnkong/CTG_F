import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import IconBackButton from "assets/icon/IconBackButton.png";
import IconMenu from "assets/icon/IconMenu.png";

const Header = ({ title, backPath }) => {
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <div className="header-container">
            {/* ✅ 뒤로 가기 버튼 */}
            <img
                src={IconBackButton}
                alt="뒤로 가기"
                className="back-button"
                onClick={() => navigate(backPath || "/menu")}
            />

            {/* ✅ 타이틀 */}
            <h1 className="title">{title}</h1>

            {/* ✅ 메뉴 아이콘 */}
            <div className="menu-container">
                <img
                    src={IconMenu}
                    alt="메뉴 아이콘"
                    className="IconMenu"
                    onClick={() => setMenuOpen(!menuOpen)}
                />
                {menuOpen && (
                    <div className="dropdown-menu">
                        <button onClick={() => navigate("/bibleStudy")}>🏠 주제 선택</button>
                        <button onClick={() => navigate(`/search`)}>🔍 리스트로</button>
                    </div>
                )}
            </div>
        </div>

    );
};

export default Header;