/**
 * Runs start/stop callbacks based on element visibility (viewport intersection + page visibility).
 * Used by animation-heavy components to pause rendering when off-screen or tab-hidden.
 * Returns a cleanup function that disconnects the observer and removes the listener.
 *
 * Guards against repeated invocations: onStart/onStop are only called when the
 * active state actually changes, so callers that start rAF loops will not spawn
 * multiple concurrent loops.
 *
 * Falls back to calling onStart() immediately (and still tracking page visibility)
 * in environments without IntersectionObserver support.
 */
export function observeVisibility(
  el: Element,
  onStart: () => void,
  onStop: () => void,
  rootMargin = '100px'
): () => void {
  let active = false;

  function start(): void {
    if (!active) {
      active = true;
      onStart();
    }
  }

  function stop(): void {
    if (active) {
      active = false;
      onStop();
    }
  }

  // Fallback for environments without IntersectionObserver (e.g. older browsers)
  if (typeof IntersectionObserver === 'undefined') {
    start();

    const onVisChange = (): void => {
      if (document.hidden) {
        stop();
      } else {
        start();
      }
    };
    document.addEventListener('visibilitychange', onVisChange);

    return () => {
      document.removeEventListener('visibilitychange', onVisChange);
      stop();
    };
  }

  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting && !document.hidden) {
        start();
      } else {
        stop();
      }
    }
  }, { rootMargin });

  observer.observe(el);

  const margin = parseInt(rootMargin) || 100;
  const onVisChange = (): void => {
    if (document.hidden) {
      stop();
    } else {
      const rect = el.getBoundingClientRect();
      const inView = rect.bottom >= -margin && rect.top <= window.innerHeight + margin;
      if (inView) start();
    }
  };
  document.addEventListener('visibilitychange', onVisChange);

  return () => {
    observer.disconnect();
    document.removeEventListener('visibilitychange', onVisChange);
    stop();
  };
}
