import { onMessage, sendMessage } from '@/common/chrome/runtime';
import { MESSAGE } from '@/common/types/messages';
import type { SignalResult } from '@/common/types/site';
import { trackInteractions } from '@/content-script/trackInteractions';
import { trackSignals } from '@/content-script/trackSignals';

export default defineContentScript({
  matches: ['<all_urls>'],
  runAt: 'document_start',
  main() {
    const hostname = location.hostname;
    let getSignalResult: () => SignalResult | null = () => null;

    onMessage(MESSAGE.GET_PAGE_INFO, () => ({ hostname, signalResult: getSignalResult() }));

    sendMessage(MESSAGE.PAGE_LOADED, { hostname })
      .then((result) => {
        if (!result?.isAi) {
          getSignalResult = trackSignals(hostname);
          return;
        }

        const { visitId } = result;
        trackInteractions((interactionType) => {
          sendMessage(MESSAGE.INTERACTED, { visitId, interactionType }).catch(() => {});
        });
      })
      .catch(() => {});
  },
});
