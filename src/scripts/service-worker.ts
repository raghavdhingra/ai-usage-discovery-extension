import { onMessage } from '@/common/chrome/runtime';
import { MESSAGE } from '@/common/types/messages';
import { getSiteStatus } from '@/service-worker/handlers/getSiteStatus';

export default defineBackground(() => {
  console.log('Straiker service worker running');

  onMessage(MESSAGE.GET_SITE_STATUS, getSiteStatus);
});
