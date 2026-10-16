import React from 'react';
import { Bookmark, Sun, Moon, DollarSign, BookOpen } from 'lucide-react';
import { ThemeMode } from '../types/blog';
import { ArticleCategory } from '../types/realestate';

interface HeaderProps {
  onGoHome: () => void;
  onSelectCategory: (cat: ArticleCategory) => void;
  onScrollToBudget: () => void;
  onScrollToArticles: () => void;
  onOpenAbout: () => void;
  savedCount: number;
  onOpenShortlist: () => void;
  currentBudget: number;
  theme: ThemeMode;
  onToggleTheme: (theme: ThemeMode) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onGoHome,
  onSelectCategory,
  onScrollToBudget,
  onScrollToArticles,
  onOpenAbout,
  savedCount,
  onOpenShortlist,
  currentBudget,
  theme,
  onToggleTheme,
}) => {
  const formatShortBudget = (val: number) => {
    if (val >= 1000000) return `$${(val / 1000000).toFixed(1)}M`;
    return `$${Math.round(val / 1000)}k`;
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md border-b transition-colors duration-200 border-stone-200/80 bg-stone-50/90 dark:border-stone-800/80 dark:bg-stone-900/90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-8">
        {/* Zone 1: Single text element Brand wordmark */}
        <button
          onClick={onGoHome}
          className="text-left text-2xl sm:text-3xl font-serif font-bold tracking-tight text-stone-900 dark:text-stone-100 hover:opacity-85 transition-opacity whitespace-nowrap shrink-0"
        >
          TERRA JOURNAL
        </button>

        {/* Zone 2: 4-5 clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-stone-600 dark:text-stone-300">
          <button
            onClick={() => {
              onSelectCategory('All');
              onScrollToArticles();
            }}
            className="hover:text-stone-950 dark:hover:text-stone-50 transition-colors whitespace-nowrap shrink-0 font-medium"
          >
            Blog Articles
          </button>
          <button
            onClick={() => {
              onSelectCategory('Investment Strategy');
              onScrollToArticles();
            }}
            className="hover:text-stone-950 dark:hover:text-stone-50 transition-colors whitespace-nowrap shrink-0"
          >
            Investment
          </button>
          <button
            onClick={() => {
              onSelectCategory('Finance & Lending');
              onScrollToArticles();
            }}
            className="hover:text-stone-950 dark:hover:text-stone-50 transition-colors whitespace-nowrap shrink-0"
          >
            Financing
          </button>
          <button
            onClick={onScrollToBudget}
            className="hover:text-stone-950 dark:hover:text-stone-50 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
          >
            <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
            <span>Budget Tool & Homes</span>
          </button>
          <button
            onClick={onOpenAbout}
            className="hover:text-stone-950 dark:hover:text-stone-50 transition-colors whitespace-nowrap shrink-0"
          >
            About
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Subtle theme toggle */}
          <button
            onClick={() => onToggleTheme(theme === 'noir' ? 'archival' : 'noir')}
            title="Toggle lighting theme"
            className="p-2 text-stone-600 hover:text-stone-950 dark:text-stone-400 dark:hover:text-stone-100 transition-colors rounded-md"
            aria-label="Toggle theme"
          >
            {theme === 'noir' ? (
              <Moon className="w-4 h-4 text-amber-300" />
            ) : (
              <Sun className="w-4 h-4 text-stone-700" />
            )}
          </button>

          {/* Quick Budget trigger */}
          <button
            onClick={onScrollToBudget}
            className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1.5 rounded border border-stone-300 dark:border-stone-700 text-xs font-mono tabular-nums text-stone-700 dark:text-stone-300 hover:bg-stone-200/50 dark:hover:bg-stone-800 transition-colors"
            title="Jump to budget explorer"
          >
            <span>Budget:</span>
            <span className="font-bold text-stone-900 dark:text-stone-100">
              {formatShortBudget(currentBudget)}
            </span>
          </button>

          {/* Primary Action Button: Reading List & Shortlist */}
          <button
            onClick={onOpenShortlist}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-medium tracking-wide text-white bg-stone-900 rounded-md hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-stone-200 transition-colors whitespace-nowrap shrink-0"
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>Reading List</span>
            {savedCount > 0 && (
              <span className="font-mono text-[11px] tabular-nums font-semibold px-1.5 py-0.2 bg-stone-700 text-stone-100 dark:bg-stone-300 dark:text-stone-900 rounded">
                {savedCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
