import { onMessage, sendMessage } from '@/common/chrome/runtime';
import { MESSAGE } from '@/common/types/messages';
import { trackInteractions } from '@/content-script/trackInteractions';

export default defineContentScript({
  matches: ['<all_urls>'],
  runAt: 'document_start',
  main() {
    const hostname = location.hostname;

    onMessage(MESSAGE.GET_HOSTNAME, () => ({ hostname }));

    sendMessage(MESSAGE.PAGE_LOADED, { hostname })
      .then((result) => {
        if (!result?.isAi) return;

        const { visitId } = result;
        trackInteractions((interactionType) => {
          sendMessage(MESSAGE.INTERACTED, { visitId, interactionType }).catch(() => {});
        });
      })
      .catch(() => {});
  },
});
