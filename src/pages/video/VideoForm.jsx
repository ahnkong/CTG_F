import React, { useState, useEffect } from 'react';
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

  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [showThumbnail, setShowThumbnail] = useState(false);

  // 유튜브 URL에서 비디오 ID를 추출하는 함수
  const extractYoutubeId = (url) => {
    try {
      const urlObj = new URL(url);
      if (urlObj.hostname.includes('youtube.com')) {
        return urlObj.searchParams.get('v');
      } else if (urlObj.hostname.includes('youtu.be')) {
        return urlObj.pathname.slice(1);
      }
    } catch (error) {
      return null;
    }
    return null;
  };

  // videoUrl이 변경될 때마다 썸네일 URL 업데이트
  useEffect(() => {
    const videoId = extractYoutubeId(formData.videoUrl);
    if (videoId) {
      setThumbnailUrl(`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`);
      setShowThumbnail(true);
    } else {
      setThumbnailUrl('');
      setShowThumbnail(false);
    }
  }, [formData.videoUrl]);

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

  const handleCancel = () => {
    navigate('/churchVideo');
  };

  return (
    <div className="video-form-page">
      <div className="video-form-wrapper">
        <div className="video-form-container">
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
              <label htmlFor="videoDate">예배 일자</label>
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
              <label htmlFor="reference">성경 말씀</label>
              <input
                type="text"
                id="reference"
                name="reference"
                value={formData.reference}
                onChange={handleChange}
                placeholder="성경 말씀을 입력하세요"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="subTitle">설교 제목</label>
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
              <label htmlFor="videoUrl">URL</label>
              <input    
                type="url"
                id="videoUrl"
                name="videoUrl"
                value={formData.videoUrl}
                onChange={handleChange}
                placeholder="유튜브 URL을 입력하세요"
                required
              />
            </div>

            {showThumbnail && (
              <div className="thumbnail-preview">
                <img src={thumbnailUrl} alt="비디오 썸네일" />
                <button
                  type="button"
                  className="thumbnail-cancel"
                  onClick={() => setShowThumbnail(false)}
                >
                  ✕
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
      <div className="video-form-footer">
        <div className="footer-buttons">
          <button className="cancel-button" onClick={handleCancel}>
            <span className="button-icon">✕</span>
            <span>취소</span>
          </button>
          <button className="submit-button" onClick={handleSubmit}>
            글 등록
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoForm; 