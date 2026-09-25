'use client';
import React, { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { slugify, type ServiceRow } from '@/lib/supabase/types';
import ImageUploadField from '@/components/ImageUploadField';

const EMPTY_FORM = {
  nom: '',
  slug: '',
  description: '',
  image: '',
  duree_minutes: '30',
  prix: '',
  info_complementaire: '',
  actif: true,
};

export default function AdminServicesPage() {
  const supabase = createClient();
  const [services, setServices] = useState<ServiceRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<ServiceRow | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [slugTouched, setSlugTouched] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from('services').select('*').order('created_at', { ascending: false });
    setServices((data as ServiceRow[]) ?? []);
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

  const openEdit = (s: ServiceRow) => {
    setEditing(s);
    setForm({
      nom: s.nom,
      slug: s.slug,
      description: s.description ?? '',
      image: s.image ?? '',
      duree_minutes: String(s.duree_minutes ?? 30),
      prix: String(s.prix),
      info_complementaire: s.info_complementaire ?? '',
      actif: s.actif,
    });
    setSlugTouched(true);
    setError(null);
    setModalOpen(true);
  };

  const handleNomChange = (v: string) => {
    setForm((f) => ({ ...f, nom: v, slug: slugTouched ? f.slug : slugify(v) }));
  };

  const handleSave = async () => {
    if (!form.nom || !form.slug || !form.prix) {
      setError('Nom, slug et prix sont obligatoires.');
      return;
    }
    setSaving(true);
    setError(null);
    const payload = {
      nom: form.nom,
      slug: form.slug,
      description: form.description || null,
      image: form.image || null,
      duree_minutes: parseInt(form.duree_minutes, 10) || null,
      prix: parseFloat(form.prix),
      info_complementaire: form.info_complementaire || null,
      actif: form.actif,
      updated_at: new Date().toISOString(),
    };
    await supabase.auth.refreshSession();
    const { data: result, error: saveError } = editing
      ? await supabase.from('services').update(payload).eq('id', editing.id).select()
      : await supabase.from('services').insert(payload).select();
    setSaving(false);
    if (saveError) {
      setError(saveError.message.includes('duplicate') ? 'Ce slug existe déjà.' : saveError.message);
      return;
    }
    if (!result || result.length === 0) {
      setError('Échec — session expirée. Reconnectez-vous et réessayez.');
      return;
    }
    setModalOpen(false);
    load();
  };

  const handleDelete = async (s: ServiceRow) => {
    if (!confirm(`Supprimer le service "${s.nom}" ?`)) return;
    setDeletingId(s.id);
    const { error: delError } = await supabase.from('services').delete().eq('id', s.id);
    setDeletingId(null);
    if (delError) {
      alert('Erreur: ' + delError.message);
      return;
    }
    load();
  };

  const toggleActif = async (s: ServiceRow) => {
    await supabase.from('services').update({ actif: !s.actif }).eq('id', s.id);
    load();
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Services / Soins</h1>
          <p className="text-sm text-gray-500 mt-0.5">{services.length} services</p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 bg-emerald-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg hover:bg-emerald-800 transition-colors"
        >
          <span>+</span> Ajouter un service
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400">Chargement...</div>
      ) : services.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-12 text-center text-gray-400">
          <div className="text-3xl mb-2">🧴</div>
          Aucun service pour le moment
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((s) => (
            <div key={s.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden group">
              <div className="h-32 overflow-hidden relative bg-gray-100">
                {s.image && <img src={s.image} alt={s.nom} className="w-full h-full object-cover" />}
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openEdit(s)} className="w-7 h-7 rounded-lg bg-white/90 hover:bg-white flex items-center justify-center text-gray-700" title="Modifier">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                  </button>
                  <button onClick={() => handleDelete(s)} disabled={deletingId === s.id} className="w-7 h-7 rounded-lg bg-white/90 hover:bg-white flex items-center justify-center text-red-600 disabled:opacity-40" title="Supprimer">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              </div>
              <div className="p-4 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-gray-900">{s.nom}</h3>
                  <button
                    onClick={() => toggleActif(s)}
                    className={`text-xs font-medium px-2 py-1 rounded-full flex-shrink-0 transition-colors ${
                      s.actif ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {s.actif ? 'Actif' : 'Inactif'}
                  </button>
                </div>
                {s.description && <p className="text-xs text-gray-500 line-clamp-2">{s.description}</p>}
                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs text-gray-400">{s.duree_minutes ? `${s.duree_minutes} min` : '—'}</span>
                  <span className="font-bold text-emerald-700">{s.prix} DH</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 overflow-y-auto" onClick={() => setModalOpen(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-4 my-8" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-gray-900 text-lg">{editing ? 'Modifier le service' : 'Nouveau service'}</h3>
              <button onClick={() => setModalOpen(false)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400">✕</button>
            </div>
            {error && <div className="text-sm bg-red-50 text-red-600 px-3 py-2 rounded-lg">{error}</div>}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Nom du service *</label>
                <input value={form.nom} onChange={(e) => handleNomChange(e.target.value)} placeholder="Ex: Soin visage hydratant" className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Slug *</label>
                <input value={form.slug} onChange={(e) => { setForm((f) => ({ ...f, slug: slugify(e.target.value) })); setSlugTouched(true); }} className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" />
              </div>
              <ImageUploadField label="Image" value={form.image} onChange={(url) => setForm((f) => ({ ...f, image: url }))} />
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
                <textarea rows={2} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Prix (DH) *</label>
                  <input type="number" step="0.01" value={form.prix} onChange={(e) => setForm((f) => ({ ...f, prix: e.target.value }))} className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Durée (min)</label>
                  <input type="number" value={form.duree_minutes} onChange={(e) => setForm((f) => ({ ...f, duree_minutes: e.target.value }))} className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Informations complémentaires</label>
                <textarea rows={2} value={form.info_complementaire} onChange={(e) => setForm((f) => ({ ...f, info_complementaire: e.target.value }))} placeholder="Précautions, préparation, etc." className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" />
              </div>
              <label className="flex items-center gap-2 cursor-pointer w-fit pt-1">
                <input type="checkbox" checked={form.actif} onChange={(e) => setForm((f) => ({ ...f, actif: e.target.checked }))} className="w-4 h-4 accent-emerald-700" />
                <span className="text-sm text-gray-700 font-medium">Service actif (réservable)</span>
              </label>
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
