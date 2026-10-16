import React, { useState } from 'react';
import {
  Bed,
  Bath,
  Square,
  MapPin,
  Calendar,
  Bookmark,
  ArrowUpRight,
  Sparkles,
  CheckCircle2,
  FileText,
} from 'lucide-react';
import { PropertyListing, BudgetState } from '../types/realestate';

interface PropertyGridProps {
  properties: PropertyListing[];
  budget: BudgetState;
  onSelectProperty: (property: PropertyListing) => void;
  savedPropertyIds: string[];
  onToggleSaveProperty: (id: string) => void;
  onSelectArticleById: (articleId: string) => void;
  onResetBudget: () => void;
}

export const PropertyGrid: React.FC<PropertyGridProps> = ({
  properties,
  budget,
  onSelectProperty,
  savedPropertyIds,
  onToggleSaveProperty,
  onSelectArticleById,
  onResetBudget,
}) => {
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(val);
  };

  // Calculate monthly mortgage payment for specific property
  const calculateMonthly = (price: number) => {
    const downAmount = price * (budget.downPaymentPercent / 100);
    const loanAmount = Math.max(0, price - downAmount);
    const monthlyRate = budget.interestRate / 100 / 12;
    const numPayments = budget.loanTermYears * 12;
    const monthlyPI =
      loanAmount > 0 && monthlyRate > 0
        ? (loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments))) /
          (Math.pow(1 + monthlyRate, numPayments) - 1)
        : 0;
    const taxMonthly = (price * 0.012) / 12;
    const insuranceMonthly = (price * 0.0035) / 12;
    return monthlyPI + taxMonthly + insuranceMonthly;
  };

  return (
    <section id="properties" className="py-12">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <span className="text-xs uppercase tracking-widest font-mono text-stone-500 dark:text-stone-400">
            Real Estate Portfolio
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 dark:text-stone-100 mt-1">
            Properties Filtered by Your Budget
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 font-sans mt-1">
            Displaying curated residences at or under your maximum threshold of{' '}
            <span className="font-semibold text-stone-900 dark:text-stone-100 font-mono">
              {formatCurrency(budget.maxBudget)}
            </span>
            .
          </p>
        </div>

        <div className="text-xs font-mono tabular-nums text-stone-500 dark:text-stone-400">
          {properties.length} Available Residence{properties.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Property Cards Grid */}
      {properties.length === 0 ? (
        <div className="py-16 text-center border border-dashed border-stone-300 dark:border-stone-800 rounded-xl bg-stone-50/50 dark:bg-stone-900/50">
          <Sparkles className="w-8 h-8 text-amber-500 mx-auto mb-3" />
          <h3 className="font-serif text-xl font-semibold text-stone-800 dark:text-stone-200">
            No properties found within {formatCurrency(budget.maxBudget)}
          </h3>
          <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
            Try adjusting your maximum purchase slider or expanding your property typology filters.
          </p>
          <button
            onClick={onResetBudget}
            className="mt-4 px-4 py-2 bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 text-xs font-medium rounded-md hover:opacity-90 transition-opacity"
          >
            Reset Budget to $5,000,000+
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {properties.map((prop) => {
            const isSaved = savedPropertyIds.includes(prop.id);
            const isUnderBudget = prop.price <= budget.maxBudget;
            const diff = budget.maxBudget - prop.price;
            const monthlyEst = calculateMonthly(prop.price);
            const hasFailedImage = failedImages[prop.id];

            return (
              <div
                key={prop.id}
                className="group flex flex-col justify-between rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 overflow-hidden shadow-xs hover:shadow-md transition-shadow"
              >
                <div>
                  {/* Photo Showcase */}
                  <div
                    onClick={() => onSelectProperty(prop)}
                    className="relative aspect-16/10 bg-stone-200 dark:bg-stone-800 cursor-pointer overflow-hidden"
                  >
                    {!hasFailedImage ? (
                      <img
                        src={prop.image}
                        alt={prop.title}
                        referrerPolicy="no-referrer"
                        onError={() =>
                          setFailedImages((prev) => ({ ...prev, [prop.id]: true }))
                        }
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-stone-100 dark:bg-stone-800 text-stone-500 font-serif p-4 text-center">
                        <span>{prop.title}</span>
                      </div>
                    )}

                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />

                    {/* Price and Monthly in Image Badge */}
                    <div className="absolute bottom-3 left-3 text-white">
                      <div className="text-xl font-bold font-mono tabular-nums leading-tight">
                        {formatCurrency(prop.price)}
                      </div>
                      <div className="text-[11px] text-stone-200 font-mono tabular-nums">
                        est. {formatCurrency(monthlyEst)}/mo
                      </div>
                    </div>

                    {/* Top Right Save Affordance */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleSaveProperty(prop.id);
                      }}
                      title={isSaved ? 'Remove from shortlist' : 'Save property'}
                      className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-colors ${
                        isSaved
                          ? 'bg-amber-500 text-white shadow-sm'
                          : 'bg-black/40 text-white hover:bg-black/70'
                      }`}
                      aria-label="Save property"
                    >
                      <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
                    </button>

                    {/* Top Left Typology Kicker */}
                    <div className="absolute top-3 left-3 px-2 py-0.5 rounded text-[10px] font-medium tracking-wide bg-stone-900/80 text-white backdrop-blur-xs">
                      {prop.propertyType}
                    </div>
                  </div>

                  {/* Card Content Body */}
                  <div className="p-5">
                    {/* Location & Title */}
                    <div className="flex items-center gap-1.5 text-xs text-stone-500 dark:text-stone-400 mb-1">
                      <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                      <span>
                        {prop.neighborhood}, {prop.city}, {prop.state}
                      </span>
                    </div>

                    <h3
                      onClick={() => onSelectProperty(prop)}
                      className="text-lg font-serif font-bold text-stone-900 dark:text-stone-100 cursor-pointer group-hover:text-amber-900 dark:group-hover:text-amber-300 transition-colors leading-snug"
                    >
                      {prop.title}
                    </h3>

                    <p className="mt-1.5 text-xs text-stone-600 dark:text-stone-400 font-sans line-clamp-2">
                      {prop.tagline}
                    </p>

                    {/* Unboxed Metadata Strip (Beds, Baths, Sqft) */}
                    <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs text-stone-600 dark:text-stone-300 font-mono">
                      <div className="flex items-center gap-1">
                        <Bed className="w-3.5 h-3.5 text-stone-400" />
                        <span className="tabular-nums">{prop.beds} Beds</span>
                      </div>
                      <span aria-hidden="true" className="text-stone-300 dark:text-stone-700">·</span>
                      <div className="flex items-center gap-1">
                        <Bath className="w-3.5 h-3.5 text-stone-400" />
                        <span className="tabular-nums">{prop.baths} Baths</span>
                      </div>
                      <span aria-hidden="true" className="text-stone-300 dark:text-stone-700">·</span>
                      <div className="flex items-center gap-1">
                        <Square className="w-3.5 h-3.5 text-stone-400" />
                        <span className="tabular-nums">{prop.sqft.toLocaleString()} sqft</span>
                      </div>
                    </div>

                    {/* Budget Delta Pill */}
                    <div className="mt-3.5 py-1 px-2.5 rounded text-[11px] font-mono flex items-center justify-between bg-stone-50 dark:bg-stone-850 border border-stone-200/80 dark:border-stone-800">
                      <span className="text-stone-500">Budget Status:</span>
                      {isUnderBudget ? (
                        <span className="text-emerald-700 dark:text-emerald-400 font-medium flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>{formatCurrency(diff)} under ceiling</span>
                        </span>
                      ) : (
                        <span className="text-amber-700 dark:text-amber-400 font-medium">
                          +{formatCurrency(Math.abs(diff))} over ceiling
                        </span>
                      )}
                    </div>

                    {/* Linked Real Estate Article if available */}
                    {prop.matchingArticleId && (
                      <div className="mt-3 pt-2 text-[11px] text-stone-500 flex items-center justify-between">
                        <button
                          onClick={() => onSelectArticleById(prop.matchingArticleId!)}
                          className="hover:text-amber-800 dark:hover:text-amber-300 flex items-center gap-1 text-left line-clamp-1 transition-colors"
                        >
                          <FileText className="w-3 h-3 shrink-0" />
                          <span>Read related strategy article</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Action Button */}
                <div className="p-5 pt-0">
                  <button
                    onClick={() => onSelectProperty(prop)}
                    className="w-full py-2.5 bg-stone-900 hover:bg-stone-800 text-white dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-stone-200 text-xs font-medium rounded-md transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span>View Property & Financing Details</span>
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
