import React from 'react';
import { DollarSign, Sliders, Home, Sparkles, Percent, Calendar } from 'lucide-react';
import { BudgetState } from '../types/realestate';

interface BudgetFilterBarProps {
  budget: BudgetState;
  onUpdateBudget: (newBudget: Partial<BudgetState>) => void;
  matchingCount: number;
  totalCount: number;
}

export const BudgetFilterBar: React.FC<BudgetFilterBarProps> = ({
  budget,
  onUpdateBudget,
  matchingCount,
  totalCount,
}) => {
  // Format currency
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(val);
  };

  // Quick preset ranges
  const presets = [
    { label: 'Under $1M', value: 1000000, desc: 'Starter & Emerging' },
    { label: 'Under $2M', value: 2000000, desc: 'Mid-Market Suburban' },
    { label: 'Under $3.5M', value: 3500000, desc: 'Prime Executive' },
    { label: 'Under $5M', value: 5000000, desc: 'Luxury Architecture' },
    { label: 'All Budgets ($10M+)', value: 10000000, desc: 'Trophy Estates' },
  ];

  const propertyTypes = [
    'All Types',
    'Single Family',
    'Architectural Modern',
    'Luxury Penthouse',
    'Historic Townhouse',
    'Waterfront Villa',
    'Eco-Passive Residence',
  ];

  // Calculate estimated monthly payment for current budget ceiling
  const downPaymentAmount = budget.maxBudget * (budget.downPaymentPercent / 100);
  const loanAmount = Math.max(0, budget.maxBudget - downPaymentAmount);
  const monthlyRate = budget.interestRate / 100 / 12;
  const numPayments = budget.loanTermYears * 12;
  const monthlyPI =
    loanAmount > 0 && monthlyRate > 0
      ? (loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments))) /
        (Math.pow(1 + monthlyRate, numPayments) - 1)
      : 0;
  const estimatedTax = (budget.maxBudget * 0.012) / 12; // ~1.2% tax rate
  const estimatedInsurance = (budget.maxBudget * 0.0035) / 12; // ~0.35% insurance
  const totalEstimatedMonthly = monthlyPI + estimatedTax + estimatedInsurance;

  return (
    <div
      id="budget-explorer"
      className="p-6 sm:p-8 rounded-xl bg-stone-100/90 dark:bg-stone-850/80 border border-stone-200 dark:border-stone-800 shadow-xs my-10"
    >
      {/* Header with Title and Live Counter */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-stone-200 dark:border-stone-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-stone-500 dark:text-stone-400">
            <DollarSign className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
            <span>Interactive Capital & Property Matching Engine</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 dark:text-stone-100 mt-1">
            Properties Tailored to Your Budget
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 font-sans mt-1">
            Adjust your maximum purchase ceiling, down payment, and mortgage parameters to filter curated architectural homes in real time.
          </p>
        </div>

        {/* Live Matching Pill */}
        <div className="flex items-center gap-2 self-start md:self-center px-3.5 py-1.5 bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-lg text-xs font-mono">
          <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
          <span className="font-semibold tabular-nums text-stone-900 dark:text-stone-100">
            {matchingCount} of {totalCount} Properties
          </span>
          <span className="text-stone-500">within budget</span>
        </div>
      </div>

      {/* Main Budget Slider & Value Display */}
      <div className="py-6 border-b border-stone-200 dark:border-stone-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <label className="text-xs uppercase tracking-wider font-semibold text-stone-700 dark:text-stone-300">
            Your Maximum Purchase Budget
          </label>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 dark:text-stone-50 tabular-nums">
              {formatCurrency(budget.maxBudget)}
            </span>
            <span className="text-xs text-stone-500 font-mono tabular-nums">
              (~{formatCurrency(totalEstimatedMonthly)}/mo est.)
            </span>
          </div>
        </div>

        {/* Range Slider */}
        <input
          type="range"
          min="500000"
          max="10000000"
          step="50000"
          value={budget.maxBudget}
          onChange={(e) => onUpdateBudget({ maxBudget: Number(e.target.value) })}
          className="w-full h-2 bg-stone-300 dark:bg-stone-700 rounded-lg appearance-none cursor-pointer accent-stone-900 dark:accent-amber-400"
        />

        {/* Range Labels */}
        <div className="flex justify-between text-[11px] font-mono tabular-nums text-stone-500 dark:text-stone-400 mt-2">
          <span>$500,000 (Emerging)</span>
          <span className="hidden sm:inline">$2,500,000 (Prime)</span>
          <span className="hidden sm:inline">$5,000,000 (Luxury)</span>
          <span>$10,000,000+ (Trophy)</span>
        </div>

        {/* Quick Presets */}
        <div className="mt-4 flex flex-wrap gap-2">
          {presets.map((preset) => {
            const isSelected = budget.maxBudget === preset.value;
            return (
              <button
                key={preset.label}
                onClick={() => onUpdateBudget({ maxBudget: preset.value })}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  isSelected
                    ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 shadow-sm'
                    : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700 hover:border-stone-400'
                }`}
              >
                <span>{preset.label}</span>
                <span className="hidden md:inline text-[11px] opacity-75 ml-1">
                  · {preset.desc}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Advanced Mortgage Controls & Type Filter */}
      <div className="pt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
        {/* Down Payment % */}
        <div className="p-3 bg-white dark:bg-stone-900 rounded-lg border border-stone-200 dark:border-stone-800">
          <label className="flex items-center gap-1.5 text-stone-500 dark:text-stone-400 font-medium mb-1.5">
            <Percent className="w-3.5 h-3.5 text-stone-400" />
            <span>Down Payment</span>
          </label>
          <div className="flex items-center gap-1">
            {[10, 20, 30].map((pct) => (
              <button
                key={pct}
                onClick={() => onUpdateBudget({ downPaymentPercent: pct })}
                className={`flex-1 py-1 rounded text-xs font-mono font-medium ${
                  budget.downPaymentPercent === pct
                    ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300'
                }`}
              >
                {pct}%
              </button>
            ))}
          </div>
          <p className="mt-1.5 text-[11px] font-mono tabular-nums text-stone-500">
            {formatCurrency(downPaymentAmount)} down
          </p>
        </div>

        {/* Interest Rate */}
        <div className="p-3 bg-white dark:bg-stone-900 rounded-lg border border-stone-200 dark:border-stone-800">
          <label className="flex items-center gap-1.5 text-stone-500 dark:text-stone-400 font-medium mb-1.5">
            <Sliders className="w-3.5 h-3.5 text-stone-400" />
            <span>Interest Rate (APR)</span>
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              step="0.1"
              min="3.0"
              max="12.0"
              value={budget.interestRate}
              onChange={(e) => onUpdateBudget({ interestRate: parseFloat(e.target.value) || 6.25 })}
              className="w-full py-1 px-2 border border-stone-300 dark:border-stone-700 rounded bg-transparent font-mono text-xs text-stone-900 dark:text-stone-100"
            />
            <span className="font-mono text-stone-500">%</span>
          </div>
          <p className="mt-1 text-[11px] text-stone-500">Benchmark 30-Yr Fixed</p>
        </div>

        {/* Loan Term */}
        <div className="p-3 bg-white dark:bg-stone-900 rounded-lg border border-stone-200 dark:border-stone-800">
          <label className="flex items-center gap-1.5 text-stone-500 dark:text-stone-400 font-medium mb-1.5">
            <Calendar className="w-3.5 h-3.5 text-stone-400" />
            <span>Loan Term</span>
          </label>
          <div className="flex items-center gap-1">
            {[15, 30].map((years) => (
              <button
                key={years}
                onClick={() => onUpdateBudget({ loanTermYears: years })}
                className={`flex-1 py-1 rounded text-xs font-mono font-medium ${
                  budget.loanTermYears === years
                    ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300'
                }`}
              >
                {years} Yrs
              </button>
            ))}
          </div>
          <p className="mt-1.5 text-[11px] font-mono tabular-nums text-stone-500">
            P&I: {formatCurrency(monthlyPI)}/mo
          </p>
        </div>

        {/* Property Type Filter */}
        <div className="p-3 bg-white dark:bg-stone-900 rounded-lg border border-stone-200 dark:border-stone-800">
          <label className="flex items-center gap-1.5 text-stone-500 dark:text-stone-400 font-medium mb-1.5">
            <Home className="w-3.5 h-3.5 text-stone-400" />
            <span>Property Typology</span>
          </label>
          <select
            value={budget.propertyTypeFilter}
            onChange={(e) => onUpdateBudget({ propertyTypeFilter: e.target.value })}
            className="w-full py-1 px-1.5 border border-stone-300 dark:border-stone-700 rounded bg-transparent text-xs text-stone-900 dark:text-stone-100 focus:outline-none"
          >
            {propertyTypes.map((t) => (
              <option key={t} value={t} className="bg-stone-50 dark:bg-stone-900">
                {t}
              </option>
            ))}
          </select>
          <p className="mt-1 text-[11px] text-stone-500">Filter by architectural category</p>
        </div>
      </div>
    </div>
  );
};
