import { SIGNALS } from '@/common/constants/signals';
import type { SignalId } from '@/common/types/site';
import {
  AI_WORDS,
  hasWord,
  MODEL_PICKER_WORDS,
  NEARBY_AI_WORDS,
  PROMPT_STARTS,
  SEND_WORDS,
} from '@/content-script/signals/words';

const NEARBY_LEVELS = 5;
const PLACEHOLDER_MAX_LENGTH = 200;
const BUTTONS = 'button, [role="button"]';

export interface TextBoxScore {
  score: number;
  signals: SignalId[];
  sendButton: Element | null;
}

export function isTextBox(element: EventTarget | undefined): element is HTMLElement {
  return (
    element instanceof HTMLTextAreaElement ||
    (element instanceof HTMLElement && element.isContentEditable)
  );
}

function attributesText(element: Element): string {
  return [...element.attributes].map((attribute) => `${attribute.name} ${attribute.value}`).join(' ');
}

function getContainer(box: Element): Element {
  let container = box;
  for (let level = 0; level < NEARBY_LEVELS && container.parentElement; level++) {
    container = container.parentElement;
  }
  return container;
}

function visiblePlaceholder(box: HTMLElement): string {
  const siblings = [...(box.parentElement?.children ?? [])].filter(
    (element) => element !== box && !element.contains(box),
  );
  return siblings
    .map((element) => element.textContent ?? '')
    .join(' ')
    .trim()
    .slice(0, PLACEHOLDER_MAX_LENGTH);
}

function promptText(box: HTMLElement): string {
  const attributes = ['placeholder', 'data-placeholder', 'aria-label']
    .map((name) => box.getAttribute(name) ?? '')
    .filter(Boolean);
  return [...attributes, visiblePlaceholder(box)].join(' | ').toLowerCase();
}

function buttonLabel(button: Element): string {
  const labelledBy = (button.getAttribute('aria-labelledby') ?? '')
    .split(' ')
    .map((id) => document.getElementById(id)?.textContent ?? '')
    .join(' ');
  return ['aria-label', 'title', 'data-testid']
    .map((name) => button.getAttribute(name) ?? '')
    .concat(labelledBy)
    .join(' ');
}

export function scoreTextBox(box: HTMLElement): TextBoxScore {
  const container = getContainer(box);
  const nearbyElements = [container, ...container.querySelectorAll('*')].filter(
    (element) => !box.contains(element),
  );
  const nearbyButtons = nearbyElements.filter((element) => element.matches(BUTTONS));
  const nearbyText = [
    ...nearbyElements.map(attributesText),
    ...nearbyButtons.map((button) => button.textContent ?? ''),
  ].join(' ');

  const prompt = promptText(box);
  const sendButton = nearbyButtons.find((button) => hasWord(buttonLabel(button), SEND_WORDS)) ?? null;

  const checks: Record<SignalId, boolean> = {
    'ai-word': hasWord(`${attributesText(box)} ${prompt}`, AI_WORDS),
    'prompt-wording': prompt
      .split(' | ')
      .some((text) => PROMPT_STARTS.some((start) => text.trim().startsWith(start))),
    'model-picker': hasWord(nearbyText, MODEL_PICKER_WORDS),
    'ai-nearby': hasWord(nearbyText, NEARBY_AI_WORDS),
    'send-control': box.getAttribute('enterkeyhint') === 'send' || sendButton !== null,
  };

  const signals = (Object.keys(checks) as SignalId[]).filter((id) => checks[id]);
  const score = signals.reduce((total, id) => total + SIGNALS[id].weight, 0);

  return { score, signals, sendButton };
}
