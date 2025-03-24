import React, { useState } from "react";
import ReactMarkdown from "react-markdown"; // react-markdown 추가
import "./App.css"; // CSS 파일을 임포트

//const STR = "Dimigo is the best highschool";
//const STR = "The currency was tied to the gold standard.";
//const STR ="As long as the irrealism of the silent black and white film predominated, one could not take filmic fantasies for representations of reality.";
//const STR = "His claim was dismissed by the Supreme Court";
const STR =
  "I understand that this is not ideal, but it is the only feasible way for the payment to be made in full";

function App() {
  // 사용자 입력을 저장할 상태 변수 설정
  const [inputValue, setInputValue] = useState("");
  const [responseMessage, setResponseMessage] = useState(""); // 백엔드 응답 메시지 상태
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태 추가

  // 입력값이 변경될 때 호출되는 함수
  const handleChange = (event) => {
    setInputValue(event.target.value); // 입력값 업데이트
  };

  // 입력값을 백엔드로 보내는 함수
  const handleSubmit = async (event) => {
    event.preventDefault(); // 기본 제출 동작 방지
    setIsLoading(true); // 요청 시작 시 로딩 활성화
    setResponseMessage("");
    try {
      const response = await fetch("http://localhost:5000/api", {
        method: "POST", // POST 요청
        headers: {
          "Content-Type": "application/json", // JSON 형식으로 요청
        },
        body: JSON.stringify({
          input: "@@" + STR + "@@ , $$" + inputValue + "$$",
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
        <p>{STR}</p> {/* 예시 문장 */}
      </div>
      <h1>위 문장의 뜻을 입력해보세요!</h1>
      <form onSubmit={handleSubmit} className="form-container">
        <textarea
          type="text"
          value={inputValue} // input 값은 상태로 관리
          onChange={handleChange} // 입력값이 변경될 때마다 호출되는 함수
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

export default App;
