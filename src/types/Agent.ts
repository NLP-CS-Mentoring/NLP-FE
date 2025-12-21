export type AgentReplyType = "text" | "file";

export interface AgentExecuteResponse {
  type: AgentReplyType;
  content: string;
  url?: string;
  filename?: string;
}

export interface AgentMessage {
  role: "user" | "assistant";
  type: AgentReplyType;
  content: string;
  url?: string;
  filename?: string;
}
