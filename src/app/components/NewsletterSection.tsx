'use client';
import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
    setEmail('');
  };

  return (
    <section className="py-16 bg-primary relative overflow-hidden">
      {/* Background decorative */}
      <div className="absolute top-1/2 -translate-y-1/2 -left-20 w-80 h-80 rounded-full bg-white/5 pointer-events-none" />
      <div className="absolute top-1/2 -translate-y-1/2 -right-20 w-96 h-96 rounded-full bg-white/5 pointer-events-none" />

      <div className="relative z-10 max-w-2xl mx-auto px-6 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 mb-6">
          <span className="text-white/80 text-xs font-bold uppercase tracking-[0.2em]">Newsletter</span>
        </div>
        <h2 className="font-display text-section-title text-white mb-4">
          Restez informé(e) des<br />
          <span className="italic">meilleures offres</span>
        </h2>
        <p className="text-white/70 text-base font-light mb-8 leading-relaxed">
          Recevez en avant-première nos promotions exclusives, nouveautés et conseils beauté directement dans votre boîte mail.
        </p>

        {submitted ? (
          <div className="flex items-center justify-center gap-3 bg-white/15 rounded-2xl px-6 py-4">
            <span className="text-2xl">🎉</span>
            <div className="text-left">
              <p className="text-white font-semibold">Merci pour votre inscription!</p>
              <p className="text-white/70 text-sm">Vous recevrez bientôt nos meilleures offres.</p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <div className="relative flex-1">
              <Icon name="EnvelopeIcon" size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="votre@email.com"
                required
                className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-white text-foreground text-sm border-2 border-transparent focus:border-accent focus:outline-none placeholder:text-muted-foreground"
              />
            </div>
            <button
              type="submit"
              className="shimmer-btn relative overflow-hidden px-6 py-3.5 bg-accent text-white rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity whitespace-nowrap"
            >
              S'inscrire
            </button>
          </form>
        )}
        <p className="text-white/50 text-xs mt-4">Pas de spam. Désabonnement facile à tout moment.</p>
      </div>
    </section>
  );
}