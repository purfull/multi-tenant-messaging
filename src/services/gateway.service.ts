import { Message } from '../models/message.model.ts';

export async function sendToGateway(message: Message) {
  return new Promise<boolean>((resolve) => {
    setTimeout(() => {
      
      const success = Math.random() < 0.8;
      resolve(success);
    }, 150);
  });
}
