import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'styles/video/video.css';
import Background from 'context/Background';
import Page from 'components/styles/Page';
import Hearder_ChuchType from 'layouts/Hearder_ChurchType';
import BottomNav from 'layouts/BottomNav';

const WorshipType = {
  ALL: '전체',
  SUNDAY: '주일예배',
  WEDNESDAY: '수요예배',
  FRIDAY: '금요예배',
  DAWN: '새벽예배',
  OTHER: '기타예배'
};

const worshipClassMap = {
  주일예배: 'sunday',
  수요예배: 'wednesday',
  금요예배: 'friday',
  새벽예배: 'dawn',
  기타예배: 'other'
};


const Video = () => {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState(null);
  const [videos] = useState([
    {
      id: 1,
      date: '2024-03-24',
      title: '2024년 3월 24일 청년부 주일예배',
      pastor: '김목사',
      sermonTitle: '하나님의 은혜하나님의 은혜하나님의 은혜',
      worshipType: WorshipType.SUNDAY,
      youtubeUrl: 'https://www.youtube.com/@soongshin',
      views: 128
    },
    {
      id: 2,
      date: '2024-03-17',
      title: '2024년 3월 17일 주일예배',
      pastor: '이목사',
      sermonTitle: '믿음의 길',
      worshipType: WorshipType.SUNDAY,
      youtubeUrl: 'https://www.youtube.com/watch?v=27bDh_GCaOQ'
    },
    {
      id: 3,
      date: '2024-03-20',
      title: '2024년 3월 20일 수요예배',
      pastor: '박목사',
      sermonTitle: '기도의 능력',
      worshipType: WorshipType.WEDNESDAY,
      youtubeUrl: 'https://www.youtube.com/watch?v=czgZD1cUQ6w&t=4144s'
    }
  ]);

  const handleVideoClick = (id) => {
    navigate(`/video/${id}`);
  };

  const filteredVideos = selectedType
    ? videos.filter(video => video.worshipType === WorshipType[selectedType])
    : videos;

  return (
    <Background type='white'>
      <Hearder_ChuchType />
      <Page id="video" className="video" scrollable={true}>
        <div className="video-container">
          <h2>예배 영상</h2>

{/* 태그 */}
          <div className="hashtag-container">
            <div className="hashtag-buttons">
              {Object.entries(WorshipType).map(([key, value]) => (
                <button
                  key={key}
                  className={`hashtag-button ${selectedType === key ? 'active' : ''}`}
                  onClick={() => setSelectedType(selectedType === key ? null : key)}
                >
                  #{value}
                </button>
              ))}
            </div>
          </div>

{/* 비디오리스트 */}
          <div className="video-list">
            {filteredVideos.map((video) => {
              let youtubeId = null;
              try {
                const url = new URL(video.youtubeUrl);
                youtubeId = url.searchParams.get("v");
              } catch (e) {
                youtubeId = null;
              }

              const thumbnail = youtubeId
                ? `https://img.youtube.com/vi/${youtubeId}/mqdefault.jpg`
                : '/default-thumbnail.jpg'; // 썸네일 없는 경우 대체 이미지

              return (
                <div
                  key={video.id}
                  className="video-item"
                  onClick={() => handleVideoClick(video.id)}
                  role="button"
                  tabIndex={0}
                >
                  <img
                    className="video-thumbnail"
                    src={thumbnail}
                    alt={video.title}
                  />
                  <div className="video-info">
                    <div className="video-title">{video.title}</div>
                    <div className="video-pastor">설교자: {video.pastor}</div>
                    <div className="video-sermon">설교제목: {video.sermonTitle}</div>
                    <div className={`video-type ${worshipClassMap[video.worshipType]}`}>
                      {video.worshipType}
                    </div>
                    {video.views && (
                      <div className="video-views">조회수: {video.views}</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Page>
      <BottomNav />
    </Background>
  );
};

export default Video;
