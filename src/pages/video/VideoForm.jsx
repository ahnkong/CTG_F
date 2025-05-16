import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import '../../styles/video/VideoForm.css';

const VideoForm = () => {
  const navigate = useNavigate();
  const { userId, domainId } = useSelector((state) => state.auth || {});

  const [formData, setFormData] = useState({
    title: '',
    subTitle: '',
    reference: '',
    videoDate: '',
    peacher: '',
    videoUrl: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId || !domainId) {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }

    try {
      const response = await axios.post('/api/videos', {
        ...formData,
        domainId
      }, {
        params: { userId }
      });
      
      if (response.status === 200) {
        alert('비디오가 성공적으로 등록되었습니다.');
        navigate('/churchVideo');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      if (error.response?.status === 403) {
        alert('비디오 게시판에 대한 권한이 없습니다.');
      } else {
        alert('비디오 등록 중 오류가 발생했습니다.');
      }
    }
  };

  return (
    <div className="video-form-page">
      <div className="video-form-wrapper">
        <div className="video-form-container">
          <h2>예배 영상 등록</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="title">제목</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="subTitle">부제목</label>
              <input
                type="text"
                id="subTitle"
                name="subTitle"
                value={formData.subTitle}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="reference">참고 구절</label>
              <input
                type="text"
                id="reference"
                name="reference"
                value={formData.reference}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="videoDate">예배 날짜</label>
              <input
                type="date"
                id="videoDate"
                name="videoDate"
                value={formData.videoDate}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="peacher">설교자</label>
              <input
                type="text"
                id="peacher"
                name="peacher"
                value={formData.peacher}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="videoUrl">비디오 URL</label>
              <input
                type="url"
                id="videoUrl"
                name="videoUrl"
                value={formData.videoUrl}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-buttons">
              <button type="button" onClick={() => navigate('/video')} className="cancel-button">
                취소
              </button>
              <button type="submit" className="submit-button">
                등록
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VideoForm; 