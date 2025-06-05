import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import '../../styles/community/CommunityForm.css';

const CommunityForm = () => {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [selectedType, setSelectedType] = useState('DAILY');
    const [images, setImages] = useState([]);
    const [previewImages, setPreviewImages] = useState([]);

    // Redux store에서 필요한 정보 가져오기
    const { userId, domainId } = useSelector((state) => state.auth || {});
    const nickname = useSelector((state) => state.auth?.nickname);


    const communityTypes = [
        { type: 'DAILY', label: '일상' },
        { type: 'BIBLE', label: '성경' },
        { type: 'WORD', label: '말씀' },
        { type: 'MEDITATION', label: '묵상' },
        { type: 'WORSHIP', label: '예배' }
    ];

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        const newImages = [...images, ...files];
        setImages(newImages);

        const newPreviewImages = files.map(file => URL.createObjectURL(file));
        setPreviewImages([...previewImages, ...newPreviewImages]);
    };

    const removeImage = (index) => {
        const newImages = images.filter((_, i) => i !== index);
        const newPreviewImages = previewImages.filter((_, i) => i !== index);
        setImages(newImages);
        setPreviewImages(newPreviewImages);
    };

    const handleSubmit = async () => {
        if (!userId || !domainId) {
            alert('로그인이 필요합니다.');
            navigate('/login');
            return;
        }

        try {
            const formData = new FormData();
            const communityDTO = {
                userId,
                domainId,
                title,
                content,
                communityType: selectedType
            };

            formData.append('communityDTO', new Blob([JSON.stringify(communityDTO)], {
                type: 'application/json'
            }));

            if (images.length > 0) {
                images.forEach(image => {
                    formData.append('images', image);
                });
            }

            const token = localStorage.getItem('token');

            const response = await axios.post('/api/community', formData, {
                params: { userId },
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.status === 200) {
                navigate('/community');
            }
        } catch (error) {
            console.error('게시글 작성 중 오류 발생:', error);
            if (error.response?.status === 403) {
                alert('게시글 작성 권한이 없습니다.');
            } else {
                alert('게시글 작성 중 오류가 발생했습니다.');
            }
        }
    };

    return (
        <div className="community-form">
            <div className="community-form-header">
                <div className="community-back-button" onClick={() => navigate(-1)} />
                <span className="community-header-title">게시판 글쓰기</span>
            </div>
            <div className="community-header-divider" />

            <div className="community-form-body">
                <div className="community-form-row">
                    <div className="community-label">제목</div>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="community-input"
                        placeholder="제목을 입력해주세요"
                    />
                </div>

                <div className="community-form-row">
                    <div className="community-label">타입</div>
                    <div className="community-type-selector">
                        {communityTypes.map(({ type, label }) => (
                            <button
                                key={type}
                                type="button"
                                className={`community-type-button ${type.toLowerCase()} ${selectedType === type ? 'selected' : ''}`}
                                onClick={() => setSelectedType(type)}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="community-form-row">
                    <div className="community-label">작성자</div>
                    <div className="community-writer">{nickname || "로딩중..."}</div>
                </div>

                <div className="community-divider" />

                <textarea
                    className="community-content-input"
                    placeholder="직접 입력"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />

                <div className="community-image-preview-container">
                    {previewImages.map((preview, index) => (
                        <div key={index} className="community-image-preview">
                            <img src={preview} alt={`미리보기 ${index + 1}`} />
                            <div
                                className="community-remove-image"
                                onClick={() => removeImage(index)}
                            />
                        </div>
                    ))}
                </div>
            </div>

            <div className="community-form-footer">
                <label className="community-footer-button">
                    <div className="community-camera-icon" />
                    <span>사진</span>
                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageUpload}
                        style={{ display: 'none' }}
                    />
                </label>

                <div className="community-footer-divider" />

                <button className="community-footer-button" onClick={handleSubmit}>
                    <div className="community-submit-icon" />
                    <span>글 등록</span>
                </button>
            </div>
        </div>
    );
};

export default CommunityForm;
