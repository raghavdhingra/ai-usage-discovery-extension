import { onMessage } from '@/common/chrome/runtime';
import { getVisits } from '@/common/chrome/storage';
import { MESSAGE } from '@/common/types/messages';
import { getSiteStatus } from '@/service-worker/handlers/getSiteStatus';
import { handleInteraction } from '@/service-worker/handlers/handleInteraction';
import { handlePageLoaded } from '@/service-worker/handlers/handlePageLoaded';
import { saveVisits } from '@/service-worker/saveVisits';

export default defineBackground(() => {
  onMessage(MESSAGE.GET_SITE_STATUS, getSiteStatus);
  onMessage(MESSAGE.PAGE_LOADED, handlePageLoaded);
  onMessage(MESSAGE.INTERACTED, handleInteraction);
  onMessage(MESSAGE.GET_VISITS, getVisits);
  onMessage(MESSAGE.CLEAR_VISITS, () => saveVisits(() => []));
});
