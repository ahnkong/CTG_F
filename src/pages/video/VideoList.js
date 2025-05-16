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

  const fetchVideos = useCallback(async () => {
    if (!domainId) return;
    try {
      setLoading(true);
      const response = await axios.get('/api/videos', {
        params: {
          domainId,
          page: currentPage,
          size: 10,
          sort: 'videoDate'
        }
      });
      if (response.data) {
        if (currentPage === 0) {
          setVideos(response.data.content);
        } else {
          setVideos(prev => [...prev, ...response.data.content]);
        }
        setTotalPages(response.data.totalPages);
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

  const handleLike = async (videoId) => {
    if (!userId) {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }
    try {
      const response = await axios.post(`/api/videos/${videoId}/like`, null, {
        params: { userId }
      });
      if (response.status === 200) {
        setCurrentPage(0); // 좋아요 후 목록 새로고침
      }
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
          <div className="video-list-header">
            <h2>예배 영상</h2>
          </div>
          {loading && videos.length === 0 ? (
            <div className="loading">로딩 중...</div>
          ) : (
            <div className="video-list">
              {videos.map((video) => (
                <div key={video.boardId} className="video-card">
                  <div className="video-card-info">
                    <h3>{video.title}</h3>
                    <div className="video-likes" onClick={() => handleLike(video.boardId)}>
                      <span className={`video-like-icon${video.isLiked ? ' liked' : ''}`}></span>
                    </div>
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
                    {video.subTitle && <div className="video-card-subtitle">{video.subTitle}</div>}
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