import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import "../../styles/board/boardForm.css";

const BoardForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Redux에서 userId 가져오기
  const userIdFromRedux = useSelector((state) => state.auth?.userId);
  const userId = userIdFromRedux || localStorage.getItem("userId");

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [type, setType] = useState("");
  const [showModal, setShowModal] = useState(false); // 임시 저장 확인 모달
  const [draftExists, setDraftExists] = useState(false); // 임시 저장 존재 여부
  const [showTagInput, setShowTagInput] = useState(false);
  const [tagError, setTagError] = useState(''); // 태그 입력 에러 상태

  useEffect(() => {
        const checkDraft = async () => {
          try {
            const response = await axios.get("http://localhost:8080/api/v1/boards/draft", {
              params: { userId: "userId" },
            });
    
            if (response.data) {
              setDraftExists(true);
              setShowModal(true); // 모달 표시
            }
          } catch (error) {
            console.error("임시 저장 확인 실패:", error.message);
          }
        };
    
        if (!id) {
          checkDraft();
        } else {
          fetchPost(id);
        }
  }, [id]);

  const fetchPost = async (boardId) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/v1/boards/${boardId}`);
      const { title, content, hashtags, images, type } = response.data;
      setTitle(title);
      setContent(content);
      setTags(hashtags.split(","));
      setImagePreviews(images.map((img) => `http://localhost:8080/${img.filePath}`));
      setType(type);
    } catch (error) {
      console.error("게시글 불러오기 실패:", error.message);
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const previews = [];
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        previews.push(reader.result);
        setImagePreviews((prev) => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
    setImages((prev) => [...prev, ...files]);
  };

  const handleTagAdd = () => {
    const newTags = tagInput
      .split(',')
      .map((tag) => tag.trim())
      .filter((tag) => tag && !tags.includes(tag)); // 중복 제거
  
    if (newTags.length + tags.length > 5) {
      setTagError('최대 5개의 태그만 추가 가능합니다.');
      return;
    }

    // 각 해시태그에 대해 길이 검증
    const validatedTags = newTags.filter((tag) => {
      if (tag.length > 30) {
          alert(`해시태그는 30자 이하로 입력해야 합니다: ${tag}`);
          return false;
      }
      return true;
    });
  
    setTags([...tags, ...newTags]);
    setTagInput('');
    setTagError(''); // 에러 메시지 초기화
  };

  const handleTagDelete = (index) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId) {
        console.error("User ID를 가져올 수 없습니다.");
        return;
    }

    const boardData = {
      userId: userId,
      title: title,
      content: content,
      hashTag: tags.length > 0 ? tags.join(",") : null, // 빈 값 방지
      type: type,
      commentId: 0
    };

    const formData = new FormData();

    // **board JSON 데이터를 Blob으로 변환하여 추가**
    formData.append("board", new Blob([JSON.stringify(boardData)], { type: "application/json" }));

    // 이미지 파일 추가 (선택적)
    if (images.length > 0) {
        images.forEach((image) => {
            formData.append("images", image);
        });
    }

    try {
        const response = await axios.post("http://localhost:8080/api/v1/boards", formData
        );

        console.log("게시글 저장 성공:", response.data);
        navigate("/main");
    } catch (error) {
        console.error("게시글 저장 실패:", error);
    }
};

const handleModalConfirm = async () => {

  if (!userId) {
    console.error("User ID를 가져올 수 없습니다.");
    return;
  }

  const boardData = {
    userId: userId,
    title: title || "", // 제목이 없으면 빈 문자열로
    content: content || "", // 내용이 없으면 빈 문자열로
    hashTag: tags.length > 0 ? tags.join(",") : null, // 태그 처리
    type: type || "POSITIVE", // 기본 값
    commentId: 0, // 초기값
  };

  const formData = new FormData();
  formData.append("board", new Blob([JSON.stringify(boardData)], { type: "application/json" }));

  // 이미지 파일 추가
  if (images.length > 0) {
    images.forEach((image) => {
      formData.append("images", image);
    });
  }

  try {
    const response = await axios.post("http://localhost:8080/api/v1/boards/draft", formData, {
      headers: {
        // Content-Type은 Axios가 자동으로 설정
      },
    });

    console.log("임시 저장 성공:", response.data);
    setShowModal(false); // 모달 닫기
  } catch (error) {
    console.error("임시 저장 실패:", error.message);
  }
};

  const handleModalCancel = () => {
    setShowModal(false);
    navigate("/main");
  };

  return (
    <div id="board-form-wrapper">
      <div className="board-form-container">
        <div className="board-form-cross-btn" onClick={() => setShowModal(true)} />
        <div className="board-form-name">{id ? "게시글 수정" : "글 올리기"}</div>
        <div className="board-form-submit-btn" onClick={handleSubmit}>등록</div>
      </div>

      <div className="board-form-type">
        <div className="board-form-type-select">게시판을 선택해주세요</div>
        <div className="board-form-type-container">
          <button
            className={`type-btn ${type === "POSITIVE" ? "active" : ""}`}
            onClick={() => setType("POSITIVE")}
          >
            <div className="type-icon-positive"></div>
            긍정
          </button>
          <button
            className={`type-btn ${type === "NEGATIVE" ? "active" : ""}`}
            onClick={() => setType("NEGATIVE")}
          >
            <div className="type-icon-negative"></div>
            부정
          </button>
        </div>
      </div>

      <div className="board-form-title">
        <input
          type="text"
          placeholder="제목을 입력하세요"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div className="board-form-content">
        <div className="tag-section">
            {tags.map((tag, index) => (
            <span key={index} className="tag">
                {tag}
                <button className="tag-delete" onClick={() => handleTagDelete(index)}/>
            </span>
            ))}
        </div>
        <textarea
          placeholder="회원들과 마음을 나눠보세요"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        ></textarea>
        <div className="image-previews">
        {imagePreviews.map((preview, index) => (
            <div key={index} className="image-preview-container">
            {/* 미리보기 이미지 */}
            <div className="image-preview">
                <img src={preview} alt={`Preview ${index}`} />
            </div>

            {/* 삭제 아이콘 */}
            <div
                className="image-delete"
                onClick={() => setImagePreviews(imagePreviews.filter((_, i) => i !== index))}
            ></div>
            </div>
        ))}
        </div>
        {showTagInput && (
            <div className="tag-input-section">
              <div className="tag-input-wrapper">
                  <input
                      type="text"
                      placeholder="#태그를 입력하세요 (#으로 구분, 최대 5개)"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                  />
                  <button onClick={handleTagAdd} disabled={tags.length >= 5}>
                      입력
                  </button>
              </div>
              {tagError && <div className="tag-error">{tagError}</div>}
          </div>
        )}
      </div>

      <div className="board-form-actions">
        <div className="action-container" onClick={() => document.getElementById("file-input").click()}>
          <div className="image-icon"></div>
          <span className="action-text">사진</span>
        </div>
        <div className="action-container" onClick={() => setShowTagInput(true)}>
          <div className="tag-icon"></div>
          <span className="action-text">태그</span>
        </div>
      </div>

      <input
        id="file-input"
        type="file"
        multiple
        style={{ display: "none" }}
        onChange={handleImageUpload}
      />

      {showModal && (
         <div className="board-form-modal">
           <div className="board-form-modal-content">
             <h3>임시 저장하시겠어요?</h3>
             <p>
              임시 저장을 사용해 수정 사항을 저장하고 나중에 다시 작성할 수 있습니다. 
                <br />
                <span>임시 저장 데이터는 <strong>30일 동안</strong> 유지됩니다.</span>
             </p>
             <div className="board-form-modal-actions">
               <button onClick={handleModalConfirm} className="board-form-modal-btn-confirm">임시 저장</button>
               <button onClick={handleModalCancel} className="board-form-modal-btn-cancel">삭제</button>
             </div>
           </div>
         </div>
      )}
    </div>
  );
};

export default BoardForm;


