import React from 'react';
import Link from 'next/link';
import AppLogo from '@/components/ui/AppLogo';
import Icon from '@/components/ui/AppIcon';

export default function Footer() {
  return (
    <footer className="bg-foreground text-white/70 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-14">
        {/* Main Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
          {/* Brand */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-2">
              <AppLogo size={36} />
              <div>
                <span className="font-display font-bold text-lg text-white leading-none block">OK</span>
                <span className="text-[10px] font-semibold text-white/50 tracking-widest uppercase">Parapharmacie</span>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-white/60">
              Votre parapharmacie en ligne au Maroc. Produits authentiques, prix compétitifs, livraison rapide.
            </p>
            <div className="flex items-center gap-3">
              <a href="https://www.instagram.com/ok.parapharmacie/" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center hover:bg-accent transition-colors" aria-label="Instagram">
                <Icon name="PhotoIcon" size={16} className="text-white" />
              </a>
              <a href="#" className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center hover:bg-accent transition-colors" aria-label="Facebook">
                <Icon name="GlobeAltIcon" size={16} className="text-white" />
              </a>
              <a href="https://wa.me/212600000000" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center hover:bg-green-600 transition-colors" aria-label="WhatsApp">
                <Icon name="ChatBubbleLeftRightIcon" size={16} className="text-white" />
              </a>
            </div>
          </div>

          {/* Liens */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider">Boutique</h4>
            {['Toutes les catégories', 'Nouveautés', 'Promotions', 'Meilleures ventes', 'Marques']?.map(link => (
              <Link key={link} href="/product-catalog" className="block text-sm hover:text-white transition-colors">{link}</Link>
            ))}
          </div>

          <div className="space-y-3">
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider">Aide</h4>
            {['Mon compte', 'Mes commandes', 'Livraison & retours', 'FAQ', 'Contact']?.map(link => (
              <Link key={link} href="#" className="block text-sm hover:text-white transition-colors">{link}</Link>
            ))}
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider">Contact</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <Icon name="MapPinIcon" size={16} className="text-accent flex-shrink-0 mt-0.5" />
                <span>Lot Mebrouk N°7, Rue Jounaid, El Maarif, Casablanca</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon name="PhoneIcon" size={16} className="text-accent flex-shrink-0" />
                <a href="tel:+212600000000" className="hover:text-white transition-colors">+212 600-000-000</a>
              </div>
              <div className="flex items-center gap-2">
                <Icon name="EnvelopeIcon" size={16} className="text-accent flex-shrink-0" />
                <a href="mailto:contact@okparapharmacie.ma" className="hover:text-white transition-colors">contact@okparapharmacie.ma</a>
              </div>
            </div>
            <div className="mt-4 p-3 bg-white/5 rounded-xl border border-white/10">
              <p className="text-xs text-white/50 mb-1">Horaires</p>
              <p className="text-sm text-white font-medium">Lun–Sam: 9h00 – 20h00</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-white/40">
          <p>© 2026 OK Parapharmacie SARL. Tous droits réservés. — Casablanca, Maroc</p>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-white transition-colors">Politique de confidentialité</Link>
            <Link href="#" className="hover:text-white transition-colors">Conditions générales</Link>
            <Link href="#" className="hover:text-white transition-colors">Mentions légales</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}