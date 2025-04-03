import React, { useState } from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';
import axios from 'axios';

function FindId({ onClose }) {
  const [formData, setFormData] = useState({ name: '', phone: '', mail: '' });
  const [responseMessage, setResponseMessage] = useState('');

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFindIdSubmit = async () => {
    try {
      const response = await axios.post('/api/v1/auth/findId', null, { params: formData });
      if (response.data.username) {
        setResponseMessage(`아이디는 "${response.data.username}" 입니다.`);
      } else {
        setResponseMessage('일치하는 사용자를 찾을 수 없습니다.');
      }
    } catch (error) {
      setResponseMessage('오류가 발생했습니다.');
    }
  };

  return (
    <Box>
      <TextField
        label="이름"
        name="name"
        fullWidth
        margin="normal"
        onChange={handleInputChange}
      />
      <TextField
        label="핸드폰 번호"
        name="phone"
        fullWidth
        margin="normal"
        onChange={handleInputChange}
      />
      <TextField
        label="이메일"
        name="mail"
        fullWidth
        margin="normal"
        onChange={handleInputChange}
      />
      <Button onClick={handleFindIdSubmit} fullWidth variant="contained" sx={{ mt: 2 }}>
        아이디 찾기
      </Button>
      {responseMessage && (
        <Typography variant="body1" sx={{ mt: 2, color: 'green' }}>
          {responseMessage}
        </Typography>
      )}
      <Button onClick={onClose} fullWidth sx={{ mt: 2 }}>
        닫기
      </Button>
    </Box>
  );
}

export default FindId;
