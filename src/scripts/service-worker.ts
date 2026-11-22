import { onMessage } from '@/common/chrome/runtime';
import { MESSAGE } from '@/common/types/messages';
import { getSiteStatus } from '@/service-worker/handlers/getSiteStatus';
import { handlePageLoaded } from '@/service-worker/handlers/handlePageLoaded';

export default defineBackground(() => {
  onMessage(MESSAGE.GET_SITE_STATUS, getSiteStatus);
  onMessage(MESSAGE.PAGE_LOADED, handlePageLoaded);
});
