import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';

import { setUser } from 'reducers/userReducer'
import { setUserId } from 'actions/userActions.js';

const AuthCheck = () => {
  const dispatch = useDispatch();

  useEffect(() => { 
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("토큰이 없습니다. 다시 로그인해주세요.");
        return;
      }

      try {
        const response = await axios.get("http://localhost:8080/api/v1/auth/check", {
          headers: {
            Authorization: `Bearer ${token}`, // JWT 토큰을 Authorization 헤더로 전달
          },
        });

        // 인증 성공 시 사용자 데이터를 Redux에 저장
        if (response.data) {
          dispatch(
            setUser({
              userId: response.data.userId,
              nickname: response.data.nickname,
              profileImage: response.data.profileImage,
            })
          );
        }
      } catch (error) {
        console.error("인증 확인 실패:", error.response?.data || error.message);
      }
    };


    checkAuth();
  }, [dispatch]);

  return null; // 이 컴포넌트는 렌더링되지 않음
};

export default AuthCheck;