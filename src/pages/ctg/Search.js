import React, { useState, useEffect } from "react";
import Background from "context/Background";
import Page from "components/styles/Page";

const Search = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [questionsData, setQuestionsData] = useState([]);

  // ✅ JSON 파일을 fetch로 불러오기
  useEffect(() => {
    fetch("/data/shorterCatechism.json")
      .then((response) => response.json())
      .then((data) => setQuestionsData(data.shorterCatechism))
      .catch((error) => console.error("🚨 JSON 로드 오류:", error));
  }, []);

  const handleSearch = () => {
    const results = questionsData.filter((q) =>
      q.question.includes(searchTerm) ||
      q.answer.includes(searchTerm) ||
      (q.explanation && q.explanation.includes(searchTerm)) ||
      q.verses.some((v) => v.text.includes(searchTerm))
    );
    setFilteredQuestions(results);
  };

  return (
    <div>
      <h1>문답 검색</h1>
      <input
        type="text"
        placeholder="검색어를 입력하세요"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button onClick={handleSearch}>검색</button>
      <ul>
        {filteredQuestions.map((q) => (
          <li key={q.id}>
            <strong>{q.question}</strong>
            <p>{q.answer}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Search;
