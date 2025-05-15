import React from 'react';
import '../../styles/video/videoList.css';
import BottomNav from 'layouts/BottomNav';
import Hearder_ChuchType from 'layouts/Hearder_ChurchType';

const VideoList = () => {
  // 예시 데이터 (실제 데이터 연동 전까지 하드코딩)
  const videoList = [
    {
      id: 1,
      title: '2025년 05월 11일 주일 예배',
      subtitle: '대충 이러저러 함',
      scripture: '창세기 28장 11-15절',
      date: '2025.05.11',
      preacher: '임형택 목사님',
      icon: '🙏',
      liked: true,
    },
    {
      id: 2,
      title: '2025년 05월 11일 주일 예배',
      subtitle: '대충 이러저러 함',
      scripture: '창세기 28장 11-15절',
      date: '2025.05.11',
      preacher: '임형택 목사님',
      icon: '👏',
      liked: false,
    },
  ];

  return (
    <div className="video-list-wrapper">
      {/* 상단 네비/교회명 */}
      <Hearder_ChuchType />

      {/* 유튜브 안내 카드 */}
      <div className="video-youtube-card">
        <span className="video-youtube-icon">▶️</span>
        <div>
          <div className="video-youtube-title">송신교회</div>
          <div className="video-youtube-desc">유튜브 채널 바로가기</div>
        </div>
      </div>

      {/* 예배 영상 카드 리스트 */}
      <div className="video-card-list">
        {videoList.map((video) => (
          <div className="video-card" key={video.id}>
            <div className="video-card-title-row">
              <span className="video-card-title">{video.title}</span>
              <span className="video-card-icon">{video.icon}</span>
            </div>
            <div className="video-card-subtitle">{video.subtitle}</div>
            <div className="video-card-info-row">
              <div className="video-card-info-left">
                <div>본문</div>
                <div>예배일</div>
                <div>설교자</div>
              </div>
              <div className="video-card-info-right">
                <div>{video.scripture}</div>
                <div>{video.date}</div>
                <div className="video-card-preacher">{video.preacher}</div>
              </div>
            </div>
            {/* 좋아요 아이콘 */}
            <div className="video-card-actions">
              <span className={`video-like-icon${video.liked ? ' liked' : ''}`} />
            </div>
          </div>
        ))}
      </div>

      {/* 하단 네비게이션 */}
      <BottomNav />
    </div>
  );
};

export default VideoList; 