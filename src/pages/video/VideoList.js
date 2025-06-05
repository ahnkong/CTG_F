import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import '../../styles/video/videoList.css';
import Hearder_ChuchType from '../../layouts/Hearder_ChurchType';
import BottomNav from '../../layouts/BottomNav';

const VideoList = () => {
  const navigate = useNavigate();
  const { userId, domainId } = useSelector((state) => state.auth || {});
  const [videos, setVideos] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [domainName, setDomainName] = useState('');
  const fetchVideos = useCallback(async () => {
    if (!domainId) return;
    try {
      setLoading(true);
      const response = await axios.get('/api/videos', {
        params: {
          domainId,
          sort: 'videoDate',
          userId
        }
      });
      if (response.data) {
        if (currentPage === 0) {
          setVideos(response.data);
        } else {
          setVideos(prev => [...prev, ...response.data]);
        }
      }
    } catch (error) {
      console.error('Error fetching videos:', error);
    } finally {
      setLoading(false);
    }
  }, [domainId, currentPage]);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  useEffect(() => {
    if (!domainId) return;
    axios.get(`/api/v1/domain/${domainId}`)
      .then(res => {
        setYoutubeUrl(res.data.youtubeUrl || '');
        setDomainName(res.data.domainName || '');
      })
      .catch(() => {
        setYoutubeUrl('')
        setDomainName('')
      });
  }, [domainId]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 100 &&
        !loading &&
        currentPage + 1 < totalPages
      ) {
        setCurrentPage(prev => prev + 1);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, currentPage, totalPages]);

  const handleLike = async (boardId) => {
    if (!userId) {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }
    try {
      await axios.patch(
        `/api/v1/likes/VIDEO/${boardId}`,
        { userId }
      );
      // 프론트에서 바로 isLiked 토글
    setVideos(prev =>
      prev.map(video =>
        video.boardId === boardId
          ? { ...video, liked: !video.liked }
          : video
      )
    );
    } catch (error) {
      console.error('Error liking video:', error);
      if (error.response?.status === 403) {
        alert('비디오 게시판에 대한 권한이 없습니다.');
      }
    }
  };

  useEffect(() => {
    if (currentPage === 0 && !loading) {
      fetchVideos();
    }
    // eslint-disable-next-line
  }, [currentPage]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="video-page">
      {/* 상단 네비/교회명 */}
      <Hearder_ChuchType />
      <div className="video-list-wrapper">
        <div className="video-list-container">
          <div
            className="video-youtube-card"
            onClick={() => {
              window.open(youtubeUrl || 'https://www.youtube.com/', '_blank');
            }}
            style={{ cursor: 'pointer' }}
          >
            <span className="video-youtube-icon" />
            <div>
              <div className="video-youtube-title">{domainName}</div>
              <div className="video-youtube-desc">유튜브 채널 바로가기</div>
            </div>
          </div>
          {loading && videos.length === 0 ? (
            <div className="loading">로딩 중...</div>
          ) : (
            <div className="video-list">
              {videos.map((video) => (
                <div
                  key={video.boardId}
                  className="video-card"
                  onClick={() => {
                    if (video.videoUrl) {
                      window.open(video.videoUrl, '_blank');
                    }
                  }}
                  style={{ cursor: video.videoUrl ? 'pointer' : 'default' }}
                >
                  <div className="video-card-title-row">
                    <h3 className="video-card-title">{video.title}</h3>
                    <div className="video-likes" onClick={e => { e.stopPropagation(); handleLike(video.boardId); }}>
                      <span className={`video-like-icon${video.liked ? ' liked' : ''}`}></span>
                    </div>
                  </div>
                  {video.subTitle && <div className="video-card-subtitle">{video.subTitle}</div>}
                  <div className="video-card-info-row">
                    <div className="video-card-info-left">
                      <div>본문</div>
                      <div>예배일</div>
                      <div>설교자</div>
                    </div>
                    <div className="video-card-info-right">
                      <div>{video.reference}</div>
                      <div>{formatDate(video.videoDate)}</div>
                      <div className="video-card-preacher">{video.peacher}</div>
                    </div>
                  </div>
                </div>
              ))}
              {loading && videos.length > 0 && (
                <div className="loading">불러오는 중...</div>
              )}
            </div>
          )}
        </div>
      </div>
      <BottomNav />
    </div>
  );
};

export default VideoList; 