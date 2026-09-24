'use client';
import React, { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { SiteSettingsRow } from '@/lib/supabase/types';

const SECTION_FIELDS: { key: keyof SiteSettingsRow['sections']; label: string }[] = [
  { key: 'featured', label: 'Produits vedettes' },
  { key: 'bestsellers', label: 'Meilleures ventes' },
  { key: 'promo_banner', label: 'Bannière promotionnelle' },
  { key: 'brands', label: 'Marques partenaires' },
  { key: 'testimonials', label: 'Témoignages' },
  { key: 'newsletter', label: 'Newsletter' },
];

export default function AdminHomepagePage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [heroTitle, setHeroTitle] = useState('');
  const [heroSubtitle, setHeroSubtitle] = useState('');
  const [ctaText, setCtaText] = useState('');
  const [sections, setSections] = useState<SiteSettingsRow['sections']>({});

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('site_settings').select('*').eq('id', 1).maybeSingle();
      if (data) {
        const s = data as SiteSettingsRow;
        setHeroTitle(s.hero_title ?? '');
        setHeroSubtitle(s.hero_subtitle ?? '');
        setCtaText(s.cta_text ?? '');
        setSections(s.sections ?? {});
      }
      setLoading(false);
    })();
  }, []);

  const toggleSection = (key: keyof SiteSettingsRow['sections']) => {
    setSections((s) => ({ ...s, [key]: !(s[key] ?? true) }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    const { error: saveError } = await supabase
      .from('site_settings')
      .update({
        hero_title: heroTitle,
        hero_subtitle: heroSubtitle,
        cta_text: ctaText,
        sections,
        updated_at: new Date().toISOString(),
      })
      .eq('id', 1);
    setSaving(false);
    if (saveError) {
      setError(saveError.message);
      return;
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (loading) {
    return <div className="text-center py-12 text-gray-400">Chargement...</div>;
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Page d&apos;accueil</h1>
        <p className="text-sm text-gray-500 mt-0.5">Gérez le contenu affiché sur la page d&apos;accueil</p>
      </div>

      {error && <div className="text-sm bg-red-50 text-red-600 px-3 py-2.5 rounded-lg">{error}</div>}

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
              onChange={(e) => setHeroTitle(e.target.value)}
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Sous-titre</label>
            <textarea
              value={heroSubtitle}
              onChange={(e) => setHeroSubtitle(e.target.value)}
              rows={2}
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 resize-none"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Texte du bouton CTA</label>
            <input
              value={ctaText}
              onChange={(e) => setCtaText(e.target.value)}
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>
        </div>
      </div>

      {/* Sections visibility */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
        <h2 className="font-semibold text-gray-900 flex items-center gap-2">
          <span>👁️</span> Visibilité des sections
        </h2>
        <div className="space-y-2">
          {SECTION_FIELDS.map((section) => {
            const checked = sections[section.key] ?? true;
            return (
              <div key={section.key} className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
                <span className="text-sm text-gray-700">{section.label}</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={checked} onChange={() => toggleSection(section.key)} className="sr-only peer" />
                  <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600" />
                </label>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className={`px-6 py-2.5 text-sm font-medium rounded-lg transition-all disabled:opacity-50 ${
            saved ? 'bg-emerald-100 text-emerald-700' : 'bg-emerald-700 text-white hover:bg-emerald-800'
          }`}
        >
          {saved ? '✓ Enregistré' : saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
        </button>
      </div>
    </div>
  );
}
