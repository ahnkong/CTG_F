// 게시글 이동 ok
// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import BottomNav from "layouts/BottomNav";
// import Page from "components/styles/Page.jsx";
// import Background from "context/Background.jsx";
// import axios from "axios";
// import "styles/MyPage/myBoardList.css"; // activeLog.css 그대로 사용
// import BackButton from "components/Buttons/BackButton";

// const MyBoardList = () => {
//   const [boards, setBoards] = useState([]);
//   const navigate = useNavigate();
  
//   // ✅ 로그인한 사용자 정보 가져오기
//   const [userId, setUserId] = useState("");

//   useEffect(() => {
//     const fetchUserData = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         if (!token) {
//           console.error("토큰이 없습니다. 다시 로그인해주세요.");
//           return;
//         }

//         const response = await axios.get("http://localhost:8080/api/v1/auth/check", {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         setUserId(response.data.userId);
//       } catch (error) {
//         console.error("사용자 정보를 불러오는 중 오류 발생:", error);
//       }
//     };

//     fetchUserData();
//   }, []);

//   // ✅ 내 게시글 불러오기
//   useEffect(() => {
//     const fetchMyBoards = async () => {
//       try {
//         if (!userId) return;
//         const res = await axios.get("http://localhost:8080/api/v1/boards/myPosts", { params: { userId } });
//         setBoards(res.data.content || []);
//       } catch (error) {
//         console.error("내 게시글 불러오기 실패:", error);
//       }
//     };

//     fetchMyBoards();
//   }, [userId]);

//   return (
//     <Background type="mypage">
//       <Page id="activeLog" scrollable={true}>
//         <div className="activeLog-backbutton">
//           <BackButton onClick={() => navigate(-1)} />
//         </div>

//         {/* 헤더 */}
//         <section className="activeLog-container">
//           <div className="header">내가 쓴 글</div>
//         </section>

//         {/* 게시글 목록 */}
//         <section className="activeLog-postList-section">
//           {boards.length > 0 ? (
//             boards.map((board) => (
//               <div
//                 key={board.boardId}
//                 className="post-item"
//                 onClick={() => navigate(`/board/${board.boardId}`)}
//               >
//                 <span className="category">{board.type}</span>
//                 <p className="post-title">{board.title}</p>
//                 <p className="post-info">
//                   {formatDate(board.cDate)} 조회 {board.view}
//                 </p>
//                 <hr className="post-item-hr" />
//               </div>
//             ))
//           ) : (
//             <p className="no-data">게시물이 없습니다.</p>
//           )}
//         </section>
//       </Page>
//       <BottomNav />
//     </Background>
//   );
// };

// // ✅ 작성일 포맷 함수
// const formatDate = (dateString) => {
//   const now = new Date();
//   const date = new Date(dateString);
//   const diff = now - date;
//   const minutes = Math.floor(diff / (1000 * 60));
//   const hours = Math.floor(diff / (1000 * 60 * 60));
//   if (now.toDateString() === date.toDateString()) {
//     if (minutes < 60) return `${minutes}분 전`;
//     return `${hours}시간 전`;
//   } else {
//     return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")}`;
//   }
// };

// export default MyBoardList;

//필터 Ok
// import { useState, useEffect } from "react";
// import BottomNav from "layouts/BottomNav";
// import Page from "components/styles/Page.jsx";
// import Background from "context/Background.jsx";
// import { useLocation, useNavigate } from "react-router-dom";
// import axios from "axios";
// import "styles/MyPage/myBoardList.css";
// import BackButton from "components/Buttons/BackButton";

// const MyBoardList = () => {
//   const location = useLocation();
//   const queryParams = new URLSearchParams(location.search);
//   const initialFilter = queryParams.get("filter") || "내가 쓴 글";
  
//   const [selectedFilter, setSelectedFilter] = useState(initialFilter);
//   const [posts, setPosts] = useState([]);
//   const [userId, setUserId] = useState(""); // 사용자 ID
//   const navigate = useNavigate();

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (!token) return;

//     fetchUserData(token);
//   }, []);

//   const fetchUserData = async (token) => {
//     try {
//       const response = await axios.get("http://localhost:8080/api/v1/auth/check", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setUserId(response.data.userId);
//     } catch (error) {
//       console.error("사용자 정보 불러오기 실패", error);
//     }
//   };

//   useEffect(() => {
//     if (!userId) return;

//     // 필터에 따라 API 다르게 호출
//     if (selectedFilter === "내가 쓴 글") {
//       fetchMyBoards();
//     } else if (selectedFilter === "내가 쓴 댓글") {
//       fetchMyComments();
//     } else {
//       setPosts([]); // 스크랩한 글은 아직 준비 안했으니까
//     }
//   }, [selectedFilter, userId]);

//   const fetchMyBoards = async () => {
//     try {
//       const response = await axios.get("http://localhost:8080/api/v1/boards/myPosts", {
//         params: { userId }
//       });
//       setPosts(response.data.content || []); // page 형태라 content만 사용
//     } catch (error) {
//       console.error("내 게시글 불러오기 실패", error);
//     }
//   };

//   const fetchMyComments = async () => {
//     try {
//       const response = await axios.get("http://localhost:8080/api/v1/comments/myComments", {
//         params: { userId }
//       });
//       setPosts(response.data || []);
//     } catch (error) {
//       console.error("내 댓글 불러오기 실패", error);
//     }
//   };

//   const filters = ["내가 쓴 글", "내가 쓴 댓글", "스크랩 한 글"];

//   return (
//     <Background type="mypage">
//       <Page id="myBoardList" scrollable={true}>
//         <div className="myBoardList-backbutton">
//           <BackButton onClick={() => navigate(-1)} />
//         </div>

//         <section className="myBoardList-container">
//           <div className="header">나의 활동 스토리</div>
//         </section>

//         <section className="filters">
//           {filters.map((filter) => (
//             <button
//               key={filter}
//               className={`filter-button ${selectedFilter === filter ? "selected" : ""}`}
//               onClick={() => setSelectedFilter(filter)}
//             >
//               {filter}
//             </button>
//           ))}
//         </section>

//         <section className="myBoardList-postList-section">
//           {posts.length > 0 ? (
//             posts.map((post, index) => (
//               <div key={index} className="post-item">
//                 <span className="category">{post.category || "기타"}</span>
//                 <p className="post-title">{post.title || post.content}</p>
//                 <p className="post-info">{post.date || "날짜 없음"} 조회 {post.view || post.views || 0}</p>
//                 <hr className="post-item-hr"/>
//               </div>
//             ))
//           ) : (
//             <p className="no-data">게시물이 없습니다.</p>
//           )}
//         </section>

//       </Page>
//       <BottomNav />
//     </Background>
//   );
// };

// export default MyBoardList;
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import BottomNav from "layouts/BottomNav";
import Page from "components/styles/Page.jsx";
import Background from "context/Background.jsx";
import axios from "axios";
import "styles/MyPage/myBoardList.css";
import BackButton from "components/Buttons/BackButton";

const MyBoardList = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialFilter = queryParams.get("filter") || "내가 쓴 글";

  const [selectedFilter, setSelectedFilter] = useState(initialFilter);
  const [posts, setPosts] = useState([]);
  const [userId, setUserId] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    fetchUserData(token);
  }, []);

  const fetchUserData = async (token) => {
    try {
      const response = await axios.get("http://localhost:8080/api/v1/auth/check", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserId(response.data.userId);
    } catch (error) {
      console.error("사용자 정보 불러오기 실패", error);
    }
  };

  useEffect(() => {
    if (!userId) return;
    if (selectedFilter === "내가 쓴 글") {
      fetchMyBoards();
    } else if (selectedFilter === "내가 쓴 댓글") {
      fetchMyComments();
    } else {
      setPosts([]);
    }
  }, [selectedFilter, userId]);

  const fetchMyBoards = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/v1/boards/myPosts", {
        params: { userId }
      });
      setPosts(response.data.content || []);
    } catch (error) {
      console.error("내 게시글 불러오기 실패", error);
    }
  };

  const fetchMyComments = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/v1/comments/myComments", {
        params: { userId }
      });
      setPosts(response.data || []);
    } catch (error) {
      console.error("내 댓글 불러오기 실패", error);
    }
  };

  const filters = ["내가 쓴 글", "내가 쓴 댓글", "스크랩 한 글"];

  const handlePostClick = (post) => {
    if (post.boardId) {
      navigate(`/board/${post.boardId}`);
    } else {
      console.warn("이동할 게시글 ID가 없습니다.");
    }
  };

  return (
    <Background type="mypage">
      <Page id="myBoardList" scrollable={true}>
        <div className="myBoardList-backbutton">
          <BackButton onClick={() => navigate(-1)} />
        </div>

        <section className="myBoardList-container">
          <div className="header">나의 활동 스토리</div>
        </section>

        {/* 필터 버튼 */}
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

        {/* 게시글/댓글 리스트 */}
        <section className="myBoardList-postList-section">
          {posts.length > 0 ? (
            posts.map((post, index) => (
              <div
                key={index}
                className="post-item"
                onClick={() => handlePostClick(post)}
              >
                <span className="category">{post.category || post.type || "기타"}</span>
                <p className="post-title">{post.title || post.content}</p>
                <p className="post-info">
                  {formatDate(post.cDate || post.coCDate)} 조회 {post.view || post.views || 0}
                </p>
                <hr className="post-item-hr" />
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

const formatDate = (dateString) => {
  if (!dateString) return "날짜 없음";
  const now = new Date();
  const date = new Date(dateString);
  const diff = now - date;
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (now.toDateString() === date.toDateString()) {
    if (minutes < 60) return `${minutes}분 전`;
    return `${hours}시간 전`;
  } else {
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")}`;
  }
};

export default MyBoardList;
