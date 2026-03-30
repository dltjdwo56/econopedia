import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

export async function POST(request) {
  try {
    const { term } = await request.json();
    if (!term) return Response.json({ error: "term required" }, { status: 400 });

    const message = await client.messages.create({
      model: "claude-opus-4-5",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: `경제 용어 "${term}"을 아래 JSON 형식으로 설명해줘. 절대 JSON 외에 다른 텍스트나 마크다운 코드블록 없이 순수 JSON만 반환해.

{
  "term": "정확한 용어명",
  "emoji": "어울리는 이모지 1개",
  "oneline": "딱 한 줄로 뭔지 설명 (20자 이내)",
  "simple": "중학생도 이해하는 쉬운 설명 (3-4문장, 일상 비유 포함)",
  "example": "실생활 또는 뉴스에서 이 단어가 쓰이는 예시 1가지",
  "tip": "이 단어를 알면 뭐가 좋은지 한 줄 팁",
  "related": ["관련 경제 용어 3개의 배열"],
  "level": "기초/중급/고급 중 하나"
}

말투는 토스처럼 친근하고 쉽게. "~해요" 체로. 투자 권유가 아닌 교육 목적임을 염두에 두고.`,
        },
      ],
    });

    const raw = message.content[0].text.trim();
    const clean = raw.replace(/```json|```/g, "").trim();
    const data = JSON.parse(clean);

    return Response.json(data);
  } catch (e) {
    console.error(e);
    return Response.json({ error: "AI 응답 처리 실패" }, { status: 500 });
  }
}