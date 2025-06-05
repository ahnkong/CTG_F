import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import 'styles/layouts/topBackBar.css';
import IconBackButton from 'assets/icon/IconBackButton.png';

const TopBackBar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const getTitleFromPath = (path) => {
    if (path.includes('/notice')) return '공지 게시판';
    if (path.includes('/board')) return '자유 게시판';
    if (path.includes('/newsletter')) return '주보 게시판';
    if (path.includes('/video')) return '영상 예배 게시판';
    return '글쓰기';
  };

  const title = getTitleFromPath(location.pathname);

  return (
    <div className="top-back-bar">
     <img className="top-back-button" src={IconBackButton} alt="뒤로가기" onClick={() => navigate(-1)}/>
         <h2 className="top-title">{title}</h2>
    </div>
  );
};

export default TopBackBar;
