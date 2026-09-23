'use client';
import React, { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { PromotionRow } from '@/lib/supabase/types';

function computeStatus(promo: { date_debut: string; date_fin: string }): 'a_venir' | 'actif' | 'termine' {
  const now = new Date();
  const start = new Date(promo.date_debut);
  const end = new Date(promo.date_fin);
  if (now < start) return 'a_venir';
  if (now > end) return 'termine';
  return 'actif';
}

const STATUS_LABEL: Record<string, string> = { a_venir: 'À venir', actif: 'Actif', termine: 'Terminée' };
const STATUS_STYLE: Record<string, string> = {
  a_venir: 'bg-blue-50 text-blue-700',
  actif: 'bg-emerald-50 text-emerald-700',
  termine: 'bg-gray-100 text-gray-500',
};

const toDateInput = (iso: string) => iso.slice(0, 10);

const EMPTY_FORM = {
  code: '',
  type: 'pourcentage' as 'pourcentage' | 'montant_fixe',
  valeur: '',
  date_debut: '',
  date_fin: '',
};

export default function AdminPromotionsPage() {
  const supabase = createClient();
  const [promos, setPromos] = useState<PromotionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<PromotionRow | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from('promotions').select('*').order('date_debut', { ascending: false });
    setPromos((data as PromotionRow[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setError(null);
    setModalOpen(true);
  };

  const openEdit = (promo: PromotionRow) => {
    setEditing(promo);
    setForm({
      code: promo.code,
      type: promo.type,
      valeur: String(promo.valeur),
      date_debut: toDateInput(promo.date_debut),
      date_fin: toDateInput(promo.date_fin),
    });
    setError(null);
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.code || !form.valeur || !form.date_debut || !form.date_fin) {
      setError('Tous les champs sont obligatoires.');
      return;
    }
    if (new Date(form.date_fin) < new Date(form.date_debut)) {
      setError('La date de fin doit être après la date de début.');
      return;
    }
    setSaving(true);
    setError(null);
    const payload = {
      code: form.code.toUpperCase(),
      type: form.type,
      valeur: parseFloat(form.valeur),
      date_debut: new Date(form.date_debut).toISOString(),
      date_fin: new Date(form.date_fin + 'T23:59:59').toISOString(),
      actif: true,
    };
    const { error: saveError } = editing
      ? await supabase.from('promotions').update(payload).eq('id', editing.id)
      : await supabase.from('promotions').insert(payload);
    setSaving(false);
    if (saveError) {
      setError(saveError.message.includes('duplicate') ? 'Ce code promo existe déjà.' : saveError.message);
      return;
    }
    setModalOpen(false);
    load();
  };

  const handleDelete = async (promo: PromotionRow) => {
    if (!confirm(`Supprimer la promotion "${promo.code}" ?`)) return;
    setDeletingId(promo.id);
    const { error: delError } = await supabase.from('promotions').delete().eq('id', promo.id);
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
          <h1 className="text-2xl font-bold text-gray-900">Promotions</h1>
          <p className="text-sm text-gray-500 mt-0.5">{promos.length} promotions — le statut est calculé automatiquement selon les dates</p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 bg-emerald-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg hover:bg-emerald-800 transition-colors"
        >
          <span>+</span> Ajouter une promotion
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400">Chargement...</div>
      ) : promos.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-12 text-center text-gray-400">
          <div className="text-3xl mb-2">🏷️</div>
          Aucune promotion pour le moment
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {promos.map((promo) => {
            const status = computeStatus(promo);
            return (
              <div key={promo.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 space-y-4 group relative">
                <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openEdit(promo)} className="w-7 h-7 rounded-lg bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-gray-600" title="Modifier">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                  </button>
                  <button onClick={() => handleDelete(promo)} disabled={deletingId === promo.id} className="w-7 h-7 rounded-lg bg-gray-50 hover:bg-red-50 flex items-center justify-center text-red-600 disabled:opacity-40" title="Supprimer">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 font-mono">{promo.code}</h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {new Date(promo.date_debut).toLocaleDateString('fr-FR')} → {new Date(promo.date_fin).toLocaleDateString('fr-FR')}
                  </p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-emerald-700">
                    -{promo.valeur}{promo.type === 'pourcentage' ? '%' : ' DH'}
                  </p>
                </div>
                <span className={`text-xs font-medium px-2 py-1 rounded-full inline-block ${STATUS_STYLE[status]}`}>
                  {STATUS_LABEL[status]}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setModalOpen(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-gray-900 text-lg">{editing ? 'Modifier la promotion' : 'Nouvelle promotion'}</h3>
              <button onClick={() => setModalOpen(false)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400">✕</button>
            </div>
            {error && <div className="text-sm bg-red-50 text-red-600 px-3 py-2 rounded-lg">{error}</div>}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Code promo *</label>
                <input value={form.code} onChange={(e) => setForm((f) => ({ ...f, code: e.target.value.toUpperCase() }))} placeholder="ETE2025" className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Type *</label>
                  <select value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as 'pourcentage' | 'montant_fixe' }))} className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500">
                    <option value="pourcentage">Pourcentage (%)</option>
                    <option value="montant_fixe">Montant fixe (DH)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Valeur *</label>
                  <input type="number" step="0.01" value={form.valeur} onChange={(e) => setForm((f) => ({ ...f, valeur: e.target.value }))} placeholder="20" className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Date début *</label>
                  <input type="date" value={form.date_debut} onChange={(e) => setForm((f) => ({ ...f, date_debut: e.target.value }))} className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Date fin *</label>
                  <input type="date" value={form.date_fin} onChange={(e) => setForm((f) => ({ ...f, date_fin: e.target.value }))} className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" />
                </div>
              </div>
              <p className="text-xs text-gray-400">Le statut (À venir / Actif / Terminée) est calculé automatiquement selon ces dates.</p>
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
