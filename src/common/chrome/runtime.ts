import type {
  Message,
  MessagePayload,
  MessageResponse,
  MessageSender,
  MessageType,
} from '@/common/types/messages';

export function sendMessage<T extends MessageType>(
  type: T,
  payload?: MessagePayload<T>,
): Promise<MessageResponse<T>> {
  return browser.runtime.sendMessage({ type, payload });
}

export function onMessage<T extends MessageType>(
  type: T,
  handler: (
    payload: MessagePayload<T>,
    sender: MessageSender,
  ) => MessageResponse<T> | Promise<MessageResponse<T>>,
): () => void {
  const listener = (
    message: Message | undefined,
    sender: { tab?: { id?: number } },
    sendResponse: (response?: unknown) => void,
  ) => {
    if (message?.type !== type) return false;

    const respond = async () => {
      try {
        const payload = message.payload as MessagePayload<T>;
        sendResponse(await handler(payload, { tabId: sender.tab?.id }));
      } catch (error) {
        console.error(`[Straiker] ${type} handler failed`, error);
        sendResponse(undefined);
      }
    };

    void respond();
    return true;
  };

  browser.runtime.onMessage.addListener(listener);
  return () => browser.runtime.onMessage.removeListener(listener);
}
