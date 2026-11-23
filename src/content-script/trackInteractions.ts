import type { InteractionType } from '@/common/types/site';

const PROMPT_BOX = 'textarea, [contenteditable="true"]';

function isPromptBox(element: EventTarget | undefined): boolean {
  return (
    element instanceof HTMLTextAreaElement ||
    (element instanceof HTMLElement && element.isContentEditable)
  );
}

export function trackInteractions(onInteraction: (type: InteractionType) => void): void {
  const onKeyDown = (event: KeyboardEvent) => {
    const isEnter = event.key === 'Enter' && !event.shiftKey && !event.isComposing;
    if (isEnter && isPromptBox(event.composedPath()[0])) done();
  };

  const onClick = (event: MouseEvent) => {
    const target = event.composedPath()[0];
    const button = target instanceof Element ? target.closest('button, [role="button"]') : null;
    if (button && /send/i.test(button.getAttribute('aria-label') ?? '')) done();
  };

  const onSubmit = (event: SubmitEvent) => {
    const form = event.target;
    if (form instanceof HTMLFormElement && form.querySelector(PROMPT_BOX)) done();
  };

  function done() {
    document.removeEventListener('keydown', onKeyDown, true);
    document.removeEventListener('click', onClick, true);
    document.removeEventListener('submit', onSubmit, true);
    onInteraction('prompt-submit');
  }

  document.addEventListener('keydown', onKeyDown, true);
  document.addEventListener('click', onClick, true);
  document.addEventListener('submit', onSubmit, true);
}
