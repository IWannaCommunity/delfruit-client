import { useEffect, useRef } from "react";

type InfiniteScrollOptions = IntersectionObserverInit & {
  enabled?: boolean;
};

export function useInfiniteScroll<T extends HTMLElement>(
  onLoadMore: () => void,
  { enabled = true, ...options }: InfiniteScrollOptions = {}
) {
  const loaderRef = useRef<T | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const observer = new IntersectionObserver((entries) => {
      const entry = entries[0];
      if (entry.isIntersecting) {
        onLoadMore();
      }
    }, options);

    const currentLoader = loaderRef.current;
    if (currentLoader) observer.observe(currentLoader);

    return () => {
      if (currentLoader) observer.unobserve(currentLoader);
      observer.disconnect();
    };
  }, [onLoadMore, options, enabled]);

  return loaderRef;
}