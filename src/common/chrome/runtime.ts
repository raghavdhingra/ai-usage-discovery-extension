import type { Message, MessageResponse, MessageType } from '@/common/types/messages';

function isMessageOfType<T extends MessageType>(message: unknown, type: T): message is Message<T> {
  return typeof message === 'object' && message !== null && (message as Message).type === type;
}

export function sendMessage<T extends MessageType>(type: T): Promise<MessageResponse<T>> {
  const message: Message<T> = { type };
  return browser.runtime.sendMessage(message);
}

export function onMessage<T extends MessageType>(
  type: T,
  handler: () => MessageResponse<T> | Promise<MessageResponse<T>>,
): void {
  browser.runtime.onMessage.addListener((message: unknown, _sender, sendResponse) => {
    if (!isMessageOfType(message, type)) return false;

    Promise.resolve()
      .then(handler)
      .then(sendResponse)
      .catch((error: unknown) => {
        console.error(`[Straiker] ${type} handler failed`, error);
        sendResponse(undefined);
      });

    return true;
  });
}
