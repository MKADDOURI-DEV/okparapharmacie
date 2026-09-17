'use client';
import React, { useState } from 'react';

export default function AdminHomepagePage() {
  const [heroTitle, setHeroTitle] = useState('Votre beauté et votre bien-être, au quotidien.');
  const [heroSubtitle, setHeroSubtitle] = useState('Découvrez les meilleures marques de parapharmacie au Maroc. Livraison rapide partout au Maroc.');
  const [ctaText, setCtaText] = useState('Découvrir nos produits');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const SECTIONS = [
    { label: 'Produits vedettes', enabled: true },
    { label: 'Meilleures ventes', enabled: true },
    { label: 'Nouveautés', enabled: true },
    { label: 'Bannière promotionnelle', enabled: true },
    { label: 'Marques partenaires', enabled: true },
    { label: 'Témoignages', enabled: true },
    { label: 'Section Instagram', enabled: true },
    { label: 'Newsletter', enabled: true },
  ];

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Page d&apos;accueil</h1>
        <p className="text-sm text-gray-500 mt-0.5">Gérez le contenu affiché sur la page d&apos;accueil</p>
      </div>

      {/* Hero section */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
        <h2 className="font-semibold text-gray-900 flex items-center gap-2">
          <span>🦸</span> Section Hero
        </h2>
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Titre principal</label>
            <input
              value={heroTitle}
              onChange={(e) => setHeroTitle(e?.target?.value)}
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Sous-titre</label>
            <textarea
              value={heroSubtitle}
              onChange={(e) => setHeroSubtitle(e?.target?.value)}
              rows={2}
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 resize-none"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Texte du bouton CTA</label>
            <input
              value={ctaText}
              onChange={(e) => setCtaText(e?.target?.value)}
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Image hero</label>
            <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center text-sm text-gray-400 hover:border-emerald-400 transition-colors cursor-pointer">
              🖼️ Cliquer pour uploader une image (1920×600px recommandé)
            </div>
          </div>
        </div>
      </div>

      {/* Sections visibility */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
        <h2 className="font-semibold text-gray-900 flex items-center gap-2">
          <span>👁️</span> Visibilité des sections
        </h2>
        <div className="space-y-2">
          {SECTIONS?.map((section) => (
            <div key={section?.label} className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
              <span className="text-sm text-gray-700">{section?.label}</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked={section?.enabled} className="sr-only peer" />
                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600" />
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Announcement bar */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
        <h2 className="font-semibold text-gray-900 flex items-center gap-2">
          <span>📢</span> Barre d&apos;annonce
        </h2>
        <div className="space-y-2">
          {['Livraison partout au Maroc', 'Paiement à la livraison', 'Produits sélectionnés avec soin']?.map((msg, i) => (
            <input
              key={i}
              defaultValue={msg}
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className={`px-6 py-2.5 text-sm font-medium rounded-lg transition-all ${
            saved
              ? 'bg-emerald-100 text-emerald-700' :'bg-emerald-700 text-white hover:bg-emerald-800'
          }`}
        >
          {saved ? '✓ Enregistré' : 'Enregistrer les modifications'}
        </button>
      </div>
    </div>
  );
}
