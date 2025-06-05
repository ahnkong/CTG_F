import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'styles/board/boardForm.css';
import Background from 'context/Background';
import Page from 'components/styles/Page';

const NewsletterUploadForm = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [content, setContent] = useState('');
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileUpload = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      const reader = new FileReader();
      reader.onload = () => {
        setFilePreview(reader.result);
      };
      reader.readAsDataURL(uploadedFile);
    }
  };

  const handleSubmit = async () => {
    if (!title || !date || !content || !file) {
      setError('제목, 날짜, 내용, 파일을 모두 입력해주세요.');
      return;
    }

    const userId = localStorage.getItem('userId'); // ✅ 로그인한 사용자 ID 가져오기
    if (!userId) {
      setError('로그인 정보가 없습니다. 다시 로그인 해주세요.');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('userId', userId);             // ✅ userId 추가
    formData.append('title', title);
    formData.append('bulletinDate', date);         // 프론트에서 보내는 날짜
    formData.append('content', content);
    formData.append('file', file);

    try {
      await axios.post("http://localhost:8080/api/bulletins", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      navigate('/newsletter');
    } catch (err) {
      console.error('업로드 실패:', err);
      setError('업로드 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Background type="white">
      <Page className="login-page" scrollable={true}>
        <div id="board-form-wrapper">
          <div className="board-form-container">
            <div className="board-form-cross-btn" onClick={() => navigate(-1)} />
            <div className="board-form-name">주보 업로드</div>
            <div className="board-form-submit-btn" onClick={handleSubmit}>
              {loading ? '업로드 중...' : '등록'}
            </div>
          </div>

          <div className="board-form-title">
            <input
              type="text"
              placeholder="제목을 입력하세요"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="board-form-title">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <div className="board-form-content">
            <textarea
              placeholder="내용을 입력하세요"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />

            {filePreview && (
              <div className="image-preview-container">
                <div className="image-preview">
                  <img src={filePreview} alt="미리보기" />
                </div>
              </div>
            )}
            {error && <div className="tag-error">{error}</div>}
          </div>

          <div className="board-form-footer">
            <div
              className="action-container"
              onClick={() => document.getElementById('file-input').click()}
            >
              <div className="image-icon"></div>
              <span className="action-text">파일 선택</span>
            </div>
            <input
              id="file-input"
              type="file"
              accept=".pdf,image/*"
              style={{ display: 'none' }}
              onChange={handleFileUpload}
            />
          </div>
        </div>
      </Page>
    </Background>
  );
};

export default NewsletterUploadForm;
