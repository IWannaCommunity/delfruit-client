import { useEffect, useRef } from "react";

export function useInfiniteScroll<T extends HTMLElement>(
  onLoadMore: () => void,
  options: IntersectionObserverInit = { threshold: 1 }
) {
  const loaderRef = useRef<T | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        onLoadMore();
      }
    }, options);

    const currentLoader = loaderRef.current;

    if (currentLoader) observer.observe(currentLoader);

    return () => {
      if (currentLoader) observer.unobserve(currentLoader);
      observer.disconnect();
    };
  }, [onLoadMore, options]);

  return loaderRef;
}