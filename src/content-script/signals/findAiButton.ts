import { AI_WORDS, hasWord } from '@/content-script/signals/words';

export function findAiButton(target: EventTarget | undefined): HTMLElement | null {
  const button = target instanceof Element ? target.closest('button, [role="button"]') : null;
  if (!(button instanceof HTMLElement)) return null;

  const label = `${button.getAttribute('aria-label') ?? ''} ${button.innerText}`;
  return hasWord(label, AI_WORDS) ? button : null;
}
