import type { MessagePayload, MessageResponse, MessageType } from '@/common/types/messages';

export interface ActiveTab {
  id: number;
  isLoading: boolean;
}

export async function getActiveTab(): Promise<ActiveTab | undefined> {
  const [tab] = await browser.tabs.query({ active: true, lastFocusedWindow: true });
  if (tab?.id === undefined) return undefined;
  return { id: tab.id, isLoading: tab.status === 'loading' };
}

export function sendMessageToTab<T extends MessageType>(
  tabId: number,
  type: T,
  payload?: MessagePayload<T>,
): Promise<MessageResponse<T>> {
  return browser.tabs.sendMessage(tabId, { type, payload });
}
