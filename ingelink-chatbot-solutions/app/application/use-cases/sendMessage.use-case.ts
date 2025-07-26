import { IChatRepository } from '@/app/domain/repositories/chat.repository';
import { Message } from '@/app/domain/entities/message.entity';

export class SendMessageUseCase {
  constructor(private readonly chatRepository: IChatRepository) {}

  execute(message: string): Promise<Message> {
    return this.chatRepository.sendMessage(message);
  }
}