'use client';
import React, { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { slugify, type MarqueRow } from '@/lib/supabase/types';

interface BrandWithCount extends MarqueRow {
  productCount: number;
}

const EMPTY_FORM = { nom: '', slug: '', logo: '' };

export default function AdminBrandsPage() {
  const supabase = createClient();
  const [brands, setBrands] = useState<BrandWithCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<MarqueRow | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [slugTouched, setSlugTouched] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const [{ data: brs }, { data: prods }] = await Promise.all([
      supabase.from('marques').select('*').order('nom'),
      supabase.from('produits').select('marque_id'),
    ]);
    const counts = new Map<string, number>();
    (prods ?? []).forEach((p: { marque_id: string | null }) => {
      if (p.marque_id) counts.set(p.marque_id, (counts.get(p.marque_id) ?? 0) + 1);
    });
    setBrands(((brs as MarqueRow[]) ?? []).map((b) => ({ ...b, productCount: counts.get(b.id) ?? 0 })));
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setSlugTouched(false);
    setError(null);
    setModalOpen(true);
  };

  const openEdit = (brand: MarqueRow) => {
    setEditing(brand);
    setForm({ nom: brand.nom, slug: brand.slug, logo: brand.logo ?? '' });
    setSlugTouched(true);
    setError(null);
    setModalOpen(true);
  };

  const handleNomChange = (v: string) => {
    setForm((f) => ({ ...f, nom: v, slug: slugTouched ? f.slug : slugify(v) }));
  };

  const handleSave = async () => {
    if (!form.nom || !form.slug) {
      setError('Le nom et le slug sont obligatoires.');
      return;
    }
    setSaving(true);
    setError(null);
    const payload = { nom: form.nom, slug: form.slug, logo: form.logo || null };
    const { error: saveError } = editing
      ? await supabase.from('marques').update(payload).eq('id', editing.id)
      : await supabase.from('marques').insert(payload);
    setSaving(false);
    if (saveError) {
      setError(saveError.message.includes('duplicate') ? 'Ce slug existe déjà.' : saveError.message);
      return;
    }
    setModalOpen(false);
    load();
  };

  const handleDelete = async (brand: BrandWithCount) => {
    if (brand.productCount > 0) {
      alert(`Impossible de supprimer "${brand.nom}" : ${brand.productCount} produit(s) l'utilisent encore.`);
      return;
    }
    if (!confirm(`Supprimer la marque "${brand.nom}" ?`)) return;
    setDeletingId(brand.id);
    const { error: delError } = await supabase.from('marques').delete().eq('id', brand.id);
    setDeletingId(null);
    if (delError) {
      alert('Erreur: ' + delError.message);
      return;
    }
    load();
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Marques</h1>
          <p className="text-sm text-gray-500 mt-0.5">{brands.length} marques</p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 bg-emerald-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg hover:bg-emerald-800 transition-colors"
        >
          <span>+</span> Ajouter une marque
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wide border-b border-gray-100">
              <th className="text-left px-5 py-3.5 font-medium">Marque</th>
              <th className="text-left px-5 py-3.5 font-medium hidden md:table-cell">Slug</th>
              <th className="text-center px-5 py-3.5 font-medium hidden sm:table-cell">Produits</th>
              <th className="text-right px-5 py-3.5 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              <tr><td colSpan={4} className="text-center py-12 text-gray-400">Chargement...</td></tr>
            ) : (
              brands.map((brand) => (
                <tr key={brand.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 flex items-center justify-center text-gray-300">
                        {brand.logo ? <img src={brand.logo} alt={brand.nom} className="w-full h-full object-cover" /> : '🏷️'}
                      </div>
                      <span className="font-semibold text-gray-900">{brand.nom}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-gray-400 font-mono text-xs hidden md:table-cell">{brand.slug}</td>
                  <td className="px-5 py-4 text-center text-gray-500 hidden sm:table-cell">{brand.productCount}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => openEdit(brand)} className="p-1.5 text-gray-400 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors" title="Modifier">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                      </button>
                      <button onClick={() => handleDelete(brand)} disabled={deletingId === brand.id} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-40" title="Supprimer">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setModalOpen(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-gray-900 text-lg">{editing ? 'Modifier la marque' : 'Nouvelle marque'}</h3>
              <button onClick={() => setModalOpen(false)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400">✕</button>
            </div>
            {error && <div className="text-sm bg-red-50 text-red-600 px-3 py-2 rounded-lg">{error}</div>}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Nom *</label>
                <input value={form.nom} onChange={(e) => handleNomChange(e.target.value)} className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Slug *</label>
                <input value={form.slug} onChange={(e) => { setForm((f) => ({ ...f, slug: slugify(e.target.value) })); setSlugTouched(true); }} className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Logo (URL)</label>
                <input value={form.logo} onChange={(e) => setForm((f) => ({ ...f, logo: e.target.value }))} placeholder="https://..." className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setModalOpen(false)} className="px-4 py-2.5 text-sm font-medium border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50">Annuler</button>
              <button onClick={handleSave} disabled={saving} className="px-5 py-2.5 text-sm font-medium bg-emerald-700 text-white rounded-lg hover:bg-emerald-800 disabled:opacity-50">
                {saving ? 'Enregistrement...' : 'Enregistrer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
