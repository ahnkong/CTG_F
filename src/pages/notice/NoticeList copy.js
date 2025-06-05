import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import "styles/notice/noticeList.css";
import BottomNav from "layouts/BottomNav";
import Hearder_ChuchType from "layouts/Hearder_ChurchType";
import Background from "context/Background";

const NoticeList = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [currentType, setCurrentType] = useState("NOTICE");
  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const buttonRefs = useRef([]);
  
  // Redux에서 사용자 정보 가져오기
  const { userId, domainId } = useSelector((state) => {
    console.log("Redux auth 상태:", state.auth);
    return state.auth || {};
  });

  useEffect(() => {
    // 디버깅 코드 추가
    console.log("현재 Redux 상태:", { userId, domainId });
    console.log("localStorage domainId:", localStorage.getItem("domainId"));
    console.log("localStorage token:", localStorage.getItem("token"));

    // 로그인 체크
    if (!userId || !domainId) {
      console.log("로그인 필요: userId 또는 domainId가 없음");
      alert("로그인이 필요합니다.");
      navigate("/login");
      return;
    }

    setPosts([]);
    setPage(0);
    setHasMore(true);
    fetchPosts(0);
  }, [currentType, userId, domainId]);

  const fetchPosts = async (pageNumber) => {
    if (isLoading || !domainId) {
      console.log("fetchPosts 중단:", { isLoading, domainId });
      return;
    }
    setIsLoading(true);
    try {
      const params = {
        domainId: domainId,
        page: pageNumber,
        size: 10,
        sort: "createdAt,desc",
        ...(currentType !== "ALL" && { noticeType: currentType })
      };

      // API 요청 전 디버깅
      console.log("=== Notice API 요청 디버깅 ===");
      console.log("요청 URL:", "http://localhost:8080/api/v1/notices");
      console.log("요청 파라미터:", params);
      console.log("현재 domainId:", domainId);

      const response = await axios.get(
        "http://localhost:8080/api/v1/notices",
        { 
          params,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem("token")}`
          }
        }
      );
      
      // API 응답 데이터 디버깅
      console.log("=== Notice API 응답 디버깅 ===");
      console.log("전체 응답:", response);
      console.log("응답 데이터:", response.data);
      console.log("필터링된 게시글 수:", response.data.content?.length || 0);
      
      const newPosts = response.data.content || [];

      // 게시글 필터링 디버깅
      console.log("=== 게시글 필터링 디버깅 ===");
      console.log("필터링 전 게시글:", newPosts);
      console.log("각 게시글의 domainId:", newPosts.map(post => post.domainId));

      setPosts((prevPosts) =>
        pageNumber === 0 ? newPosts : [...prevPosts, ...newPosts]
      );

      setPage(pageNumber + 1);
      setHasMore(newPosts.length > 0);
    } catch (error) {
      console.error("=== Notice API 에러 디버깅 ===");
      console.error("에러 메시지:", error.message);
      if (error.response) {
        console.error("에러 응답 데이터:", error.response.data);
        console.error("에러 상태 코드:", error.response.status);
        console.error("에러 헤더:", error.response.headers);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getNoticeStatus = (endDate) => {
    if (!endDate) return "IN_PROGRESS";
    const now = new Date();
    const end = new Date(endDate);
    return now > end ? "ENDED" : "IN_PROGRESS";
  };

  const formatDate = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diff = now - date;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (now.toDateString() === date.toDateString()) {
      return minutes < 60 ? `${minutes}분 전` : `${hours}시간 전`;
    }
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")}`;
  };

  useEffect(() => {
    const activeButton = buttonRefs.current[["ALL", "NOTICE", "EVENT", "NEWS"].indexOf(currentType)];
    const indicator = document.querySelector(".NoticeList-active-indicator");
    if (activeButton && indicator) {
      const parentRect = activeButton.parentElement.getBoundingClientRect();
      const buttonRect = activeButton.getBoundingClientRect();
      const offsetLeft = buttonRect.left - parentRect.left;
      indicator.style.transform = `translateX(${offsetLeft}px)`;
      indicator.style.width = `${buttonRect.width}px`;
    }
  }, [currentType]);

  return (
    <Background type="white">
      <Hearder_ChuchType />
        <section className="NoticeList-sort-options">
          {["ALL", "NOTICE", "EVENT", "NEWS"].map((type, index) => (
            <button
              key={type}
              className={`NoticeList-sort-button ${currentType === type ? "NoticeList-active" : ""}`}
              onClick={() => setCurrentType(type)}
              ref={(el) => (buttonRefs.current[index] = el)}
            >
              {type === "ALL" ? "전체보기" : type === "NOTICE" ? "공지" : type === "EVENT" ? "행사" : "소식"}
            </button>
          ))}
          <div className="NoticeList-sort-button-wrapper">
          </div>
        </section>
            <div className="NoticeList-active-indicator"></div>

      <div className="NoticeList-container">
   
        <section className="NoticeList-posts">
          {posts.map((post) => (
            <div
              key={post.boardId}
              className="NoticeList-post"
              onClick={() => navigate(`/notice/${post.boardId}`)}
            >
              <div className="NoticeList-post-left">
                <div className="NoticeList-post-tags">
                  {post.hashTag?.split(" ").map((tag, index) => (
                    <span key={index} className="NoticeList-post-tag">
                      <span
                        className="NoticeList-hashtag-symbol"
                        style={{ color: currentType === "NOTICE" ? "#1133F6" : "#FD1919" }}
                      >
                        #&nbsp;
                      </span>
                      {tag.substring(1)}
                    </span>
                  ))}
                  <span className={`status-tag ${getNoticeStatus(post.displayEndDate).toLowerCase()}`}>
                    {getNoticeStatus(post.displayEndDate) === "ENDED" ? "마감" : "진행중"}
                  </span>
                  <span className={`NoticeList-type-tag ${post.noticeType.toLowerCase()}`}>
                    {post.noticeType === "NOTICE" ? "공지" : post.noticeType === "EVENT" ? "행사" : "소식"}
                  </span>
                </div>
                <h4 className="NoticeList-post-title">{post.title}</h4>
                <div className="NoticeList-post-meta">
                  <span>{formatDate(post.createdAt)}</span>
                  <span> | 조회 {post.view || 0}</span>
                </div>
              </div>
              <div className="NoticeList-post-right">
                {post.images?.length > 0 ? (
                  <img
                    src={`http://localhost:8080/uploads/${post.images[0].fileName}`}
                    alt="썸네일"
                    className="NoticeList-post-thumbnail"
                  />
                ) : (
                  <div className="NoticeList-post-thumbnail transparent"></div>
                )}
              </div>
            </div>
          ))}
        </section>

        <BottomNav />
      </div>
    </Background>
  );
};

export default NoticeList;
