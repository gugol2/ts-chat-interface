import { useRef } from "react";

export function useScrollToBottom() {
  const ref = useRef<HTMLDivElement>(null);

  function scrollToBottom() {
    setTimeout(() => {
      if (ref.current) {
        ref.current.scrollTop = ref.current.scrollHeight;
      }
    }, 10);
  }

  return { ref, scrollToBottom };
}
