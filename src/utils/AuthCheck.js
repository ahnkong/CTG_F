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
        if (response.data && response.data.email) { // email 값이 있는지 확인
          const userData = await axios.get(`http://localhost:8080/api/v1/users/profile/${response.data.email}`);
          
          dispatch(
            setUser({
              email: userData.data.email,
              nickname: userData.data.nickname,
              profileImage: userData.data.profileImage,
            })
          );
        }
      } catch (error) {
        console.error("인증 확인 실패:", error.response?.data || error.message);
      }
    };

    checkAuth();
  }, [dispatch]);

  return null;
};

export default AuthCheck;