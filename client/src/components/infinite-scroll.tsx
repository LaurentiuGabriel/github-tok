import { useEffect, useRef } from "react";
import { Loader2 } from "lucide-react";

interface InfiniteScrollProps {
  onLoadMore: () => void;
  isLoading: boolean;
  hasError: boolean;
  children: React.ReactNode;
}

export default function InfiniteScroll({
  onLoadMore,
  isLoading,
  hasError,
  children
}: InfiniteScrollProps) {
  const observerTarget = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoading && !hasError) {
          onLoadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [onLoadMore, isLoading, hasError]);

  return (
    <div>
      {children}
      
      <div ref={observerTarget} className="h-20 flex items-center justify-center">
        {isLoading && (
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        )}
        {hasError && (
          <p className="text-destructive">Error loading repositories</p>
        )}
      </div>
    </div>
  );
}
