import React from 'react';
import { X, Building2, TrendingUp, ShieldCheck } from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-stone-900/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-2xl bg-stone-50 dark:bg-stone-900 rounded-xl shadow-2xl border border-stone-200 dark:border-stone-800 p-6 sm:p-8 max-h-[90vh] overflow-y-auto z-10">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 rounded-md transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="text-center pb-6 border-b border-stone-200 dark:border-stone-800">
          <span className="text-xs uppercase tracking-widest font-mono text-stone-500 dark:text-stone-400">
            Real Estate Advisory Colophon
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 dark:text-stone-100 mt-1">
            TERRA REAL ESTATE & CAPITAL
          </h2>
          <p className="text-xs font-serif italic text-stone-600 dark:text-stone-400 mt-1">
            Bridging Independent Real Estate Analysis with Quantitative Budget Matching
          </p>
        </div>

        {/* Body Content */}
        <div className="py-6 space-y-5 text-xs sm:text-sm text-stone-700 dark:text-stone-300 font-sans leading-relaxed">
          <p className="editorial-drop-cap">
            TERRA was founded to provide transparent, uncompromised real estate intelligence for property buyers and investors. In an industry overwhelmed by aggressive agent sales pitches, opaque MLS syndication feeds, and superficial cosmetic flips, we combine forensic architectural valuation with rigorous financial modeling.
          </p>

          <p>
            Our core mission is straightforward: empower individuals and families to establish their exact financial comfort zone—calculating true down payments, monthly debt amortization, property taxes, and long-term holding costs—while showcasing curated architectural properties strictly aligned with that budget.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 pb-2">
            <div className="p-3.5 rounded bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
              <Building2 className="w-4 h-4 text-amber-800 dark:text-amber-400 mb-1.5" />
              <h4 className="font-serif font-semibold text-stone-900 dark:text-stone-100 text-xs">
                Architectural Pedigree
              </h4>
              <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-1">
                Evaluating structural permanence, mass timber, rammed earth, and historic brownstone longevity.
              </p>
            </div>

            <div className="p-3.5 rounded bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
              <TrendingUp className="w-4 h-4 text-amber-800 dark:text-amber-400 mb-1.5" />
              <h4 className="font-serif font-semibold text-stone-900 dark:text-stone-100 text-xs">
                Budget Mathematical Model
              </h4>
              <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-1">
                Dynamic live mortgage and holding-cost filtering that prevents buyer over-leveraging.
              </p>
            </div>

            <div className="p-3.5 rounded bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
              <ShieldCheck className="w-4 h-4 text-amber-800 dark:text-amber-400 mb-1.5" />
              <h4 className="font-serif font-semibold text-stone-900 dark:text-stone-100 text-xs">
                Unconflicted Advisory
              </h4>
              <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-1">
                All 10 monographs authored by licensed brokers, tax attorneys, and urban planners without developer bias.
              </p>
            </div>
          </div>

          <p>
            Whether your target acquisition budget is $650,000 in an emerging high-growth suburb or an $8,000,000 coastal estate, our platform equips you with the institutional knowledge to transact with total clarity.
          </p>
        </div>

        {/* Colophon Credits */}
        <div className="pt-4 border-t border-stone-200 dark:border-stone-800 flex flex-wrap items-center justify-between text-xs text-stone-500 dark:text-stone-400">
          <div>
            <span className="font-medium text-stone-800 dark:text-stone-200">
              Editorial Board:
            </span>{' '}
            Victoria Vance, Marcus Thorne, Camilla Rossi, Julian Sterling
          </div>
          <button
            onClick={onClose}
            className="mt-2 sm:mt-0 px-4 py-1.5 text-xs font-medium bg-stone-900 hover:bg-stone-800 text-white dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-stone-200 rounded transition-colors"
          >
            Close Colophon
          </button>
        </div>
      </div>
    </div>
  );
};
