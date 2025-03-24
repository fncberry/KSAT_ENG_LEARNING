const path = require("path");
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const { GoogleGenerativeAI } = require("@google/generative-ai");

// dotenv.config({
//   path: "./.env",
// }); // .env 파일을 로드
// 현재 디렉터리 경로 설정

// .env 파일 로드
dotenv.config({ path: path.resolve(__dirname, ".env") });

console.log(process.env.API_KEY);
const app = express();
const PORT = process.env.PORT;

app.use(cors()); // CORS 허용
app.use(express.json()); // JSON 요청 파싱

const genAI = new GoogleGenerativeAI(process.env.API_KEY);

// 기본 라우트
app.get("/", (req, res) => {
  res.send("백엔드 서버 정상 작동 중!");
});

// 사용자로부터 받은 데이터 처리 및 AI 모델 호출
app.post("/api", async (req, res) => {
  const userInput = req.body.input; // 프론트에서 받은 데이터
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt =
      `너는 사용자의 번역이 맞는지 확인해주는 프로그램이야.` +
      ` 너에게는 영어 문장과 사용자의 한국어 입력이 input으로 주어질거고, 사용자의 한국어 입력이 영어 문장을 번역했을때 뜻과 일치하는지 아닌지를 판단해야 하며,` +
      `만약 잘못 번역했다면 옳은 해석까지 출력해주어야 돼.\n.` +
      `userInput에 영어 문장만 두개가 입력되었다면 ""한국어 문장을 입력해주세요.""라고 출력해` +
      `Exoutput에 **사이에 있는 문자는 볼드체로 출력하도록 해` +
      `줄바꿈을 할 때는 항상 한 줄씩만 해야돼` +
      `예제:\n` +
      `EXinput1: @@Dimigo is the best highschool@@ + $$디미고는 최고의 고등학교이다$$\n` +
      `EXoutput1: **정확합니다!**\n ` +
      `EXinput2: @@Dimigo is the best highschool@@ + $$디미고는 훌륭한 고등학교이다$$\n` +
      `EXoutput2: **정확합니다!**\n` +
      `EXinput3: @@Dimigo is the best highschool@@ + $$디미고는 좋은 학교이다$$\n` +
      `EXoutput3: **비슷합니다!**\n하지만 best(최상급)의 느낌이 나타나면 좋으며, 그냥 학교보다는 고등학교가 더 정확한 번역입니다. 예시) 디미고는 최고로 좋은 고등학교이다.\n` +
      `EXinput4: @@The cat jumped high@@ + $$그 고양이는 낮게 뛰었다$$\n` +
      `EXoutput4: **틀렸습니다!**\n본 문장에서 high는 '높이', 혹은 '높게'라고 해석되어야 합니다. 옳은 해석) 그 고양이는 높게 뛰었다.\n` +
      `EXinput5: @@He's playing a guitar@@ + $$그는 기타를 놀고 있다$$\n` +
      `EXoutput5: **틀렸습니다!**\n일반적으로 play는 '놀다'라는 뜻으로 쓰이지만 본 문장에서는 '(악기를)연주하다' 라는 뜻으로 쓰였습니다.\n옳은 해석) 그는 기타를 연주하고 있다.\n` +
      `EXinput6: @@Dimigo is the best highschool@@ + $$Dimigo is the best highschool$$\n` +
      `EXoutput6: 한국어 번역을 입력해 주세요\n` +
      `EXinput7: @@Dimigo is the best highschool@@ + $$Hello guys$$\n` +
      `EXoutput7: 한국어 번역을 입력해 주세요\n` +
      `EXinput8: @@Dimigo is the best highschool@@ + $$The best highschool is Dimigo$$\n` +
      `EXoutput8: 한국어 번역을 입력해 주세요\n` +
      `EXinput9: @@His claim was dismissed by the Supreme Court@@ + $$주장 was dismissed by the 법정$$\n` +
      `EXoutput9: 한국어 번역을 입력해 주세요\n` +
      `userInput: ${userInput}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = await response.text();
    res.json({ message: text }); // AI 모델로부터 받은 데이터 응답
  } catch (error) {
    console.error("Error generating content:", error);
    res.status(500).json({ error: "AI 모델 생성 오류" });
  }
});

// 서버 실행
app.listen(PORT, () => {
  console.log(`서버가 http://localhost:${PORT}에서 실행 중`);
});
