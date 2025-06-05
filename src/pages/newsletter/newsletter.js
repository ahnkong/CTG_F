import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'styles/newsletter/newsletter.css';
import Background from 'context/Background';
import Page from 'components/styles/Page';
import Hearder_ChuchType from 'layouts/Hearder_ChurchType';
import BottomNav from 'layouts/BottomNav';

const Newsletter = () => {
  const navigate = useNavigate();
  const [newsletters, setNewsletters] = useState([]);

  useEffect(() => {
    const fetchNewsletters = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/bulletins');
        const formatted = response.data.map((item) => ({
          id: item.boardId,
          date: item.createdAt?.split('T')[0], // ISO 문자열에서 날짜만
          title: item.title,
          imageUrl: item.images?.[0]?.filePath || '/images/default-thumbnail.jpg', // 썸네일 기본 처리
        }));
        setNewsletters(formatted);
      } catch (error) {
        console.error('주보 목록을 불러오는 데 실패했습니다:', error);
      }
    };

    fetchNewsletters();
  }, []);

  const handleNewsletterClick = (newsletterId) => {
    navigate(`/newsletter/${newsletterId}`);
  };

  return (
    <Background type="white">
      <Hearder_ChuchType />
      <Page id="newsletter" className="newsletter" scrollable={true}>
        <div className="newsletter-container">
          <h2>주보</h2>
          <div className="newsletter-list">
            {newsletters.map((newsletter) => (
              <div
                key={newsletter.id}
                className="newsletter-item"
                onClick={() => handleNewsletterClick(newsletter.id)}
                role="button"
                tabIndex={0}
              >
                <img
                  className="newsletter-thumbnail"
                  src={newsletter.imageUrl}
                  alt={newsletter.title}
                />
                <div className="newsletter-info">
                  <div className="newsletter-date">📅 {newsletter.date}</div>
                  <div className="newsletter-title">{newsletter.title}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Page>
      <BottomNav />
    </Background>
  );
};

export default Newsletter;
