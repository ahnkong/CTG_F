import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import IconFrontButton from "assets/icon/IconFrontButton.png"; // 이미지 파일을 가져오기
import "styles/MyPage/profileInfo.css";
import Page from "components/styles/Page.jsx";
import Background from "context/Background.jsx";
import BackButton from "components/Buttons/BackButton";
import BottomNav from "layouts/BottomNav";


// ✅ 모달 창 컴포넌트
const Modal = ({ message, onClose }) => (
  <div className="modal-overlay">
    <div className="modal-content">
      <p>{message}</p>
      <button onClick={onClose}>확인</button>
    </div>
  </div>
);



const ProfileInfo = () => {
  const [userData, setUserData] = useState({
    nickname: "",
    email: "",
    password: "",
    name: "",
    tell: "",
    birth: "",
    info: "안녕하세요! 사용자 정보를 불러오는 중입니다.",
    profileImage: "https://via.placeholder.com/150",
    marketing: false, // ✅ 초기값 설정
  });

  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [editedInfo, setEditedInfo] = useState(userData.info || "");
  const navigate = useNavigate();
  const userId = useSelector((state) => state.auth?.userId || null);
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false); // ✅ 모달 상태 추가
  const [modalMessage, setModalMessage] = useState(""); // ✅ 모달 메시지 상태 추가

  // ✅ 모달 닫기 함수
  const closeModal = () => setShowModal(false);

  const handleEditClick = (field) => {
    if (field === "name" || field === "email") {
      setModalMessage("이 필드는 수정할 수 없습니다."); // ✅ 모달 메시지 설정
      setShowModal(true); // ✅ 모달 띄우기
      return;
    }
    console.log(`${field} 수정 페이지로 이동`);
    navigate(`/edit-profile/${field}`);
  };



  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("토큰이 없습니다. 다시 로그인해주세요.");
          return;
        }

        const response = await fetch("http://localhost:8080/api/v1/auth/check", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error("사용자 인증 실패");

        const { userId } = await response.json();
        dispatch({ type: "SET_USER_ID", payload: userId });

        const userResponse = await fetch(`http://localhost:8080/api/v1/user/${userId}`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!userResponse.ok) throw new Error("사용자 정보를 가져올 수 없습니다.");

        const userData = await userResponse.json();
        setUserData({
          nickname: userData.nickname || "닉네임 없음",
          password: userData.password,
          email: userData.email || "이메일 없음",
          info: userData.info || "자기소개가 없습니다.",
          name: userData.name || "이름이 없음",
          tell: userData.tell || "번호가 없음",
          birth: userData.birth || "생년월일이 없음",
          profileImage: userData.profileImage || "https://via.placeholder.com/150",
          marketing: userData.marketing || "", // ✅ 초기값 설정

        });
      } catch (error) {
        console.error("Error:", error.message);
      }
    };

    fetchUserData();
  }, [dispatch]);

  useEffect(() => {
    setEditedInfo(userData.info || "");
  }, [userData]);


  const handleMarketingToggle = async () => {
    try {
      const newMarketingStatus = !userData.marketing; // 토글 상태 반전
      setUserData((prev) => ({ ...prev, marketing: newMarketingStatus }));

      const token = localStorage.getItem("token");
      if (!token) {
        console.error("토큰이 없습니다. 다시 로그인해주세요.");
        return;
      }

      const response = await fetch(`http://localhost:8080/api/v1/user/${userId}/updateMarketing`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ marketing: newMarketingStatus ? 1 : 0 }), // 서버에서 1, 0으로 저장하는 경우
      });

      if (!response.ok) throw new Error("마케팅 동의 상태 업데이트 실패");
    } catch (error) {
      console.error("Error updating marketing preference:", error.message);
    }
  };


  return (
    <Background type="mypage">
      <Page id="profileInfo" scrollable={true}>
        <header className="profileInfo-header">
          <BackButton onClick={() => navigate("/mypage")} />
          <h1 className="profileInfo-title">프로필 정보</h1>
        </header>
          <p className="profileInfo-subtitle">{userData.name}님의 개인정보를 확인하세요.</p>

        {/* 프로필 사진 섹션 */}
        <section className="profileInfo-section-avatar">
          <div className="profileInfo-avatar-wrapper">
            <img
              src={userData.profileImage}
              alt={`${userData.name}의 프로필`}
              className="profileInfo-avatar-image"  // ✅ 클래스명 수정
            />
          </div>
        </section>

        {/* 기본 정보 섹션 */}
        <h2 className="section-title">기본 정보</h2>
        <div className="detail-item">
          <span className="label">이름</span>
          <span className="value">{userData.name || "이름 없음"}</span>
          <button className="edit-btn hidden-btn">
            <img src={IconFrontButton} alt="수정" />
          </button>
        </div>


        <div className="detail-item">
          <span className="label">닉네임</span>
          <span className="value">{userData.nickname || "없음"}</span>
          <button className="edit-btn" onClick={() => handleEditClick("nickname")}>
            <img src={IconFrontButton} alt="수정" />
          </button>
        </div>
        <div className="detail-item">
          <span className="label">비밀번호</span>
          <span className="value">
            {"*".repeat(userData.password?.length || 6)}  {/* ✅ 비밀번호 길이만큼 * 표시 */}
          </span>
          <button className="edit-btn" onClick={() => handleEditClick("password")}>
            <img src={IconFrontButton} alt="수정" />
          </button>
        </div>


        {/* 연락처 섹션 */}
        <div className="contact-section">
          <h2 className="section-title">연락처</h2>

          <div className="detail-item">
            <span className="label">휴대폰 번호</span>
            <span className="value">{userData.tell || "번호 없음"}</span>
            <button className="edit-btn" onClick={() => handleEditClick("tell")}>
              <img src={IconFrontButton} alt="수정" />
            </button>
          </div>

          <div className="detail-item">
            <span className="label">이메일 주소</span>
            <span className="value">{userData.email || "이메일 없음"}</span>
            <button className="edit-btn" onClick={() => handleEditClick("email")}>
              <img src={IconFrontButton} alt="수정" />
            </button>
          </div>
        </div>

        {/* 기타 정보 섹션 */}
        <div className="etc-section">
          <h2 className="section-title">기타 정보</h2>

          <div className="detail-item">
            <span className="label">생년월일</span>
            <span className="value">{userData.birth || "생년월일 없음"}</span>
            <button className="edit-btn hidden-btn">
            <img src={IconFrontButton} alt="수정" />
            </button>
          </div>

          <div className="detail-item">
            <span className="label">마케팅 수신 동의</span>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={userData.marketing}
                onChange={handleMarketingToggle}
              />
              <span className="slider">
              {/* {userData.marketing ? "ON" : "OFF"} */}
              </span>
            </label>
          </div>


        </div>
        {/* ✅ showModal이 true일 때만 모달 창 표시 */}
        {showModal && <Modal message={modalMessage} onClose={closeModal} />}

      </Page>
      <BottomNav />
    </Background>
  );
};

export default ProfileInfo;
