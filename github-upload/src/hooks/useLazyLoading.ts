import { useState, useEffect, useCallback, useRef } from 'react';

// Interface pour les options de lazy loading
interface LazyLoadingOptions {
  threshold?: number; // Distance en pixels avant de charger
  rootMargin?: string; // Marge du root
  triggerOnce?: boolean; // Ne déclencher qu'une fois
  skip?: boolean; // Ignorer le lazy loading
}

// Interface pour l'état du lazy loading
interface LazyLoadingState {
  isVisible: boolean;
  hasBeenVisible: boolean;
  isLoaded: boolean;
  isLoading: boolean;
  error: Error | null;
}

/**
 * Hook pour le lazy loading d'éléments
 */
export const useLazyLoading = (options: LazyLoadingOptions = {}) => {
  const {
    threshold = 0.1,
    rootMargin = '50px',
    triggerOnce = true,
    skip = false
  } = options;

  const [state, setState] = useState<LazyLoadingState>({
    isVisible: false,
    hasBeenVisible: false,
    isLoaded: false,
    isLoading: false,
    error: null
  });

  const elementRef = useRef<HTMLElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const handleIntersection = useCallback((entries: IntersectionObserverEntry[]) => {
    const [entry] = entries;
    const isVisible = entry.isIntersecting;

    setState(prev => ({
      ...prev,
      isVisible,
      hasBeenVisible: prev.hasBeenVisible || isVisible
    }));

    // Arrêter l'observation si triggerOnce et que l'élément a été visible
    if (triggerOnce && isVisible && observerRef.current) {
      observerRef.current.disconnect();
    }
  }, [triggerOnce]);

  useEffect(() => {
    if (skip || !elementRef.current) return;

    observerRef.current = new IntersectionObserver(handleIntersection, {
      threshold,
      rootMargin
    });

    observerRef.current.observe(elementRef.current);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [handleIntersection, threshold, rootMargin, skip]);

  const load = useCallback(async (loadFn: () => Promise<any>) => {
    if (state.isLoaded || state.isLoading) return;

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      await loadFn();
      setState(prev => ({ ...prev, isLoaded: true, isLoading: false }));
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: error as Error, 
        isLoading: false 
      }));
    }
  }, [state.isLoaded, state.isLoading]);

  const reset = useCallback(() => {
    setState({
      isVisible: false,
      hasBeenVisible: false,
      isLoaded: false,
      isLoading: false,
      error: null
    });
  }, []);

  return {
    elementRef,
    ...state,
    load,
    reset
  };
};

/**
 * Hook pour le lazy loading d'images
 */
export const useLazyImage = (src: string, options: LazyLoadingOptions = {}) => {
  const { elementRef, isVisible, hasBeenVisible, isLoaded, isLoading, error, load } = useLazyLoading(options);

  useEffect(() => {
    if (isVisible && !isLoaded && !isLoading) {
      load(async () => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = () => resolve(img);
          img.onerror = reject;
          img.src = src;
        });
      });
    }
  }, [isVisible, isLoaded, isLoading, src, load]);

  return {
    elementRef,
    isVisible,
    hasBeenVisible,
    isLoaded,
    isLoading,
    error,
    shouldLoad: isVisible || hasBeenVisible
  };
};

/**
 * Hook pour le lazy loading de composants
 */
export const useLazyComponent = <T extends React.ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  options: LazyLoadingOptions = {}
) => {
  const { elementRef, isVisible, hasBeenVisible, isLoaded, isLoading, error, load } = useLazyLoading(options);
  const [Component, setComponent] = useState<T | null>(null);

  useEffect(() => {
    if (isVisible && !isLoaded && !isLoading) {
      load(async () => {
        const module = await importFn();
        setComponent(() => module.default);
      });
    }
  }, [isVisible, isLoaded, isLoading, importFn, load]);

  return {
    elementRef,
    Component,
    isVisible,
    hasBeenVisible,
    isLoaded,
    isLoading,
    error
  };
};

/**
 * Hook pour le lazy loading de données
 */
export const useLazyData = <T>(
  dataFn: () => Promise<T>,
  options: LazyLoadingOptions = {}
) => {
  const { elementRef, isVisible, hasBeenVisible, isLoaded, isLoading, error, load } = useLazyLoading(options);
  const [data, setData] = useState<T | null>(null);

  useEffect(() => {
    if (isVisible && !isLoaded && !isLoading) {
      load(async () => {
        const result = await dataFn();
        setData(result);
      });
    }
  }, [isVisible, isLoaded, isLoading, dataFn, load]);

  return {
    elementRef,
    data,
    isVisible,
    hasBeenVisible,
    isLoaded,
    isLoading,
    error
  };
};

/**
 * Hook pour le lazy loading de listes
 */
export const useLazyList = <T>(
  items: T[],
  batchSize: number = 10,
  options: LazyLoadingOptions = {}
) => {
  const [visibleItems, setVisibleItems] = useState<T[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const { elementRef, isVisible, hasBeenVisible, isLoaded, isLoading, error, load } = useLazyLoading(options);

  useEffect(() => {
    if (isVisible && hasMore && !isLoading) {
      load(async () => {
        const currentLength = visibleItems.length;
        const newItems = items.slice(currentLength, currentLength + batchSize);
        
        setVisibleItems(prev => [...prev, ...newItems]);
        setHasMore(currentLength + batchSize < items.length);
      });
    }
  }, [isVisible, hasMore, isLoading, items, batchSize, visibleItems.length, load]);

  const reset = useCallback(() => {
    setVisibleItems([]);
    setHasMore(true);
  }, []);

  return {
    elementRef,
    visibleItems,
    hasMore,
    isVisible,
    hasBeenVisible,
    isLoaded,
    isLoading,
    error,
    reset
  };
};

/**
 * Hook pour le lazy loading de modules
 */
export const useLazyModule = (
  moduleName: string,
  options: LazyLoadingOptions = {}
) => {
  const { elementRef, isVisible, hasBeenVisible, isLoaded, isLoading, error, load } = useLazyLoading(options);
  const [module, setModule] = useState<any>(null);

  useEffect(() => {
    if (isVisible && !isLoaded && !isLoading) {
      load(async () => {
        // Import dynamique du module
        const module = await import(`../components/modules/${moduleName}`);
        setModule(module);
      });
    }
  }, [isVisible, isLoaded, isLoading, moduleName, load]);

  return {
    elementRef,
    module,
    isVisible,
    hasBeenVisible,
    isLoaded,
    isLoading,
    error
  };
};
