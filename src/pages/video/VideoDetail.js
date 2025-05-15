import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import 'styles/video/videoDetail.css';
import Background from 'context/Background';
import Page from 'components/styles/Page';
import Hearder_ChuchType from 'layouts/Hearder_ChurchType';
import BottomNav from 'layouts/BottomNav';
// 더미 데이터 (실제론 API로 대체 가능)
const dummyVideos = [
  {
    id: '1',
    title: '2024년 3월 24일 예배',
    date: '2024-03-24',
    pastor: '김목사',
    sermonTitle: '하나님의 은혜',
    worshipType: '주일예배',
    youtubeUrl: 'https://www.youtube.com/watch?v=5i0iLw6HNg4'
  },
  {
    id: '2',
    title: '2024년 3월 17일 예배',
    date: '2024-03-17',
    pastor: '이목사',
    sermonTitle: '믿음의 길',
    worshipType: '주일예배',
    youtubeUrl: 'https://www.youtube.com/watch?v=eEpMPbU0ywo'
  },
  {
    id: '3',
    title: '2024년 3월 20일 예배',
    date: '2024-03-20',
    pastor: '박목사',
    sermonTitle: '기도의 능력',
    worshipType: '수요예배',
    youtubeUrl: 'https://www.youtube.com/watch?v=kTtE7Ki16eA'
  }
];

const VideoDetail = () => {
  const { videoId } = useParams();
  const [videoData, setVideoData] = useState(null);

  useEffect(() => {
    const found = dummyVideos.find((v) => v.id === videoId);
    setVideoData(found);
  }, [videoId]);

  if (!videoData) {
    return (
      <Background type="sheep">
        <Hearder_ChuchType />
        <Page id="videoDetail" className="videoDetail" scrollable={true}>
          <div className="video-detail-container">
            <h2>예배 영상을 찾을 수 없습니다.</h2>
          </div>
        </Page>
      </Background>
    );
  }

  const youtubeId = new URL(videoData.youtubeUrl).searchParams.get('v');

  return (
    <Background type='sheep'>
      <Hearder_ChuchType />
      <Page id="videoDetail" className="videoDetail" scrollable={true}>
        <div className="video-detail-container">
          <div className="video-header">
            <h2>{videoData.title}</h2>
          </div>

          <div className="youtube-thumbnail" onClick={() => window.open(videoData.youtubeUrl, '_blank')}>
            <img 
              src={`https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`}
              alt="예배 영상 썸네일"
            />
            <div className="play-overlay">▶</div>
          </div>

          <div className="videoDetail-info">
            <div className="info-row"><span className="label">날짜:</span>{videoData.date}</div>
            <div className="info-row"><span className="label">설교자:</span>{videoData.pastor}</div>
            <div className="info-row"><span className="label">설교제목:</span>{videoData.sermonTitle}</div>
            <div className="info-row"><span className="label">예배타입:</span>{videoData.worshipType}</div>
          </div>
        </div>
      </Page>
      <BottomNav />
    </Background>
  );
};

export default VideoDetail;
