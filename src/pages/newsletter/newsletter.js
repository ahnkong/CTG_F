import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'styles/newsletter/newsletter.css';
import Background from 'context/Background';
import Page from 'components/styles/Page';
import Hearder_ChuchType from 'layouts/Hearder_ChurchType';
import BottomNav from 'layouts/BottomNav';
const Newsletter = () => {
  const navigate = useNavigate();
  const [newsletters] = useState([
    {
      id: 1,
      date: '2024-03-24',
      title: '2024년 3월 24일 주보',
      imageUrl: '/newsletters/20240324.jpg'
    },
    {
      id: 2,
      date: '2024-03-17',
      title: '2024년 3월 17일 주보',
      imageUrl: '/newsletters/20240317.jpg'
    }
  ]);

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
