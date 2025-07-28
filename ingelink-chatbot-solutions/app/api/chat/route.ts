import { NextRequest, NextResponse } from 'next/server';
import { ChatService } from '@/app/application/chat.service';
import { ChatApiRequestBody } from '@/app/domain/entities/message.entity';

const chatService = new ChatService();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (body.engine) {
      const result = await chatService.processEngineRequest(body as ChatApiRequestBody);
      // Langchain devuelve una respuesta directa, n8n no.
      if (result) {
        return NextResponse.json(result);
      }
      return NextResponse.json({ success: true, message: `Request forwarded to ${body.engine}.` });
    }

    // Lógica de fallback para respuestas de n8n vía Pusher
    await chatService.processPusherFallback(body);
    return NextResponse.json({ success: true, message: 'Response broadcasted via Pusher.' });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    console.error('Error in /api/chat:', errorMessage);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}