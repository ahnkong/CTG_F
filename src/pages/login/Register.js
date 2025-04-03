import React, { useState } from 'react';
import axios from 'axios';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Divider,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  InputAdornment, // 추가
  IconButton, // 추가
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material'; // 추가
import { styled } from '@mui/system';
import { useNavigate } from 'react-router-dom';
import CheckPersonal from '../auth/CheckPersonal';

//-----------------------------------------------------------------
const BackgroundBox = styled(Box)({
  backgroundColor: '#000',
  paddingBottom: '10px',
  borderBottomLeftRadius: '50px',
  display: 'flex',
  maxWidth: '100vw',
  justifyContent: 'flex-start',
  alignItems: 'flex-start',
  flexDirection: 'column',
  position: 'relative',
  zIndex: 4,
});

const WhiteBox = styled(Box)({
  backgroundColor: '#fff',
  padding: '20px',
  zIndex: 3,
  position: 'relative',
  top: '-50px',
});



function Register() {
  const [formData, setFormData] = useState({
    userId: '',
    password: '',
    confirmPassword: '',
    name: '',
    email: '',
    tell: '',
    nickname: '',
    agreeToTerms: false,
    Marketing: null, // 초기값 설정
    local: 1, // 기본값 설정
  });


  //--------------------------------------------------
  const navigate = useNavigate();

  // 모달창
  const [openCheckPersonalModal, setOpenCheckPersonalModal] = useState(false);
  const handleOpenCheckPersonalModal = () => {
    setOpenCheckPersonalModal(true);
  };

  const handleCloseCheckPersonalModal = () => {
    setOpenCheckPersonalModal(false);
  };



  const [openPopup, setOpenPopup] = useState(false);

  // 아이디
  const [idMessage, setIdMessage] = useState(''); // 아이디 메시지 상태
  const [isIdValid, setIsIdValid] = useState(null); // 아이디 유효성 상태 (true/false/null)

  const validateId = (userId) => {
    const regex = /^[a-zA-Z]{4,}$/; // 4글자 이상, 영문만 허용
    if (!regex.test(userId)) {
      setIdMessage('아이디는 영문 4글자 이상이어야 합니다.');
      setIsIdValid(false);
    } else {
      setIdMessage('사용할 수 있는 아이디입니다.');
      setIsIdValid(true);
    }
  };
   // 이메일
   const [mailMessage, setMailMessage] = useState(''); // 아이디 메시지 상태
   const [isMailValid, setIsMailValid] = useState(null); // 아이디 유효성 상태 (true/false/null)
    // 닉네임
  const [nickNameMessage, setNickNameMessage] = useState(''); // 아이디 메시지 상태
  const [isNickNameValid, setIsNickNameValid] = useState(null); // 아이디 유효성 상태 (true/false/null)

  // 비밀번호 유효성 상태
  const [passwordValid, setPasswordValid] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  // 비밀번호 토글
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // 비밀번호 유효성 검사
  const validatePassword = (password) => {
    const minLength = /.{8,}/; // 8자 이상
    const hasNumber = /\d/; // 숫자 포함
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/; // 특수문자 포함

    if (!minLength.test(password)) {
      setPasswordValid(false);
      setPasswordError('비밀번호는 8자 이상이어야 합니다.');
    } else if (!hasNumber.test(password)) {
      setPasswordValid(false);
      setPasswordError('비밀번호에 숫자가 하나 이상 포함되어야 합니다.');
    } else if (!hasSpecialChar.test(password)) {
      setPasswordValid(false);
      setPasswordError('비밀번호에 특수문자가 하나 이상 포함되어야 합니다.');
    } else {
      setPasswordValid(true);
      setPasswordError('');
    }
  };
// 닉네임 유효성 검사 추가
  const validateNickName = (nickname) => {
    if (nickname.length < 2) {
      setNickNameMessage('닉네임은 2글자 이상이어야 합니다.');
      setIsNickNameValid(false);
    } else {
      setNickNameMessage('사용할 수 있는 닉네임입니다.');
      setIsNickNameValid(true);
    }
  };
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });

    if (name === 'password') {
      validatePassword(value); // 비밀번호 유효성 검사
    }

    // 아이디 변경 시 메시지 초기화
    if (name === 'userId') {
      setIdMessage('');
      setIsIdValid(null);
      validateId(value); // 유효성 검사 추가
    }
    
    // 이메일 변경 시 메시지 초기화
    if (name === 'email') {
      setMailMessage('');
      setIsMailValid(null);
    }

    
    // 닉네임 변경 시 메시지 초기화
    if (name === 'nickname') {
      setNickNameMessage('');
      setIsNickNameValid(null);
      validateNickName(value); // 유효성 검사 추가

    }
  };


        // 아이디 중복 확인 함수
        const checkIdDuplicate = async () => {
          console.log("Checking ID:", formData.userId); // 디버깅 로그
        
          if (!formData.userId) {
            setIdMessage("아이디를 입력하세요.");
            setIsIdValid(false);
            return;
          }
        
          validateId(formData.userId); // 유효성 검사
          if (!isIdValid) return; // 유효하지 않은 경우 API 호출 중단   

          try {
            const response = await axios.get("http://localhost:8080/api/v1/auth/checkId", {
              params: { userId : formData.userId },
            });
            console.log("Axios 응답:", response.data); // 응답 디버깅
            if (response.data) {
              setIdMessage("사용할 수 있는 아이디 입니다.");
              setIsIdValid(true);
              // 서버에서 true = 이미 사용 중인 아이디

            } else {
              // 서버에서 false = 사용 가능한 아이디
              setIdMessage("사용할 수 없는 아이디 입니다.");
              setIsIdValid(false);
            }
          } catch (error) {
            console.error("아이디 중복 확인 오류:", error);
            setIdMessage("아이디 중복 확인 중 문제가 발생했습니다.");
            setIsIdValid(false);
          }
        };

        // 메일 중복 확인 함수
        const checkMailDuplicate = async () => {
          console.log("Checking Mail:", formData.email); // 디버깅 로그
        
          if (!formData.email) {
            setMailMessage("이메일을 입력하세요.");
            setIsMailValid(false);
            return;
          }
        
          try {
            const response = await axios.get("http://localhost:8080/api/v1/auth/checkMail", {
              params: { email: formData.email },
            });
            console.log("Axios 응답:", response.data); // 응답 디버깅
            if (response.data) {
              setMailMessage("사용할 수 있는 이메일입니다.");
              setIsMailValid(true);
              // 서버에서 true = 이미 사용 중인 아이디
    
            } else {
              // 서버에서 false = 사용 가능한 아이디
              setMailMessage("이미 가입이 되어 있는 이메일 입니다.");
              setIsMailValid(false);
            }
          } catch (error) {
            console.error("이메일 중복 확인 오류:", error);
            setMailMessage("이메일 중복 확인 중 문제가 발생했습니다.");
            setIsMailValid(false);
          }
        };
          
        // 닉네임 중복 확인 함수
        const checkNickNameDuplicate = async () => {
          console.log("Checking nickname:", formData.nickname); // 디버깅 로그
        
          if (!formData.nickname) { 
            setNickNameMessage("닉네임을 입력하세요.");
            setIsNickNameValid(false);
            return;
          }
          validateNickName(formData.nickname); // 유효성 검사
          if (!isNickNameValid) return; // 유효하지 않은 경우 API 호출 중단


          try {
            const response = await axios.get("http://localhost:8080/api/v1/auth/checkNickName", {
              params: { nickname: formData.nickname },
            });
            console.log("Axios 응답:", response.data); // 응답 디버깅
            if (response.data) {
              setNickNameMessage("사용할 수 있는 닉네임입니다.");
              setIsNickNameValid(true);
              // 서버에서 true = 이미 사용 중인 아이디
    
            } else {
              // 서버에서 false = 사용 가능한 아이디
              setNickNameMessage("이미 사용 중인 닉네임 입니다..");
              setIsNickNameValid(false);
            }
          } catch (error) {
            console.error("닉네임 중복 확인 오류:", error);
            setNickNameMessage("닉네임 중복 확인 중 문제가 발생했습니다.");
            setIsNickNameValid(false);
          }
        };
  

    const handlePopupOpen = () => {
      setOpenPopup(true); // CheckPersonal 모달 열기
    };

    const handlePopupClose = (agree) => {
      setOpenPopup(false); // 모달 닫기
      setFormData((prevData) => ({
        ...prevData,
        agreeToTerms: agree.agreeToTerms, // 필수 동의 여부
        agreeMarketing: agree.agreeMarketing ? 1 : null, // 마케팅 동의 여부 (1 또는 null)
      }));
    };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert('비밀번호가 일치하지 않습니다. 다시 확인해주세요.');
      return;
    }

    if (!formData.agreeToTerms) {
      alert("개인정보 제공에 동의해야 회원가입이 가능합니다.");
      return;
    }

    const { userId, password, name, email, nickname, tell, agreeMarketing, local } = formData;

    try {
      const response = await axios.post('http://localhost:8080/api/v1/auth/register', {
        userId,
        password,
        name,
        email,
        nickname,
        tell,
        marketing: agreeMarketing, // 1 또는 null
        local, // 회원가입 방식 (local)
      });
    
      if (response.status === 201 || response.status === 200 ) {
        alert('회원가입이 완료되었습니다!');
        navigate('/');
      } else {
        alert('회원가입 실패');
      }
    } catch (error) {
      console.error('회원가입 오류:', error);
      alert('회원가입 요청 중 오류가 발생했습니다.');
    }
  };
  const handlePhoneVerification = () => {
    alert('핸드폰 본인 인증 절차를 진행합니다.');
  };



  return (
    <Box
      sx={{
        backgroundColor: '#000',
        minHeight: '100vh',
        textAlign: 'center',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Container sx={{ fullWidth: '100vw' }}>
        <BackgroundBox>
          <Typography variant="h4" fontWeight="bold" color="#00DFEE" sx={{ padding: '35px' }}>
            create account
          </Typography>
        </BackgroundBox>

        <WhiteBox>
          <form
            onSubmit={handleSubmit}
            style={{ width: '100%', marginTop: '30px', alignItems: 'center' }}
          >
            <TextField
              label="아이디"
              type="text"
              name="userId"
              value={formData.userId}
              onChange={handleChange}
              onBlur={checkIdDuplicate} // 입력 필드가 포커스를 잃을 때 중복 확인
              fullWidth
              required
              margin="normal"
              error={isIdValid === false} // 중복된 아이디일 경우 에러 표시
              helperText={idMessage} // 메시지 표시
            />

            <TextField
              label="비밀번호"
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              fullWidth
              required
              margin="normal"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              helperText={
                passwordError || (passwordValid ? '사용할 수 있는 비밀번호입니다.' : '')
              }
              error={!!passwordError}
            />
            <TextField
              label="비밀번호 확인"
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              fullWidth
              required
              margin="normal"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              helperText={
                formData.password &&
                formData.confirmPassword &&
                formData.password !== formData.confirmPassword
                  ? '비밀번호가 일치하지 않습니다.'
                  : passwordError || (passwordValid ? '비밀번호가 일치합니다.' : '')
              }
              error={
                formData.password &&
                formData.confirmPassword &&
                formData.password !== formData.confirmPassword
              }
            />

            <TextField
              label="이름"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              fullWidth
              required
              margin="normal"
            />
            <TextField
              label="핸드폰번호"
              type="text"
              name="tell"
              value={formData.tell}
              onChange={handleChange}
              fullWidth
              required
              margin="normal"
            />
            <TextField
              label="이메일"
              type="text"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={checkMailDuplicate} // 입력 필드가 포커스를 잃을 때 중복 확인
              fullWidth
              required
              margin="normal"
              error={isMailValid === false} // 중복된 아이디일 경우 에러 표시
              helperText={mailMessage} // 메시지 표시
            />
            <TextField
              label="닉네임"
              type="text"
              name="nickname"
              value={formData.nickname}
              onChange={handleChange}
              onBlur={checkNickNameDuplicate} // 입력 필드가 포커스를 잃을 때 중복 확인
              fullWidth
              required
              margin="normal"
              error={isNickNameValid === false} // 중복된 아이디일 경우 에러 표시
              helperText={nickNameMessage} // 메시지 표시
            />
            <Button
              variant="contained"
              onClick={handlePhoneVerification}
              fullWidth
              sx={{
                mt: 1,
                mb: 2,
                backgroundColor: '#00DFEE',
                color: '#000',
                '&:hover': { backgroundColor: '#00BBDD' },
                fontWeight: 'bold',
              }}
            >
              핸드폰 인증
            </Button>
           {/* 개인정보 동의 */}
          <FormControlLabel
            control={
              <Checkbox
                name="agreeToTerms"
                checked={formData.agreeToTerms}
                onClick={(e) => {
                  e.preventDefault();
                  handlePopupOpen(); // 모달 열기
                
                }}
              />
            }
            label={
              <Typography style={{ color: "black" }}>
              개인정보 제공에 동의하시겠습니까?
            </Typography>
            }
          />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={!passwordValid || formData.password !== formData.confirmPassword}
              sx={{
                mt: 2,
                backgroundColor: '#000',
                color: '#fff',
                '&:hover': { backgroundColor: '#333' },
              }}
            >
              회원가입
            </Button>
          </form>

          <Divider sx={{ mt: 3, mb: 1, color: '#333' }}>이미 계정이 있으신가요?</Divider>
          <Button
          variant="text"
          onClick={() => navigate('/')}
          sx={{ fontSize: '0.9em', color: '#333' }}
        >
          로그인 페이지로 이동
        </Button>

        </WhiteBox>
      </Container>
            <CheckPersonal open={openPopup} onClose={handlePopupClose} />
    </Box>
  );
}

export default Register;
