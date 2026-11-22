import { useEffect } from 'react';
import { Loader } from '@/common/components/Loader';
import type { PopupState } from '@/common/types/site';
import { PopupLayout } from '@/popup/layout/PopupLayout';
import { usePopupStore } from '@/popup/store/popupStore';
import { NoticeView } from '@/popup/views/NoticeView';
import { SiteView } from '@/popup/views/SiteView';

function renderView(state: PopupState) {
  switch (state.status) {
    case 'loading':
      return <Loader label="Checking this page…" />;
    case 'error':
      return <NoticeView variant="error">Couldn't load site data.</NoticeView>;
    case 'unsupported':
      return (
        <NoticeView variant="unsupported">
          This might be a browser page (like <code className="text-xs">chrome://</code>) or the
          Chrome Web Store, where extensions aren't allowed to run.
        </NoticeView>
      );
    default:
      return <SiteView data={state} />;
  }
}

export function App() {
  const state = usePopupStore((store) => store.state);
  const load = usePopupStore((store) => store.load);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <PopupLayout footerDisabled={state.status === 'loading'}>{renderView(state)}</PopupLayout>
  );
}
