import type { SiteStatus } from '@/common/types/site';
import { ACTIVE_MOCK, getMockSiteStatus, MOCK_DELAY_MS } from '@/service-worker/mocks/siteStatus';

export async function getSiteStatus(): Promise<SiteStatus> {
  await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY_MS));
  return getMockSiteStatus(ACTIVE_MOCK);
}
