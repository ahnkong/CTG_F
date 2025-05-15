const initialState = {
  userId: 0,
  nickname: null,
  isAuthenticated: false,
  profilePicture: null,
};
const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_USER':
      return {
        ...state,
        userId: action.payload.userId,
        nickname: action.payload.nickname,
        profilePicture: action.payload.profileImage,
        isAuthenticated: true,
      };
    case 'SET_USER_ID':              // ← 이 부분 추가
      return {
        ...state,
        userId: action.payload,
        isAuthenticated: true,       // 원하시면 인증 상태도 true로
      };
    case 'LOGOUT':
      localStorage.removeItem("token"); // 로그아웃 시 토큰 삭제
      return initialState;

    case 'CLEAR_USER':        // ← 추가!
       localStorage.removeItem("token"); // 로그아웃 시 토큰 삭제
       localStorage.removeItem("userData"); // 로그아웃 시 토큰 삭제

      return initialState;
    
    default:
      return state;
  }
};
// 액션 크리에이터 정의
export const setUser = (user) => ({
  type: 'SET_USER',
  payload: user,
});
export const logout = () => ({
  type: 'LOGOUT',
});

export const clearUser = () => ({    // ← 추가!
  type: 'CLEAR_USER'
});

export default userReducer;