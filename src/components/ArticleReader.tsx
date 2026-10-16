import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Bookmark,
  Share2,
  Heart,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Check,
  Clock,
  Calendar,
  Layers,
  ChevronRight,
  DollarSign,
  MapPin,
  Bed,
  Bath,
  Square,
  ArrowUpRight,
} from 'lucide-react';
import { RealEstateArticle, PropertyListing, FontSize } from '../types/realestate';

interface ArticleReaderProps {
  article: RealEstateArticle;
  onBack: () => void;
  onSelectArticle: (article: RealEstateArticle) => void;
  allArticles: RealEstateArticle[];
  allProperties: PropertyListing[];
  onSelectProperty: (property: PropertyListing) => void;
  isSaved: boolean;
  onToggleSave: (articleId: string) => void;
}

export const ArticleReader: React.FC<ArticleReaderProps> = ({
  article,
  onBack,
  onSelectArticle,
  allArticles,
  allProperties,
  onSelectProperty,
  isSaved,
  onToggleSave,
}) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [fontSize, setFontSize] = useState<FontSize>('normal');
  const [likes, setLikes] = useState(article.likes);
  const [hasLiked, setHasLiked] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioSeconds, setAudioSeconds] = useState(32);
  const [audioMuted, setAudioMuted] = useState(false);
  const [activeTocId, setActiveTocId] = useState<string>(
    article.tableOfContents[0]?.id || ''
  );
  const [imgError, setImgError] = useState(false);

  // Scroll Progress Listener
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const currentProgress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(Math.min(100, Math.max(0, currentProgress)));
      }

      // Check current section for TOC
      article.tableOfContents.forEach((item) => {
        const el = document.getElementById(item.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 200 && rect.bottom >= 100) {
            setActiveTocId(item.id);
          }
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [article]);

  // Audio timer simulation
  useEffect(() => {
    let interval: any;
    if (isPlayingAudio) {
      interval = setInterval(() => {
        setAudioSeconds((prev) => (prev >= 380 ? 0 : prev + 1));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlayingAudio]);

  const handleLike = () => {
    if (!hasLiked) {
      setLikes((prev) => prev + 1);
      setHasLiked(true);
    } else {
      setLikes((prev) => prev - 1);
      setHasLiked(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const formatAudioTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(val);
  };

  // Associated properties for this article
  const matchingProperties = allProperties.filter((p) =>
    article.relatedPropertyIds?.includes(p.id)
  );

  // Related articles
  const relatedArticles = allArticles
    .filter((a) => a.id !== article.id)
    .slice(0, 3);

  const getFontSizeClass = () => {
    switch (fontSize) {
      case 'large':
        return 'text-lg leading-[1.85]';
      case 'larger':
        return 'text-xl leading-[1.95]';
      case 'normal':
      default:
        return 'text-base leading-[1.8]';
    }
  };

  return (
    <article className="min-h-screen pb-24">
      {/* 1. Thin Scroll Progress Indicator */}
      <div
        className="fixed top-0 left-0 right-0 h-1 bg-amber-800 dark:bg-amber-500 z-50 transition-all duration-100 ease-out"
        style={{ width: `${scrollProgress}%` }}
        role="progressbar"
        aria-valuenow={Math.round(scrollProgress)}
        aria-valuemin={0}
        aria-valuemax={100}
      />

      {/* 2. Reader Floating Utility Bar */}
      <div className="sticky top-18 z-30 w-full border-b border-stone-200/90 dark:border-stone-800/90 bg-stone-50/95 dark:bg-stone-900/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between gap-4">
          {/* Back button */}
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-stone-100 transition-colors whitespace-nowrap"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Real Estate Journal</span>
          </button>

          {/* Reader Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Audio narrator toggle */}
            <button
              onClick={() => setIsPlayingAudio(!isPlayingAudio)}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-xs rounded border transition-colors ${
                isPlayingAudio
                  ? 'bg-amber-100 border-amber-300 text-amber-900 dark:bg-amber-950 dark:border-amber-800 dark:text-amber-200'
                  : 'border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
              }`}
              title="Listen to narrated article"
            >
              {isPlayingAudio ? (
                <>
                  <Pause className="w-3 h-3 text-amber-800 dark:text-amber-300" />
                  <span className="font-mono text-[11px] tabular-nums hidden sm:inline">
                    {formatAudioTime(audioSeconds)}
                  </span>
                </>
              ) : (
                <>
                  <Play className="w-3 h-3" />
                  <span className="hidden sm:inline">Listen to Audio</span>
                </>
              )}
            </button>

            {/* Font Size Selector */}
            <div className="hidden sm:flex items-center border border-stone-200 dark:border-stone-700 rounded p-0.5 text-xs text-stone-600 dark:text-stone-300">
              <button
                onClick={() => setFontSize('normal')}
                className={`px-2 py-0.5 rounded text-[11px] ${
                  fontSize === 'normal'
                    ? 'bg-stone-200 dark:bg-stone-700 font-semibold'
                    : 'hover:text-stone-900 dark:hover:text-stone-100'
                }`}
                title="Default text size"
              >
                A
              </button>
              <button
                onClick={() => setFontSize('large')}
                className={`px-2 py-0.5 rounded text-xs ${
                  fontSize === 'large'
                    ? 'bg-stone-200 dark:bg-stone-700 font-semibold'
                    : 'hover:text-stone-900 dark:hover:text-stone-100'
                }`}
                title="Large text size"
              >
                A+
              </button>
              <button
                onClick={() => setFontSize('larger')}
                className={`px-2 py-0.5 rounded text-sm ${
                  fontSize === 'larger'
                    ? 'bg-stone-200 dark:bg-stone-700 font-semibold'
                    : 'hover:text-stone-900 dark:hover:text-stone-100'
                }`}
                title="Expansive text size"
              >
                A++
              </button>
            </div>

            {/* Bookmark button */}
            <button
              onClick={() => onToggleSave(article.id)}
              className={`p-1.5 rounded border transition-colors ${
                isSaved
                  ? 'bg-amber-100 border-amber-300 text-amber-900 dark:bg-amber-950 dark:border-amber-800 dark:text-amber-200'
                  : 'border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
              }`}
              title={isSaved ? 'Remove from shortlist' : 'Save to shortlist'}
              aria-label="Bookmark article"
            >
              <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
            </button>

            {/* Share / Copy link */}
            <button
              onClick={handleCopyLink}
              className="p-1.5 rounded border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
              title="Copy link to monograph"
              aria-label="Share article"
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              ) : (
                <Share2 className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>

        {/* Audio Player Drawer Banner when playing */}
        {isPlayingAudio && (
          <div className="bg-amber-50/90 dark:bg-stone-850 border-t border-amber-200 dark:border-stone-700 px-4 py-2 flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-600"></span>
              </span>
              <span className="text-stone-700 dark:text-stone-300 font-medium">
                Audio Narration: {article.title}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="font-mono tabular-nums text-stone-500">
                {formatAudioTime(audioSeconds)} / 06:24
              </span>
              <button
                onClick={() => setAudioMuted(!audioMuted)}
                className="text-stone-500 hover:text-stone-800 dark:hover:text-stone-200"
              >
                {audioMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={() => setIsPlayingAudio(false)}
                className="text-stone-500 hover:text-stone-900 text-xs font-medium"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 3. Main Reading Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Article Body (8 cols on desktop) */}
          <div className="lg:col-span-8 max-w-2xl mx-auto lg:mx-0">
            {/* Header Kicker */}
            <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400 mb-4 font-sans">
              <span className="font-semibold uppercase tracking-wider text-amber-900 dark:text-amber-400">
                {article.category}
              </span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1 font-mono text-emerald-700 dark:text-emerald-400 font-medium">
                <DollarSign className="w-3 h-3" />
                <span>Target: {article.targetBudgetTier}</span>
              </span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{article.readTime}</span>
              </span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>{article.date}</span>
              </span>
            </div>

            {/* Monograph Title */}
            <h1
              className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-stone-900 dark:text-stone-50 leading-[1.12] tracking-tight"
              style={{ textWrap: 'balance' }}
            >
              {article.title}
            </h1>

            {/* Subtitle / Deck */}
            <p className="mt-4 text-lg sm:text-xl text-stone-600 dark:text-stone-300 font-sans leading-relaxed">
              {article.subtitle}
            </p>

            {/* Author Byline */}
            <div className="mt-6 pt-6 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-stone-200 dark:bg-stone-700 flex items-center justify-center font-serif text-sm font-semibold text-stone-800 dark:text-stone-100">
                  {article.author.initials}
                </div>
                <div>
                  <p className="text-sm font-semibold text-stone-900 dark:text-stone-100">
                    {article.author.name}
                  </p>
                  <p className="text-xs text-stone-500 dark:text-stone-400">
                    {article.author.role}
                  </p>
                </div>
              </div>

              {copied && (
                <span className="text-xs text-emerald-700 dark:text-emerald-400 font-medium bg-emerald-50 dark:bg-emerald-950 px-2.5 py-1 rounded border border-emerald-200 dark:border-emerald-800">
                  Link copied to clipboard
                </span>
              )}
            </div>

            {/* Hero Artwork */}
            <figure className="my-8">
              <div className="overflow-hidden rounded-lg bg-stone-200 dark:bg-stone-800 border border-stone-200 dark:border-stone-800 aspect-16/10">
                {!imgError ? (
                  <img
                    src={article.image}
                    alt={article.title}
                    referrerPolicy="no-referrer"
                    onError={() => setImgError(true)}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-stone-100 dark:bg-stone-800 text-stone-500 font-serif">
                    <span>{article.title}</span>
                  </div>
                )}
              </div>
              <figcaption className="mt-2.5 text-xs font-serif italic text-stone-500 dark:text-stone-400">
                {article.imageCaption}
              </figcaption>
            </figure>

            {/* Pull Quote */}
            <div className="my-10 py-6 border-y border-stone-200 dark:border-stone-800 text-center px-4">
              <blockquote className="font-serif italic text-xl sm:text-2xl text-stone-800 dark:text-stone-200 leading-snug">
                "{article.pullQuote}"
              </blockquote>
              {article.pullQuoteAuthor && (
                <cite className="block mt-2 text-xs font-sans not-italic text-stone-500 dark:text-stone-400 uppercase tracking-wider">
                  — {article.pullQuoteAuthor}
                </cite>
              )}
            </div>

            {/* Article Sections */}
            <div className={`space-y-8 font-sans ${getFontSizeClass()} text-stone-800 dark:text-stone-200`}>
              {article.sections.map((section, sIndex) => (
                <section
                  key={section.id}
                  id={section.id}
                  className="scroll-mt-28"
                >
                  {section.heading && (
                    <h2 className="text-2xl sm:text-3xl font-serif font-semibold text-stone-900 dark:text-stone-100 mb-4 tracking-tight">
                      {section.heading}
                    </h2>
                  )}

                  {section.paragraphs.map((p, pIndex) => (
                    <p
                      key={pIndex}
                      className={`mb-5 ${
                        sIndex === 0 && pIndex === 0 ? 'editorial-drop-cap' : ''
                      }`}
                    >
                      {p}
                    </p>
                  ))}

                  {/* Section Callout */}
                  {section.callout && (
                    <div className="my-6 p-5 bg-stone-100/70 dark:bg-stone-800/60 rounded-md border border-stone-200/80 dark:border-stone-700/80">
                      {section.callout.type === 'stat' && (
                        <div className="flex items-start gap-3">
                          <Layers className="w-5 h-5 text-amber-700 dark:text-amber-400 shrink-0 mt-0.5" />
                          <div>
                            <span className="text-xs font-mono uppercase tracking-wider text-stone-500 dark:text-stone-400 block mb-1">
                              Empirical Real Estate Metric
                            </span>
                            <p className="text-sm font-sans text-stone-800 dark:text-stone-200 font-medium">
                              {section.callout.text}
                            </p>
                          </div>
                        </div>
                      )}

                      {section.callout.type === 'margin-note' && (
                        <div>
                          <span className="text-xs font-mono uppercase tracking-wider text-stone-500 dark:text-stone-400 block mb-1">
                            Advisory Annotation
                          </span>
                          <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 font-serif italic">
                            {section.callout.text}
                          </p>
                        </div>
                      )}

                      {section.callout.type === 'quote' && (
                        <div>
                          <p className="font-serif italic text-base sm:text-lg text-stone-800 dark:text-stone-200 leading-snug">
                            "{section.callout.text}"
                          </p>
                          {section.callout.citation && (
                            <p className="mt-1.5 text-xs text-stone-500 dark:text-stone-400 font-sans">
                              — {section.callout.citation}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </section>
              ))}
            </div>

            {/* Properties Featured in This Strategy Guide */}
            {matchingProperties.length > 0 && (
              <div className="mt-14 p-6 rounded-xl bg-stone-100/90 dark:bg-stone-850/80 border border-stone-200 dark:border-stone-800">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-xs uppercase tracking-widest font-mono text-stone-500 dark:text-stone-400">
                      Portfolio Alignment
                    </span>
                    <h3 className="text-lg font-serif font-bold text-stone-900 dark:text-stone-100 mt-0.5">
                      Properties Matching This Strategy & Budget
                    </h3>
                  </div>
                  <span className="text-xs font-mono text-stone-500">
                    {matchingProperties.length} Residence{matchingProperties.length !== 1 ? 's' : ''}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {matchingProperties.map((prop) => (
                    <div
                      key={prop.id}
                      onClick={() => onSelectProperty(prop)}
                      className="group cursor-pointer p-3 bg-white dark:bg-stone-900 rounded-lg border border-stone-200 dark:border-stone-750 hover:shadow-sm transition-shadow"
                    >
                      <div className="aspect-16/10 rounded overflow-hidden bg-stone-200 dark:bg-stone-800 mb-2.5">
                        <img
                          src={prop.image}
                          alt={prop.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="text-xs font-bold font-mono text-stone-900 dark:text-stone-100">
                        {formatCurrency(prop.price)}
                      </div>
                      <h4 className="text-xs font-serif font-semibold text-stone-800 dark:text-stone-200 group-hover:text-amber-800 dark:group-hover:text-amber-300 line-clamp-1 mt-0.5">
                        {prop.title}
                      </h4>
                      <p className="text-[11px] text-stone-500 mt-1 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-stone-400" />
                        <span>
                          {prop.city}, {prop.state} · {prop.beds}B/{prop.baths}B
                        </span>
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Interactive Feedback & Likes */}
            <div className="mt-12 pt-8 border-t border-stone-200 dark:border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleLike}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-full border transition-all ${
                    hasLiked
                      ? 'bg-rose-50 border-rose-300 text-rose-700 dark:bg-rose-950 dark:border-rose-800 dark:text-rose-200 scale-105'
                      : 'border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
                  }`}
                  aria-label="Applaud essay"
                >
                  <Heart
                    className={`w-4 h-4 ${hasLiked ? 'fill-current text-rose-600' : ''}`}
                  />
                  <span className="text-xs font-semibold font-mono tabular-nums">
                    {likes}
                  </span>
                  <span className="text-xs font-medium">
                    {hasLiked ? 'Bookmarked as Essential' : 'Mark as Essential'}
                  </span>
                </button>

                <button
                  onClick={() => onToggleSave(article.id)}
                  className={`flex items-center gap-1.5 px-4 py-2.5 rounded-full border text-xs font-medium transition-colors ${
                    isSaved
                      ? 'bg-amber-100 border-amber-300 text-amber-900 dark:bg-amber-950 dark:border-amber-800 dark:text-amber-200'
                      : 'border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
                  }`}
                >
                  <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
                  <span>{isSaved ? 'Saved in Shortlist' : 'Save to Shortlist'}</span>
                </button>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap items-center gap-2">
                {article.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs text-stone-500 dark:text-stone-400 font-mono"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Author Biography Footer Card */}
            <div className="mt-10 p-6 rounded-lg bg-stone-100/60 dark:bg-stone-850/40 border border-stone-200 dark:border-stone-800 flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-stone-300 dark:bg-stone-700 flex items-center justify-center font-serif text-base font-semibold text-stone-800 dark:text-stone-100 shrink-0">
                {article.author.initials}
              </div>
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-stone-500 dark:text-stone-400">
                  Contributing Real Estate Strategist
                </span>
                <h4 className="text-base font-serif font-bold text-stone-900 dark:text-stone-100 mt-0.5">
                  {article.author.name}
                </h4>
                <p className="text-xs text-stone-600 dark:text-stone-400 font-sans mt-1 leading-relaxed">
                  {article.author.role}. Their writing advises family offices and independent buyers on structural equity optimization and debt positioning.
                </p>
              </div>
            </div>
          </div>

          {/* Sticky Side Rail */}
          <div className="hidden lg:block lg:col-span-4 space-y-8 pl-4">
            <div className="sticky top-32 p-6 rounded-lg border border-stone-200 dark:border-stone-800 bg-stone-50/60 dark:bg-stone-850/40">
              <h3 className="text-xs font-mono uppercase tracking-widest text-stone-500 dark:text-stone-400 mb-4">
                Playbook Sections
              </h3>
              <nav className="space-y-2.5">
                {article.tableOfContents.map((item, idx) => {
                  const isActive = activeTocId === item.id;
                  return (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      className={`group flex items-start gap-2 text-xs transition-colors ${
                        isActive
                          ? 'text-amber-900 dark:text-amber-300 font-semibold'
                          : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
                      }`}
                    >
                      <span className="font-mono text-stone-400 text-[11px] pt-0.5">
                        {String(idx + 1).padStart(2, '0')}.
                      </span>
                      <span className="group-hover:underline underline-offset-4 leading-snug">
                        {item.title}
                      </span>
                    </a>
                  );
                })}
              </nav>

              {/* Strategy Parameters */}
              <div className="mt-8 pt-6 border-t border-stone-200 dark:border-stone-800">
                <span className="text-xs font-mono uppercase tracking-widest text-stone-500 dark:text-stone-400 block mb-3">
                  Capital Parameters
                </span>
                <dl className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-stone-200/50 dark:border-stone-800/50">
                    <dt className="text-stone-500">Target Budget</dt>
                    <dd className="font-mono font-semibold text-emerald-700 dark:text-emerald-400">
                      {article.targetBudgetTier}
                    </dd>
                  </div>
                  <div className="flex justify-between py-1 border-b border-stone-200/50 dark:border-stone-800/50">
                    <dt className="text-stone-500">Asset Class</dt>
                    <dd className="text-stone-800 dark:text-stone-200">
                      {article.category}
                    </dd>
                  </div>
                  <div className="flex justify-between py-1 border-b border-stone-200/50 dark:border-stone-800/50">
                    <dt className="text-stone-500">Advisory Docket</dt>
                    <dd className="font-mono text-stone-800 dark:text-stone-200">
                      RE-{article.id.slice(0, 8).toUpperCase()}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* 4. Related Guides Strip */}
        <section className="mt-20 pt-12 border-t border-stone-200 dark:border-stone-800">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-stone-500 dark:text-stone-400">
                Next in the Journal
              </span>
              <h3 className="text-2xl font-serif font-semibold text-stone-900 dark:text-stone-100 mt-1">
                Related Real Estate Inquiries
              </h3>
            </div>
            <button
              onClick={onBack}
              className="text-xs font-medium text-stone-600 dark:text-stone-300 hover:text-stone-950 dark:hover:text-stone-50 flex items-center gap-1"
            >
              <span>Explore All 10 Guides</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedArticles.map((rel) => (
              <div
                key={rel.id}
                onClick={() => {
                  onSelectArticle(rel);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="group cursor-pointer p-4 rounded-lg border border-stone-200 dark:border-stone-800 hover:bg-stone-100/60 dark:hover:bg-stone-850/60 transition-colors"
              >
                <div className="aspect-16/10 rounded overflow-hidden bg-stone-200 dark:bg-stone-800 mb-3">
                  <img
                    src={rel.image}
                    alt={rel.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="text-xs text-stone-500 dark:text-stone-400 mb-1">
                  <span>{rel.category}</span>
                  <span className="mx-1.5">·</span>
                  <span className="font-mono text-emerald-700 dark:text-emerald-400">
                    {rel.targetBudgetTier}
                  </span>
                </div>
                <h4 className="text-base font-serif font-semibold text-stone-900 dark:text-stone-100 group-hover:text-amber-900 dark:group-hover:text-amber-300 transition-colors line-clamp-2">
                  {rel.title}
                </h4>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 line-clamp-2">
                  {rel.subtitle}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </article>
  );
};
