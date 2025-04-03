const initialState = {
  userId: null,
  nickname: null,
  point: null,
  isAuthenticated: false,
  nickname: null,
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
    case 'LOGOUT':
      localStorage.removeItem("token"); // 로그아웃 시 토큰 삭제
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
export default userReducer;