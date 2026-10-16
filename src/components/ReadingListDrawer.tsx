import React, { useState } from 'react';
import { X, Trash2, ArrowRight, Bookmark, Clock, DollarSign, Home, FileText, MapPin } from 'lucide-react';
import { RealEstateArticle, PropertyListing } from '../types/realestate';

interface ReadingListDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  savedArticles: RealEstateArticle[];
  savedProperties: PropertyListing[];
  onSelectArticle: (article: RealEstateArticle) => void;
  onSelectProperty: (property: PropertyListing) => void;
  onRemoveSavedArticle: (id: string) => void;
  onRemoveSavedProperty: (id: string) => void;
  onClearAll: () => void;
}

export const ReadingListDrawer: React.FC<ReadingListDrawerProps> = ({
  isOpen,
  onClose,
  savedArticles,
  savedProperties,
  onSelectArticle,
  onSelectProperty,
  onRemoveSavedArticle,
  onRemoveSavedProperty,
  onClearAll,
}) => {
  const [activeTab, setActiveTab] = useState<'properties' | 'articles'>(
    savedProperties.length > 0 ? 'properties' : 'articles'
  );

  if (!isOpen) return null;

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const totalSavedCount = savedArticles.length + savedProperties.length;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-stone-900/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-stone-50 dark:bg-stone-900 shadow-2xl border-l border-stone-200 dark:border-stone-800 flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bookmark className="w-4 h-4 text-amber-800 dark:text-amber-400" />
              <h2 className="text-lg font-serif font-bold text-stone-900 dark:text-stone-100">
                Personal Real Estate Portfolio
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 rounded-md transition-colors"
              aria-label="Close shortlist"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Segmented Controls: Properties vs Articles */}
          <div className="px-6 py-2 bg-stone-100/70 dark:bg-stone-850/60 border-b border-stone-200 dark:border-stone-800 flex gap-2">
            <button
              onClick={() => setActiveTab('properties')}
              className={`flex-1 py-1.5 px-3 rounded text-xs font-medium flex items-center justify-center gap-1.5 transition-colors ${
                activeTab === 'properties'
                  ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-xs'
                  : 'text-stone-500 hover:text-stone-900 dark:hover:text-stone-100'
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              <span>Properties ({savedProperties.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('articles')}
              className={`flex-1 py-1.5 px-3 rounded text-xs font-medium flex items-center justify-center gap-1.5 transition-colors ${
                activeTab === 'articles'
                  ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-xs'
                  : 'text-stone-500 hover:text-stone-900 dark:hover:text-stone-100'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Strategy Guides ({savedArticles.length})</span>
            </button>
          </div>

          {/* Content Stream */}
          <div className="flex-1 overflow-y-auto p-6 divide-y divide-stone-200 dark:divide-stone-800">
            {activeTab === 'properties' ? (
              savedProperties.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center px-4 py-16">
                  <Home className="w-10 h-10 text-stone-300 dark:text-stone-700 mb-3 stroke-[1.2]" />
                  <h3 className="font-serif text-lg text-stone-800 dark:text-stone-200 font-medium">
                    No properties shortlisted
                  </h3>
                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 max-w-xs leading-relaxed">
                    Browse properties in the budget explorer and bookmark residences to compare financing and request private viewings.
                  </p>
                </div>
              ) : (
                savedProperties.map((prop) => (
                  <div key={prop.id} className="py-4 first:pt-0 last:pb-0 group">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="text-xs font-mono font-bold text-stone-900 dark:text-stone-100">
                          {formatCurrency(prop.price)}
                        </div>
                        <h4
                          onClick={() => {
                            onSelectProperty(prop);
                            onClose();
                          }}
                          className="text-sm font-serif font-semibold text-stone-800 dark:text-stone-200 cursor-pointer group-hover:text-amber-900 dark:group-hover:text-amber-300 transition-colors leading-snug mt-0.5"
                        >
                          {prop.title}
                        </h4>
                        <p className="text-[11px] text-stone-500 flex items-center gap-1 mt-1">
                          <MapPin className="w-3 h-3 text-stone-400" />
                          <span>
                            {prop.neighborhood}, {prop.city} · {prop.beds}B/{prop.baths}B
                          </span>
                        </p>
                      </div>

                      <button
                        onClick={() => onRemoveSavedProperty(prop.id)}
                        className="p-1 text-stone-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors shrink-0"
                        title="Remove from shortlist"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      <button
                        onClick={() => {
                          onSelectProperty(prop);
                          onClose();
                        }}
                        className="inline-flex items-center gap-1 text-xs font-medium text-stone-700 dark:text-stone-300 hover:text-stone-950 dark:hover:text-stone-50"
                      >
                        <span>View Financials & Tour</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))
              )
            ) : savedArticles.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center px-4 py-16">
                <FileText className="w-10 h-10 text-stone-300 dark:text-stone-700 mb-3 stroke-[1.2]" />
                <h3 className="font-serif text-lg text-stone-800 dark:text-stone-200 font-medium">
                  No strategy guides saved
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 max-w-xs leading-relaxed">
                  Save monographs on suburban equity, 1031 exchanges, or mortgage buydowns to read anytime.
                </p>
              </div>
            ) : (
              savedArticles.map((article) => (
                <div key={article.id} className="py-4 first:pt-0 last:pb-0 group">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="text-[11px] text-stone-500 dark:text-stone-400 mb-1">
                        <span>{article.category}</span>
                        <span className="mx-1.5">·</span>
                        <span className="font-mono text-emerald-700 dark:text-emerald-400">
                          {article.targetBudgetTier}
                        </span>
                      </div>
                      <h4
                        onClick={() => {
                          onSelectArticle(article);
                          onClose();
                        }}
                        className="text-sm font-serif font-semibold text-stone-900 dark:text-stone-100 cursor-pointer group-hover:text-amber-900 dark:group-hover:text-amber-300 transition-colors leading-snug"
                      >
                        {article.title}
                      </h4>
                      <p className="text-xs text-stone-500 mt-1">By {article.author.name}</p>
                    </div>

                    <button
                      onClick={() => onRemoveSavedArticle(article.id)}
                      className="p-1 text-stone-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors shrink-0"
                      title="Remove guide"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <button
                      onClick={() => {
                        onSelectArticle(article);
                        onClose();
                      }}
                      className="inline-flex items-center gap-1 text-xs font-medium text-stone-700 dark:text-stone-300 hover:text-stone-950 dark:hover:text-stone-50"
                    >
                      <span>Read Guide</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {totalSavedCount > 0 && (
            <div className="p-4 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between bg-stone-50 dark:bg-stone-900">
              <button
                onClick={onClearAll}
                className="text-xs text-stone-500 hover:text-rose-600 dark:text-stone-400 dark:hover:text-rose-400 transition-colors"
              >
                Clear all shortlisted
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-stone-200 text-xs font-medium rounded transition-colors"
              >
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
