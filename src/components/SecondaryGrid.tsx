import React, { useState } from 'react';
import { ArrowUpRight, Bookmark, Clock, DollarSign } from 'lucide-react';
import { RealEstateArticle } from '../types/realestate';

interface SecondaryGridProps {
  articles: RealEstateArticle[];
  onSelectArticle: (article: RealEstateArticle) => void;
  savedIds: string[];
  onToggleSave: (articleId: string) => void;
}

export const SecondaryGrid: React.FC<SecondaryGridProps> = ({
  articles,
  onSelectArticle,
  savedIds,
  onToggleSave,
}) => {
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  return (
    <section className="py-12 border-b border-stone-200 dark:border-stone-800">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-xl sm:text-2xl font-serif font-semibold text-stone-900 dark:text-stone-100 tracking-tight">
            Featured Real Estate Market Inquiries
          </h2>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
            Critical analysis on architectural appreciation, debt structuring, and historic townhome capital.
          </p>
        </div>
        <span className="hidden sm:inline-block text-xs font-mono tabular-nums text-stone-400">
          Curated Vol. VIII
        </span>
      </div>

      {/* 3-Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {articles.map((article) => {
          const isSaved = savedIds.includes(article.id);
          const hasImageFailed = failedImages[article.id];

          return (
            <article
              key={article.id}
              className="group flex flex-col justify-between border-t border-stone-200 dark:border-stone-800 pt-5"
            >
              <div>
                {/* Image Showcase */}
                <div
                  onClick={() => onSelectArticle(article)}
                  className="relative overflow-hidden rounded-md bg-stone-200 dark:bg-stone-800 aspect-16/10 mb-4 cursor-pointer border border-stone-200/80 dark:border-stone-800/80"
                >
                  {!hasImageFailed ? (
                    <img
                      src={article.image}
                      alt={article.title}
                      referrerPolicy="no-referrer"
                      onError={() =>
                        setFailedImages((prev) => ({ ...prev, [article.id]: true }))
                      }
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center p-4 bg-stone-100 dark:bg-stone-800 text-stone-600 font-serif text-center">
                      <span>{article.category} Analysis</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-stone-900/10 group-hover:bg-transparent transition-colors" />

                  {/* Budget Bracket Overlay */}
                  <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-black/70 text-white backdrop-blur-xs flex items-center gap-1">
                    <DollarSign className="w-2.5 h-2.5 text-amber-400" />
                    <span>{article.targetBudgetTier}</span>
                  </div>
                </div>

                {/* Unboxed Metadata */}
                <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400 mb-2 font-sans">
                  <span className="font-medium text-amber-900 dark:text-amber-400">
                    {article.category}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{article.readTime}</span>
                  </span>
                </div>

                {/* Article Title */}
                <h3
                  onClick={() => onSelectArticle(article)}
                  className="text-lg sm:text-xl font-serif font-semibold text-stone-900 dark:text-stone-100 leading-snug cursor-pointer group-hover:text-amber-900 dark:group-hover:text-amber-300 transition-colors"
                  style={{ textWrap: 'balance' }}
                >
                  {article.title}
                </h3>

                {/* Excerpt */}
                <p className="mt-2 text-xs sm:text-sm text-stone-600 dark:text-stone-400 leading-relaxed line-clamp-3 font-sans">
                  {article.excerpt}
                </p>
              </div>

              {/* Card Footer: Author & Action */}
              <div className="mt-6 pt-4 border-t border-stone-100 dark:border-stone-850 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-stone-200 dark:bg-stone-700 flex items-center justify-center font-serif text-xs font-semibold text-stone-800 dark:text-stone-200">
                    {article.author.initials}
                  </div>
                  <div>
                    <p className="text-xs font-medium text-stone-900 dark:text-stone-200">
                      {article.author.name}
                    </p>
                    <p className="text-[11px] text-stone-500 dark:text-stone-400">
                      {article.date}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onToggleSave(article.id)}
                    title={isSaved ? 'Remove from shortlist' : 'Save article'}
                    className={`p-1.5 rounded transition-colors ${
                      isSaved
                        ? 'text-amber-700 dark:text-amber-400'
                        : 'text-stone-400 hover:text-stone-700 dark:hover:text-stone-200'
                    }`}
                    aria-label="Save article"
                  >
                    <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
                  </button>

                  <button
                    onClick={() => onSelectArticle(article)}
                    className="p-1.5 text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
                    aria-label={`Read ${article.title}`}
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};
