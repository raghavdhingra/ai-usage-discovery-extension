import type {
  Message,
  MessagePayload,
  MessageResponse,
  MessageType,
} from '@/common/types/messages';

type PayloadArgs<T extends MessageType> = MessagePayload<T> extends void ? [] : [MessagePayload<T>];

function isMessageOfType<T extends MessageType>(message: unknown, type: T): message is Message<T> {
  return typeof message === 'object' && message !== null && (message as Message).type === type;
}

export function sendMessage<T extends MessageType>(
  type: T,
  ...[payload]: PayloadArgs<T>
): Promise<MessageResponse<T>> {
  return browser.runtime.sendMessage({ type, payload });
}

export function onMessage<T extends MessageType>(
  type: T,
  handler: (payload: MessagePayload<T>) => MessageResponse<T> | Promise<MessageResponse<T>>,
): void {
  browser.runtime.onMessage.addListener((message: unknown, _sender, sendResponse) => {
    if (!isMessageOfType(message, type)) return false;

    Promise.resolve(message.payload)
      .then(handler)
      .then(sendResponse)
      .catch((error: unknown) => {
        console.error(`[Straiker] ${type} handler failed`, error);
        sendResponse(undefined);
      });

    return true;
  });
}
