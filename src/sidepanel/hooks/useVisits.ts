import { useEffect, useState } from 'react';
import { onMessage, sendMessage } from '@/common/chrome/runtime';
import { MESSAGE } from '@/common/types/messages';
import type { AiVisit } from '@/common/types/site';

export function useVisits() {
  const [visits, setVisits] = useState<AiVisit[] | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const unsubscribe = onMessage(MESSAGE.VISITS_UPDATED, setVisits);

    sendMessage(MESSAGE.GET_VISITS)
      .then((initial) => setVisits(initial ?? []))
      .catch(() => setError(true));

    return unsubscribe;
  }, []);

  const clear = () => sendMessage(MESSAGE.CLEAR_VISITS).catch(() => setError(true));

  return { visits: visits ?? [], loading: visits === null && !error, error, clear };
}
