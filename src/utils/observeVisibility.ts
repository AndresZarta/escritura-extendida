/**
 * Runs start/stop callbacks based on element visibility (viewport intersection + page visibility).
 * Used by animation-heavy components to pause rendering when off-screen or tab-hidden.
 * Returns a cleanup function that disconnects the observer and removes the listener.
 */
export function observeVisibility(
  el: Element,
  onStart: () => void,
  onStop: () => void,
  rootMargin = '100px'
): () => void {
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting && !document.hidden) {
        onStart();
      } else {
        onStop();
      }
    }
  }, { rootMargin });

  observer.observe(el);

  const margin = parseInt(rootMargin) || 100;
  const onVisChange = (): void => {
    if (document.hidden) {
      onStop();
    } else {
      const rect = el.getBoundingClientRect();
      const inView = rect.bottom >= -margin && rect.top <= window.innerHeight + margin;
      if (inView) onStart();
    }
  };
  document.addEventListener('visibilitychange', onVisChange);

  return () => {
    observer.disconnect();
    document.removeEventListener('visibilitychange', onVisChange);
  };
}
