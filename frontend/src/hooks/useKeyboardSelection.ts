import { useEffect } from 'react';

type Actions = {
  all: () => void;
  clear: () => void;
  disabled?: boolean;
  invert: () => void;
  download: () => void;
};

export function useKeyboardSelection(actions: Actions) {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (actions.disabled) return;
      if (isTyping(event)) return;
      if (event.ctrlKey && event.key.toLowerCase() === 'a') {
        event.preventDefault();
        actions.all();
      }
      if (event.key === 'Backspace') actions.clear();
      if (event.key.toLowerCase() === 'i') actions.invert();
      if (event.key.toLowerCase() === 'd') actions.download();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [actions]);
}

function isTyping(event: KeyboardEvent) {
  const target = event.target as HTMLElement | null;
  return target?.tagName === 'INPUT' || target?.tagName === 'SELECT' || target?.tagName === 'TEXTAREA';
}
