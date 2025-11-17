import React, { useState } from 'react';
import { TranslationPair } from '../types';
import { XIcon, CheckCircleIcon } from './icons';

interface TmSearchResultsModalProps {
  results: TranslationPair[];
  searchTerm: string;
  onClose: () => void;
  onAddContext: (pair: TranslationPair) => void;
  existingContextPairs: TranslationPair[];
}

// Helper component to highlight the search term within a string
const Highlight: React.FC<{ text: string; highlight: string }> = ({ text, highlight }) => {
    if (!highlight.trim()) {
      return <>{text}</>;
    }
    const regex = new RegExp(`(${highlight})`, 'gi');
    const parts = text.split(regex);
    return (
      <>
        {parts.map((part, i) =>
          part.toLowerCase() === highlight.toLowerCase() ? (
            <mark key={i} className="bg-yellow-300 text-slate-900 px-1 rounded-sm">
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </>
    );
};


const TmSearchResultsModal: React.FC<TmSearchResultsModalProps> = ({ results, searchTerm, onClose, onAddContext, existingContextPairs }) => {
  const [selection, setSelection] = useState<{ text: string; index: number | null }>({ text: '', index: null });
  
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  const isFullPairAdded = (pair: TranslationPair) => {
    return existingContextPairs.some(p => p.spanish === pair.spanish && p.arabic === pair.arabic);
  }

  const handleSelection = (rowIndex: number) => {
    const selectedText = window.getSelection()?.toString().trim() ?? '';
    // Only update if there's text, to avoid clearing on any click
    if(selectedText) {
        setSelection({ text: selectedText, index: rowIndex });
    }
  };

  const handleAddSelection = (rowIndex: number) => {
    if (selection.text && selection.index === rowIndex) {
        onAddContext({
            spanish: searchTerm,
            arabic: selection.text,
        });
        setSelection({ text: '', index: null }); // Clear selection after adding
    }
  };

  return (
    <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4"
        onClick={onClose}
        aria-modal="true"
        role="dialog"
    >
      <div 
        className="bg-slate-800 w-full max-w-5xl max-h-[90vh] rounded-xl shadow-2xl flex flex-col ring-1 ring-slate-700"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex justify-between items-center p-4 border-b border-slate-700 flex-shrink-0">
          <h2 className="text-xl font-semibold text-slate-100">
            TM Search Results for: <span className="text-sky-400 font-mono">"{searchTerm}"</span>
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:bg-slate-700 hover:text-white transition-colors"
            aria-label="Close search results"
          >
            <XIcon className="w-6 h-6" />
          </button>
        </header>
        <main className="p-1 sm:p-4 overflow-y-auto">
          {results.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-slate-300">
                <thead className="text-xs text-slate-400 uppercase bg-slate-700 sticky top-0">
                  <tr>
                    <th scope="col" className="px-6 py-3 w-[45%]">
                      Español
                    </th>
                    <th scope="col" className="px-6 py-3 w-[45%] text-right" dir="rtl">
                      العربية
                    </th>
                    <th scope="col" className="px-6 py-3 w-[10%] text-center">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((pair, index) => {
                    const isFullAdded = isFullPairAdded(pair);
                    const isSelectionActive = selection.index === index && selection.text;
                    const isSelectionInContext = isSelectionActive && existingContextPairs.some(p => p.spanish === searchTerm && p.arabic === selection.text);
                    
                    return (
                        <tr key={index} className="bg-slate-800/50 border-b border-slate-700 hover:bg-slate-700/40 transition-colors">
                        <td className="px-6 py-4 align-top">
                            <Highlight text={pair.spanish} highlight={searchTerm} />
                        </td>
                        <td 
                            className="px-6 py-4 font-arabic text-base text-right align-top" 
                            dir="rtl"
                            onMouseUp={() => handleSelection(index)}
                            onKeyUp={() => handleSelection(index)}
                        >
                            {pair.arabic}
                        </td>
                        <td className="px-6 py-4 align-top">
                           <div className="flex items-center justify-center space-x-3">
                                <button
                                    onClick={() => onAddContext(pair)}
                                    disabled={isFullAdded}
                                    title="إضافة الجملة كاملة كمرجع"
                                    className="bg-transparent text-sky-400 hover:bg-slate-700/50 disabled:text-slate-600 disabled:hover:bg-transparent disabled:cursor-not-allowed font-bold text-lg rounded-full w-7 h-7 flex items-center justify-center transition-colors"
                                >
                                    ++
                                </button>
                                <button
                                    onClick={() => handleAddSelection(index)}
                                    disabled={!isSelectionActive || isSelectionInContext}
                                    title="إضافة المصطلح المحدد كمرجع"
                                    className="bg-transparent text-sky-400 hover:bg-slate-700/50 disabled:text-slate-600 disabled:hover:bg-transparent disabled:cursor-not-allowed font-bold text-lg rounded-full w-7 h-7 flex items-center justify-center transition-colors"
                                >
                                    +
                                </button>
                           </div>
                        </td>
                        </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-slate-400">No matching entries found in the Translation Memory.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default TmSearchResultsModal;