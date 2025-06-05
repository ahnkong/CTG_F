import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'styles/notice/noticeDetail.css';
import Background from 'context/Background';
import Page from 'components/styles/Page';
import Hearder_ChurchType from 'layouts/Hearder_ChurchType';
import TopBackBar from 'layouts/TopBackBar';
import TagButton from 'components/common/TagButton';

const NoticeDetail = () => {
  const { boardId } = useParams();
  const navigate = useNavigate();
  const [notice, setNotice] = useState(null);

  useEffect(() => {
    const fetchNotice = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/v1/notices/${boardId}`);
        setNotice(response.data);
      } catch (error) {
        console.error('공지사항 조회 실패:', error);
        alert('게시글을 불러오는데 실패했습니다.');
        navigate('/noticeList');
      }
    };

    fetchNotice();
  }, [boardId, navigate]);

  if (!notice) return <div>로딩중...</div>;

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
  };

  const getNoticeStatus = () => {
    if (!notice.displayStartDate || !notice.displayEndDate) {
      return "ONGOING"; // 날짜가 설정되지 않은 경우 진행중으로 표시
    }

    const now = new Date();
    const startDate = new Date(notice.displayStartDate);
    const endDate = new Date(notice.displayEndDate);

    if (now < startDate) {
      return "UPCOMING"; // 시작 전
    } else if (now > endDate) {
      return "ENDED"; // 마감됨
    } else {
      return "ONGOING"; // 진행중
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "UPCOMING": return "시작 예정";
      case "ONGOING": return "진행중";
      case "ENDED": return "마감";
      default: return "";
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "UPCOMING": return "upcoming";
      case "ONGOING": return "ongoing";
      case "ENDED": return "ended";
      default: return "";
    }
  };

  const getNoticeTypeText = (type) => {
    switch (type) {
      case 'NOTICE': return '공지';
      case 'EVENT': return '행사';
      case 'NEWS': return '소식';
      default: return '';
    }
  };
  console.log("notice:", notice); // ❗ notice.data 아님
  console.log("displayEndDate:", notice.displayEndDate);
  console.log("parsed:", new Date(notice.displayEndDate));
  
  const currentStatus = getNoticeStatus();
  
  return (
    <Background type='white'>
      <TopBackBar/>
      <Page className="NoticeDetail" scrollable={true} type="notice">
        <div className="notice-header">
          <div className="notice-tags">
            <span className="notice-writer">👤 {notice.userNickname}</span>
            <TagButton
              variant={getStatusClass(currentStatus)}
              isActive={false}
              className="small"
            >
              {getStatusText(currentStatus)}
            </TagButton>
            <TagButton
              variant={notice.noticeType.toLowerCase()}
              isActive={false}
              className="small"
            >
              {getNoticeTypeText(notice.noticeType)}
            </TagButton>
          </div>
          <h1 className="notice-title">{notice.title}</h1>
          <div className="notice-info">
            <span className="notice-author">{notice.userNickname}</span>
            <span className="notice-date">{formatDate(notice.createdAt)}</span>
            <span className="notice-views">조회 {notice.view}</span>
          </div>
        </div>

        <div className="notice-content">
          {notice.content}
        </div>

        {notice.images && notice.images.length > 0 && (
          <div className="notice-images">
            {notice.images.map((image, index) => (
              <img
                key={index}
                src={`http://localhost:8080/uploads/${image.fileName}`}
                alt={`첨부 이미지 ${index + 1}`}
                className="notice-image"
              />
            ))}
          </div>
        )}
      </Page>
    </Background>
  );
};

export default NoticeDetail; 