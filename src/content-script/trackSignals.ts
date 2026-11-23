import { sendMessage } from '@/common/chrome/runtime';
import { AI_BUTTON_CONFIDENCE, AI_SCORE_THRESHOLD } from '@/common/constants/signals';
import { MESSAGE } from '@/common/types/messages';
import type { SignalResult } from '@/common/types/site';
import { findAiButton } from '@/content-script/signals/findAiButton';
import { isTextBox, scoreTextBox } from '@/content-script/signals/scoreTextBox';

export function trackSignals(hostname: string): () => SignalResult | null {
  const scoredBoxes = new WeakSet<Element>();
  let pageResult: SignalResult | null = null;
  let visitId: Promise<string | null> | null = null;
  let used = false;

  function reportDetected(result: SignalResult) {
    if (!pageResult || result.confidence > pageResult.confidence) pageResult = result;

    visitId ??= sendMessage(MESSAGE.AI_DETECTED, { hostname, ...result })
      .then((response) => response?.visitId ?? null)
      .catch(() => null);
  }

  function reportUsed() {
    if (used || !visitId) return;
    used = true;

    void visitId.then((id) => {
      if (id) sendMessage(MESSAGE.AI_USED, { visitId: id }).catch(() => {});
    });
  }

  function watchForSend(box: HTMLElement, sendButton: Element | null) {
    box.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' && !event.shiftKey && !event.isComposing) reportUsed();
    });
    box.closest('form')?.addEventListener('submit', reportUsed);
    sendButton?.addEventListener('click', reportUsed);
  }

  document.addEventListener(
    'focusin',
    (event) => {
      const box = event.composedPath()[0];
      if (!isTextBox(box) || scoredBoxes.has(box)) return;
      scoredBoxes.add(box);

      const { score, signals, sendButton } = scoreTextBox(box);
      if (score < AI_SCORE_THRESHOLD) return;

      reportDetected({ confidence: score * 10, signals });
      watchForSend(box, sendButton);
    },
    true,
  );

  document.addEventListener(
    'click',
    (event) => {
      if (!findAiButton(event.composedPath()[0])) return;

      reportDetected({ confidence: AI_BUTTON_CONFIDENCE, signals: ['ai-word'] });
      reportUsed();
    },
    true,
  );

  return () => pageResult;
}
