import { tick } from 'svelte';
import type { Action } from 'svelte/action';

type FormSelectInstance = { destroy: () => void };

declare global {
  interface Window {
    M?: {
      FormSelect: {
        init: (
          els: HTMLSelectElement,
          options?: {
            dropdownOptions?: {
              coverTrigger?: boolean;
              constrainWidth?: boolean;
              container?: Element;
            };
          }
        ) => FormSelectInstance[];
      };
      updateTextFields: () => void;
    };
  }
}

function whenMaterializeReady(run: () => void): () => void {
  if (typeof window === 'undefined') return () => {};

  if (window.M) {
    run();
    return () => {};
  }

  const interval = window.setInterval(() => {
    if (window.M) {
      window.clearInterval(interval);
      run();
    }
  }, 50);

  return () => window.clearInterval(interval);
}

function setNativeSelectValue(node: HTMLSelectElement, value: string | undefined): boolean {
  if (!value) return false;
  for (const option of node.options) {
    if (option.value === value) {
      node.value = value;
      return true;
    }
  }
  return false;
}

function initFormSelect(
  node: HTMLSelectElement,
  selectedValue: string | undefined
): FormSelectInstance | undefined {
  if (!window.M) return undefined;
  setNativeSelectValue(node, selectedValue);
  return window.M.FormSelect.init(node, {
    dropdownOptions: {
      coverTrigger: false,
      constrainWidth: true,
      container: document.body,
    },
  })[0];
}

export const materializeSelect: Action<HTMLSelectElement, string | undefined> = (node, selectedValue) => {
  let instance: FormSelectInstance | undefined;
  let cancelled = false;

  async function mountSelect() {
    await tick();
    if (cancelled || !window.M) return;
    instance?.destroy();
    instance = initFormSelect(node, selectedValue);
    window.M?.updateTextFields();
  }

  const cancelWait = whenMaterializeReady(() => {
    void mountSelect();
  });

  return {
    update(value) {
      selectedValue = value;
      if (!setNativeSelectValue(node, value)) return;
      if (instance && window.M) {
        instance.destroy();
        instance = initFormSelect(node, selectedValue);
        window.M.updateTextFields();
      }
    },
    destroy() {
      cancelled = true;
      cancelWait();
      instance?.destroy();
    },
  };
};

export const materializeTextFields: Action<HTMLElement> = () => {
  const cancelWait = whenMaterializeReady(() => {
    window.M?.updateTextFields();
  });

  return {
    destroy() {
      cancelWait();
    },
  };
};
