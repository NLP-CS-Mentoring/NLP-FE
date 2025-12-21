export type AgentReplyType = "text" | "file" | "update";

export interface AgentExecuteResponse {
  type: AgentReplyType;
  content: string;
  url?: string;
  filename?: string;
  data?: string; 
}

export interface AgentMessage {
  role: "user" | "assistant";
  type: AgentReplyType;
  content: string;
  url?: string;
  filename?: string;
  data?: string; 
}
