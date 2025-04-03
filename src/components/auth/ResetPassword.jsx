import React, { useState } from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';
import axios from 'axios';

function ResetPassword({ onClose }) {
  const [formData, setFormData] = useState({ phone: '', verificationCode: '', id: '', newPassword: '' });
  const [isCodeSent, setIsCodeSent] = useState(false); // 인증번호 발송 여부
  const [isCodeVerified, setIsCodeVerified] = useState(false); // 인증번호 확인 여부
  const [errorMessage, setErrorMessage] = useState(''); // 오류 메시지

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSendVerificationCode = async () => {
    try {
      await axios.post('/api/v1/auth/sendVerificationCode', { phone: formData.phone });
      setIsCodeSent(true);
      alert('인증번호가 발송되었습니다.');
    } catch (error) {
      setErrorMessage('인증번호 발송에 실패했습니다.');
    }
  };

  const handleVerifyCode = async () => {
    try {
      const response = await axios.post('/api/v1/auth/verifyCode', {
        phone: formData.phone,
        code: formData.verificationCode,
      });
      if (response.data.verified) {
        setIsCodeVerified(true);
        alert('인증이 완료되었습니다.');
      } else {
        setErrorMessage('인증번호가 일치하지 않습니다.');
      }
    } catch (error) {
      setErrorMessage('인증번호 확인 중 오류가 발생했습니다.');
    }
  };

  const handleNewPasswordSubmit = async () => {
    try {
      await axios.post('/api/v1/auth/updatePassword', {
        id: formData.id,
        newPassword: formData.newPassword,
      });
      alert('비밀번호가 성공적으로 변경되었습니다.');
      onClose(); // 부모 컴포넌트에서 모달 닫기
    } catch (error) {
      setErrorMessage('비밀번호 변경 중 오류가 발생했습니다.');
    }
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2 }}>
        비밀번호 재설정
      </Typography>

      {!isCodeVerified ? (
        <>
          <TextField
            label="핸드폰 번호"
            name="phone"
            fullWidth
            margin="normal"
            onChange={handleInputChange}
          />
          {isCodeSent && (
            <TextField
              label="인증번호"
              name="verificationCode"
              fullWidth
              margin="normal"
              onChange={handleInputChange}
            />
          )}
          {errorMessage && <Typography color="error">{errorMessage}</Typography>}
          {!isCodeSent ? (
            <Button
              onClick={handleSendVerificationCode}
              fullWidth
              sx={{ mt: 2 }}
              variant="contained"
            >
              인증번호 발송
            </Button>
          ) : (
            <Button
              onClick={handleVerifyCode}
              fullWidth
              sx={{ mt: 2 }}
              variant="contained"
            >
              인증번호 확인
            </Button>
          )}
        </>
      ) : (
        <>
          <TextField
            label="아이디"
            name="id"
            fullWidth
            margin="normal"
            onChange={handleInputChange}
          />
          <TextField
            label="새 비밀번호"
            name="newPassword"
            type="password"
            fullWidth
            margin="normal"
            onChange={handleInputChange}
          />
          {errorMessage && <Typography color="error">{errorMessage}</Typography>}
          <Button
            onClick={handleNewPasswordSubmit}
            fullWidth
            sx={{ mt: 2 }}
            variant="contained"
          >
            비밀번호 재설정
          </Button>
        </>
      )}
    </Box>
  );
}

export default ResetPassword;
