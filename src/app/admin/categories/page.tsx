'use client';
import React, { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { slugify, type CategorieRow } from '@/lib/supabase/types';

interface CatWithCount extends CategorieRow {
  productCount: number;
}

const EMPTY_FORM = { nom: '', slug: '', description: '', image: '', ordre: '0' };

export default function AdminCategoriesPage() {
  const supabase = createClient();
  const [categories, setCategories] = useState<CatWithCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<CategorieRow | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [slugTouched, setSlugTouched] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const [{ data: cats }, { data: prods }] = await Promise.all([
      supabase.from('categories').select('*').order('ordre'),
      supabase.from('produits').select('category_id'),
    ]);
    const counts = new Map<string, number>();
    (prods ?? []).forEach((p: { category_id: string | null }) => {
      if (p.category_id) counts.set(p.category_id, (counts.get(p.category_id) ?? 0) + 1);
    });
    setCategories(((cats as CategorieRow[]) ?? []).map((c) => ({ ...c, productCount: counts.get(c.id) ?? 0 })));
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ ...EMPTY_FORM, ordre: String(categories.length + 1) });
    setSlugTouched(false);
    setError(null);
    setModalOpen(true);
  };

  const openEdit = (cat: CategorieRow) => {
    setEditing(cat);
    setForm({
      nom: cat.nom,
      slug: cat.slug,
      description: cat.description ?? '',
      image: cat.image ?? '',
      ordre: String(cat.ordre),
    });
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
    const payload = {
      nom: form.nom,
      slug: form.slug,
      description: form.description || null,
      image: form.image || null,
      ordre: parseInt(form.ordre, 10) || 0,
    };
    const { error: saveError } = editing
      ? await supabase.from('categories').update(payload).eq('id', editing.id)
      : await supabase.from('categories').insert(payload);
    setSaving(false);
    if (saveError) {
      setError(saveError.message.includes('duplicate') ? 'Ce slug existe déjà.' : saveError.message);
      return;
    }
    setModalOpen(false);
    load();
  };

  const handleDelete = async (cat: CatWithCount) => {
    if (cat.productCount > 0) {
      alert(`Impossible de supprimer "${cat.nom}" : ${cat.productCount} produit(s) l'utilisent encore.`);
      return;
    }
    if (!confirm(`Supprimer la catégorie "${cat.nom}" ?`)) return;
    setDeletingId(cat.id);
    const { error: delError } = await supabase.from('categories').delete().eq('id', cat.id);
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
          <h1 className="text-2xl font-bold text-gray-900">Catégories</h1>
          <p className="text-sm text-gray-500 mt-0.5">{categories.length} catégories</p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 bg-emerald-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg hover:bg-emerald-800 transition-colors"
        >
          <span>+</span> Ajouter une catégorie
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400">Chargement...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <div key={cat.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden group">
              <div className="h-28 overflow-hidden relative">
                {cat.image && <img src={cat.image} alt={cat.nom} className="w-full h-full object-cover" />}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openEdit(cat)} className="w-7 h-7 rounded-lg bg-white/90 hover:bg-white flex items-center justify-center text-gray-700" title="Modifier">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                  </button>
                  <button onClick={() => handleDelete(cat)} disabled={deletingId === cat.id} className="w-7 h-7 rounded-lg bg-white/90 hover:bg-white flex items-center justify-center text-red-600 disabled:opacity-40" title="Supprimer">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-semibold text-gray-900">{cat.nom}</h3>
                  <span className="text-xs text-gray-400">{cat.productCount} produits</span>
                </div>
                <p className="text-xs text-gray-400 font-mono">/{cat.slug}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setModalOpen(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-gray-900 text-lg">{editing ? 'Modifier la catégorie' : 'Nouvelle catégorie'}</h3>
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
                <label className="block text-xs font-medium text-gray-600 mb-1">Image (URL)</label>
                <input value={form.image} onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))} placeholder="https://..." className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
                <textarea rows={2} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Ordre d&apos;affichage</label>
                <input type="number" value={form.ordre} onChange={(e) => setForm((f) => ({ ...f, ordre: e.target.value }))} className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" />
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
