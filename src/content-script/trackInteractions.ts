import type { InteractionType } from '@/common/types/site';

const PROMPT_BOX = 'textarea, [contenteditable="true"]';
const REPEAT_WINDOW_MS = 2000;

function isPromptBox(element: EventTarget | undefined): boolean {
  return (
    element instanceof HTMLTextAreaElement ||
    (element instanceof HTMLElement && element.isContentEditable)
  );
}

export function trackInteractions(onInteraction: (type: InteractionType) => void): void {
  let lastReportedAt = 0;

  function report() {
    const now = Date.now();
    if (now - lastReportedAt < REPEAT_WINDOW_MS) return;
    lastReportedAt = now;
    onInteraction('prompt-submit');
  }

  document.addEventListener(
    'keydown',
    (event) => {
      const isEnter = event.key === 'Enter' && !event.shiftKey && !event.isComposing;
      if (isEnter && isPromptBox(event.composedPath()[0])) report();
    },
    true,
  );

  document.addEventListener(
    'click',
    (event) => {
      const target = event.composedPath()[0];
      const button = target instanceof Element ? target.closest('button, [role="button"]') : null;
      if (button && /send/i.test(button.getAttribute('aria-label') ?? '')) report();
    },
    true,
  );

  document.addEventListener(
    'submit',
    (event) => {
      const form = event.target;
      if (form instanceof HTMLFormElement && form.querySelector(PROMPT_BOX)) report();
    },
    true,
  );
}
