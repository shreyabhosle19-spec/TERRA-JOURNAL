/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { REAL_ESTATE_ARTICLES, REAL_ESTATE_PROPERTIES } from './data/realestate';
import {
  RealEstateArticle,
  PropertyListing,
  ArticleCategory,
  BudgetState,
} from './types/realestate';
import { ThemeMode } from './types/blog';
import { Header } from './components/Header';
import { HeroLead } from './components/HeroLead';
import { SecondaryGrid } from './components/SecondaryGrid';
import { BudgetFilterBar } from './components/BudgetFilterBar';
import { PropertyGrid } from './components/PropertyGrid';
import { PropertyModal } from './components/PropertyModal';
import { ArchiveExplorer } from './components/ArchiveExplorer';
import { ArticleReader } from './components/ArticleReader';
import { ReadingListDrawer } from './components/ReadingListDrawer';
import { NewsletterSection } from './components/NewsletterSection';
import { AboutModal } from './components/AboutModal';
import { Footer } from './components/Footer';

export default function App() {
  const [articles] = useState<RealEstateArticle[]>(REAL_ESTATE_ARTICLES);
  const [properties] = useState<PropertyListing[]>(REAL_ESTATE_PROPERTIES);

  const [selectedArticle, setSelectedArticle] = useState<RealEstateArticle | null>(null);
  const [selectedProperty, setSelectedProperty] = useState<PropertyListing | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<ArticleCategory>('All');
  const [isShortlistOpen, setIsShortlistOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [theme, setTheme] = useState<ThemeMode>('archival');

  // Interactive Budget State
  const [budget, setBudget] = useState<BudgetState>({
    maxBudget: 2500000,
    downPaymentPercent: 20,
    interestRate: 6.25,
    loanTermYears: 30,
    propertyTypeFilter: 'All Types',
  });

  // Shortlisted items persisted in localStorage
  const [savedArticleIds, setSavedArticleIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('terra_saved_articles');
      return stored ? JSON.parse(stored) : ['art-suburban-equity-playbook'];
    } catch {
      return ['art-suburban-equity-playbook'];
    }
  });

  const [savedPropertyIds, setSavedPropertyIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('terra_saved_properties');
      return stored ? JSON.parse(stored) : ['prop-austin-modern-westlake'];
    } catch {
      return ['prop-austin-modern-westlake'];
    }
  });

  // Persist bookmarks
  useEffect(() => {
    try {
      localStorage.setItem('terra_saved_articles', JSON.stringify(savedArticleIds));
    } catch {}
  }, [savedArticleIds]);

  useEffect(() => {
    try {
      localStorage.setItem('terra_saved_properties', JSON.stringify(savedPropertyIds));
    } catch {}
  }, [savedPropertyIds]);

  // Apply dark mode
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('dark');
    if (theme === 'noir') {
      root.classList.add('dark');
    }
  }, [theme]);

  const toggleSaveArticle = (articleId: string) => {
    setSavedArticleIds((prev) =>
      prev.includes(articleId)
        ? prev.filter((id) => id !== articleId)
        : [...prev, articleId]
    );
  };

  const toggleSaveProperty = (propertyId: string) => {
    setSavedPropertyIds((prev) =>
      prev.includes(propertyId)
        ? prev.filter((id) => id !== propertyId)
        : [...prev, propertyId]
    );
  };

  const handleUpdateBudget = (newBudget: Partial<BudgetState>) => {
    setBudget((prev) => ({ ...prev, ...newBudget }));
  };

  // Filter properties matching budget
  const filteredProperties = useMemo(() => {
    return properties.filter((p) => {
      const matchesBudget = p.price <= budget.maxBudget;
      const matchesType =
        budget.propertyTypeFilter === 'All Types' ||
        p.propertyType === budget.propertyTypeFilter;
      return matchesBudget && matchesType;
    });
  }, [properties, budget.maxBudget, budget.propertyTypeFilter]);

  // Navigation helpers
  const scrollToBudget = () => {
    if (selectedArticle) setSelectedArticle(null);
    setTimeout(() => {
      document.getElementById('budget-companion-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  };

  const scrollToArticles = () => {
    if (selectedArticle) setSelectedArticle(null);
    setTimeout(() => {
      document.getElementById('articles')?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  };

  const handleGoHome = () => {
    setSelectedArticle(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectArticleById = (articleId: string) => {
    const found = articles.find((a) => a.id === articleId);
    if (found) {
      setSelectedArticle(found);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Blog article tiers
  const leadArticle = articles.find((a) => a.featuredTier === 'lead') || articles[0];
  const secondaryArticles = articles.filter((a) => a.featuredTier === 'secondary');

  const savedArticles = articles.filter((a) => savedArticleIds.includes(a.id));
  const savedPropertiesList = properties.filter((p) => savedPropertyIds.includes(p.id));
  const totalSavedCount = savedArticleIds.length + savedPropertyIds.length;

  const getThemeBgClass = () => {
    switch (theme) {
      case 'noir':
        return 'bg-[#121110] text-stone-100';
      case 'gallery':
        return 'bg-white text-stone-900';
      case 'archival':
      default:
        return 'bg-[#FAF8F5] text-stone-900';
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-200 ${getThemeBgClass()}`}>
      {/* Top Bar Header */}
      <Header
        onGoHome={handleGoHome}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          scrollToArticles();
        }}
        onScrollToBudget={scrollToBudget}
        onScrollToArticles={scrollToArticles}
        onOpenAbout={() => setIsAboutOpen(true)}
        savedCount={totalSavedCount}
        onOpenShortlist={() => setIsShortlistOpen(true)}
        currentBudget={budget.maxBudget}
        theme={theme}
        onToggleTheme={(t) => setTheme(t)}
      />

      {/* Main Blog Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {selectedArticle ? (
          /* Long-Form Blog Article Reader Mode */
          <ArticleReader
            article={selectedArticle}
            onBack={handleGoHome}
            onSelectArticle={(art) => {
              setSelectedArticle(art);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            allArticles={articles}
            allProperties={properties}
            onSelectProperty={(prop) => setSelectedProperty(prop)}
            isSaved={savedArticleIds.includes(selectedArticle.id)}
            onToggleSave={toggleSaveArticle}
          />
        ) : (
          /* PRIMARY WEBSITE: REAL ESTATE BLOG */
          <>
            {/* 1. Flagship Lead Blog Monograph */}
            <HeroLead
              article={leadArticle}
              onSelectArticle={(art) => {
                setSelectedArticle(art);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              isSaved={savedArticleIds.includes(leadArticle.id)}
              onToggleSave={toggleSaveArticle}
              onScrollToBudget={scrollToBudget}
            />

            {/* 2. Curatorial Secondary Blog Articles Grid (3 Features) */}
            <SecondaryGrid
              articles={secondaryArticles}
              onSelectArticle={(art) => {
                setSelectedArticle(art);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              savedIds={savedArticleIds}
              onToggleSave={toggleSaveArticle}
            />

            {/* 3. Complete 10 Real Estate Articles Library (with Search, Category Filtering, Sort) */}
            <ArchiveExplorer
              articles={articles}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              onSelectArticle={(art) => {
                setSelectedArticle(art);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              savedIds={savedArticleIds}
              onToggleSave={toggleSaveArticle}
            />

            {/* 4. Interactive Editorial Feature: Budget Explorer & Property Matches */}
            <section
              id="budget-companion-section"
              className="py-14 border-t border-stone-200 dark:border-stone-800"
            >
              <div className="mb-2">
                <span className="text-xs uppercase tracking-widest font-mono text-stone-500 dark:text-stone-400">
                  Interactive Blog Feature
                </span>
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 dark:text-stone-100 mt-1">
                  The Reader’s Capital Desk: Property Finder by Budget
                </h2>
                <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 font-sans mt-1 max-w-2xl">
                  Test the equity and acquisition theories discussed in our monographs. Configure your budget ceiling and mortgage terms below to reveal curated architectural properties matching your exact price range.
                </p>
              </div>

              {/* Budget Filter Controls */}
              <BudgetFilterBar
                budget={budget}
                onUpdateBudget={handleUpdateBudget}
                matchingCount={filteredProperties.length}
                totalCount={properties.length}
              />

              {/* Properties Matching The Budget */}
              <PropertyGrid
                properties={filteredProperties}
                budget={budget}
                onSelectProperty={(prop) => setSelectedProperty(prop)}
                savedPropertyIds={savedPropertyIds}
                onToggleSaveProperty={toggleSaveProperty}
                onSelectArticleById={handleSelectArticleById}
                onResetBudget={() =>
                  handleUpdateBudget({ maxBudget: 5000000, propertyTypeFilter: 'All Types' })
                }
              />
            </section>

            {/* 5. Bi-Monthly Real Estate Dispatch Subscription */}
            <NewsletterSection />
          </>
        )}
      </main>

      {/* Footer Colophon */}
      <Footer
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          if (selectedArticle) setSelectedArticle(null);
          scrollToArticles();
        }}
        onScrollToBudget={scrollToBudget}
        onOpenAbout={() => setIsAboutOpen(true)}
        onGoHome={handleGoHome}
      />

      {/* Property Details Modal */}
      <PropertyModal
        property={selectedProperty}
        budget={budget}
        onClose={() => setSelectedProperty(null)}
        onSelectArticleById={handleSelectArticleById}
        isSaved={selectedProperty ? savedPropertyIds.includes(selectedProperty.id) : false}
        onToggleSave={toggleSaveProperty}
      />

      {/* Shortlist & Reading Queue Drawer */}
      <ReadingListDrawer
        isOpen={isShortlistOpen}
        onClose={() => setIsShortlistOpen(false)}
        savedArticles={savedArticles}
        savedProperties={savedPropertiesList}
        onSelectArticle={(art) => {
          setSelectedArticle(art);
          setIsShortlistOpen(false);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onSelectProperty={(prop) => {
          setSelectedProperty(prop);
          setIsShortlistOpen(false);
        }}
        onRemoveSavedArticle={toggleSaveArticle}
        onRemoveSavedProperty={toggleSaveProperty}
        onClearAll={() => {
          setSavedArticleIds([]);
          setSavedPropertyIds([]);
        }}
      />

      {/* Colophon & About Modal */}
      <AboutModal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
      />
    </div>
  );
}
