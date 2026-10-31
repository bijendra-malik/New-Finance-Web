import type { KeyboardEvent } from "react";

const NON_ADVANCING_INPUT_TYPES = new Set([
  "button",
  "submit",
  "reset",
  "checkbox",
  "radio",
  "file",
  "hidden",
  "image",
  "color",
  "range",
]);

const isAdvancingTarget = (
  target: EventTarget | null,
): target is HTMLInputElement | HTMLSelectElement => {
  if (target instanceof HTMLInputElement) return !NON_ADVANCING_INPUT_TYPES.has(target.type);
  return target instanceof HTMLSelectElement;
};

const isVisible = (element: HTMLElement): boolean => element.getClientRects().length > 0;

const isNavigableField = (element: Element): element is HTMLElement => {
  if (!(element instanceof HTMLElement) || element.tabIndex < 0) return false;
  if (element.hasAttribute("disabled")) return false;
  if (element instanceof HTMLInputElement) {
    return !NON_ADVANCING_INPUT_TYPES.has(element.type) && isVisible(element);
  }
  if (element instanceof HTMLSelectElement || element instanceof HTMLTextAreaElement) {
    return isVisible(element);
  }
  return false;
};

const primaryAction = (form: HTMLFormElement): HTMLElement | null => {
  const candidates = form.querySelectorAll<HTMLElement>(
    '[data-enter-next], button[type="submit"], input[type="submit"]',
  );
  for (const candidate of Array.from(candidates)) {
    if (!candidate.hasAttribute("disabled")) return candidate;
  }
  return null;
};

export const advanceOnEnter = (event: KeyboardEvent<HTMLElement>): void => {
  if (event.key !== "Enter" || event.defaultPrevented) return;
  if (event.nativeEvent.isComposing || event.keyCode === 229) return;

  const target = event.target;
  if (!isAdvancingTarget(target)) return;

  const form = target.form;
  if (!form) return;

  const fields = Array.from(form.elements).filter(isNavigableField);
  const index = fields.indexOf(target);
  const next = index >= 0 ? fields[index + 1] : undefined;

  event.preventDefault();
  if (next) {
    next.focus();
    return;
  }
  primaryAction(form)?.focus();
};

export default advanceOnEnter;
