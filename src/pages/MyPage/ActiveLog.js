import { useState, useEffect } from "react";
import BottomNav from "layouts/BottomNav";
import Page from "components/styles/Page.jsx";
import Background from "context/Background.jsx";
import { useLocation, useNavigate } from "react-router-dom";
import "styles/MyPage/activeLog.css";
import BackButton from "components/Buttons/BackButton";


// const ActiveLog = () => {
//   const [selectedFilter, setSelectedFilter] = useState("내가 쓴 글");

//   const filters = ["내가 쓴 글", "내가 쓴 댓글", "스크랩 한 글"];

//   // 테스트용 데이터
  const postData = {
    "내가 쓴 글": [
      { category: "일상", title: "오늘 참 힘들고 ... 외롭다", date: "1주 전", views: 100 },
      { category: "운동", title: "오늘 헬스장에서 2시간 땀 흘림", date: "3일 전", views: 230 }
    ],
    "내가 쓴 댓글": [
      { category: "요리", title: "이 레시피 정말 최고네요!", date: "2일 전", views: 45 }
    ],
    "스크랩 한 글": [
      { category: "개발", title: "React 상태 관리 꿀팁", date: "1시간 전", views: 78 }
    ]
  };


const ActiveLog = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialFilter = queryParams.get("filter") || "내가 쓴 글";
  const [selectedFilter, setSelectedFilter] = useState(initialFilter);
  const navigate = useNavigate();
  
  useEffect(() => {
    setSelectedFilter(initialFilter);
  }, [initialFilter]);

  const filters = ["내가 쓴 글", "내가 쓴 댓글", "스크랩 한 글"];

  return (
    <Background type="mypage">
      <Page id="activeLog" scrollable={true}>
        <div className="activeLog-backbutton">
          <BackButton onClick={() => navigate(-1)} />
        </div>
        <section className="activeLog-container">
          <div className="header">나의 활동 스토리</div>
        </section>

        {/* Filters */}
        <section className="filters">
          {filters.map((filter) => (
            <button
              key={filter}
              className={`filter-button ${selectedFilter === filter ? "selected" : ""}`}
              onClick={() => setSelectedFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </section>

        {/* Post List */}
        <section className="activeLog-postList-section">
          {postData[selectedFilter]?.length > 0 ? (
            postData[selectedFilter].map((post, index) => (
              <div key={index} className="post-item">
                <span className="category">{post.category}</span>
                <p className="post-title">{post.title}</p>
                <p className="post-info">{post.date} 조회 {post.views}</p>
                <hr className="post-item-hr"/>
              </div>
            ))
          ) : (
            <p className="no-data">게시물이 없습니다.</p>
          )}
        </section>
      </Page>
      <BottomNav />
    </Background>
  );
};

export default ActiveLog;
