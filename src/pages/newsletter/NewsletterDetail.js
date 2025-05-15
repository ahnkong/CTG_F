// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import 'styles/newsletter/newsletter.css';
// import Background from 'context/Background';
// import Page from 'components/styles/Page';
// import Hearder_ChuchType from 'layouts/Hearder_ChurchType';

// const NewsletterDetail = () => {
//   const { id } = useParams();
//   const [newsletter, setnewsletter] = useState({
//     id: 1,
//     title: '2024년 3월 24일 주보',
//     content: '주보 내용이 들어갑니다.',
//     createdDate: '2024-03-24',
//     worshipDate: '2024-03-24',
//     imageUrl: '/newsletters/20240324.jpg'
//   });

//   // 실제 구현 시에는 아래와 같이 데이터를 가져올 수 있습니다
//   /*
//   useEffect(() => {
//     const fetchnewsletter = async () => {
//       try {
//         const response = await fetch(`/api/newsletters/${id}`);
//         const data = await response.json();
//         setnewsletter(data);
//       } catch (error) {
//         console.error('주보를 불러오는데 실패했습니다:', error);
//       }
//     };
//     fetchnewsletter();
//   }, [id]);
//   */

//   return (
//     <Background type='sheep'>
//       <Hearder_ChuchType />
//       <Page id="newsletter-detail" className="newsletter-detail" scrollable={true}>
//         <div className="newsletter-detail-container">
//           <h2>{newsletter.title}</h2>
          
//           <div className="newsletter-info">
//             <div className="info-row">
//               <span className="label">생성일자:</span>
//               <span className="value">{newsletter.createdDate}</span>
//             </div>
//             <div className="info-row">
//               <span className="label">예배일자:</span>
//               <span className="value">{newsletter.worshipDate}</span>
//             </div>
//           </div>

//           <div className="newsletter-content">
//             <img 
//               src={newsletter.imageUrl} 
//               alt={newsletter.title}
//               className="newsletter-image"
//             />
//             <div className="content-text">
//               {newsletter.content}
//             </div>
//           </div>
//         </div>
//       </Page>
//     </Background>
//   );
// };

// export default NewsletterDetail;


import React from 'react';
import { useLocation, useParams } from 'react-router-dom';
import 'styles/newsletter/newsletter.css';
import Background from 'context/Background';
import Page from 'components/styles/Page';
import Hearder_ChuchType from 'layouts/Hearder_ChurchType';

const NewsletterDetail = () => {
  const { id } = useParams();
  const location = useLocation();

  // 목록에서 전달된 newsletter 객체
  const newsletter = location.state?.newsletter;

  if (!newsletter) {
    return (
      <Background type="sheep">
        <Hearder_ChuchType />
        <Page id="newsletter-detail" className="newsletter-detail" scrollable={true}>
          <div className="newsletter-detail-container">
            <h2>주보 정보를 찾을 수 없습니다.</h2>
          </div>
        </Page>
      </Background>
    );
  }

  return (
    <Background type="sheep">
      <Hearder_ChuchType />
      <Page id="newsletter-detail" className="newsletter-detail" scrollable={true}>
        <div className="newsletter-detail-container">
          <h2>{newsletter.title}</h2>

          <div className="newsletter-info">
            <div className="info-row">
              <span className="label">생성일자:</span>
              <span className="value">{newsletter.date}</span>
            </div>
            <div className="info-row">
              <span className="label">예배일자:</span>
              <span className="value">{newsletter.date}</span>
            </div>
          </div>

          <div className="newsletter-content">
            <img
              src={newsletter.imageUrl}
              alt={newsletter.title}
              className="newsletter-image"
            />
            <div className="content-text">{newsletter.content}</div>
          </div>
        </div>
      </Page>
    </Background>
  );
};

export default NewsletterDetail;
