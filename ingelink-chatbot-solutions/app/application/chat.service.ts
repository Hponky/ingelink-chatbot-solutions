import { ChatApiRequestBody, Message } from '@/app/domain/entities/message.entity';
import { LangchainService } from '../infrastructure/langchain/langchain.service';
import { N8nService } from '../infrastructure/n8n/n8n.service';
import { PusherService } from '../infrastructure/pusher/pusher.service';

// Define a specific type for the pusher fallback body to avoid 'any'
type Candidate = {
  content?: {
    parts?: {
      text?: string;
    }[];
  };
};

type FallbackObject = {
  reply?: string;
  response?: string;
  candidates?: Candidate[];
};

type FallbackArrayItem = {
  response?: string;
  candidates?: Candidate[];
};

type PusherFallbackBody = FallbackObject | FallbackArrayItem[];

// Define union type for engine responses
type EngineResponse = 
  | { reply: string }  // LangchainService response
  | { success: boolean; message: string };  // N8nService response

export class ChatService {
  private _langchainService?: LangchainService;
  private _n8nService?: N8nService;
  private _pusherService?: PusherService;

  constructor() {
    // No inicializar servicios aquí
  }

  private get langchainService(): LangchainService {
    if (!this._langchainService) {
      this._langchainService = new LangchainService();
    }
    return this._langchainService;
  }

  private get n8nService(): N8nService {
    if (!this._n8nService) {
      this._n8nService = new N8nService();
    }
    return this._n8nService;
  }

  private get pusherService(): PusherService {
    if (!this._pusherService) {
      this._pusherService = new PusherService();
    }
    return this._pusherService;
  }

  private formatFallbackToMessage(body: PusherFallbackBody): Message {
    let text = 'No se pudo obtener una respuesta.'; // Default message

    if (Array.isArray(body)) {
      // Handle FallbackArrayItem[]
      const firstItem = body[0];
      if (firstItem?.response) {
        text = firstItem.response;
      } else if (firstItem?.candidates?.[0]?.content?.parts?.[0]?.text) {
        text = firstItem.candidates[0].content.parts[0].text;
      }
    } else {
      // Handle FallbackObject
      if (body.reply) {
        text = body.reply;
      } else if (body.response) {
        text = body.response;
      } else if (body.candidates?.[0]?.content?.parts?.[0]?.text) {
        text = body.candidates[0].content.parts[0].text;
      }
    }

    return {
      role: 'model',
      parts: [{ text }],
    };
  }

  async processEngineRequest(body: ChatApiRequestBody): Promise<EngineResponse> {
    if (body.engine === 'langchain') {
      return await this.langchainService.handleRequest(body);
    } else {
      return await this.n8nService.handleRequest(body);
    }
  }

  async processPusherFallback(body: PusherFallbackBody): Promise<{ success: boolean }> {
    const message = this.formatFallbackToMessage(body);
    await this.pusherService.broadcastMessage(message);
    return { success: true };
  }
}