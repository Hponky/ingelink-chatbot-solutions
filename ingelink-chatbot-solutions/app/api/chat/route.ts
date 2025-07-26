import { NextRequest, NextResponse } from 'next/server';
import { pusher } from '../../../utils/pusher';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Case 1: Message from the UI to start the process
    if (body.contents) {
      const n8nWebhookUrl = 'http://localhost:5678/webhook-test/recepcion-mensaje';
      const n8nResponse = await fetch(n8nWebhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: body.contents }),
      });

      if (!n8nResponse.ok) {
        const errorBody = await n8nResponse.text();
        console.error('Error from n8n webhook:', n8nResponse.status, errorBody);
        return NextResponse.json({ error: 'Error contacting n8n webhook' }, { status: n8nResponse.status });
      }

      return NextResponse.json({ success: true });
    }

    // Case 2: Direct response format from n8n
    if (body.response) {
      const aiReply = body.response;
      
      const formattedMessage = {
        role: 'model' as const,
        parts: [{ text: aiReply }]
      };
      
      await pusher.trigger('chat-channel', 'new-message', formattedMessage);
      return NextResponse.json({ success: true });
    }

    // Case 3: Direct candidates format (nuevo formato actual)
    if (body.candidates && Array.isArray(body.candidates) && body.candidates.length > 0) {
      const candidate = body.candidates[0];
      if (candidate.content && candidate.content.parts && candidate.content.parts.length > 0) {
        const aiReply = candidate.content.parts[0].text;
        
        const formattedMessage = {
          role: 'model' as const,
          parts: [{ text: aiReply }]
        };
        
        await pusher.trigger('chat-channel', 'new-message', formattedMessage);
        return NextResponse.json({ success: true });
      }
    }

    // Case 4: Array format with candidates structure
    if (Array.isArray(body) && body.length > 0 && body[0].candidates) {
      const candidates = body[0].candidates;
      if (candidates && candidates.length > 0 && candidates[0].content && candidates[0].content.parts) {
        const aiReply = candidates[0].content.parts[0].text;
        
        const formattedMessage = {
          role: 'model' as const,
          parts: [{ text: aiReply }]
        };
        
        await pusher.trigger('chat-channel', 'new-message', formattedMessage);
        return NextResponse.json({ success: true });
      }
    }

    // Case 5: Array format with direct response
    if (Array.isArray(body) && body.length > 0 && body[0].response) {
      const aiReply = body[0].response;
      
      const formattedMessage = {
        role: 'model' as const,
        parts: [{ text: aiReply }]
      };
      
      await pusher.trigger('chat-channel', 'new-message', formattedMessage);
      return NextResponse.json({ success: true });
    }
    
    // Case 6: Simple reply format (mantener compatibilidad)
    if (body.reply) {
      const formattedMessage = {
        role: 'model' as const,
        parts: [{ text: body.reply }]
      };
      
      await pusher.trigger('chat-channel', 'new-message', formattedMessage);
      return NextResponse.json({ success: true });
    }

    console.warn('Invalid request to /api/chat:', body);
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });

  } catch (error) {
    console.error('Error in /api/chat:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}