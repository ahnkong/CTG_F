import React, { useState } from 'react';
import axios from 'axios';
import 'styles/notice/noticeForm.css';
import Background from 'context/Background';
import Page from 'components/styles/Page';
import { useSelector } from 'react-redux';
import TopBackBar from 'layouts/TopBackBar';
import TagButton, { TagButtonGroup } from 'components/common/TagButton';
import Hearder_ChurchType from 'layouts/Hearder_ChurchType';

const NoticeForm = () => {
  const { userId, domainId, nickname } = useSelector(state => state.auth || {});
  const [form, setForm] = useState({
    title: '',
    noticeType: 'NOTICE',
    displayStartDate: '',
    displayEndDate: '',
    content: ''
  });
  const [images, setImages] = useState([]);

  const handleChange = (e) => {
    setForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleImageChange = (e) => {
    setImages([...e.target.files]);
  };

  const handleSubmit = async () => {
    if (!userId || !domainId) {
      alert('로그인이 필요합니다.');
      return;
    }

    // 필수 필드 검증
    if (!form.title.trim()) {
      alert('제목을 입력해주세요.');
      return;
    }

    if (!form.content.trim()) {
      alert('내용을 입력해주세요.');
      return;
    }

    // 날짜 검증
    if (form.displayStartDate && form.displayEndDate) {
      const startDate = new Date(form.displayStartDate);
      const endDate = new Date(form.displayEndDate);
      
      if (startDate > endDate) {
        alert('시작일이 종료일보다 늦을 수 없습니다.');
        return;
      }
    }

    const noticeDTO = {
      title: form.title,
      noticeType: form.noticeType,
      displayStartDate: form.displayStartDate ? `${form.displayStartDate}T00:00:00` : null,
      displayEndDate: form.displayEndDate ? `${form.displayEndDate}T23:59:59` : null,
      content: form.content,
      userId,
      domainId
    };

    const formData = new FormData();
    formData.append('noticeDTO', new Blob([JSON.stringify(noticeDTO)], { type: 'application/json' }));

    images.forEach(img => {
      formData.append('images', img);
    });

    try {
      await axios.post('/api/v1/notices', formData);
      alert('공지 작성 완료!');
      window.location.href = '/noticeList';  // 작성 완료 후 목록으로 이동
    } catch (error) {
      console.error('공지 작성 실패:', error);
      alert('작성 실패!');
    }
  };

  return (
    <Background>
      <TopBackBar />
      <Page className="NoticeForm_write" scrollable={true} type="notice">
        <div className="notice-row">
          <label className="label-title" htmlFor="title">제목</label>
          <input id="title" name="title" value={form.title} onChange={handleChange} />
        </div>

        {/* <div className="notice-row">
          <label className="label-author" htmlFor="author">작성자</label>
          <span className="author">{nickname}</span>
        </div> */}

        <div className="notice-row">
          <label className="label-type">공지 타입</label>
          <TagButtonGroup>
            {[
              { type: "NOTICE", label: "공지", variant: "notice" },
              { type: "EVENT", label: "행사", variant: "event" },
              { type: "NEWS", label: "소식", variant: "news" }
            ].map(({ type, label, variant }) => (
              <TagButton
                key={type}
                variant={variant}
                isActive={form.noticeType === type}
                onClick={() => setForm(prev => ({ ...prev, noticeType: type }))}
              >
                {label}
              </TagButton>
            ))}
          </TagButtonGroup>
        </div>

        <div className="notice-row">
          <label className="label-period">기간</label>
          <div className="date-group">
            <input
              type="date"
              id="displayStartDate"
              name="displayStartDate"
              value={form.displayStartDate}
              onChange={handleChange}
            />
            <input
              type="date"
              id="displayEndDate"
              name="displayEndDate"
              value={form.displayEndDate}
              onChange={handleChange}
            />
          </div>
        </div>

        <textarea
          name="content"
          value={form.content}
          onChange={handleChange}
          className="notice-content"
          placeholder="내용을 입력해주세요."
          rows={20}
        />

        <div className="bottom-bar">
          <button onClick={() => document.querySelector('.image-upload').click()}>📷 사진</button>
          <button onClick={handleSubmit}>✅ 글 등록</button>
        </div>
      </Page>
    </Background>
  );
};

export default NoticeForm;
