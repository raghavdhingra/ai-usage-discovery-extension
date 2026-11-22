import { AI_TOOLS } from '@/common/constants/aiTools';
import type { AiTool } from '@/common/types/site';

export function matchDomain(hostname: string): AiTool | null {
  const host = hostname.toLowerCase();

  return (
    AI_TOOLS.find((tool) =>
      tool.domains.some((domain) => host === domain || host.endsWith(`.${domain}`)),
    ) ?? null
  );
}
