import { useCallback, useRef } from 'react';

interface KanbanCard {
  id: string;
  columnId: string;
}

export function useKeyboardNavigation(
  cards: KanbanCard[],
  focusedCardId: string | null,
  setFocusedCardId: (cardId: string | null) => void
) {
  const cardRefs = useRef<Map<string, HTMLElement>>(new Map());

  const registerCardRef = useCallback((cardId: string, element: HTMLElement | null) => {
    if (element) {
      cardRefs.current.set(cardId, element);
    } else {
      cardRefs.current.delete(cardId);
    }
  }, []);

  const focusNextCard = useCallback(() => {
    if (!focusedCardId) {
      const firstCard = cards[0];
      if (firstCard) {
        setFocusedCardId(firstCard.id);
        cardRefs.current.get(firstCard.id)?.focus();
      }
      return;
    }

    const currentIndex = cards.findIndex(card => card.id === focusedCardId);
    const nextCard = cards[currentIndex + 1];
    
    if (nextCard) {
      setFocusedCardId(nextCard.id);
      cardRefs.current.get(nextCard.id)?.focus();
    }
  }, [cards, focusedCardId, setFocusedCardId]);

  const focusPreviousCard = useCallback(() => {
    if (!focusedCardId) {
      const lastCard = cards[cards.length - 1];
      if (lastCard) {
        setFocusedCardId(lastCard.id);
        cardRefs.current.get(lastCard.id)?.focus();
      }
      return;
    }

    const currentIndex = cards.findIndex(card => card.id === focusedCardId);
    const previousCard = cards[currentIndex - 1];
    
    if (previousCard) {
      setFocusedCardId(previousCard.id);
      cardRefs.current.get(previousCard.id)?.focus();
    }
  }, [cards, focusedCardId, setFocusedCardId]);

  const focusNextColumn = useCallback(() => {
    if (!focusedCardId) return;

    const currentCard = cards.find(card => card.id === focusedCardId);
    if (!currentCard) return;

    const currentColumnCards = cards.filter(card => card.columnId === currentCard.columnId);
    const currentColumnIndex = currentColumnCards.findIndex(card => card.id === focusedCardId);
    
    // Try to find next card in same column
    const nextCardInColumn = currentColumnCards[currentColumnIndex + 1];
    if (nextCardInColumn) {
      setFocusedCardId(nextCardInColumn.id);
      cardRefs.current.get(nextCardInColumn.id)?.focus();
      return;
    }

    // If no next card in column, find first card in next column
    const columns = Array.from(new Set(cards.map(card => card.columnId)));
    const currentColumnIndexInColumns = columns.indexOf(currentCard.columnId);
    const nextColumn = columns[currentColumnIndexInColumns + 1];
    
    if (nextColumn) {
      const firstCardInNextColumn = cards.find(card => card.columnId === nextColumn);
      if (firstCardInNextColumn) {
        setFocusedCardId(firstCardInNextColumn.id);
        cardRefs.current.get(firstCardInNextColumn.id)?.focus();
      }
    }
  }, [cards, focusedCardId, setFocusedCardId]);

  const focusPreviousColumn = useCallback(() => {
    if (!focusedCardId) return;

    const currentCard = cards.find(card => card.id === focusedCardId);
    if (!currentCard) return;

    const currentColumnCards = cards.filter(card => card.columnId === currentCard.columnId);
    const currentColumnIndex = currentColumnCards.findIndex(card => card.id === focusedCardId);
    
    // Try to find previous card in same column
    const previousCardInColumn = currentColumnCards[currentColumnIndex - 1];
    if (previousCardInColumn) {
      setFocusedCardId(previousCardInColumn.id);
      cardRefs.current.get(previousCardInColumn.id)?.focus();
      return;
    }

    // If no previous card in column, find last card in previous column
    const columns = Array.from(new Set(cards.map(card => card.columnId)));
    const currentColumnIndexInColumns = columns.indexOf(currentCard.columnId);
    const previousColumn = columns[currentColumnIndexInColumns - 1];
    
    if (previousColumn) {
      const lastCardInPreviousColumn = cards
        .filter(card => card.columnId === previousColumn)
        .pop();
      if (lastCardInPreviousColumn) {
        setFocusedCardId(lastCardInPreviousColumn.id);
        cardRefs.current.get(lastCardInPreviousColumn.id)?.focus();
      }
    }
  }, [cards, focusedCardId, setFocusedCardId]);

  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    switch (event.key) {
      case 'ArrowRight':
        event.preventDefault();
        focusNextColumn();
        break;
      case 'ArrowLeft':
        event.preventDefault();
        focusPreviousColumn();
        break;
      case 'ArrowDown':
        event.preventDefault();
        focusNextCard();
        break;
      case 'ArrowUp':
        event.preventDefault();
        focusPreviousCard();
        break;
      case 'Enter':
        event.preventDefault();
        if (focusedCardId) {
          // Trigger card selection
          const focusedElement = cardRefs.current.get(focusedCardId);
          focusedElement?.click();
        }
        break;
      case 'Escape':
        event.preventDefault();
        setFocusedCardId(null);
        break;
      case 'Tab':
        // Let default tab behavior work
        break;
      default:
        break;
    }
  }, [focusedCardId, focusNextCard, focusPreviousCard, focusNextColumn, focusPreviousColumn, setFocusedCardId]);

  return {
    handleKeyDown,
    focusNextCard,
    focusPreviousCard,
    focusNextColumn,
    focusPreviousColumn,
    registerCardRef,
    focusedCardId
  };
} 