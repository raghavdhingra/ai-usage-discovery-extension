import type { MessagePayload, MessageResponse, MessageType } from '@/common/types/messages';

export async function getActiveTabId(): Promise<number | undefined> {
  const [tab] = await browser.tabs.query({ active: true, lastFocusedWindow: true });
  return tab?.id;
}

export function sendMessageToTab<T extends MessageType>(
  tabId: number,
  type: T,
  payload?: MessagePayload<T>,
): Promise<MessageResponse<T>> {
  return browser.tabs.sendMessage(tabId, { type, payload });
}

export function onTabRemoved(callback: (tabId: number) => void): void {
  browser.tabs.onRemoved.addListener((tabId) => callback(tabId));
}
