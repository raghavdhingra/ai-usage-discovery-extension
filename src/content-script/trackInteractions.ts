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

  function report(type: InteractionType) {
    const now = Date.now();
    if (now - lastReportedAt < REPEAT_WINDOW_MS) return;
    lastReportedAt = now;
    onInteraction(type);
  }

  document.addEventListener(
    'keydown',
    (event) => {
      const isEnter = event.key === 'Enter' && !event.shiftKey && !event.isComposing;
      if (isEnter && isPromptBox(event.composedPath()[0])) report('prompt-submit');
    },
    true,
  );

  document.addEventListener(
    'click',
    (event) => {
      const target = event.composedPath()[0];
      const button = target instanceof Element ? target.closest('button, [role="button"]') : null;
      const label = button?.getAttribute('aria-label') ?? '';
      if (/voice/i.test(label)) report('ai-button');
      else if (/send/i.test(label)) report('prompt-submit');
    },
    true,
  );

  document.addEventListener(
    'submit',
    (event) => {
      const form = event.target;
      if (form instanceof HTMLFormElement && form.querySelector(PROMPT_BOX)) report('prompt-submit');
    },
    true,
  );
}
