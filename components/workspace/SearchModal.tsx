import { motion, AnimatePresence } from 'framer-motion';
import React, { useState, useEffect, useCallback, useRef } from 'react';

import { KanbanCard } from './KanbanBoard';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  cards: KanbanCard[];
  onCardSelect: (cardId: string) => void;
  'data-testid'?: string;
}

interface SearchResult {
  card: KanbanCard;
  score: number;
  matches: string[];
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  cards,
  onCardSelect,
  'data-testid': dataTestId
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Search functionality
  const searchCards = useCallback((searchQuery: string): SearchResult[] => {
    if (!searchQuery.trim()) {
      return cards.map(card => ({ card, score: 0, matches: [] }));
    }

    const query = searchQuery.toLowerCase();
    const results: SearchResult[] = [];

    cards.forEach(card => {
      let score = 0;
      const matches: string[] = [];

      // Title match (highest priority)
      if (card.title.toLowerCase().includes(query)) {
        score += 100;
        matches.push('title');
      }

      // Description match
      if (card.description?.toLowerCase().includes(query)) {
        score += 50;
        matches.push('description');
      }

      // Tag matches
      card.tags?.forEach(tag => {
        if (tag.toLowerCase().includes(query)) {
          score += 30;
          matches.push('tag');
        }
      });

      // Assignee match
      if (card.assignee?.toLowerCase().includes(query)) {
        score += 20;
        matches.push('assignee');
      }

      // Status match
      if (card.status.toLowerCase().includes(query)) {
        score += 10;
        matches.push('status');
      }

      if (score > 0) {
        results.push({ card, score, matches });
      }
    });

    return results.sort((a, b) => b.score - a.score);
  }, [cards]);

  // Update results when query changes
  useEffect(() => {
    if (!isOpen) return;

    setIsLoading(true);
    
    // Debounce search
    const timeoutId = setTimeout(() => {
      const searchResults = searchCards(query);
      setResults(searchResults);
      setSelectedIndex(0);
      setIsLoading(false);
    }, 150);

    return () => clearTimeout(timeoutId);
  }, [query, searchCards, isOpen]);

  // Keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, results.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (results[selectedIndex]) {
          onCardSelect(results[selectedIndex].card.id);
          onClose();
        }
        break;
      case 'Escape':
        e.preventDefault();
        onClose();
        break;
    }
  }, [results, selectedIndex, onCardSelect, onClose]);

  // Scroll selected item into view
  useEffect(() => {
    if (resultsRef.current && selectedIndex >= 0) {
      const selectedElement = resultsRef.current.children[selectedIndex] as HTMLElement;
      if (selectedElement) {
        selectedElement.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [selectedIndex]);

  // Close modal when clicking outside
  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }, [onClose]);

  const getMatchHighlight = (text: string, query: string) => {
    if (!query.trim()) return text;
    
    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <span key={index} className="bg-yellow-200 font-medium">
          {part}
        </span>
      ) : part
    );
  };

  const getPriorityColor = (priority: KanbanCard['priority']) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-300';
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center pt-20"
        onClick={handleBackdropClick}
        data-testid={dataTestId}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[70vh] flex flex-col"
        >
          {/* Search Input */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search cards..."
                className="flex-1 text-lg bg-transparent border-none outline-none placeholder-gray-400"
              />
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Results */}
          <div className="flex-1 overflow-y-auto">
            {isLoading ? (
              <div className="p-8 text-center text-gray-500">
                <div className="animate-spin w-6 h-6 border-2 border-gray-300 border-t-blue-600 rounded-full mx-auto mb-2"></div>
                Searching...
              </div>
            ) : results.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                {query ? 'No cards found' : 'Start typing to search cards'}
              </div>
            ) : (
              <div ref={resultsRef} className="divide-y divide-gray-100">
                {results.map((result, index) => (
                  <motion.div
                    key={result.card.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`p-4 cursor-pointer transition-colors ${
                      index === selectedIndex ? 'bg-blue-50 border-l-4 border-blue-500' : 'hover:bg-gray-50'
                    }`}
                    onClick={() => {
                      onCardSelect(result.card.id);
                      onClose();
                    }}
                  >
                    <div className="flex items-start space-x-3">
                      {/* Priority indicator */}
                      <div 
                        className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${getPriorityColor(result.card.priority)}`}
                        title={`Priority: ${result.card.priority}`}
                      />
                      
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-gray-900 mb-1">
                          {getMatchHighlight(result.card.title, query)}
                        </h3>
                        
                        {result.card.description && (
                          <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                            {getMatchHighlight(result.card.description, query)}
                          </p>
                        )}
                        
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span className="capitalize">{result.card.status}</span>
                          {result.card.assignee && (
                            <span>Assigned to {result.card.assignee}</span>
                          )}
                          {result.card.dueDate && (
                            <span>Due {new Date(result.card.dueDate).toLocaleDateString()}</span>
                          )}
                        </div>
                        
                        {/* Match indicators */}
                        {result.matches.length > 0 && (
                          <div className="flex items-center space-x-1 mt-2">
                            {result.matches.map((match, matchIndex) => (
                              <span
                                key={matchIndex}
                                className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
                              >
                                {match}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      {/* Keyboard shortcut hint */}
                      {index === selectedIndex && (
                        <div className="text-xs text-gray-400">
                          Press Enter
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-gray-200 bg-gray-50 rounded-b-lg">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center space-x-4">
                <span>↑↓ Navigate</span>
                <span>Enter Select</span>
                <span>Esc Close</span>
              </div>
              <span>{results.length} result{results.length !== 1 ? 's' : ''}</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}; 