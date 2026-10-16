import React, { useState } from 'react';
import {
  X,
  MapPin,
  Bed,
  Bath,
  Square,
  DollarSign,
  Calendar,
  CheckCircle2,
  FileText,
  Mail,
  Phone,
  User,
  Clock,
  Sparkles,
} from 'lucide-react';
import { PropertyListing, BudgetState } from '../types/realestate';

interface PropertyModalProps {
  property: PropertyListing | null;
  budget: BudgetState;
  onClose: () => void;
  onSelectArticleById: (articleId: string) => void;
  isSaved: boolean;
  onToggleSave: (id: string) => void;
}

export const PropertyModal: React.FC<PropertyModalProps> = ({
  property,
  budget,
  onClose,
  onSelectArticleById,
  isSaved,
  onToggleSave,
}) => {
  const [tourDate, setTourDate] = useState('2026-10-22');
  const [tourTime, setTourTime] = useState('11:00 AM');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isBooked, setIsBooked] = useState(false);

  if (!property) return null;

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(val);
  };

  // Financial Calculations
  const downPaymentAmount = property.price * (budget.downPaymentPercent / 100);
  const loanAmount = Math.max(0, property.price - downPaymentAmount);
  const monthlyRate = budget.interestRate / 100 / 12;
  const numPayments = budget.loanTermYears * 12;
  const monthlyPI =
    loanAmount > 0 && monthlyRate > 0
      ? (loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments))) /
        (Math.pow(1 + monthlyRate, numPayments) - 1)
      : 0;
  const monthlyTax = property.propertyTaxAnnual / 12;
  const monthlyInsurance = (property.price * 0.0035) / 12;
  const totalMonthly = monthlyPI + monthlyTax + monthlyInsurance + property.estimatedHoaMonthly;

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    setIsBooked(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-4xl bg-stone-50 dark:bg-stone-900 rounded-xl shadow-2xl border border-stone-200 dark:border-stone-800 my-8 overflow-hidden z-10 max-h-[90vh] flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-stone-900/60 text-white hover:bg-stone-900 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Scrollable Container */}
        <div className="overflow-y-auto flex-1">
          {/* Hero Image */}
          <div className="relative aspect-16/9 sm:aspect-21/9 bg-stone-200 dark:bg-stone-800">
            <img
              src={property.image}
              alt={property.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

            <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 text-white max-w-xl">
              <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-amber-600/90 text-white uppercase tracking-wider mb-2 inline-block">
                {property.propertyType}
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold leading-tight">
                {property.title}
              </h2>
              <p className="text-xs sm:text-sm text-stone-200 flex items-center gap-1.5 mt-1">
                <MapPin className="w-3.5 h-3.5" />
                <span>
                  {property.address}, {property.neighborhood}, {property.city}, {property.state}
                </span>
              </p>
            </div>

            <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 text-right text-white">
              <div className="text-2xl sm:text-3xl font-bold font-mono tabular-nums">
                {formatCurrency(property.price)}
              </div>
              <div className="text-xs text-stone-300 font-mono">
                est. {formatCurrency(totalMonthly)}/month
              </div>
            </div>
          </div>

          {/* Modal Body */}
          <div className="p-6 sm:p-8 space-y-8">
            {/* Quick Specs Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-lg bg-white dark:bg-stone-850 border border-stone-200 dark:border-stone-800 text-stone-800 dark:text-stone-200 font-mono text-xs">
              <div className="flex items-center gap-2">
                <Bed className="w-4 h-4 text-stone-400" />
                <div>
                  <span className="text-[10px] text-stone-400 block font-sans uppercase">Bedrooms</span>
                  <span className="font-semibold text-sm tabular-nums">{property.beds} Beds</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Bath className="w-4 h-4 text-stone-400" />
                <div>
                  <span className="text-[10px] text-stone-400 block font-sans uppercase">Bathrooms</span>
                  <span className="font-semibold text-sm tabular-nums">{property.baths} Baths</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Square className="w-4 h-4 text-stone-400" />
                <div>
                  <span className="text-[10px] text-stone-400 block font-sans uppercase">Living Area</span>
                  <span className="font-semibold text-sm tabular-nums">{property.sqft.toLocaleString()} sqft</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-stone-400" />
                <div>
                  <span className="text-[10px] text-stone-400 block font-sans uppercase">Year Built</span>
                  <span className="font-semibold text-sm tabular-nums">{property.yearBuilt}</span>
                </div>
              </div>
            </div>

            {/* Split Columns: Description & Financial Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Column: Narrative & Features (7 cols) */}
              <div className="lg:col-span-7 space-y-6">
                <div>
                  <h3 className="text-lg font-serif font-bold text-stone-900 dark:text-stone-100">
                    Architectural Narrative & Specs
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-stone-600 dark:text-stone-300 font-sans leading-relaxed">
                    {property.description}
                  </p>
                </div>

                {/* Features Checkmarks */}
                <div>
                  <h4 className="text-xs font-mono uppercase tracking-widest text-stone-500 dark:text-stone-400 mb-3">
                    Key Property Specifications
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-stone-700 dark:text-stone-300">
                    {property.features.map((feat, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Additional Metadata */}
                <div className="p-4 rounded-lg bg-stone-100/60 dark:bg-stone-850/40 border border-stone-200 dark:border-stone-800 text-xs space-y-2">
                  <div className="flex justify-between">
                    <span className="text-stone-500">Architectural Style:</span>
                    <span className="font-medium text-stone-900 dark:text-stone-100">
                      {property.architecturalStyle}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Lot Size:</span>
                    <span className="font-medium text-stone-900 dark:text-stone-100">{property.lotSize}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Walk Score:</span>
                    <span className="font-mono font-medium text-stone-900 dark:text-stone-100">
                      {property.walkScore}/100
                    </span>
                  </div>
                </div>

                {/* Linked Real Estate Article Banner */}
                {property.matchingArticleId && (
                  <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800">
                    <div className="flex items-start gap-3">
                      <FileText className="w-4 h-4 text-amber-800 dark:text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[11px] uppercase tracking-wider font-mono text-amber-900 dark:text-amber-300 font-semibold block">
                          Featured in Editorial Strategy Article
                        </span>
                        <p className="text-xs text-stone-700 dark:text-stone-300 mt-0.5">
                          This residence illustrates principles discussed in our deep-dive analysis.
                        </p>
                        <button
                          onClick={() => {
                            onClose();
                            onSelectArticleById(property.matchingArticleId!);
                          }}
                          className="mt-2 text-xs font-semibold text-amber-900 dark:text-amber-300 hover:underline"
                        >
                          Read the full monograph →
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column: Mortgage Breakdown & Tour Booking (5 cols) */}
              <div className="lg:col-span-5 space-y-6">
                {/* Mortgage Breakdown Card */}
                <div className="p-5 rounded-lg bg-white dark:bg-stone-850 border border-stone-200 dark:border-stone-800 text-xs">
                  <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-stone-800">
                    <span className="font-mono uppercase tracking-wider text-stone-500 font-semibold">
                      Monthly Investment
                    </span>
                    <span className="text-lg font-bold font-mono text-stone-900 dark:text-stone-100 tabular-nums">
                      {formatCurrency(totalMonthly)}/mo
                    </span>
                  </div>

                  <dl className="mt-3 space-y-2 text-stone-600 dark:text-stone-300 font-mono tabular-nums">
                    <div className="flex justify-between">
                      <dt className="text-stone-500 font-sans">
                        P&I ({budget.downPaymentPercent}% down, {budget.interestRate}%, {budget.loanTermYears}yr)
                      </dt>
                      <dd>{formatCurrency(monthlyPI)}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-stone-500 font-sans">Property Taxes (est.)</dt>
                      <dd>{formatCurrency(monthlyTax)}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-stone-500 font-sans">Homeowner Insurance (est.)</dt>
                      <dd>{formatCurrency(monthlyInsurance)}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-stone-500 font-sans">HOA / Maintenance Dues</dt>
                      <dd>{formatCurrency(property.estimatedHoaMonthly)}</dd>
                    </div>
                    <div className="pt-2 border-t border-stone-100 dark:border-stone-800 flex justify-between font-bold text-stone-900 dark:text-stone-100">
                      <dt className="font-sans">Initial Cash Down Payment</dt>
                      <dd>{formatCurrency(downPaymentAmount)}</dd>
                    </div>
                  </dl>
                </div>

                {/* Schedule Private Tour Form */}
                <div className="p-5 rounded-lg bg-stone-100/70 dark:bg-stone-850/60 border border-stone-200 dark:border-stone-800">
                  <h4 className="text-sm font-serif font-bold text-stone-900 dark:text-stone-100 mb-1">
                    Schedule Private Architectural Tour
                  </h4>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400 mb-3">
                    Accompanied by a licensed architectural acquisition broker.
                  </p>

                  {isBooked ? (
                    <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded text-xs text-emerald-800 dark:text-emerald-200 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>
                        Tour confirmed for {tourDate} at {tourTime}. Our acquisition team will email confirmation to {email || 'your inbox'}.
                      </span>
                    </div>
                  ) : (
                    <form onSubmit={handleBooking} className="space-y-3 text-xs">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] text-stone-500 block mb-1">Preferred Date</label>
                          <input
                            type="date"
                            value={tourDate}
                            onChange={(e) => setTourDate(e.target.value)}
                            className="w-full p-2 bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded text-xs text-stone-900 dark:text-stone-100"
                            required
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-stone-500 block mb-1">Preferred Time</label>
                          <select
                            value={tourTime}
                            onChange={(e) => setTourTime(e.target.value)}
                            className="w-full p-2 bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded text-xs text-stone-900 dark:text-stone-100"
                          >
                            <option>10:00 AM</option>
                            <option>11:00 AM</option>
                            <option>02:00 PM</option>
                            <option>04:30 PM (Golden Hour)</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <input
                          type="text"
                          placeholder="Your Full Name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full p-2 bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded text-xs text-stone-900 dark:text-stone-100"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="email"
                          placeholder="Email Address"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full p-2 bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded text-xs text-stone-900 dark:text-stone-100"
                          required
                        />
                        <input
                          type="tel"
                          placeholder="Phone (Optional)"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full p-2 bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded text-xs text-stone-900 dark:text-stone-100"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-2.5 bg-stone-900 hover:bg-stone-800 text-white dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-stone-200 font-medium rounded transition-colors text-xs"
                      >
                        Request Confirmed Viewing
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
