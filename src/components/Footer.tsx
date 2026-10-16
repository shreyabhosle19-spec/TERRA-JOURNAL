import React from 'react';
import { ArrowUp, BookOpen, DollarSign } from 'lucide-react';
import { ArticleCategory } from '../types/realestate';

interface FooterProps {
  onSelectCategory: (cat: ArticleCategory) => void;
  onScrollToBudget: () => void;
  onOpenAbout: () => void;
  onGoHome: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectCategory,
  onScrollToBudget,
  onOpenAbout,
  onGoHome,
}) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-stone-200 dark:border-stone-800 bg-stone-100/60 dark:bg-stone-900/60 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-stone-200 dark:border-stone-800">
          {/* Brand Colophon (5 cols) */}
          <div className="md:col-span-5">
            <button
              onClick={onGoHome}
              className="text-2xl font-serif font-bold text-stone-900 dark:text-stone-100 tracking-tight hover:opacity-85 text-left"
            >
              TERRA REAL ESTATE
            </button>
            <p className="mt-2 text-xs font-serif italic text-stone-600 dark:text-stone-400">
              Journal of Real Estate Strategy, Architecture & Capital Allocation
            </p>
            <p className="mt-4 text-xs text-stone-500 dark:text-stone-400 font-sans max-w-sm leading-relaxed">
              Empowering home buyers and institutional investors with forensic architectural appraisals, live budget matching, and ten authoritative monographs on wealth preservation through property.
            </p>
          </div>

          {/* Quick Departments (4 cols) */}
          <div className="md:col-span-4">
            <h4 className="text-xs font-mono uppercase tracking-widest text-stone-500 dark:text-stone-400 mb-3">
              Monograph Departments
            </h4>
            <ul className="space-y-2 text-xs text-stone-600 dark:text-stone-300">
              <li>
                <button
                  onClick={() => {
                    onSelectCategory('Investment Strategy');
                    onGoHome();
                  }}
                  className="hover:text-stone-950 dark:hover:text-stone-100 transition-colors"
                >
                  Investment Strategy & Equity Playbooks
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onSelectCategory('Luxury Market');
                    onGoHome();
                  }}
                  className="hover:text-stone-950 dark:hover:text-stone-100 transition-colors"
                >
                  Luxury Modernism & Trophy Pedigree
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onSelectCategory('Finance & Lending');
                    onGoHome();
                  }}
                  className="hover:text-stone-950 dark:hover:text-stone-100 transition-colors"
                >
                  Finance, Mortgage ARMs & 1031 Swaps
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onSelectCategory('Restoration & Heritage');
                    onGoHome();
                  }}
                  className="hover:text-stone-950 dark:hover:text-stone-100 transition-colors"
                >
                  Historic Townhomes & Brownstones
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onSelectCategory('Sustainable Homes');
                    onGoHome();
                  }}
                  className="hover:text-stone-950 dark:hover:text-stone-100 transition-colors"
                >
                  Passive Solar & Net-Zero Residences
                </button>
              </li>
            </ul>
          </div>

          {/* Tools & Back to Top (3 cols) */}
          <div className="md:col-span-3 flex flex-col justify-between">
            <div>
              <h4 className="text-xs font-mono uppercase tracking-widest text-stone-500 dark:text-stone-400 mb-3">
                Financial Instruments
              </h4>
              <button
                onClick={onScrollToBudget}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-800 dark:text-emerald-400 hover:underline mb-2 block"
              >
                <DollarSign className="w-3.5 h-3.5" />
                <span>Launch Interactive Budget Engine</span>
              </button>
              <button
                onClick={onOpenAbout}
                className="inline-flex items-center gap-1.5 text-xs text-stone-600 dark:text-stone-400 hover:underline block"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Advisory Principles & Colophon</span>
              </button>
            </div>

            <button
              onClick={scrollToTop}
              className="mt-6 self-start inline-flex items-center gap-1.5 text-xs text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Quiet Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500 dark:text-stone-400 font-sans">
          <p>© 2026 TERRA Real Estate & Capital Advisory. Equal Housing Opportunity.</p>
          <div className="flex items-center gap-6">
            <span>10 Published Monograph Guides</span>
            <span aria-hidden="true">·</span>
            <span>Independent Property Intelligence</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
