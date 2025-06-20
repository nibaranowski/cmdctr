import { useState, useCallback, useRef } from 'react';

export function useOptimisticUpdates<T extends { id: string }>(
  initialData: T[]
) {
  const [optimisticData, setOptimisticData] = useState<T[]>(initialData);
  const originalDataRef = useRef<T[]>(initialData);
  const pendingUpdatesRef = useRef<Map<string, Partial<T>>>(new Map());

  // Update optimistic data when initial data changes
  if (originalDataRef.current !== initialData) {
    originalDataRef.current = initialData;
    setOptimisticData(initialData);
    pendingUpdatesRef.current.clear();
  }

  const applyOptimisticUpdate = useCallback((id: string, updates: Partial<T>) => {
    setOptimisticData(prev => 
      prev.map(item => 
        item.id === id ? { ...item, ...updates } : item
      )
    );
    pendingUpdatesRef.current.set(id, updates);
  }, []);

  const revertOptimisticUpdate = useCallback((id: string) => {
    setOptimisticData(prev => 
      prev.map(item => 
        item.id === id ? originalDataRef.current.find(original => original.id === id) || item : item
      )
    );
    pendingUpdatesRef.current.delete(id);
  }, []);

  const revertAllOptimisticUpdates = useCallback(() => {
    setOptimisticData(originalDataRef.current);
    pendingUpdatesRef.current.clear();
  }, []);

  const commitOptimisticUpdate = useCallback((id: string) => {
    pendingUpdatesRef.current.delete(id);
  }, []);

  return {
    optimisticData,
    applyOptimisticUpdate,
    revertOptimisticUpdate,
    revertAllOptimisticUpdates,
    commitOptimisticUpdate,
    hasPendingUpdates: pendingUpdatesRef.current.size > 0
  };
} 