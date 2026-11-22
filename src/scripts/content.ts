import { onMessage, sendMessage } from '@/common/chrome/runtime';
import { MESSAGE } from '@/common/types/messages';

export default defineContentScript({
  matches: ['<all_urls>'],
  runAt: 'document_start',
  async main() {
    onMessage(MESSAGE.GET_HOSTNAME, () => ({ hostname: location.hostname }));

    try {
      await sendMessage(MESSAGE.PAGE_LOADED, { hostname: location.hostname });
    } catch {
      return;
    }
  },
});
