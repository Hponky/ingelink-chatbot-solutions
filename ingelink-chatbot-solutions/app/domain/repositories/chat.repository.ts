import { Message } from '../entities/message.entity';

export interface IChatRepository {
  sendMessage(message: string): Promise<Message>;
}