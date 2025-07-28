import { pusher } from '@/utils/pusher';
import { Message } from '@/app/domain/entities/message.entity';

export class PusherService {
  async broadcastMessage(message: Message): Promise<void> {
    try {
      await pusher.trigger('chat-channel', 'new-message', message);
    } catch (error) {
      console.error('Error in PusherService.broadcastMessage:', error);
      throw new Error('Failed to broadcast message via Pusher.');
    }
  }
}