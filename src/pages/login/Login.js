import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Container, Typography, TextField, Button, Divider,  Dialog, DialogTitle, DialogContent, DialogActions, } from '@mui/material';
import { styled } from '@mui/system';
import { useNavigate } from 'react-router-dom';
import login from 'styles/login/login.css'
import { useDispatch } from 'react-redux';
import { setUserId } from '../../actions/userActions';
import ResetPassword from '../auth/ResetPassword';
import FindId from '../auth/FindId';

const BackgroundBox = styled(Box)({
  backgroundColor: '#000',
  display: 'flex',
  maxWidth: '390px',
  maxHeight: '100',
//   flexDirection: 'column',
  position: 'relative',
  zIndex: 1, // 가장 아래 레이어
});

const WhiteBox = styled(Box)({
  backgroundColor: '#fff',
  borderTopLeftRadius: '100px',
  padding: '20px',
  maxHeight: '100vh',
  maxWidth: '100%',
  zIndex: 100,
  position: 'relative',
});

const OverlappingImage = styled(Box)({
  position: 'absolute',
  top: '-80px',
  // right: '90px',
  transform: 'translate(40%, 0)',
  zIndex: 2,
  width: '120px',
  height: 'auto',
});

function Login() {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태
  const [fadeOut, setFadeOut] = useState(false); // 페이드 아웃 상태
  const [fadeIn, setFadeIn] = useState(true); // 페이드 인 상태
  //아이디, 비밀번호 재설정

  const [isResetPasswordOpen, setIsResetPasswordOpen] = useState(false);

  const handleOpenResetPassword = () => setIsResetPasswordOpen(true);
  const handleCloseResetPassword = () => setIsResetPasswordOpen(false);

  const [modalType, setModalType] = useState(null); // "findId" or "resetPassword"
  const [formData, setFormData] = useState({
    userId: '',
    name: '',
    email: '',
    tell: '',
    password: '',
  }); // 공통 입력 데이터
  const [responseMessage, setResponseMessage] = useState(''); // 응답 메시지
  const [resetPasswordMode, setResetPasswordMode] = useState(false); // 비밀번호 재설정 모드
  const [newPassword, setNewPassword] = useState(''); // 새 비밀번호
  
    // 임시 비밀번호 이메일 발송
  const [user, setUser] = useState({
    userMail: '',
    useTel: '',
  })
  const navigate = useNavigate();
  const dispatch = useDispatch();

//   useEffect(() => {
//     if (!window.Kakao.isInitialized()) {
//       window.Kakao.init('9ad17f158e56a3e1472d0143dc6418b2');
//       console.log("Kakao SDK Initialized:", window.Kakao.isInitialized());
//     } else {
//       console.log("Kakao SDK already initialized.");
//     }

//     // 페이드 인 효과 시작
//     const fadeInTimeout = setTimeout(() => setFadeIn(false), 500); // 페이드 인 지속 시간
//     return () => clearTimeout(fadeInTimeout);
//   }, []);

  useEffect(() => {
    // if (!window.Kakao.isInitialized()) {
    //   window.Kakao.init('9ad17f158e56a3e1472d0143dc6418b2');
    //   console.log("Kakao SDK Initialized:", window.Kakao.isInitialized());
    // } else {
    //   console.log("Kakao SDK already initialized.");
    // }

    // 페이드 인 효과 시작
    const fadeInTimeout = setTimeout(() => setFadeIn(false), 500); // 페이드 인 지속 시간
    return () => clearTimeout(fadeInTimeout);
  }, []);

        // const handleKakaoLogin = () => {
        //   setIsLoading(true); // 로딩 시작
        //   window.Kakao.API.request({
        //     url: '/v2/user/me',
        //     success: (res) => {
        //       const profile = res.kakao_account.profile;
          
        //       console.log("닉네임:", profile.nickname);
        //       console.log("썸네일 이미지:", profile.thumbnail_image_url);
        //       console.log("고해상도 이미지:", profile.profile_image_url);
          
        //       if (profile.thumbnail_image_url) {
        //         // 썸네일 이미지 존재 시 처리
        //         console.log("Thumbnail Image URL:", profile.thumbnail_image_url);
        //       } else {
        //         console.warn("썸네일 이미지가 없습니다.");
        //       }
          
        //       if (profile.profile_image_url) {
        //         // 고해상도 이미지 존재 시 처리
        //         console.log("Profile Image URL:", profile.profile_image_url);
        //       } else {
        //         console.warn("프로필 이미지가 없습니다.");
        //       }
        //     },
        //     fail: (err) => {
        //       console.error("Kakao API Request Failed:", err);
        //     },
        //   });
          
        // };

        // const handleKakaoLogin = () => {
        //   setIsLoading(true); // 로딩 시작
      
        //   // Kakao 로그인 요청
        //   window.Kakao.Auth.login({
        //     scope: 'profile_nickname, profile_image',
        //     success: (authObj) => {
        //       console.log("Kakao Auth Success:", authObj);
      
        //       // 사용자 정보 요청
        //       window.Kakao.API.request({
        //         url: '/v2/user/me',
        //         success: async (res) => {
        //           const profile = res.kakao_account.profile;
        //           const kakaoUserData = {
        //             nickname: profile.nickname,
        //             thumbnailImageUrl: profile.thumbnail_image_url,
        //             profileImageUrl: profile.profile_image_url,
        //           };
      
        //           console.log("Kakao User Data:", kakaoUserData);
      
        //           // 서버로 전송
        //           try {
        //             const response = await axios.post('http://localhost:8080/kakaoLogin', kakaoUserData);
        //             // const response = await axios.post('http://192.168.45.217:8080/kakaoLogin', kakaoUserData);
        //             // const response = await axios.post('http://192.168.45.217:8080/kakaoLogin', 
        //             //   kakaoUserData, 
        //             //   {
        //             //     headers: {
        //             //       Host: '192.168.45.217:3000',
        //             //     },
        //             //   });
                    
        //             console.log("서버 응답:", response.data);
        //             alert("카카오 로그인 성공!");
        //             navigate('/main');
        //           } catch (error) {
        //             console.error("카카오 유저 저장 실패:", error);
        //             alert("카카오 로그인 중 문제가 발생했습니다.");
        //           } finally {
        //             setIsLoading(false); // 로딩 종료
        //           }
        //         },
        //         fail: (err) => {
        //           console.error("Kakao API Request Failed:", err);
        //           setIsLoading(false); // 로딩 종료
        //         },
        //       });
        //     },
        //     fail: (err) => {
        //       console.error("Kakao Login Failed:", err);
        //       setIsLoading(false); // 로딩 종료
        //     },
        //   });
        // };


        const handleFindIdSubmit = async () => {
          try {
              const response = await axios.post('/api/v1/user/findId', null, {
                  name: formData.name,
                  tell: formData.tell,
                  email: formData.email,
              });
      
              if (response.data.userId) {
                  setResponseMessage(`아이디는 "${response.data.userId}" 입니다.`);
              } else {
                  setResponseMessage('일치하는 사용자를 찾을 수 없습니다.');
              }
          } catch (error) {
              const errorMsg = error.response?.data?.message || '오류가 발생했습니다.';
              setResponseMessage(errorMsg);
          }
      };
    
    const handleNewPasswordSubmit = async () => {
      try {
          const response = await axios.post('/api/v1/auth/updatePassword', {
              id: formData.userId,
              newPassword,
          });
  
          if (response.data.message === '비밀번호 변경 성공') {
              alert('비밀번호가 성공적으로 변경되었습니다.');
              setResetPasswordMode(false); // 비밀번호 재설정 모드 비활성화
              setModalType(null); // 모달 닫기
          } else {
              setResponseMessage('비밀번호 변경 실패');
          }
      } catch (error) {
          alert('비밀번호 변경 중 오류가 발생했습니다.');
      }
  };


    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
      
    
    const handleResetPasswordSubmit = async () => {
        try {
            const response = await axios.post('/api/v1/auth/resetPassword', {
                name: formData.name,
                id: formData.userId,
                email: formData.email,
                password: formData.password, // 새 비밀번호를 기존 password 필드로 전송
            });
    
            if (response.data.message.includes('성공')) {
                alert('가입시 작성한 이메일로 임시비밀번호를 발급하였습니다.');
                setModalType(null); // 모달 닫기
            } else {
                alert(response.data.message);
            }
        } catch (error) {
            alert('오류가 발생했습니다.');
        }
    };

    const handleModalSubmit = async () => {
        try {
            const endpoint = modalType === 'findId' 
                ? '/api/v1/user/findId' 
                : '/api/v1/auth/resetPassword';
    
            const response = await axios.post(endpoint, null, {
                params: formData, // 쿼리 매개변수로 전달
            });
    
            // 성공 메시지 처리
            setResponseMessage(response.data.message); // 성공 메시지 설정
            if (modalType === 'findId' && response.data.userInfo) {
                setFormData({ ...formData, userInfo: response.data.userInfo }); // 아이디 저장
            }
            alert(response.data.message);
            setModalType(null); // 모달 닫지 않음, 텍스트 표시
        } catch (error) {
            const errorMsg = error.response?.data?.message || '오류가 발생했습니다.';
            setResponseMessage(errorMsg);
            alert(errorMsg);
        }
    };
    

const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true); // 로딩 시작
    try {
        const response = await axios.post('http://localhost:8080/api/v1/auth/login', { userId, password }, { withCredentials: true });
      console.log(response.data.userId)
      
      if (response.data.token) {
        // 서버에서 반환한 데이터
        const { userId, nickname, profilePicture, token } = response.data;

        // 토큰을 로컬 스토리지에 저장
        localStorage.setItem("token", token);
        localStorage.setItem("userId", userId);
        localStorage.setItem("nickname", nickname);
        localStorage.setItem("profilePicture", profilePicture);

        // Redux에 사용자 정보 저장
        dispatch({
            type: 'SET_USER',
            payload: { userId, nickname, profilePicture },
        });

        // 페이드 아웃 애니메이션 및 페이지 전환
        setTimeout(() => {
            setFadeOut(true); // 페이드 아웃 시작
            setTimeout(() => navigate('/MyPage'), 500); // 마이페이지로 이동
        }, 2000); // 로딩 지속 시간
      }  else {
        alert("로그인 실패");
        setIsLoading(false); // 로딩 종료
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("로그인 중 오류가 발생했습니다.");
      setIsLoading(false); // 로딩 종료
    }
  };

  return (
    <div id="root" isert={!!modalType} className={`login-container ${fadeIn ? 'fade-in' : ''} ${fadeOut ? 'fade-out' : ''}`}>
        {/* <div id="root" className={`login-container ${fadeIn ? 'fade-in' : ''} ${fadeOut ? 'fade-out' : ''}`}> 
        <div
        id="root"
        isert={!!modalType ? "true" : "false"}
        className={`login-container ${fadeIn ? 'fade-in' : ''} ${fadeOut ? 'fade-out' : ''}`}
        > */}
        {isLoading ? (
            <div className="loading-screen">
                <img src="/logo.png" alt="Loading..." className="loading-logo" />
            </div>
        ) : (
            <Box sx={{ backgroundColor: '#000', minHeight: '100%', textAlign: 'center', display: 'flex', justifyContent: 'center' }}>
                <Container sx={{ fullWidth: '100%', paddingTop: '40px' }}>
                    <BackgroundBox>
                        <Container sx={{ width: '100%', px: 6, pt: 7 }}>
                            <Typography variant="h4" fontWeight="bold" color="#00DFEE" align="left">
                                감정지옥에 ! <br />
                                오신걸 환영합니다!.
                            </Typography>
                        </Container>
                    </BackgroundBox>

                    <WhiteBox sx={{ marginTop: '70px' }}>
                        <OverlappingImage component="img" src="/logo192.png" alt="Logo" />
                        <Typography variant="h5" fontWeight="bold" align="center" sx={{ mb: 2, paddingTop: '20px', color: '#000' }}>
                            LOGIN
                        </Typography>
                        <form onSubmit={handleLogin}>
                            <TextField
                                label="아이디"
                                type="text"
                                value={userId}
                                fullWidth
                                onChange={(e) => setUserId(e.target.value)}
                                margin="normal"
                                required
                            />
                            <TextField
                                label="비밀번호"
                                type="password"
                                value={password}
                                fullWidth
                                onChange={(e) => setPassword(e.target.value)}
                                margin="normal"
                                required
                            />
                            <Button
                                type="submit"
                                variant="contained"
                                fullWidth
                                sx={{ mt: 2, backgroundColor: '#000', color: '#fff', '&:hover': { backgroundColor: '#333' } }}
                            >
                                Sign In
                            </Button>
                        </form>
                        <Box display="flex" justifyContent="space-between" mt={1} sx={{ fontSize: '0.9em', color: '#666' }}>
                            <Button variant="text" color="inherit" size="small" onClick={() => setModalType('findId')}>
                                아이디 찾기
                            </Button>
                            <Button variant="text" color="inherit" size="small" onClick={() => setModalType('resetPassword')}>
                                비밀번호 재설정
                            </Button>
                            <Button variant="text" color="inherit" size="small" onClick={() => navigate('/Register')}>
                                회원가입
                            </Button>
                        </Box>
                        <Divider sx={{ mt: 1, color: '#000', mb: 1 }}>SNS 계정으로 이용하기</Divider>
                        <Box display="flex" justifyContent="center" mt={1}>
                            <Button
                                variant="contained"
                                // onClick={handleKakaoLogin}
                                sx={{ backgroundColor: '#FEE500', color: '#000', '&:hover': { backgroundColor: '#FFD700' }, fontWeight: 'bold' }}
                                fullWidth
                            >
                                카카오로 로그인
                            </Button>
                        </Box>
                    </WhiteBox>
                </Container>
            </Box>
        )}

        {/* 아이디 찾기 및 비밀번호 재설정 모달 */}
        <Dialog open={!!modalType} onClose={() => setModalType(null)}>
    <DialogTitle>
        {modalType === 'findId' ? '아이디 찾기' : resetPasswordMode ? '새 비밀번호 입력' : '비밀번호 재설정'}
    </DialogTitle>
    <DialogContent>
        {modalType === 'findId' ? (
            <>
                <TextField
                    label="이름"
                    name="name"
                    fullWidth
                    margin="normal"
                    onChange={handleInputChange}
                />
                <TextField
                    label="핸드폰 번호"
                    name="tell"
                    fullWidth
                    margin="normal"
                    onChange={handleInputChange}
                />
                <TextField
                    label="이메일"
                    name="email"
                    fullWidth
                    margin="normal"
                    onChange={handleInputChange}
                />
                {responseMessage && (
                    <Typography variant="body1" sx={{ mt: 2, color: 'green' }}>
                        {responseMessage}
                    </Typography>
                )}
            </>
        ) : resetPasswordMode ? (
            <>
                <TextField
                    label="새 비밀번호"
                    type="password"
                    fullWidth
                    margin="normal"
                    onChange={(e) => setNewPassword(e.target.value)}
                />
                {responseMessage && (
                    <Typography variant="body1" sx={{ mt: 2, color: 'red' }}>
                        {responseMessage}
                    </Typography>
                )}
            </>
        ) : (
            <>
                <TextField
                    label="이름"
                    name="name"
                    fullWidth
                    margin="normal"
                    onChange={handleInputChange}
                />
                <TextField
                    label="아이디"
                    name="userId"
                    fullWidth
                    margin="normal"
                    onChange={handleInputChange}
                />
                <TextField
                    label="이메일"
                    name="email"
                    fullWidth
                    margin="normal"
                    onChange={handleInputChange}
                />
                <TextField
                    label="핸드폰 번호"
                    name="tell"
                    fullWidth
                    margin="normal"
                    onChange={handleInputChange}
                />
                
                {responseMessage && (
                    <Typography variant="body1" sx={{ mt: 2, color: 'green' }}>
                        {responseMessage}
                    </Typography>
                )}
            </>
        )}
    </DialogContent>
    <DialogActions>
        {modalType === 'findId' ? (
            <Button onClick={handleFindIdSubmit}>아이디 찾기</Button>
        ) : resetPasswordMode ? (
            <Button onClick={handleNewPasswordSubmit}>비밀번호 발급</Button>
        ) : (
            <Button onClick={handleResetPasswordSubmit}>임시비밀번호 발급</Button>
        )}
        <Button onClick={() => setModalType(null)}>로그인 하러 가기</Button>
    </DialogActions>
</Dialog>

    <div>
      <Dialog open={isResetPasswordOpen} onClose={handleCloseResetPassword}>
        <DialogContent>
          <ResetPassword onClose={handleCloseResetPassword} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseResetPassword}>닫기</Button>
        </DialogActions>
      </Dialog>
    </div>
    </div>

);

}

export default Login;
