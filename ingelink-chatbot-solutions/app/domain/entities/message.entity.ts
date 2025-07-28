export type Message = {
  role: 'user' | 'model';
  parts: { text: string }[];
};

export type ChatApiRequestBody = {
  engine: 'n8n' | 'langchain';
  query: string;
  history: Message[];
};