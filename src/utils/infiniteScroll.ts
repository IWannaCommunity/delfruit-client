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

    if (loaderRef.current) observer.observe(loaderRef.current);

    return () => {
      if (loaderRef.current) observer.unobserve(loaderRef.current);
    };
  }, [onLoadMore, options]);

  return loaderRef;
}