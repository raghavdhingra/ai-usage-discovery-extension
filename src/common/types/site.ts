export type SignalId =
  | 'ai-network'
  | 'ai-script'
  | 'ai-disclaimer'
  | 'keyword'
  | 'prompt-input'
  | 'chat-controls';

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
  detectedAt: number;
  interacted: boolean;
  interactionType: InteractionType | null;
  interactions: Interaction[];
}

export type ConfidenceLevel = 'none' | 'low' | 'medium' | 'high';

export interface AiSiteStatus {
  status: 'ai';
  hostname: string;
  name: string;
  category: string;
  method: DetectionMethod;
  signals: SignalId[];
  confidence: ConfidenceLevel;
  lastUsedAt: number | null;
}

export interface NotAiSiteStatus {
  status: 'not-ai';
  hostname: string;
  signals: SignalId[];
  confidence: ConfidenceLevel;
}

export type SiteStatus = AiSiteStatus | NotAiSiteStatus | { status: 'unsupported' };

export type PopupState = { status: 'loading' } | { status: 'error' } | SiteStatus;
