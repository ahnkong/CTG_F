import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import "styles/board/boardDetail.css";
import { IMAGES } from "constants/images";
import Background from "context/Background";


const BoardDetail = () => {
    const { boardId } = useParams();
    const [board, setBoard] = useState(null);
    const [comments, setComments] = useState([]);
    const [likeCount, setLikeCount] = useState(0);
    const [isLiked, setIsLiked] = useState(false);
    const [commentText, setCommentText] = useState("");
    const [replyText, setReplyText] = useState({});
    const [totalCommentCount, setTotalCommentCount] = useState(0);
    const [activeMenu, setActiveMenu] = useState(null);
    const [editMode, setEditMode] = useState(null);
    const [editText, setEditText] = useState({});
    const [submittingReply, setSubmittingReply] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const navigate = useNavigate();


    // Redux에서 userId 가져오기
    const userId = useSelector((state) => state.auth.userId);
    console.log("현재 로그인 유저 ID:", userId);

    useEffect(() => {
        fetchBoardDetail();
        fetchComments();
        fetchLikeStatus();
        fetchLikeCount();
        fetchTotalCommentCount();
    }, [boardId]);


    // 게시글 상세 정보 가져오기
    const fetchBoardDetail = async () => {
        try {
            const response = await axios.get(`/api/v1/boards/${boardId}`);
            setBoard(response.data);
        } catch (error) {
            console.error("게시글 상세 정보 가져오기 실패", error);
        }
    };
    

    // 댓글 목록 가져오기
    const fetchComments = async () => {
        try {
            const response = await axios.get(`/api/v1/comments/by-board/${boardId}`, {
                params: { userId },
            });
            const commentsData = response.data;

            // 댓글 + 대댓글 좋아요 수 병렬 fetch
            const commentsWithLikes = await Promise.all(
                commentsData.map(async (comment) => {
                    const commentLikeCount = await fetchCommentLikeCount(comment.commentId);

                    const reCommentsWithLikes = await Promise.all(
                        comment.reComments.map(async (reComment) => {
                            const reCommentLikeCount = await fetchReCommentLikeCount(reComment.recommentId);
                            return {
                                ...reComment,
                                likeCount: reCommentLikeCount,
                                liked: reComment.liked, // ✅ 이 줄 추가, 새로고침 누르면 좋아요 체크가 안되어 잇어서, 이부분 추가

                            };
                        })
                    );
                    console.log("서버에서 받은 대댓글:", comment.reComments);

                    return {
                        ...comment,
                        likeCount: commentLikeCount,
                        liked: comment.liked, // ✅ 이 줄 추가 - 새로고침 누르면 좋아요 체크가 안되어 잇어서, 이부분 추가
                        reComments: reCommentsWithLikes,
                    };
                })
            );

            setComments(commentsWithLikes);
        } catch (error) {
            console.error("댓글 목록 + 좋아요 수 가져오기 실패", error);
        }
    };


    // 좋아요 상태 확인 (게시글)
    const fetchLikeStatus = async () => {
        try {
            if (!userId) {
                console.error("사용자 ID가 없습니다.");
                return;
            }

            const response = await axios.get(`/api/v1/likes/BOARD/${boardId}/status`, {
                params: { userId } // 현재 로그인한 사용자 ID 반영
            });

            setIsLiked(response.data); // 서버에서 받은 좋아요 상태 적용

        } catch (error) {
            console.error("좋아요 상태 확인 실패", error);
        }
    };

    // 좋아요 개수 확인 (보드)
    const fetchLikeCount = async () => {
        try {
            const response = await axios.get(`/api/v1/likes/BOARD/${boardId}/count`);
            console.log("좋아요 개수 응답:", response.data);
            setLikeCount(response.data);
        } catch (error) {
            console.error("좋아요 개수 가져오기 실패", error);
        }
    };

    // 좋아요 개수 확인 (코멘트)
    const fetchCommentLikeCount = async (commentId) => {
        const res = await axios.get(`/api/v1/likes/COMMENT/${commentId}/count`);
        return res.data;
    };

    // 좋아요 개수 확인 (리코멘트)
    const fetchReCommentLikeCount = async (reCommentId) => {
        const res = await axios.get(`/api/v1/likes/RECOMMENT/${reCommentId}/count`);
        return res.data;
    };

    // 총 댓글 수
    const fetchTotalCommentCount = async () => {
        try {
            const response = await axios.get(`/api/v1/comments/count/${boardId}`);
            console.log(`게시글 ${boardId} 총 댓글 개수 응답:`, response.data);
            setTotalCommentCount(response.data);
        } catch (error) {
            console.error(`게시글 ${boardId} 총 댓글 개수 가져오기 실패`, error);
        }
    };

    if (!board) return <div>Loading...</div>;

    // 타입에 따라 클래스 이름 설정
    const containerClass = `board-detail-container ${board.type.toLowerCase()} ${board.images.length > 0 ? "with-image" : "no-image"}`;

    const formatDate = (date) => {
        const now = new Date();
        const postDate = new Date(date);
        const diff = (now - postDate) / 1000;

        if (diff < 60) return "방금 전"; // ✅ 1분 이내 → "방금 전"
        if (diff < 3600) return `${Math.floor(diff / 60)}분 전`; // ✅ 1시간 이내 → "X분 전"
        if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`; // ✅ 24시간 이내 → "X시간 전"
        return postDate.toLocaleDateString();
    };

    // 게시글 좋아요 토글
    const toggleLike = async () => {
        try {
            // 현재 로그인한 사용자 ID 가져오기 (예: 로컬 스토리지, Context API, Redux 등)
            if (!userId) {
                console.error("사용자 ID가 없습니다.");
                return;
            }

            const response = await axios.patch(`/api/v1/likes/BOARD/${boardId}/`,
                { userId },  // ✅ 현재 로그인된 사용자 ID 사용
                {
                    headers: { 'Content-Type': 'application/json' }
                }
            );

            setIsLiked(prev => !prev);  // ✅ 상태 토글

            // 좋아요 개수 업데이트
            fetchLikeCount();

        } catch (error) {
            console.error("좋아요 토글 실패", error);
        }
    };

    // 댓글 좋아요 토글
    const toggleCommentLike = async (commentId) => {
        try {
            if (!userId) {
                console.error("사용자 ID가 없습니다.");
                return;
            }

            // ✅ 1. UI에서 먼저 like 상태/개수 업데이트
            setComments(prevComments =>
                prevComments.map(comment =>
                    comment.commentId === commentId
                        ? {
                            ...comment,
                            liked: !comment.liked,
                            likeCount: comment.liked
                                ? comment.likeCount - 1
                                : comment.likeCount + 1
                        }
                        : comment
                )
            );

            // ✅ 2. 서버에 좋아요 토글 요청
            await axios.patch(
                `/api/v1/likes/COMMENT/${commentId}/`,
                { userId },
                { headers: { 'Content-Type': 'application/json' } }
            );

        } catch (error) {
            console.error(`댓글 ${commentId} 좋아요 토글 실패`, error);
        }
    };


    // 대댓글 좋아요 토글
    const toggleReCommentLike = async (reCommentId) => {
        if (!userId || !reCommentId) {
            console.error("사용자 ID 또는 대댓글 ID가 없습니다.");
            return;
        }

        try {
            // ✅ 1. UI 먼저 업데이트
            setComments((prevComments) =>
                prevComments.map((comment) => ({
                    ...comment,
                    reComments: comment.reComments.map((reComment) =>
                        reComment.recommentId === reCommentId
                            ? {
                                ...reComment,
                                liked: !reComment.liked,
                                likeCount: reComment.liked
                                    ? reComment.likeCount - 1
                                    : reComment.likeCount + 1
                            }
                            : reComment
                    ),
                }))
            );

            // ✅ 2. 서버에 토글 요청
            await axios.patch(
                `/api/v1/likes/RECOMMENT/${reCommentId}/`,
                { userId },
                { headers: { 'Content-Type': 'application/json' } }
            );
        } catch (error) {
            console.error("대댓글 좋아요 토글 실패", error);
        }
    };


    // const handleCommentSubmit = async () => {
    //     if (!commentText.trim()) return;
    //     try {
    //         await axios.post(`/api/v1/comments`, {
    //             boardId,
    //             userId,
    //             content: commentText
    //         });
    //         setCommentText("");
    //         fetchComments();
    //     } catch (error) {
    //         console.error("댓글 등록 실패", error);
    //     }
    // };


    let isSubmitting = false;

    const handleCommentSubmit = async () => {
        if (!commentText.trim() || isSubmitting) return;

        isSubmitting = true; // 🔐 중복 방지
        try {
            await axios.post(`/api/v1/comments`, {
                boardId,
                userId,
                content: commentText
            });
            setCommentText("");
            fetchComments();
        } catch (error) {
            console.error("댓글 등록 실패", error);
        } finally {
            isSubmitting = false;
        }
    };

    // const handleReplySubmit = async (commentId) => {
    //     if (!replyText[commentId]?.trim()) return; // 입력값이 비어있으면 실행 안 함.

    //     try {
    //         const response = await axios.post(`/api/v1/recomments`, {
    //             commentId,  // 원 댓글 ID (대댓글의 부모)
    //             userId,
    //             content: replyText[commentId]
    //         });

    //         console.log("대댓글 등록 성공:", response.data);

    //         setReplyText((prev) => ({ ...prev, [commentId]: "" })); // 입력창 초기화
    //         fetchComments(); // 댓글 목록 다시 불러오기
    //     } catch (error) {
    //         console.error("대댓글 등록 실패", error);
    //     }
    // };

    const handleReplySubmit = async (commentId) => {
        if (!replyText[commentId]?.trim() || submittingReply) return; // ✅ 중복 방지

        setSubmittingReply(true);
        try {
            const response = await axios.post(`/api/v1/recomments`, {
              commentId,
              userId,
              content: replyText[commentId]
            });
        
            const newReComment = response.data;
        
            setComments(prevComments =>
              prevComments.map(comment =>
                comment.commentId === commentId
                  ? {
                      ...comment,
                      reComments: [...comment.reComments, newReComment]
                    }
                  : comment
              )
            );
        
            setReplyText((prev) => ({ ...prev, [commentId]: "" }));
          } catch (error) {
            console.error("대댓글 등록 실패", error);
          } finally {
            setSubmittingReply(false);
          }
        };

    const handleMenuToggle = (commentId) => {
        setActiveMenu((prev) => (prev === commentId ? null : commentId));
    };

    const handleEditClick = (commentId, currentContent) => {
        setEditMode(commentId); // 현재 수정 중인 댓글 ID 저장
        setEditText((prev) => ({ ...prev, [commentId]: currentContent })); // 기존 댓글 내용 설정
    };

    const handleEditChange = (commentId, newText) => {
        setEditText((prev) => ({ ...prev, [commentId]: newText }));
    };

    const handleEditSubmit = async (commentId) => {
        try {
            await axios.put(`/api/v1/comments/${commentId}`, {
                content: editText[commentId] // content만 전송
            });

            setEditMode(null);
            fetchComments();
        } catch (error) {
            console.error("댓글 수정 실패", error);
        }
    };

    // 댓글 삭제
    const handleDeleteComment = async (commentId) => {
        try {
            await axios.delete(`/api/v1/comments/${commentId}`);
            fetchComments(); // 삭제 후 댓글 목록 갱신
        } catch (error) {
            console.error("댓글 삭제 실패", error);
        }
    };

    return (
        <Background type="white">
            <div className={containerClass}>
                <div className="board-content-wrapper">
                    <div className="board-container">
                    <div className="board-header">
                        <div className="header-left-icons">
                            <div className="back-icon" onClick={() => navigate(-1)} />
                            <div className="home-icon" onClick={() => navigate("/main")} />
                        </div>
                        <div className="menu-icon" />
                    </div>
                    {board.images.length > 0 && (
                        <div className="board-image-carousel">
                            {board.images.map((image, index) => (
                                <img
                                    key={index}
                                    src={`http://localhost:3000/uploads/${encodeURIComponent(image.fileName)}`}
                                    alt={`Board Image ${index + 1}`}
                                    className="board-carousel-image"
                                />
                            ))}
                        </div>
                    )}
                    {/* 이미지 없으면 없게! */}
                    {/* {board.images && board.images.length > 0 ? (
                    <div className="board-image-carousel">
                        {board.images.map((image, index) => (
                        <img
                            key={index}
                            src={`http://localhost:3000/uploads/${encodeURIComponent(image.fileName)}`}
                            alt={`Board Image ${index + 1}`}
                            className="board-carousel-image"
                        />
                        ))}
                    </div>
                    ) : (
                    <div className="board-no-image-spacer" />
                    )} */}
                    <h1 className="Detail-logo-text-wrapper">
                        <span className="logo-text static">ctg</span>
                        <span className={`logo-text dynamic ${board.type.toLowerCase()}`}>
                            ctg
                        </span>
                    </h1>
                    <div className="board-info">
                        {/* 왼쪽: 프로필 이미지 */}
                        <div className="board-info-left">
                            <div className="profile-image">
                                <img
                                    src={board?.userProfileImage ? `http://localhost:8080${board.userProfileImage}` : IMAGES.DEFAULT_PROFILE}
                                    alt="User Profile"
                                    className="profile-img"
                                />
                            </div>
                        </div>
                        {/* 가운데: 작성자, 게시글 생성일, 댓글 수 */}
                        <div className="board-info-center">
                            <p className="author-name">{board.userNickname}</p>
                            <p className="post-date">
                                <span className="icon clock-icon" />
                                {formatDate(board.cDate)}
                                <span className="icon commentCount-icon" />
                                {totalCommentCount}
                            </p>
                        </div>
                        {/* 오른쪽 : 게시글 좋아요 토글 */}
                        <div className="board-info-right">
                            <button
                                className={`like-button ${isLiked ? "liked" : ""}`}
                                onClick={toggleLike}
                            />
                        </div>
                    </div>


                    <h2 className="board-content-title">{board.title}</h2>
                    <div className="board-hashtags">
                        {board.hashTag && board.hashTag.split(" ").map((tag, index) => (
                            <span key={index} className="board-tag">{tag}</span>
                        ))}
                    </div>
                    <div className="board-content">{board.content}</div>
                    <p className="board-stats">
                        좋아요 {likeCount} · 조회 {board.view}
                    </p>
                </div>

                <div className="board-comment-container">
                    {/* 댓글 입력 필드 */}
                    {/* 댓글 입력 필드 - 하단 고정 */}
                    <div className="fixed-comment-input">
                        <input
                            type="text"
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault();
                                    handleCommentSubmit();
                                }
                            }}
                            placeholder="댓글을 입력하세요..."
                            className="comment-input"
                        />
                        <button onClick={handleCommentSubmit} className="comment-submit-btn">등록</button>
                    </div>


                    {/* 댓글 목록 */}
                    <div className="comment-section">
                        {comments.map(comment => (
                            <div key={comment.commentId} className="comment-container">
                                {/* 🔹 댓글 상단 영역 */}
                                <div className="comment-header">
                                    {/* 🔹 왼쪽 (프로필 이미지) */}
                                    <div className="comment-user">
                                        <img src={comment.userProfileImage || IMAGES.DEFAULT_PROFILE} alt="Profile" className="comment-profile-img" />
                                    </div>

                                    {/* 🔹 가운데 (닉네임 & 좋아요/댓글 정보) */}
                                    <div className="comment-info">
                                        <span className="comment-nickname">{comment.userNickname}</span>
                                        <span className="comment-time">{formatDate(comment.coCDate)}</span>


                                    </div>

                                    {/* 🔹 오른쪽 (메뉴 버튼) */}
                                    <div className="comment-menu">
                                        <button className="comment-menu-button" onClick={() => handleMenuToggle(comment.commentId)}>
                                            <span className="comment-menu-icon"></span>
                                        </button>
                                        {activeMenu === comment.commentId && ( // ✅ 수정: activeMenu를 기준으로 메뉴 표시
                                            <div className="comment-menu-options">
                                                <button onClick={() => handleEditClick(comment.commentId, comment.content)}>수정</button>
                                                <button onClick={() => handleDeleteComment(comment.commentId)}>삭제</button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* 🔹 댓글 본문 (수정 모드) */}
                                {editMode === comment.commentId ? (
                                    <div className="edit-input">
                                        <input
                                            type="text"
                                            value={editText[comment.commentId] || ""}
                                            onChange={(e) => handleEditChange(comment.commentId, e.target.value)}
                                        />
                                        <button onClick={() => handleEditSubmit(comment.commentId)}>저장</button>
                                        <button onClick={() => setEditMode(null)}>취소</button>
                                    </div>
                                ) : (
                                    <p className="comment-content">
                                        {comment.content}
                                        {comment.edited && <span className="edited-label"> (수정됨)</span>}
                                    </p>
                                )}

                                <div className="comment-actions">
                                    {/* 좋아요 버튼 */}
                                    <button className={`comment-like-button ${comment.liked ? "liked" : ""}`} onClick={() => toggleCommentLike(comment.commentId)} />
                                    <span className="like-count-text">{comment.likeCount === 0 ? "좋아요" : comment.likeCount}</span>

                                    {/* 댓글 버튼 (대댓글 입력 토글) */}
                                    <button
                                        className="reply-button"
                                        onClick={() => setReplyText((prev) =>
                                            prev[comment.commentId] !== undefined
                                                ? Object.fromEntries(Object.entries(prev).filter(([key]) => key !== String(comment.commentId)))
                                                : { ...prev, [comment.commentId]: "" }
                                        )}
                                    >
                                        <span className="reply-icon" />
                                    </button>
                                    <span className="reply-count-text">
                                        {comment.reComments.length > 0 ? comment.reComments.length : "댓글 달기"}
                                    </span>
                                </div>

                                {/* ✅ 대댓글 입력창 (토글) */}
                                <div className="reply-input-section">
                                {replyText[comment.commentId] !== undefined && (
                                    <div className="reply-input">
                                        <input
                                            type="text"
                                            value={replyText[comment.commentId] || ""}
                                            onChange={(e) => setReplyText((prev) => ({ ...prev, [comment.commentId]: e.target.value }))}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter" && !e.shiftKey) {
                                                    e.preventDefault();
                                                    handleReplySubmit(comment.commentId);
                                                }
                                            }}
                                            placeholder="답글을 입력하세요..."
                                        />
                                        <button className="recomment-input" onClick={() => handleReplySubmit(comment.commentId)}>등록</button>
                                    </div>
                                )}
                                </div>

                                {/* 🔹 대댓글 목록 */}
                                {comment.reComments && comment.reComments.length > 0 && (
                                    <div className="recomment-section">
                                        {comment.reComments.map((reComment, index) => (
                                        <div
                                            key={reComment.reCommentId || `fallback-${index}`}
                                            className="recomment"
                                        >
                                                <div className="comment-user">
                                                    <img src={reComment.userProfileImage || IMAGES.DEFAULT_PROFILE} alt="Profile" className="comment-profile-img" />
                                                    <div className="nickname-time-wrapper">
                                                      <span className="comment-nickname">{reComment.userNickname}</span>
                                                    <span className="comment-time">{formatDate(reComment.reCDate)}</span>
                                                    </div>
                                                </div>
                                                <p className="comment-content">{reComment.content}</p>

                                                {/* 🔹 대댓글 좋아요 버튼 */}
                                                <button className={`comment-like-button ${reComment.liked ? "liked" : ""}`} onClick={() => toggleReCommentLike(reComment.recommentId)} />
                                                {/* <span className="like-count-text">{reComment.likeCount === 0 ? "좋아요" : reComment.likeCount}</span> */}
                                                <span className="like-count-text">  {reComment.likeCount > 0 ? reComment.likeCount : '좋아요'}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                        </div>
                    </div> {/* comment-section */}
                </div>
            </div>
        </Background>
    );
};

export default BoardDetail;

