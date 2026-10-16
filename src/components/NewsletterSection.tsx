import React, { useState } from 'react';
import { Mail, Check, ArrowRight } from 'lucide-react';

export const NewsletterSection: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError('Please provide a valid email address.');
      return;
    }
    setError('');
    setIsSubmitted(true);
  };

  return (
    <section className="my-16 py-12 px-6 sm:px-12 rounded-xl bg-stone-100/90 dark:bg-stone-850/80 border border-stone-200 dark:border-stone-800">
      <div className="max-w-2xl mx-auto text-center">
        <span className="text-xs uppercase tracking-widest font-mono text-stone-500 dark:text-stone-400">
          The Tectonic Dispatch
        </span>
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 dark:text-stone-100 mt-2">
          Bi-Monthly Print & Digital Essays
        </h2>
        <p className="mt-3 text-sm text-stone-600 dark:text-stone-400 font-sans leading-relaxed">
          Receive thoughtful, long-form critical essays on contemporary architecture, vernacular stone masonry, and biophilic spatial design delivered directly to your inbox.
        </p>

        {isSubmitted ? (
          <div className="mt-6 p-4 rounded-md bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 flex items-center justify-center gap-2 text-stone-800 dark:text-stone-200 text-xs sm:text-sm">
            <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>
              You have been added to the Autumn dispatch queue ({email}). Welcome to the journal.
            </span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 max-w-md mx-auto">
            <div className="flex items-stretch gap-2">
              <div className="relative flex-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="architect@atelier.org"
                  className="w-full pl-9 pr-3 py-2.5 text-xs bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-md text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-stone-600"
                />
              </div>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-stone-900 hover:bg-stone-800 text-white dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-stone-200 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0"
              >
                <span>Subscribe</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
            {error && (
              <p className="mt-2 text-xs text-rose-600 dark:text-rose-400 text-left">
                {error}
              </p>
            )}
            <p className="mt-2.5 text-[11px] text-stone-500 dark:text-stone-400">
              Zero algorithmic advertising. Unsubscribe at any moment with one click.
            </p>
          </form>
        )}
      </div>
    </section>
  );
};
