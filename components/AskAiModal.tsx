import React, { useState } from 'react';
import { XIcon, ClipboardCopyIcon, CheckCircleIcon } from './icons';
import { TranslationPair } from '../types';
import Loader from './Loader';

interface AskAiModalProps {
  term: string;
  result: string;
  isLoading: boolean;
  onClose: () => void;
  onAddContext: (pair: TranslationPair) => void;
  existingContextPairs: TranslationPair[];
}

const AskAiModal: React.FC<AskAiModalProps> = ({ term, result, isLoading, onClose, onAddContext, existingContextPairs }) => {
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [selectedArabicText, setSelectedArabicText] = useState<string>('');
  
  const isAdded = React.useMemo(() => {
      if (!selectedArabicText) return false;
      return existingContextPairs.some(p => p.spanish === term && p.arabic === selectedArabicText);
  }, [selectedArabicText, term, existingContextPairs]);

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
  
  const handleCopy = () => {
    if (!result || isLoading) return;
    navigator.clipboard.writeText(result).then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    }).catch(err => {
        console.error('Failed to copy text: ', err);
    });
  };

  const handleAddContext = () => {
    if (selectedArabicText && !isAdded) {
        onAddContext({
            spanish: term,
            arabic: selectedArabicText
        });
    }
  };

  const handleSelection = () => {
    const selection = window.getSelection()?.toString().trim() ?? '';
    setSelectedArabicText(selection);
  };


  return (
    <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4"
        onClick={onClose}
        aria-modal="true"
        role="dialog"
    >
      <div 
        className="bg-slate-800 w-full max-w-3xl max-h-[90vh] rounded-xl shadow-2xl flex flex-col ring-1 ring-slate-700"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex justify-between items-center p-4 border-b border-slate-700 flex-shrink-0">
          <h2 className="text-xl font-semibold text-slate-100">
            AI Analysis for: <span className="text-sky-400 font-mono">"{term}"</span>
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:bg-slate-700 hover:text-white transition-colors"
            aria-label="Close AI analysis"
          >
            <XIcon className="w-6 h-6" />
          </button>
        </header>
        <main className="p-6 overflow-y-auto" dir="rtl" lang="ar" onMouseUp={handleSelection} onKeyUp={handleSelection}>
          {isLoading ? (
            <Loader />
          ) : (
            <>
              <div className="flex justify-start mb-4">
                  <button
                      onClick={handleCopy}
                      disabled={!result || isLoading || isCopied}
                      className="flex items-center text-sm text-slate-400 hover:text-sky-400 disabled:text-slate-600 disabled:cursor-not-allowed transition-colors"
                      title={isCopied ? "Copied!" : "Copy to clipboard"}
                  >
                      {isCopied ? (
                          <>
                              <CheckCircleIcon className="w-4 h-4 ml-1 text-green-400" />
                              <span className="text-green-400">تم النسخ!</span>
                          </>
                      ) : (
                          <>
                              <ClipboardCopyIcon className="w-4 h-4 ml-1" />
                              <span>نسخ</span>
                          </>
                      )}
                  </button>
              </div>
              <div className="font-arabic text-right text-slate-200 whitespace-pre-wrap leading-relaxed">
                {result}
              </div>
            </>
          )}
        </main>
        {!isLoading && result && (
            <footer className="flex justify-between items-center p-4 border-t border-slate-700 flex-shrink-0 bg-slate-800/50 rounded-b-xl">
                 <div className="text-xs text-slate-400 flex-1 pr-4">
                    {selectedArabicText ? (
                        <p className="truncate">
                            Selected: <span className="font-arabic font-semibold text-sky-300">"{selectedArabicText}"</span>
                        </p>
                    ) : (
                        <p>Highlight text in the report to add it as context.</p>
                    )}
                </div>
                <button
                    onClick={handleAddContext}
                    disabled={!selectedArabicText || isAdded}
                    className="text-sm px-4 py-2 rounded font-semibold transition-colors duration-200 disabled:cursor-not-allowed flex items-center justify-center
                                bg-sky-800 text-sky-300 hover:bg-sky-700 hover:text-sky-200
                                disabled:bg-slate-600 disabled:text-slate-400 disabled:opacity-70"
                >
                    {isAdded ? (
                        <>
                            <CheckCircleIcon className="w-5 h-5 mr-2" />
                            <span>Added as Context</span>
                        </>
                    ) : (
                        <span>[+ إضافة كمرجع]</span>
                    )}
                </button>
            </footer>
        )}
      </div>
    </div>
  );
};

export default AskAiModal;
