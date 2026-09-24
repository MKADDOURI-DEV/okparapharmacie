'use client';
import React, { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { SiteSettingsRow } from '@/lib/supabase/types';

export default function AdminSettingsPage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [version, setVersion] = useState(0);

  const [form, setForm] = useState({
    nom_boutique: 'OK Parapharmacie',
    email: 'contact@okparapharmacie.ma',
    telephone: '+212600000000',
    whatsapp: '+212600000000',
    adresse: 'Lot Mebrouk N°7, Rue Jounaid, El Maarif, Casablanca',
    instagram_url: 'https://www.instagram.com/ok.parapharmacie/',
    frais_livraison: '30',
    livraison_gratuite_a_partir: '500',
    devise: 'MAD',
  });

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('site_settings').select('*').eq('id', 1).maybeSingle();
      if (data) {
        const s = data as SiteSettingsRow;
        setForm((f) => ({
          nom_boutique: s.nom_boutique || f.nom_boutique,
          email: s.email || f.email,
          telephone: s.telephone || f.telephone,
          whatsapp: s.whatsapp || f.whatsapp,
          adresse: s.adresse || f.adresse,
          instagram_url: s.instagram_url || f.instagram_url,
          frais_livraison: String(s.frais_livraison ?? f.frais_livraison),
          livraison_gratuite_a_partir: String(s.livraison_gratuite_a_partir ?? f.livraison_gratuite_a_partir),
          devise: s.devise || f.devise,
        }));
      }
      setLoading(false);
    })();
  }, [version]);

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    const { error: saveError } = await supabase
      .from('site_settings')
      .update({
        nom_boutique: form.nom_boutique,
        email: form.email || null,
        telephone: form.telephone || null,
        whatsapp: form.whatsapp || null,
        adresse: form.adresse || null,
        instagram_url: form.instagram_url || null,
        frais_livraison: parseFloat(form.frais_livraison) || 0,
        livraison_gratuite_a_partir: parseFloat(form.livraison_gratuite_a_partir) || 0,
        devise: form.devise,
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
        <h1 className="text-2xl font-bold text-gray-900">Paramètres</h1>
        <p className="text-sm text-gray-500 mt-0.5">Configuration générale de la boutique</p>
      </div>

      {error && <div className="text-sm bg-red-50 text-red-600 px-3 py-2.5 rounded-lg">{error}</div>}

      {/* Store info */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
        <h2 className="font-semibold text-gray-900 flex items-center gap-2"><span>🏪</span> Informations boutique</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Nom de la boutique</label>
            <input type="text" value={form.nom_boutique} onChange={set('nom_boutique')} className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Email</label>
            <input type="email" value={form.email} onChange={set('email')} className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Téléphone</label>
            <input type="tel" value={form.telephone} onChange={set('telephone')} className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">WhatsApp</label>
            <input type="tel" value={form.whatsapp} onChange={set('whatsapp')} placeholder="+212600000000" className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Adresse</label>
            <input type="text" value={form.adresse} onChange={set('adresse')} className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Instagram URL</label>
            <input type="url" value={form.instagram_url} onChange={set('instagram_url')} className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" />
          </div>
        </div>
      </div>

      {/* Delivery */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
        <h2 className="font-semibold text-gray-900 flex items-center gap-2"><span>🚚</span> Livraison</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Frais de livraison (DH)</label>
            <input type="number" value={form.frais_livraison} onChange={set('frais_livraison')} className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Livraison gratuite à partir de (DH)</label>
            <input type="number" value={form.livraison_gratuite_a_partir} onChange={set('livraison_gratuite_a_partir')} className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" />
          </div>
        </div>
      </div>

      {/* Currency */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
        <h2 className="font-semibold text-gray-900 flex items-center gap-2"><span>⚙️</span> Général</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Devise</label>
            <select value={form.devise} onChange={set('devise')} className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white">
              <option value="MAD">MAD / DH</option>
              <option value="EUR">EUR</option>
              <option value="USD">USD</option>
            </select>
          </div>
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
