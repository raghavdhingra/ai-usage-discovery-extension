export type SignalId = 'ai-word' | 'prompt-wording' | 'model-picker' | 'ai-nearby' | 'send-control';

export interface SignalResult {
  confidence: number;
  signals: SignalId[];
}

export interface SignalDefinition {
  label: string;
  weight: number;
}

export type DetectionMethod = 'domain' | 'signal';

export interface AiTool {
  toolId: string;
  name: string;
  category: string;
  domains: string[];
}

export type InteractionType = 'prompt-submit' | 'ai-button';

export interface Interaction {
  type: InteractionType;
  at: number;
}

export interface AiVisit {
  visitId: string;
  toolId: string;
  name: string;
  category: string;
  hostname: string;
  method: DetectionMethod;
  signals: SignalId[];
  confidence: number;
  detectedAt: number;
  interacted: boolean;
  interactionType: InteractionType | null;
  interactions: Interaction[];
}

export interface AiSiteStatus {
  status: 'ai';
  hostname: string;
  name: string;
  category: string;
  method: DetectionMethod;
  signals: SignalId[];
  confidence: number;
  lastUsedAt: number | null;
}

export interface NotAiSiteStatus {
  status: 'not-ai';
  hostname: string;
  signals: SignalId[];
  confidence: number;
}

export type SiteStatus = AiSiteStatus | NotAiSiteStatus | { status: 'unsupported' };

export type PopupState = { status: 'loading' } | { status: 'error' } | SiteStatus;
