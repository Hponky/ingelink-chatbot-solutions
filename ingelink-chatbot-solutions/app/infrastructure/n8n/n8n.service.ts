import { ChatApiRequestBody } from '@/app/domain/entities/message.entity';

export class N8nService {
  private readonly n8nWebhookUrl = 'http://localhost:5678/webhook-test/recepcion-mensaje';

  async handleRequest(body: ChatApiRequestBody): Promise<{ success: boolean; message: string }> {
    try {
      // Construir el historial completo incluyendo el query actual
      const conversationHistory = [
        ...(body.history || []), // Historial previo
        {
          role: 'user' as const,
          parts: [{ text: body.query }] // Mensaje actual del usuario
        }
      ];
      
      // Enviar el historial completo al webhook
      const webhookPayload = {
        contents: conversationHistory
      };
      
      const response = await fetch(this.n8nWebhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(webhookPayload),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        console.error('Error from n8n webhook:', response.status, errorBody);
        throw new Error(`n8n webhook error: ${response.status}`);
      }

      return { success: true, message: 'Request forwarded to n8n.' };

    } catch (error) {
      console.error('Error in N8nService.handleRequest:', error);
      throw new Error('Failed to forward request to n8n.');
    }
  }
}