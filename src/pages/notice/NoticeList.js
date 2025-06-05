import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import "styles/notice/noticeList.css";
import BottomNav from "layouts/BottomNav";
import Hearder_ChuchType from "layouts/Hearder_ChurchType";
import Background from "context/Background";
import Page from "components/styles/Page";
import TagButton from 'components/common/TagButton';

const NoticeList = () => {
  const navigate = useNavigate();
  const { noticeId } = useParams();
  const [posts, setPosts] = useState([]);
  const [currentType, setCurrentType] = useState("ALL");
  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const buttonRefs = useRef([]);
  
  // Redux에서 사용자 정보 가져오기
  const { userId, domainId } = useSelector((state) => {
    return state.auth || {};
  });

  const NOTICE_TYPES = {
    ALL: { id: "ALL", label: "전체보기" },
    NOTICE: { id: "NOTICE", label: "공지" },
    EVENT: { id: "EVENT", label: "행사" },
    NEWS: { id: "NEWS", label: "소식" }
  };

  const handleTypeChange = async (type) => {
    setCurrentType(type);
    setPosts([]);
    setPage(0);
    
    if (isLoading || !domainId) return;
    setIsLoading(true);
    
    try {
      const params = {
        page: 0,
        size: 10,
        sort: "createdAt,desc",
        domainId
      };

      if (type !== "ALL") {
        params.noticeType = type;
      }

      const response = await axios.get("http://localhost:8080/api/v1/notices", {
        params,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("token")}`
        }
      });

      const newPosts = response.data.content || [];
      setPosts(newPosts);
      setPage(1);
      setHasMore(newPosts.length > 0);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
    setIsLoading(false);
  };

  const fetchPosts = async (pageNumber) => {
    if (isLoading || !domainId) return;
    setIsLoading(true);
    
    try {
      const params = {
        page: pageNumber,
        size: 10,
        sort: "createdAt,desc",
        domainId
      };

      if (currentType !== "ALL") {
        params.noticeType = currentType;
      }

      const response = await axios.get("http://localhost:8080/api/v1/notices", {
        params,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("token")}`
        }
      });

      const newPosts = response.data.content || [];
      setPosts(pageNumber === 0 ? newPosts : [...posts, ...newPosts]);
      setPage(pageNumber + 1);
      setHasMore(newPosts.length > 0);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (!userId || !domainId) {
      navigate("/login");
      return;
    }
    fetchPosts(0);
  }, [userId, domainId]);

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

  const getNoticeStatus = (endDate) => {
    if (!endDate) return "IN_PROGRESS";
    const now = new Date();
    const end = new Date(endDate);
    return now > end ? "ENDED" : "IN_PROGRESS";
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
      <div className="NoticeList_header">
        <Hearder_ChuchType />
        
        <div className="NoticeList-sort-options">
          {Object.values(NOTICE_TYPES).map((type, index) => (
            <button
              key={type.id}
              className={`NoticeList-sort-button ${currentType === type.id ? "NoticeList-active" : ""}`}
              onClick={() => handleTypeChange(type.id)}
              ref={(el) => (buttonRefs.current[index] = el)}
            >
              {type.label}
            </button>
          ))}
          <div className="NoticeList-sort-button-wrapper">
            <div className="NoticeList-active-indicator"></div>
          </div>
        </div>
      </div>

      <Page className="NoticeList-page" scrollable={true}>
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
                      <span className={`NoticeList-hashtag-symbol ${post.noticeType === "NOTICE" ? "notice" : "event"}`}>
                        #&nbsp;
                      </span>
                      {tag.substring(1)}
                    </span>
                  ))}
                  <TagButton
                    variant={getNoticeStatus(post.displayEndDate).toLowerCase()}
                    isActive={false}
                    className="small"
                  >
                    {getNoticeStatus(post.displayEndDate) === "ENDED" ? "마감" : "진행중"}
                  </TagButton>
                  <TagButton
                    variant={post.noticeType.toLowerCase()}
                    isActive={false}
                    className="small with-margin"
                  >
                    {post.noticeType === "NOTICE" ? "공지" :
                     post.noticeType === "EVENT" ? "행사" :
                     post.noticeType === "NEWS" ? "소식" : ""}
                  </TagButton>
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
      </Page>
    </Background>
  );
};

export default NoticeList;
