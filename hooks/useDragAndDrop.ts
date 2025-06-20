import { useState, useCallback, useRef } from 'react';

interface DragState {
  isDragging: boolean;
  draggedItemId: string | null;
  draggedItemType: 'card' | 'column' | null;
  sourceColumnId?: string;
}

export function useDragAndDrop() {
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    draggedItemId: null,
    draggedItemType: null
  });

  const dragStartTimeRef = useRef<number>(0);
  const dragThresholdRef = useRef(100); // ms

  const dragStart = useCallback((itemId?: string, itemType: 'card' | 'column' = 'card', sourceColumnId?: string) => {
    dragStartTimeRef.current = Date.now();
    setDragState({
      isDragging: true,
      draggedItemId: itemId || null,
      draggedItemType: itemType,
      ...(sourceColumnId && { sourceColumnId })
    });
  }, []);

  const dragEnd = useCallback(() => {
    const dragDuration = Date.now() - dragStartTimeRef.current;
    
    // Only consider it a drag if it lasted longer than threshold
    if (dragDuration < dragThresholdRef.current) {
      setDragState({
        isDragging: false,
        draggedItemId: null,
        draggedItemType: null
      });
      return;
    }

    setDragState({
      isDragging: false,
      draggedItemId: null,
      draggedItemType: null
    });
  }, []);

  const drop = useCallback((targetId: string, position?: number) => {
    // This would typically trigger the actual drop logic
    // The actual implementation depends on the specific use case
    setDragState({
      isDragging: false,
      draggedItemId: null,
      draggedItemType: null
    });
  }, []);

  const isOverDropZone = useCallback((zoneId: string) => {
    return dragState.isDragging && dragState.draggedItemId !== zoneId;
  }, [dragState]);

  const canDrop = useCallback((targetType: 'card' | 'column', targetId: string) => {
    if (!dragState.isDragging) return false;
    
    // Prevent dropping on itself
    if (dragState.draggedItemId === targetId) return false;
    
    // Cards can be dropped on columns or other cards
    if (dragState.draggedItemType === 'card') {
      return targetType === 'column' || targetType === 'card';
    }
    
    // Columns can only be reordered (dropped on other columns)
    if (dragState.draggedItemType === 'column') {
      return targetType === 'column';
    }
    
    return false;
  }, [dragState]);

  return {
    isDragging: dragState.isDragging,
    draggedItemId: dragState.draggedItemId,
    draggedItemType: dragState.draggedItemType,
    sourceColumnId: dragState.sourceColumnId,
    dragStart,
    dragEnd,
    drop,
    isOverDropZone,
    canDrop
  };
} 