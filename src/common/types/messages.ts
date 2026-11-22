import type { SiteStatus } from '@/common/types/site';

export const MESSAGE = {
  GET_SITE_STATUS: 'GET_SITE_STATUS',
} as const;

export interface MessageMap {
  [MESSAGE.GET_SITE_STATUS]: { response: SiteStatus };
}

export type MessageType = keyof MessageMap;

export interface Message<T extends MessageType = MessageType> {
  type: T;
}

export type MessageResponse<T extends MessageType> = MessageMap[T]['response'];
