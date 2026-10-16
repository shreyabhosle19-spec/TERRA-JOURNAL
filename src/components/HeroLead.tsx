import React, { useState } from 'react';
import { ArrowUpRight, Bookmark, Clock, DollarSign } from 'lucide-react';
import { RealEstateArticle } from '../types/realestate';

interface HeroLeadProps {
  article: RealEstateArticle;
  onSelectArticle: (article: RealEstateArticle) => void;
  isSaved: boolean;
  onToggleSave: (articleId: string) => void;
  onScrollToBudget: () => void;
}

export const HeroLead: React.FC<HeroLeadProps> = ({
  article,
  onSelectArticle,
  isSaved,
  onToggleSave,
  onScrollToBudget,
}) => {
  const [imgError, setImgError] = useState(false);

  return (
    <section className="relative w-full border-b border-stone-200 dark:border-stone-800 pb-16 pt-8">
      {/* Editorial Kicker Banner */}
      <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 mb-6 font-sans">
        <div className="flex items-center gap-2">
          <span className="font-semibold tracking-wider uppercase text-stone-800 dark:text-stone-200">
            Real Estate Masterclass
          </span>
          <span aria-hidden="true">·</span>
          <span>Target Budget: {article.targetBudgetTier}</span>
          <span aria-hidden="true">·</span>
          <span>Autumn 2026 Advisory</span>
        </div>
        <div className="hidden sm:flex items-center gap-2 font-mono tabular-nums">
          <span>Capital Series</span>
          <span aria-hidden="true">·</span>
          <span>10 Monograph Guides</span>
        </div>
      </div>

      {/* Main Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
        {/* Left Column: Typography & Deck (7 cols) */}
        <div className="lg:col-span-7 flex flex-col justify-between">
          <div>
            {/* Unboxed Metadata Line */}
            <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400 mb-4">
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
            </div>

            {/* Display Headline */}
            <h1
              onClick={() => onSelectArticle(article)}
              className="text-3xl sm:text-4xl lg:text-5xl font-serif font-semibold text-stone-900 dark:text-stone-50 leading-[1.12] tracking-tight cursor-pointer hover:text-amber-900 dark:hover:text-amber-300 transition-colors"
              style={{ textWrap: 'balance' }}
            >
              {article.title}
            </h1>

            {/* Subtitle / Deck */}
            <p className="mt-4 text-base sm:text-lg text-stone-600 dark:text-stone-300 leading-relaxed font-sans max-w-2xl">
              {article.subtitle}
            </p>

            {/* Excerpt Body */}
            <p className="mt-4 text-sm text-stone-500 dark:text-stone-400 leading-relaxed font-sans max-w-2xl line-clamp-3">
              {article.excerpt}
            </p>
          </div>

          {/* Curatorial Pull Quote Strip */}
          <div className="my-6 py-4 border-y border-stone-200 dark:border-stone-800">
            <p className="font-serif italic text-base sm:text-lg text-stone-800 dark:text-stone-200 leading-snug">
              "{article.pullQuote}"
            </p>
            {article.pullQuoteAuthor && (
              <p className="mt-1 text-xs text-stone-500 dark:text-stone-400 font-sans">
                — {article.pullQuoteAuthor}
              </p>
            )}
          </div>

          {/* Author Byline & Actions */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-stone-200 dark:bg-stone-700 flex items-center justify-center font-serif text-sm font-semibold text-stone-800 dark:text-stone-100">
                {article.author.initials}
              </div>
              <div>
                <p className="text-sm font-semibold text-stone-900 dark:text-stone-100">
                  {article.author.name}
                </p>
                <p className="text-xs text-stone-500 dark:text-stone-400 line-clamp-1">
                  {article.author.role}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={onScrollToBudget}
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-md border border-stone-300 dark:border-stone-700 text-xs font-medium text-stone-800 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
              >
                <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                <span>Match Budget Properties</span>
              </button>

              <button
                onClick={() => onToggleSave(article.id)}
                title={isSaved ? 'Remove from shortlist' : 'Save article'}
                className={`p-2.5 rounded-md border text-xs font-medium transition-colors ${
                  isSaved
                    ? 'bg-amber-100 border-amber-300 text-amber-900 dark:bg-amber-950 dark:border-amber-800 dark:text-amber-200'
                    : 'border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
                }`}
                aria-label="Save article"
              >
                <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
              </button>

              <button
                onClick={() => onSelectArticle(article)}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-stone-200 text-xs font-medium tracking-wide rounded-md transition-colors whitespace-nowrap"
              >
                <span>Read Real Estate Guide</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Hero Artwork (5 cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between">
          <div
            onClick={() => onSelectArticle(article)}
            className="group relative overflow-hidden rounded-lg bg-stone-200 dark:bg-stone-800 cursor-pointer aspect-4/3 lg:aspect-auto lg:h-full min-h-[320px] shadow-sm border border-stone-200 dark:border-stone-800"
          >
            {!imgError ? (
              <img
                src={article.image}
                alt={article.title}
                referrerPolicy="no-referrer"
                onError={() => setImgError(true)}
                className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-stone-100 dark:bg-stone-800 text-center">
                <span className="font-serif text-2xl text-stone-600 dark:text-stone-300 mb-2">
                  TERRA REAL ESTATE
                </span>
                <p className="text-xs text-stone-500">{article.title}</p>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
          </div>

          <p className="mt-2 text-xs font-serif italic text-stone-500 dark:text-stone-400">
            {article.imageCaption}
          </p>
        </div>
      </div>
    </section>
  );
};
