import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client safely
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn('GEMINI_API_KEY is not set. API calls will fail unless configured.');
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

// API: Generate AI Career Strategy Report
app.post('/api/career-report', async (req, res) => {
  try {
    const ai = getGeminiClient();
    if (!ai) {
      return res.status(500).json({ error: 'GEMINI_API_KEY가 설정되지 않았습니다. AI 분석을 위해 비밀키를 확인해주세요.' });
    }

    const { scores, primaryAnchor, secondaryAnchor, jobInput } = req.body;

    const prompt = `
당신은 에드거 샤인(Edgar Schein)의 커리어 앵커(Career Anchors) 이론에 입각한 최고급 커리어 코치 및 HR 전략 컨설턴트입니다.
사용자의 40문항 커리어 앵커 진단 결과와 희망 직무 정보를 바탕으로 심도 있고 실용적인 AI 커리어 전략 리포트를 한국어로 작성해주세요.

[사용자 진단 데이터]
- 1순위 핵심 앵커: ${primaryAnchor} (점수: ${scores[primaryAnchor]}점 / 20점 만점)
- 2순위 핵심 앵커: ${secondaryAnchor} (점수: ${scores[secondaryAnchor]}점 / 20점 만점)
- 전체 8가지 앵커 점수: ${JSON.stringify(scores)}
- 희망 직무: ${jobInput.targetJob || '미입력 (일반 커리어)'}
- 관심 산업군: ${jobInput.industry || '전체 산업군'}
- 현재 주요 고민: ${(jobInput.concerns || []).join(', ') || '직무 적합성 및 커리어 방향성'}

[작성 지침 - 필수사항]
1. 직무 궁합 및 시너지 (jobSynergy): 1순위(${primaryAnchor})와 2순위(${secondaryAnchor}) 앵커 특성이 희망 직무(${jobInput.targetJob || '해당 분야'})에서 발휘할 수 있는 궁합과 시너지를 3~4문장으로 구체적으로 서술하세요.
2. 자소서 & 면접 필살기 키워드 (resumeKeywords): 서류 및 면접에서 자신 있게 어필할 수 있는 핵심 역량 키워드 정확히 3개를 선정하세요. 각 항목마다 'keyword'(한글 키워드명), 'englishKeyword'(영문 키워드명), 'description'(자기소개서 작성법 및 면접 질문 시 구체적인 어필 경험 작성 가이드 2~3문장)을 작성해야 합니다.
3. 커리어 주의사항 (careerCaution): 이 앵커 조합과 희망 직무 수행 시 주의해야 할 함정, 슬럼프 원인, 번아웃 위험 요소 및 피해야 할 조직 문화나 환경을 3~4문장의 실질적인 조언으로 명확히 작성하세요. 절대 빈칸으로 남기지 마세요.
4. 추천 연관 직무 (recommendedRoles): 1, 2순위 앵커 특성에 잘 맞는 직무 이름 3~5개를 배열로 작성하세요.
5. 성장 액션 플랜 (growthActionPlan): 1~3년 내 실행 가능한 커리어 성장 지침 3개를 배열로 작성하세요.
6. 종합 요약 (overallSummary): 사용자의 커리어 비전을 격려하는 2문장의 총평 요약 메시지.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        systemInstruction: '너는 조직 심리학에 깊은 식견을 가진 전문적이고 따뜻한 커리어 컨설턴트야. 모든 필드를 누락 없이 풍부한 내용으로 채워줘.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            jobSynergy: {
              type: Type.STRING,
              description: '희망 직무와 커리어 앵커 간의 궁합 및 시너지 분석 (3-4문장)',
            },
            resumeKeywords: {
              type: Type.ARRAY,
              description: '자기소개서 및 면접 필살기 키워드 3개',
              items: {
                type: Type.OBJECT,
                properties: {
                  keyword: { type: Type.STRING, description: '한글 키워드 (예: 전문성)' },
                  englishKeyword: { type: Type.STRING, description: '영문 키워드 (예: Expertise)' },
                  description: { type: Type.STRING, description: '자기소개서 및 면접 활용법 설명' },
                },
                required: ['keyword', 'englishKeyword', 'description'],
              },
            },
            careerCaution: {
              type: Type.STRING,
              description: '주의해야 할 커리어 함정 및 경고 사항 (3-4문장)',
            },
            recommendedRoles: {
              type: Type.ARRAY,
              description: '추천 직무 목록 3-5개',
              items: { type: Type.STRING },
            },
            growthActionPlan: {
              type: Type.ARRAY,
              description: '성장 실행 지침 3가지',
              items: { type: Type.STRING },
            },
            overallSummary: {
              type: Type.STRING,
              description: '종합 응원 및 요약 메시지',
            },
          },
          required: ['jobSynergy', 'resumeKeywords', 'careerCaution', 'recommendedRoles', 'growthActionPlan', 'overallSummary'],
        },
      },
    });

    const jsonText = response.text ? response.text.trim() : '{}';
    const reportData = JSON.parse(jsonText);
    res.json({ success: true, data: reportData });
  } catch (error: any) {
    console.error('Error generating career report:', error);
    res.status(500).json({
      error: 'AI 리포트 생성 중 오류가 발생했습니다.',
      details: error.message || String(error),
    });
  }
});

// API: AI Career Counselor Chat
app.post('/api/career-chat', async (req, res) => {
  try {
    const ai = getGeminiClient();
    if (!ai) {
      return res.status(500).json({ error: 'GEMINI_API_KEY가 설정되지 않았습니다.' });
    }

    const { messages, userContext } = req.body;

    const systemInstruction = `
당신은 'My Career Anchor' 서비스의 친절하고 전문적인 AI 커리어 코치입니다.
사용자의 진단 결과:
- 1순위 앵커: ${userContext?.primaryAnchor || '미정'}
- 2순위 앵커: ${userContext?.secondaryAnchor || '미정'}
- 희망 직무: ${userContext?.jobInput?.targetJob || '미입력'}
- 관심 산업: ${userContext?.jobInput?.industry || '미입력'}

사용자의 질문에 답변할 때:
1. 에드거 샤인의 커리어 앵커 이론을 바탕으로 공감과 전문적 조언을 제공하세요.
2. 답변은 명확하고 이해하기 쉽게 한국어로 친절하게 작성해주세요.
3. 2-4문단 정도로 깔끔하게 요약하여 답변해 주세요.
`;

    const chat = ai.chats.create({
      model: 'gemini-3.6-flash',
      config: {
        systemInstruction,
      },
    });

    // Send history if present
    let lastUserMessage = '안녕하세요, 제 커리어 앵커 진단 결과를 바탕으로 조언을 구하고 싶습니다.';
    if (messages && messages.length > 0) {
      lastUserMessage = messages[messages.length - 1].text;
    }

    const response = await chat.sendMessage({
      message: lastUserMessage,
    });

    res.json({ success: true, text: response.text });
  } catch (error: any) {
    console.error('Error in career chat:', error);
    res.status(500).json({ error: '대화 응답 생성에 실패했습니다.' });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
