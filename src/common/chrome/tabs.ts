import type { MessagePayload, MessageResponse, MessageType } from '@/common/types/messages';

type PayloadArgs<T extends MessageType> = MessagePayload<T> extends void ? [] : [MessagePayload<T>];

export async function getActiveTabId(): Promise<number | undefined> {
  const [tab] = await browser.tabs.query({ active: true, lastFocusedWindow: true });
  return tab?.id;
}

export function sendMessageToTab<T extends MessageType>(
  tabId: number,
  type: T,
  ...[payload]: PayloadArgs<T>
): Promise<MessageResponse<T>> {
  return browser.tabs.sendMessage(tabId, { type, payload });
}
