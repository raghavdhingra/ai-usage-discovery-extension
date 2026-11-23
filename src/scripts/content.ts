import { onMessage, sendMessage } from '@/common/chrome/runtime';
import { MESSAGE, type PageLoadedResult } from '@/common/types/messages';
import { trackInteractions } from '@/content-script/trackInteractions';

export default defineContentScript({
  matches: ['<all_urls>'],
  runAt: 'document_start',
  main() {
    let page: PageLoadedResult = { isAi: false };

    onMessage(MESSAGE.GET_HOSTNAME, () => ({ hostname: location.hostname }));

    sendMessage(MESSAGE.PAGE_LOADED, { hostname: location.hostname })
      .then((result) => {
        if (result) page = result;
        if (!page.isAi) return;

        const { visitId } = page;
        trackInteractions((interactionType) => {
          sendMessage(MESSAGE.INTERACTED, { visitId, interactionType }).catch(() => {});
        });
      })
      .catch(() => {});
  },
});
