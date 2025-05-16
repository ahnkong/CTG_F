import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axios from 'axios';

import IconSearch from "assets/icon/IconSearch.png";
import IconHome from "assets/icon/IconHome.png";
import IconPen from "assets/icon/IconPen.png";
import "styles/layouts/hearderChurchType.css";

const Hearder_ChurchType = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userId = useSelector(state => state.auth?.userId);
  const domainId = useSelector(state => state.auth?.domainId);
  const [domainName, setDomainName] = useState('');

  // 로그인 상태 복구 (필요하다면 유지)
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUserId = localStorage.getItem("userId");
    if (!userId && token && storedUserId) {
      dispatch({ type: "SET_USER_ID", payload: storedUserId });
    }
  }, [userId, dispatch]);

  // 도메인 이름 가져오기
  useEffect(() => {
    if (domainId) {
      axios.get(`/api/v1/domain/${domainId}`)
        .then(res => setDomainName(res.data.domainName))
        .catch(() => setDomainName(''));
    }
  }, [domainId]);

  return (
    <div className="church-header-wrapper">
      <div className="church-header">
        <p className="church-title">{domainName || "교회 이름"}</p>
        <div className="church-icons">
          <img
            src={IconHome}
            alt="홈"
            className="icon-button"
            onClick={() => navigate("/menu")}
          />
          <img
            src={IconPen}
            alt="글쓰기"
            className="icon-button"
            onClick={() => navigate("/create")}
          />
          <img
            src={IconSearch}
            alt="검색"
            className="icon-button"
            onClick={() => navigate("/search")}
          />
        </div>
      </div>
    </div>
  );
};

export default Hearder_ChurchType;
