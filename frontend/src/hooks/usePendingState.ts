import { useEffect, useRef, useState } from 'react';
import { useGlobalState } from './useGlobalState';

export const usePendingState = () => {
  const [pending, setPending] = useGlobalState('pending');
  const [showLoadingIndicator, setShowLoadingIndicator] = useState(false);
  const timerRef = useRef<number>();

  useEffect(() => {
    if (!pending) {
      timerRef.current = window.setTimeout(() => {
        setShowLoadingIndicator(false);
      }, 1000);
    } else {
      clearTimeout(timerRef.current);
      setShowLoadingIndicator(true);
    }
  }, [pending]);

  return { pending, setPending, showLoadingIndicator };
};
