import { useState } from "react";
import { executeAgent } from "../api/agentApi";
import type { AgentMessage } from "../types/Agent";

export const useAgentChat = () => {
  const [messages, setMessages] = useState<AgentMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const sendMessage = async (userMessage: string, context: string) => {
    if (!userMessage.trim()) return;
    console.log("[AgentChat] ▶️ request", {
      userMessage,
      contextPreview: context?.slice(0, 200) || "",
      contextLength: context?.length || 0,
    });

    const userMsg: AgentMessage = { role: "user", type: "text", content: userMessage };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);
    setError("");
    try {
      const res = await executeAgent(userMessage, context);
      console.log("[AgentChat] ✅ response", res);

      const assistantMsg: AgentMessage = {
        role: "assistant",
        type: res.type,
        content: res.content,
        url: res.url,
        filename: res.filename,
        data: res.data
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      console.error("[AgentChat] ❌ error", err);
      setError("에이전트 호출 중 오류가 발생했어요. 서버 상태를 확인해주세요.");
    } finally {
      setLoading(false);
    }
  };

  const resetChat = () => setMessages([]);

  return { messages, loading, error, sendMessage, resetChat };
};
