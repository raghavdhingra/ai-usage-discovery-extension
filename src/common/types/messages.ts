import type { SiteStatus } from '@/common/types/site';

export const MESSAGE = {
  GET_SITE_STATUS: 'GET_SITE_STATUS',
  PAGE_LOADED: 'PAGE_LOADED',
  GET_HOSTNAME: 'GET_HOSTNAME',
} as const;

export interface HostnamePayload {
  hostname: string;
}

export type PageLoadedResult = { isAi: false } | { isAi: true; visitId: string };

export interface MessageMap {
  [MESSAGE.GET_SITE_STATUS]: { payload: void; response: SiteStatus };
  [MESSAGE.PAGE_LOADED]: { payload: HostnamePayload; response: PageLoadedResult };
  [MESSAGE.GET_HOSTNAME]: { payload: void; response: HostnamePayload };
}

export type MessageType = keyof MessageMap;

export type MessagePayload<T extends MessageType> = MessageMap[T]['payload'];

export type MessageResponse<T extends MessageType> = MessageMap[T]['response'];

export interface Message<T extends MessageType = MessageType> {
  type: T;
  payload: MessagePayload<T>;
}
