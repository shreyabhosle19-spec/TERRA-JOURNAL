import React, { useState, useMemo } from 'react';
import { Search, Clock, ArrowUpRight, Bookmark, X, SlidersHorizontal, Heart, DollarSign } from 'lucide-react';
import { RealEstateArticle, ArticleCategory } from '../types/realestate';

interface ArchiveExplorerProps {
  articles: RealEstateArticle[];
  selectedCategory: ArticleCategory;
  onSelectCategory: (cat: ArticleCategory) => void;
  onSelectArticle: (article: RealEstateArticle) => void;
  savedIds: string[];
  onToggleSave: (articleId: string) => void;
}

export const ArchiveExplorer: React.FC<ArchiveExplorerProps> = ({
  articles,
  selectedCategory,
  onSelectCategory,
  onSelectArticle,
  savedIds,
  onToggleSave,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'readTime' | 'likes'>('date');

  const categories: ArticleCategory[] = [
    'All',
    'Investment Strategy',
    'Luxury Market',
    'Finance & Lending',
    'Restoration & Heritage',
    'Urban Living',
    'Sustainable Homes',
    'Buyer Playbook',
  ];

  // Filtering & Sorting
  const filteredArticles = useMemo(() => {
    return articles
      .filter((art) => {
        const matchesCategory =
          selectedCategory === 'All' || art.category === selectedCategory;
        if (!matchesCategory) return false;

        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        return (
          art.title.toLowerCase().includes(q) ||
          art.subtitle.toLowerCase().includes(q) ||
          art.excerpt.toLowerCase().includes(q) ||
          art.author.name.toLowerCase().includes(q) ||
          art.targetBudgetTier.toLowerCase().includes(q) ||
          art.tags.some((t) => t.toLowerCase().includes(q))
        );
      })
      .sort((a, b) => {
        if (sortBy === 'likes') {
          return b.likes - a.likes;
        }
        if (sortBy === 'readTime') {
          const numA = parseInt(a.readTime) || 0;
          const numB = parseInt(b.readTime) || 0;
          return numA - numB;
        }
        return 0;
      });
  }, [articles, selectedCategory, searchQuery, sortBy]);

  return (
    <section id="articles" className="py-14 border-t border-stone-200 dark:border-stone-800">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <span className="text-xs uppercase tracking-widest text-stone-500 dark:text-stone-400 font-mono">
            Real Estate Knowledge Base
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 dark:text-stone-100 mt-1">
            All 10 Real Estate Monographs & Playbooks
          </h2>
          <p className="text-sm text-stone-600 dark:text-stone-400 mt-1 max-w-xl">
            In-depth guides on budget allocation, equity acceleration, 1031 tax swaps, mortgage rates, and architectural valuation.
          </p>
        </div>

        {/* Counter Badge */}
        <div className="text-xs font-mono tabular-nums text-stone-500 dark:text-stone-400">
          Showing {filteredArticles.length} of {articles.length} Guide{articles.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-stone-200 dark:border-stone-800">
        {/* Category Segmented Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => onSelectCategory(cat)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors shrink-0 ${
                  isActive
                    ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 shadow-sm'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100 dark:text-stone-400 dark:hover:text-stone-100 dark:hover:bg-stone-800'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Search and Sort Toolbar */}
        <div className="flex items-center gap-3 w-full lg:w-auto">
          {/* Search Input */}
          <div className="relative flex-1 lg:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search mortgages, suburbs, taxes..."
              className="w-full pl-8 pr-7 py-1.5 text-xs bg-stone-100 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 rounded-md text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-stone-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
                aria-label="Clear search"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-1.5 shrink-0 text-xs text-stone-600 dark:text-stone-400">
            <SlidersHorizontal className="w-3.5 h-3.5 text-stone-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'date' | 'readTime' | 'likes')}
              className="bg-transparent border border-stone-200 dark:border-stone-700 rounded-md py-1.5 px-2 text-xs text-stone-800 dark:text-stone-200 focus:outline-none"
            >
              <option value="date" className="bg-stone-50 dark:bg-stone-900">
                Latest Published
              </option>
              <option value="readTime" className="bg-stone-50 dark:bg-stone-900">
                Shortest Read
              </option>
              <option value="likes" className="bg-stone-50 dark:bg-stone-900">
                Most Helpful
              </option>
            </select>
          </div>
        </div>
      </div>

      {/* Articles Stream */}
      {filteredArticles.length === 0 ? (
        <div className="py-20 text-center">
          <p className="font-serif text-xl text-stone-700 dark:text-stone-300">
            No real estate guides matching "{searchQuery}"
          </p>
          <p className="text-xs text-stone-500 mt-2 font-sans">
            Try adjusting your search query or selecting "All" categories.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              onSelectCategory('All');
            }}
            className="mt-4 px-4 py-2 text-xs font-medium text-stone-800 dark:text-stone-200 border border-stone-300 dark:border-stone-700 rounded-md hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="divide-y divide-stone-200 dark:divide-stone-800">
          {filteredArticles.map((article, index) => {
            const isSaved = savedIds.includes(article.id);

            return (
              <div
                key={article.id}
                className="group py-7 flex flex-col md:flex-row md:items-start justify-between gap-6 hover:bg-stone-100/50 dark:hover:bg-stone-850/40 px-2 sm:px-4 rounded-lg transition-colors"
              >
                {/* Left Index */}
                <div className="hidden sm:block text-xs font-mono tabular-nums text-stone-400 pt-1 shrink-0 w-8">
                  {String(index + 1).padStart(2, '0')}.
                </div>

                {/* Center Content */}
                <div className="flex-1">
                  {/* Unboxed Metadata */}
                  <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400 mb-1.5 font-sans">
                    <span className="font-medium text-amber-900 dark:text-amber-400">
                      {article.category}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{article.readTime}</span>
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{article.date}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono text-emerald-700 dark:text-emerald-400 font-medium flex items-center gap-0.5">
                      <DollarSign className="w-3 h-3" />
                      <span>{article.targetBudgetTier}</span>
                    </span>
                  </div>

                  {/* Title */}
                  <h3
                    onClick={() => onSelectArticle(article)}
                    className="text-lg sm:text-xl font-serif font-semibold text-stone-900 dark:text-stone-100 cursor-pointer group-hover:text-amber-900 dark:group-hover:text-amber-300 transition-colors"
                    style={{ textWrap: 'balance' }}
                  >
                    {article.title}
                  </h3>

                  {/* Subtitle */}
                  <p className="mt-1.5 text-xs sm:text-sm text-stone-600 dark:text-stone-400 font-sans leading-relaxed max-w-3xl">
                    {article.subtitle}
                  </p>

                  {/* Byline & Likes */}
                  <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-stone-500 dark:text-stone-400">
                    <span className="font-medium text-stone-800 dark:text-stone-200">
                      By {article.author.name}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{article.author.role}</span>
                    <span aria-hidden="true">·</span>
                    <span className="flex items-center gap-1 text-stone-500">
                      <Heart className="w-3 h-3 fill-stone-300 text-stone-400" />
                      <span className="font-mono tabular-nums">{article.likes} helpful</span>
                    </span>
                  </div>
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-2 self-start md:self-center shrink-0 pt-2 md:pt-0">
                  <button
                    onClick={() => onToggleSave(article.id)}
                    title={isSaved ? 'Remove from shortlist' : 'Save guide'}
                    className={`p-2 rounded border text-xs transition-colors ${
                      isSaved
                        ? 'bg-amber-100 border-amber-300 text-amber-900 dark:bg-amber-950 dark:border-amber-800 dark:text-amber-200'
                        : 'border-stone-200 dark:border-stone-700 text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-200/50 dark:hover:bg-stone-800'
                    }`}
                    aria-label="Save monograph"
                  >
                    <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
                  </button>

                  <button
                    onClick={() => onSelectArticle(article)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-900 dark:text-stone-100 border border-stone-300 dark:border-stone-700 hover:bg-stone-900 hover:text-white dark:hover:bg-stone-100 dark:hover:text-stone-900 rounded transition-colors whitespace-nowrap"
                  >
                    <span>Read Guide</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};
