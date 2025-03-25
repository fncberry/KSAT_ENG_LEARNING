import React, { useState } from "react";
import ReactMarkdown from "react-markdown"; // react-markdown 추가
import "./App.css"; // CSS 파일을 임포트

function AppTest() {
  // 사용자 입력을 저장할 상태 변수 설정
  const [inputValue, setInputValue] = useState("");
  const [responseMessage, setResponseMessage] = useState(""); // 백엔드 응답 메시지 상태
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태 추가
  const [strValue, setStrValue] = useState(
    "I understand that this is not ideal, but it is the only feasible way for the payment to be made in full"
  ); // STR 값을 상태로 설정

  // 입력값이 변경될 때 호출되는 함수
  const handleInputChange = (event) => {
    setInputValue(event.target.value); // 입력값 업데이트
  };

  // STR 값을 수정하는 함수
  const handleStrChange = (event) => {
    setStrValue(event.target.value); // STR 수정
  };

  // 입력값을 백엔드로 보내는 함수
  const handleSubmit = async (event) => {
    event.preventDefault(); // 기본 제출 동작 방지
    setIsLoading(true); // 요청 시작 시 로딩 활성화
    setResponseMessage("");
    try {
      const response = await fetch("https://ksat-back.vercel.app/api", {
        method: "POST", // POST 요청
        headers: {
          "Content-Type": "application/json", // JSON 형식으로 요청
        },
        body: JSON.stringify({
          input: "@@" + strValue + "@@ , $$" + inputValue + "$$", // STR 값을 사용
        }), // 입력값을 JSON 형식으로 보내기
      });

      if (response.ok) {
        const data = await response.json(); // JSON 응답 받기
        setResponseMessage(data.message); // 서버 응답을 상태로 설정
      } else {
        setResponseMessage("서버 응답 오류");
      }
    } catch (error) {
      console.error("서버로 데이터 전송 실패:", error);
      setResponseMessage("서버로 데이터 전송 실패.");
    }
    setIsLoading(false); // 응답 받으면 로딩 비활성화
  };

  const handleKeyDown = (event) => {
    if (isLoading) {
      event.preventDefault(); // 로딩 중에는 엔터키 입력 방지
      return;
    }
    // 엔터키(13번) 눌렀을 때 줄바꿈 대신 전송
    if (event.key === "Enter") {
      event.preventDefault(); // 줄바꿈 방지
      handleSubmit(event); // 전송 함수 호출
    }
  };

  return (
    <div className="App">
      <div className="english-sentence-container">
        {/* 사용자가 STR 값을 수정할 수 있도록 입력 필드 추가 */}
        <textarea
          type="text"
          value={strValue} // STR 값은 상태로 관리
          onChange={handleStrChange} // STR 값이 변경될 때마다 호출되는 함수
          placeholder="번역할 영어 문장을 입력해주세요"
          className="input-field"
        />
      </div>
      <h1>
        위 공간에 영어 문장을 적고 아래 공간에 한국어로 문장의 뜻을
        입력해보세요!
      </h1>
      <form onSubmit={handleSubmit} className="form-container">
        <textarea
          type="text"
          value={inputValue} // input 값은 상태로 관리
          onChange={handleInputChange} // 입력값이 변경될 때마다 호출되는 함수
          onKeyDown={handleKeyDown} // 엔터키 눌렀을 때 전송 처리
          placeholder="여기에 입력하세요"
          className="input-field"
          disabled={isLoading} // 로딩 중에는 입력 비활성화
        />
        <button type="submit" className="submit-button" disabled={isLoading}>
          {isLoading ? "로딩 중..." : "전송"}
        </button>
      </form>
      <div className="markdown-container">
        {isLoading && <div className="loading-spinner"></div>}
        <div className="markdown-output">
          <ReactMarkdown>{responseMessage}</ReactMarkdown>
        </div>
      </div>
      {/* <p>백엔드 응답: {responseMessage}</p> 백엔드에서 받은 응답 출력 */}
    </div>
  );
}

export default AppTest;
