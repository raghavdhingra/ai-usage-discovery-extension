import type { AiVisit, InteractionType, SignalResult, SiteStatus } from '@/common/types/site';

export const MESSAGE = {
  GET_SITE_STATUS: 'GET_SITE_STATUS',
  PAGE_LOADED: 'PAGE_LOADED',
  GET_PAGE_INFO: 'GET_PAGE_INFO',
  AI_DETECTED: 'AI_DETECTED',
  AI_USED: 'AI_USED',
  GET_VISITS: 'GET_VISITS',
  CLEAR_VISITS: 'CLEAR_VISITS',
  VISITS_UPDATED: 'VISITS_UPDATED',
  INTERACTED: 'INTERACTED',
} as const;

export interface HostnamePayload {
  hostname: string;
}

export interface InteractionPayload {
  visitId: string;
  interactionType: InteractionType;
}

export interface PageInfo {
  hostname: string;
  signalResult: SignalResult | null;
}

export interface AiDetectedPayload extends SignalResult {
  hostname: string;
}

export interface VisitIdPayload {
  visitId: string;
}

export type PageLoadedResult = { isAi: false } | { isAi: true; visitId: string };

export interface MessageMap {
  [MESSAGE.GET_SITE_STATUS]: { payload: void; response: SiteStatus };
  [MESSAGE.PAGE_LOADED]: { payload: HostnamePayload; response: PageLoadedResult };
  [MESSAGE.GET_PAGE_INFO]: { payload: void; response: PageInfo };
  [MESSAGE.AI_DETECTED]: { payload: AiDetectedPayload; response: VisitIdPayload };
  [MESSAGE.AI_USED]: { payload: VisitIdPayload; response: void };
  [MESSAGE.GET_VISITS]: { payload: void; response: AiVisit[] };
  [MESSAGE.CLEAR_VISITS]: { payload: void; response: void };
  [MESSAGE.VISITS_UPDATED]: { payload: AiVisit[]; response: void };
  [MESSAGE.INTERACTED]: { payload: InteractionPayload; response: void };
}

export type MessageType = keyof MessageMap;

export type MessagePayload<T extends MessageType> = MessageMap[T]['payload'];

export type MessageResponse<T extends MessageType> = MessageMap[T]['response'];

export interface Message<T extends MessageType = MessageType> {
  type: T;
  payload: MessagePayload<T>;
}
