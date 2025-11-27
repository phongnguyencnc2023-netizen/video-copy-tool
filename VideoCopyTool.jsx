/*
Tool: Copy-Analyze-Rewrite -> Prompt VEo3
File: Single-file React component (default export)
Tailwind CSS assumed. Uses lucide-react for UI.

This is the frontend React component. Use it inside your React app.
*/

import React, { useState } from "react";
import { Copy, Play } from "lucide-react";

export default function VideoCopyTool() {
  const [videoUrl, setVideoUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [scripts, setScripts] = useState(null);
  const [prompts, setPrompts] = useState([]);
  const [error, setError] = useState("");
  const [options, setOptions] = useState({
    language: "vi",
    numPrompts: 3,
    shortVersion: true,
    includeThumbnailAdvice: true,
  });

  async function fetchTranscript() {
    setError("");
    if (!videoUrl) return setError("Vui lòng dán link video.");
    setLoading(true);
    try {
      const res = await fetch("/api/transcript", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: videoUrl, language: options.language }),
      });
      if (!res.ok) throw new Error(await res.text());
      const json = await res.json();
      setTranscript(json.transcript || "");
    } catch (e) {
      console.error(e);
      setError("Lấy transcript thất bại: " + (e.message || e));
    } finally {
      setLoading(false);
    }
  }

  async function analyze() {
    setError("");
    if (!transcript) return setError("Chưa có transcript để phân tích.");
    setLoading(true);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript, options }),
      });
      if (!res.ok) throw new Error(await res.text());
      const json = await res.json();
      setAnalysis(json.analysis || null);
      setScripts(json.scripts || null);
      setPrompts(json.prompts || []);
    } catch (e) {
      console.error(e);
      setError("Phân tích thất bại: " + (e.message || e));
    } finally {
      setLoading(false);
    }
  }

  function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
      // small visual feedback could be added
    });
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Tool: Copy → Phân tích → Viết kịch bản → Prompt VEo3</h1>

      <div className="bg-white shadow-md rounded-lg p-4 mb-4">
        <label className="block text-sm font-medium text-gray-700">Link video đối thủ</label>
        <div className="flex gap-2 mt-2">
          <input
            className="flex-1 border rounded p-2"
            placeholder="https://www.youtube.com/watch?v=..."
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
          />
          <button
            className="px-4 py-2 rounded bg-sky-600 text-white hover:bg-sky-700"
            onClick={fetchTranscript}
            disabled={loading}
          >
            <Play size={16} className="inline-block mr-2" /> Lấy Transcript
          </button>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-3">
          <label className="text-sm">Ngôn ngữ</label>
          <select
            value={options.language}
            onChange={(e) => setOptions({ ...options, language: e.target.value })}
            className="border rounded p-1"
          >
            <option value="vi">Tiếng Việt</option>
            <option value="en">English</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded mb-4">{error}</div>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-semibold mb-2">Transcript</h2>
          <textarea
            className="w-full h-48 border rounded p-2 text-sm"
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            placeholder="Transcript sẽ hiện ở đây..."
          />
          <div className="flex gap-2 mt-2">
            <button
              className="px-3 py-1 rounded bg-emerald-600 text-white"
              onClick={analyze}
              disabled={loading}
            >
              Phân tích & Tạo kịch bản
            </button>
            <button
              className="px-3 py-1 rounded border"
              onClick={() => copyToClipboard(transcript)}
            >
              <Copy size={14} className="inline-block mr-2"/>Copy
            </button>
          </div>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-semibold mb-2">Tùy chọn xuất</h2>
          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={options.shortVersion}
                onChange={(e) => setOptions({ ...options, shortVersion: e.target.checked })}
              />
              Xuất phiên bản ngắn (Shorts)
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={options.includeThumbnailAdvice}
                onChange={(e) => setOptions({ ...options, includeThumbnailAdvice: e.target.checked })}
              />
              Thêm gợi ý thumbnail & title
            </label>

            <label className="flex items-center gap-2">
              <span>Số prompt VEo3</span>
              <input
                type="number"
                min={1}
                max={10}
                value={options.numPrompts}
                onChange={(e) => setOptions({ ...options, numPrompts: Number(e.target.value) })}
                className="ml-auto w-20 border rounded p-1"
              />
            </label>
          </div>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {analysis && (
          <section className="bg-white p-4 rounded shadow">
            <h3 className="font-bold mb-2">Phân tích</h3>
            <pre className="whitespace-pre-wrap text-sm">{analysis}</pre>
          </section>
        )}

        {scripts && (
          <section className="bg-white p-4 rounded shadow">
            <h3 className="font-bold mb-2">Kịch bản (Long)</h3>
            <div className="prose max-w-none">
              <p>{scripts.long}</p>
            </div>

            <div className="mt-3">
              <h4 className="font-semibold">Kịch bản (Short)</h4>
              <p className="text-sm">{scripts.short}</p>
              <div className="mt-2 flex gap-2">
                <button className="px-3 py-1 rounded bg-sky-600 text-white" onClick={() => copyToClipboard(scripts.long)}>
                  Copy Long
                </button>
                <button className="px-3 py-1 rounded bg-amber-600 text-white" onClick={() => copyToClipboard(scripts.short)}>
                  Copy Short
                </button>
              </div>
            </div>
          </section>
        )}

        {prompts.length > 0 && (
          <section className="bg-white p-4 rounded shadow">
            <h3 className="font-bold mb-2">Prompt VEo3</h3>
            <div className="grid gap-3">
              {prompts.map((p, idx) => (
                <div key={idx} className="border rounded p-3">
                  <div className="flex justify-between items-start">
                    <strong>Prompt #{idx + 1}</strong>
                    <div className="flex gap-2">
                      <button className="text-sm border rounded px-2 py-1" onClick={() => copyToClipboard(p)}>
                        <Copy size={12} className="inline-block mr-1"/>Copy
                      </button>
                    </div>
                  </div>
                  <pre className="mt-2 text-sm whitespace-pre-wrap">{p}</pre>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      <footer className="mt-6 text-sm text-gray-500">
        Lưu ý: Đây là giao diện frontend. Bạn cần triển khai backend an toàn (lưu API key server-side) để gọi YouTube transcript + OpenAI GPT.
      </footer>
    </div>
  );
}
