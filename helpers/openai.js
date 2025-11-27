const OpenAI = require('openai');
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

function buildPrompt(transcript, options){
  const numPrompts = (options && options.numPrompts) || 3;
  return `Bạn là một chuyên gia sản xuất video viral. Dưới đây là transcript video đối thủ:\n\n${transcript}\n\nYêu cầu:
1) Phân tích chi tiết: bố cục, kịch bản, điểm mạnh (5), điểm yếu (5), CTA, pacing.
2) Viết 1 kịch bản MỚI (long) cải tiến không trùng lặp — tối ưu cho Youtube 4-8 phút.
3) Viết 1 kịch bản SHORT (<=60s) tối ưu cho YouTube Shorts.
4) Tạo ${numPrompts} Prompt VEo3 chi tiết (camera, ánh sáng, chuyển động, close-up, model, DOF, hiệu ứng nước/slow-mo nếu phù hợp).
5) Nếu cần, thêm 5 tiêu đề SEO & gợi ý thumbnail.
6) Trả về duy nhất 1 JSON object:{
  "analysis": "...",
  "strengths": ["..."],
  "weaknesses": ["..."],
  "scripts": { "long": "...", "short": "..." },
  "prompts": ["...", "..."],
  "thumbnails": ["..."],
  "titles": ["..."] }
Trả lời bằng JSON only.`;
}

async function analyzeWithOpenAI(transcript, options={}){
  const prompt = buildPrompt(transcript, options);
  const resp = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 1600,
  });
  const text = resp.choices?.[0]?.message?.content || '';
  try{
    const jsonMatch = text.match(/```json([\s\S]*?)```/);
    let parsed;
    if(jsonMatch){
      parsed = JSON.parse(jsonMatch[1]);
    } else {
      parsed = JSON.parse(text);
    }
    return parsed;
  }catch(e){
    return { analysis: text, strengths: [], weaknesses: [], scripts: { long: '', short: '' }, prompts: [], thumbnails: [], titles: [] };
  }
}

module.exports = { analyzeWithOpenAI, buildPrompt };
