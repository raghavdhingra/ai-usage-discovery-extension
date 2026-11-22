import { create } from 'zustand';
import { sendMessage } from '@/common/chrome/runtime';
import { MESSAGE } from '@/common/types/messages';
import type { PopupState } from '@/common/types/site';

interface PopupStore {
  state: PopupState;
  load: () => Promise<void>;
}

export const usePopupStore = create<PopupStore>((set) => ({
  state: { status: 'loading' },
  load: async () => {
    set({ state: { status: 'loading' } });

    try {
      const siteStatus = await sendMessage(MESSAGE.GET_SITE_STATUS);
      set({ state: siteStatus ?? { status: 'error' } });
    } catch (error) {
      console.error('[Straiker] Failed to load site status', error);
      set({ state: { status: 'error' } });
    }
  },
}));
