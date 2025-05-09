import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../../styles/board/boardList.css";
import BottomNav from "layouts/BottomNav";
import IconHeart from "assets/icon/IconHeart.png"; // 좋아요 아이콘
import IconComment from "assets/icon/IconCommentWhite.png"; // 댓글 아이콘

import Hearder_ChuchType from "layouts/Hearder_ChurchType";



const BoardNotice = () => {
  const navigate = useNavigate();
  const { boardId } = useParams();
  const [posts, setPosts] = useState([]);
  const [currentType, setCurrentType] = useState("NOTICE");
  const [sortOption, setSortOption] = useState("latest");
  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const buttonRefs = useRef([]);
  const [likeCounts, setLikeCounts] = useState(0);
  const [commentCounts, setCommentCounts] = useState({});

  useEffect(() => {
    setPosts([]);
    setPage(0);
    setHasMore(true);
    fetchPosts(0);
  }, [currentType, sortOption]);
  const fetchPosts = async (pageNumber) => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const filterDate =
        sortOption === "likesLast7Days"
          ? 7
          : sortOption === "likesLast30Days"
            ? 30
            : null;
      const params = {
        type: currentType,
        page: pageNumber,
        sort: sortOption === "latest" ? "cDate,desc" : null,
        filterDate: filterDate || undefined,
        sort: sortOption !== "latest" ? sortOption : "cDate,desc", // ✅ 이 부분 수정!
      };
      const response = await axios.get(
        "http://localhost:8080/api/v1/boards",
        { params }
      );
      // API 응답 데이터를 콘솔에 출력하여 디버깅
      console.log("API 응답 데이터:", response.data.content);
      const newPosts = response.data.content || [];

      // 게시글 목록을 상태에 저장
      setPosts((prevPosts) =>
        pageNumber === 0 ? newPosts : [...prevPosts, ...newPosts]
      );

      // 각 게시글의 좋아요 수를 가져옴
      newPosts.forEach((post) => {
        fetchLikeCount(post.boardId); // 총 좋아요 수 가져오기
        fetchCommentCount(post.boardId);  // 총 댓글 수 가져오기
      });

      setPage(pageNumber + 1);
      setHasMore(newPosts.length > 0);
    } catch (error) {
      console.error("게시글 가져오기 실패:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diff = now - date;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (now.toDateString() === date.toDateString()) {
      if (minutes < 60) return `${minutes}분 전`;
      return `${hours}시간 전`;
    } else {
      return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(
        2,
        "0"
      )}.${String(date.getDate()).padStart(2, "0")}`;
    }
  };
  const handleSortChange = (sort, index) => {
    setSortOption(sort);
    const activeButton = buttonRefs.current[index];
    const indicator = document.querySelector(".active-indicator");
    if (activeButton && indicator) {
      const parentRect = activeButton.parentElement.getBoundingClientRect();
      const buttonRect = activeButton.getBoundingClientRect();
      const offsetLeft = buttonRect.left - parentRect.left;
      indicator.style.transform = `translateX(${offsetLeft}px)`;
      indicator.style.width = `${buttonRect.width}px`;
    }
  };

  // 좋아요 개수
  const fetchLikeCount = async (boardId) => {
    try {
      const response = await axios.get(`/api/v1/likes/BOARD/${boardId}/count`);
      console.log(`게시글 ${boardId} 좋아요 개수 응답:`, response.data);

      setLikeCounts((prevCounts) => ({
        ...prevCounts,
        [boardId]: response.data, // 개별 게시글 ID를 키로 저장
      }));
    } catch (error) {
      console.error(`게시글 ${boardId} 좋아요 개수 가져오기 실패`, error);
    }
  };

  // 댓글 갯수 (댓글 수 + 대댓글 수)
  const fetchCommentCount = async (boardId) => {
    try {
      const response = await axios.get(`/api/v1/comments/count/${boardId}`);
      console.log(`게시글 ${boardId} 총 댓글 개수 응답:`, response.data);

      setCommentCounts((prevCounts) => ({
        ...prevCounts,
        [boardId]: response.data, // 개별 게시글 ID를 키로 저장
      }));
    } catch (error) {
      console.error(`게시글 ${boardId} 총 댓글 개수 가져오기 실패`, error);
    }
  };

  useEffect(() => {
    const activeButton = buttonRefs.current[0];
    const indicator = document.querySelector(".active-indicator");
    if (activeButton && indicator) {
      const parentRect = activeButton.parentElement.getBoundingClientRect();
      const buttonRect = activeButton.getBoundingClientRect();
      const offsetLeft = buttonRect.left - parentRect.left;
      indicator.style.transform = `translateX(${offsetLeft}px)`;
      indicator.style.width = `${buttonRect.width}px`;
    }
  }, []);
  return (
    <div>
      <div className="BoardList_header">
        <Hearder_ChuchType />
      </div>
      <div className={`board-list-container ${currentType.toLowerCase()}`}>
        {/* <h1 className="logo-text-wrapper">
          <span className="logo-text static">ctg</span>
          <span className={`logo-text dynamic ${currentType.toLowerCase()}`}>
            ctg
          </span>
        </h1> */}
        {/* 정렬 옵션 버튼 */}
        <section className="board-sort-options">
          {["latest", "likesLast7Days", "likesLast30Days"].map((sort, index) => (
            <button
              key={sort}
              className={`sort-button ${sortOption === sort ? "active" : ""}`}
              onClick={() => handleSortChange(sort, index)}
              ref={(el) => (buttonRefs.current[index] = el)}
            >
              {sort === "latest" ? "숭신교회 공지사항" : sort === "likesLast7Days" ? "주간 공지사항"  : "월간 인기글"}
            </button>
          ))}
          <div className="sort-button-wrapper">
            <div className="active-indicator"></div>
          </div>
        </section>
        <section className="board-posts">
          {posts.map((post) => (
            <div
              key={post.boardId}
              className="board-post"
              onClick={() => navigate(`/board/${post.boardId}`)}
            >
              {/* 왼쪽 컨텐츠 */}
              <div className="post-left">
                <div className="post-tags">
                  {post.hashTag &&
                    post.hashTag.split(" ").map((tag, index) => (
                      <span key={index} className="post-tag">
                        <span
                          className="hashtag-symbol"
                          style={{
                            color:
                              currentType === "NOTICE"
                                ? "#1133F6"
                                : "#FD1919",
                          }}
                        >
                          #&nbsp;
                        </span>
                        {tag.substring(1)}
                      </span>
                    ))}
                </div>
                <h4 className="post-title">{post.title}</h4>
                <div className="post-meta">
                  <span>{formatDate(post.cDate)}</span>
                  <span> | 조회 {post.view || 0}</span>
                </div>
              </div>
              {/* 오른쪽 컨텐츠 */}
              <div className="post-right">
                {post.images && post.images.length > 0 ? (
                  <img
                    src={`http://localhost:8080/uploads/${post.images[0].fileName}`}
                    alt="썸네일"
                    className="post-thumbnail"
                  />
                ) : (
                  <div className="post-thumbnail transparent"></div>
                )}
                <div className="post-stats">
                  <span className="post-likes">
                    <img src={IconHeart} alt="좋아요" className="icon" />
                    {likeCounts[post.boardId] || 0}
                  </span>
                  <span className="post-comments">
                    <img src={IconComment} alt="댓글" className="icon" />
                    {commentCounts[post.boardId] || 0}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </section>
        <BottomNav onLogoClick={(type) => setCurrentType(type)} />
      </div>
    </div>
  );
};
export default BoardNotice;