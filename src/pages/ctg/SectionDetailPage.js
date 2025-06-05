import CatechismHeader from "components/CatechismHeader";
import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Background from "context/Background";
import "styles/ctg/section-detail.css";

// 구절 파싱
const extractVersesFromGroup = (groupText) => {
  if (!groupText) return [];
  const parts = groupText.split(/[;,]/);
  const results = [];
  let currentBook = "";

  parts.forEach((part) => {
    const trimmed = part.trim().replace(/\.$/, "");
    const match = trimmed.match(/^([가-힣]+)\s*(\d+):([\d~]+)$/);
    if (match) {
      currentBook = match[1];
      results.push({ book: match[1], chapter: match[2], verse: match[3] });
    } else {
      const subMatch = trimmed.match(/^(\d+):([\d~]+)$/);
      if (subMatch && currentBook) {
        results.push({
          book: currentBook,
          chapter: subMatch[1],
          verse: subMatch[2],
        });
      }
    }
  });

  return results;
};

// 범위 확장
const expandVerseRange = (rangeStr) => {
  if (rangeStr.includes("~")) {
    const [start, end] = rangeStr.split("~").map(Number);
    return Array.from({ length: end - start + 1 }, (_, i) => String(start + i));
  } else {
    return [rangeStr];
  }
};

// 랜덤 파스텔 색상 생성
const generatePastelColor = () => {
  const hue = Math.floor(Math.random() * 360);
  return `hsl(${hue}, 70%, 85%)`;
};

const SectionDetailPage = () => {
  const { chapter, section } = useParams();
  const navigate = useNavigate();
  const [sections, setSections] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedNoteNumber, setSelectedNoteNumber] = useState(null);
  const [selectedVerseTexts, setSelectedVerseTexts] = useState([]);
  const [visibleVerses, setVisibleVerses] = useState({});
  const [selectedVerseKey, setSelectedVerseKey] = useState(null);

  const colorMapRef = useRef({});

  const sec = sections[currentIndex] || {};

  // 각주 번호 매핑
  const referenceMap = {};
  if (sec.reference) {
    const groups = sec.reference.match(/\d+\)\s*[^]+?(?=\d+\)|$)/g) || [];
    groups.forEach((g) => {
      const match = g.match(/^(\d+)\)\s*(.+)$/s);
      if (match) {
        referenceMap[match[1]] = match[2];
      }
    });
  }

  useEffect(() => {
    fetch(`/api/books/chapter/${chapter}`)
      .then((res) => (res.ok ? res.json() : Promise.reject("네트워크 오류")))
      .then((data) => {
        const idx = data.findIndex((s) => String(s.sectionNumber) === section);
        setSections(data);
        setCurrentIndex(idx >= 0 ? idx : 0);
      })
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }, [chapter, section]);

  const fetchVerseTexts = async (groupText) => {
    if (!groupText) return;
    const verseList = extractVersesFromGroup(groupText);
    const bible = await fetch("/data/bible.json").then((res) => res.json());
    const results = [];

    for (const ref of verseList) {
      const verseNums = expandVerseRange(ref.verse);
      verseNums.forEach((vNum) => {
        const key = `${ref.book}${ref.chapter}:${vNum}`;
        results.push({
          book: ref.book,
          chapter: ref.chapter,
          verse: vNum,
          text: bible[key] || "본문 없음",
        });
      });
    }

    setSelectedVerseTexts(results);
    setVisibleVerses({});
  };

  const handleNoteClick = (noteNum) => {
    const groupText = referenceMap[noteNum];
    if (!groupText) return;

    setSelectedNoteNumber(noteNum);
    setSelectedVerseTexts([]);
    fetchVerseTexts(groupText);
  };

  const toggleVerseVisibility = (key) => {
    setVisibleVerses((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const renderContentWithButtons = (content) => {
    const parts = content.split(/(\d+\))/g);
    return parts.map((part, index) => {
      const match = part.match(/^(\d+)\)$/);
      if (match) {
        const num = match[1];
        if (!colorMapRef.current[num]) {
          colorMapRef.current[num] = generatePastelColor();
        }
        return (
          <button
            key={index}
            className="note-button"
            onClick={() => handleNoteClick(num)}
            style={{
              backgroundColor: colorMapRef.current[num],
              color: "#333",
              fontSize: "0.75rem",
              fontWeight: 500,
            }}
          >
            {num})
          </button>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  if (loading)
    return (
      <Background type="white">
        <p>Loading…</p>
      </Background>
    );
  if (error)
    return (
      <Background type="white">
        <p>Error: {error}</p>
      </Background>
    );

  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < sections.length - 1;

  return (
    <Background type="white">
      <CatechismHeader />
      <div className="section-detail-container">
        <div className="section-header">
          <h2 className="chapter-title">{chapter}장</h2>
          <span className="section-pill">📖 {sec.sectionNumber}문</span>
        </div>

        <h3 className="question-title">{sec.question}</h3>
        <p className="answer-text">
          {renderContentWithButtons(sec.content || "")}
        </p>

        {selectedVerseTexts.length > 0 && (
          <div className="verse-group-box">
            {/* ✅ 버튼 가로 스크롤 */}
            <div className="verse-scroll-container">
              {selectedVerseTexts.map((v, idx) => {
                const verseKey = `${v.book}${v.chapter}:${v.verse}`;
                return (
                  <button
                    key={idx}
                    className={`verse-toggle-button ${
                      selectedVerseKey === verseKey ? "active" : ""
                    }`}
                    onClick={() => setSelectedVerseKey(verseKey)}
                  >
                    {v.book} {v.chapter}:{v.verse}
                  </button>
                );
              })}
            </div>

            {/* ✅ 선택된 본문만 출력 */}
            <div className="verse-display-box">
              {selectedVerseKey && (
                <div className="verse-display-box animate-fade">
                  {selectedVerseTexts
                    .filter(
                      (v) =>
                        `${v.book}${v.chapter}:${v.verse}` === selectedVerseKey
                    )
                    .map((v, idx) => (
                      <div key={idx} className="verse-box">
                        <p className="verse-text">{v.text}</p>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        )}

        <div className="nav-buttons">
          <button
            className="btn prev-btn"
            disabled={!hasPrev}
            onClick={() =>
              navigate(
                `/confession/${chapter}/${
                  sections[currentIndex - 1].sectionNumber
                }`
              )
            }
          >
            이전
          </button>
          <button
            className="btn next-btn"
            disabled={!hasNext}
            onClick={() =>
              navigate(
                `/confession/${chapter}/${
                  sections[currentIndex + 1].sectionNumber
                }`
              )
            }
          >
            다음
          </button>
        </div>
      </div>
    </Background>
  );
};

export default SectionDetailPage;

// import CatechismHeader from "components/CatechismHeader";
// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import Background from "context/Background";
// import "styles/ctg/section-detail.css";

// // ✅ 구절 파싱 함수 (세미콜론, 쉼표 둘 다 처리)
// const extractVersesFromGroup = (groupText) => {
//   const parts = groupText.split(/[;,]/); // , ; 기준
//   const results = [];
//   let currentBook = "";

//   parts.forEach((part) => {
//     const trimmed = part.trim().replace(/\.$/, ""); // ✅ 끝 마침표 제거
//     const match = trimmed.match(/^([가-힣]+)\s*(\d+):([\d~]+)$/); // 책명 포함
//     if (match) {
//       currentBook = match[1];
//       results.push({
//         book: match[1],
//         chapter: match[2],
//         verse: match[3],
//       });
//     } else {
//       const subMatch = trimmed.match(/^(\d+):([\d~]+)$/); // 책명 생략
//       if (subMatch && currentBook) {
//         results.push({
//           book: currentBook,
//           chapter: subMatch[1],
//           verse: subMatch[2],
//         });
//       }
//     }
//   });

//   return results;
// };

// // ✅ 범위를 펼쳐 키 배열로 반환
// const expandVerseRange = (rangeStr) => {
//   if (rangeStr.includes("~")) {
//     const [start, end] = rangeStr.split("~").map(Number);
//     return Array.from({ length: end - start + 1 }, (_, i) => String(start + i));
//   } else {
//     return [rangeStr];
//   }
// };

// const SectionDetailPage = () => {
//   const { chapter, section } = useParams();
//   const navigate = useNavigate();
//   const [sections, setSections] = useState([]);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [selectedVerseGroup, setSelectedVerseGroup] = useState(null);
//   const [selectedVerseTexts, setSelectedVerseTexts] = useState([]);

//   useEffect(() => {
//     setLoading(true);
//     fetch(`/api/books/chapter/${chapter}`)
//       .then((res) => (res.ok ? res.json() : Promise.reject("네트워크 오류")))
//       .then((data) => {
//         setSections(data);
//         const idx = data.findIndex((s) => String(s.sectionNumber) === section);
//         setCurrentIndex(idx >= 0 ? idx : 0);
//       })
//       .catch((err) => setError(err))
//       .finally(() => setLoading(false));
//   }, [chapter, section]);

//   const fetchVerseTexts = async (verseList) => {
//     const bible = await fetch("/data/bible.json").then((res) => res.json());
//     const results = [];

//     for (const ref of verseList) {
//       const verseNums = expandVerseRange(ref.verse);
//       verseNums.forEach((vNum) => {
//         const cleanVerse = vNum.replace(/\./g, "").trim(); // ✅ 마침표 제거
//         const key = `${ref.book}${ref.chapter.trim()}:${cleanVerse}`;
//         results.push({
//           book: ref.book,
//           chapter: ref.chapter,
//           verse: cleanVerse,
//           text: bible[key] || "본문 없음",
//         });
//       });
//     }

//     setSelectedVerseTexts(results);
//   };

//   const handleVerseGroupClick = (text) => {
//     const parsed = extractVersesFromGroup(text);
//     setSelectedVerseGroup(text);
//     setSelectedVerseTexts([]);
//     fetchVerseTexts(parsed);
//   };

//   if (loading)
//     return (
//       <Background type="white">
//         <p>Loading…</p>
//       </Background>
//     );
//   if (error)
//     return (
//       <Background type="white">
//         <p>Error: {error}</p>
//       </Background>
//     );

//   const sec = sections[currentIndex];
//   const hasPrev = currentIndex > 0;
//   const hasNext = currentIndex < sections.length - 1;

//   return (
//     <Background type="white">
//       <CatechismHeader />
//       <div className="section-detail-container">
//         <div className="section-header">
//           <h2 className="chapter-title">{chapter}장</h2>
//           <span className="section-pill">📖 {sec.sectionNumber}문</span>
//         </div>

//         <h3 className="question-title">{sec.question}</h3>
//         <p className="answer-text">{sec.content}</p>

//         {/* ✅ 성경 구절 그룹 표시 */}
//         {sec.reference && (
//           <div className="refs-container">
//             {(() => {
//               const groups = sec.reference
//                 .split(/(?=\d+\)\s*)/)
//                 .map((group) => group.trim())
//                 .filter((group) => group.length > 0);

//               return groups.map((group, i) => {
//                 const match = group.match(/^(\d+\))\s*(.+)$/);
//                 if (!match) return null;

//                 const label = match[1]; // 예: 1)
//                 const versesText = match[2]; // 예: 롬 2:14~15; 1:19~20

//                 return (
//                   <div
//                     key={i}
//                     className={`ref-pill ${
//                       selectedVerseGroup === group ? "active" : ""
//                     }`}
//                     onClick={() => {
//                       setSelectedVerseGroup(group); // 전체 그룹 표시
//                       fetchVerseTexts(extractVersesFromGroup(versesText)); // 숫자 제외된 본문만 파싱
//                     }}
//                   >
//                     <strong>{label}</strong> {versesText}
//                   </div>
//                 );
//               });
//             })()}
//           </div>
//         )}

//         {/* ✅ 본문 출력 */}
//         {selectedVerseTexts.length > 0 && (
//           <div className="verse-group-box">
//             {selectedVerseTexts.map((v, idx) => (
//               <div key={idx} className="verse-box">
//                 <p className="verse-reference">
//                   {v.book} {v.chapter}:{v.verse}
//                 </p>
//                 <p className="verse-text">{v.text}</p>
//               </div>
//             ))}
//           </div>
//         )}

//         <div className="nav-buttons">
//           <button
//             className="btn prev-btn"
//             disabled={!hasPrev}
//             onClick={() =>
//               navigate(
//                 `/confession/${chapter}/${sections[currentIndex - 1].sectionNumber}`
//               )
//             }
//           >
//             이전
//           </button>
//           <button
//             className="btn next-btn"
//             disabled={!hasNext}
//             onClick={() =>
//               navigate(
//                 `/confession/${chapter}/${sections[currentIndex + 1].sectionNumber}`
//               )
//             }
//           >
//             다음
//           </button>
//         </div>
//       </div>
//     </Background>
//   );
// };

// export default SectionDetailPage;
