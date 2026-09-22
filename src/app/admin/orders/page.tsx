'use client';
import React, { useEffect, useMemo, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { CommandeRow } from '@/lib/supabase/types';

const ALL_STATUSES = ['Tous', 'en_attente', 'confirmee', 'en_cours', 'expediee', 'livree', 'annulee'];

const STATUS_LABEL: Record<string, string> = {
  en_attente: 'En attente',
  confirmee: 'Confirmé',
  en_cours: 'En cours',
  expediee: 'Expédié',
  livree: 'Livré',
  annulee: 'Annulé',
};

const STATUS_STYLES: Record<string, string> = {
  livree: 'bg-emerald-50 text-emerald-700',
  en_cours: 'bg-blue-50 text-blue-700',
  confirmee: 'bg-violet-50 text-violet-700',
  en_attente: 'bg-amber-50 text-amber-700',
  expediee: 'bg-sky-50 text-sky-700',
  annulee: 'bg-red-50 text-red-600',
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<CommandeRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('Tous');
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<CommandeRow | null>(null);
  const [page, setPage] = useState(1);
  const PER_PAGE = 8;

  useEffect(() => {
    (async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from('commandes')
        .select('*, clients(*)')
        .order('created_at', { ascending: false });
      setOrders((data as CommandeRow[]) ?? []);
      setLoading(false);
    })();
  }, []);

  const stats = useMemo(() => ({
    total: orders.length,
    enAttente: orders.filter((o) => o.statut === 'en_attente').length,
    expediees: orders.filter((o) => o.statut === 'expediee').length,
    livrees: orders.filter((o) => o.statut === 'livree').length,
  }), [orders]);

  const filtered = orders.filter((o) => {
    const matchStatus = statusFilter === 'Tous' || o.statut === statusFilter;
    const clientNom = o.clients?.nom ?? '';
    const matchSearch =
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      clientNom.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const SUMMARY = [
    { label: 'Total commandes', value: stats.total, icon: '🛒', color: 'bg-blue-50 text-blue-700' },
    { label: 'En attente', value: stats.enAttente, icon: '⏳', color: 'bg-amber-50 text-amber-700' },
    { label: 'Expédiées', value: stats.expediees, icon: '🚚', color: 'bg-sky-50 text-sky-700' },
    { label: 'Livrées', value: stats.livrees, icon: '✅', color: 'bg-emerald-50 text-emerald-700' },
  ];

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Commandes</h1>
        <p className="text-sm text-gray-500 mt-0.5">Consultation et suivi — le statut évolue automatiquement</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {SUMMARY.map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg ${s.color}`}>{s.icon}</div>
            <div>
              <p className="text-lg font-bold text-gray-900">{s.value}</p>
              <p className="text-xs text-gray-500">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Rechercher par ID, client..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {ALL_STATUSES.map((s) => (
              <button
                key={s}
                onClick={() => { setStatusFilter(s); setPage(1); }}
                className={`text-xs font-medium px-3 py-2 rounded-lg border transition-colors ${
                  statusFilter === s ? 'bg-emerald-700 text-white border-emerald-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                {s === 'Tous' ? 'Tous' : STATUS_LABEL[s]}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wide border-b border-gray-100">
                <th className="text-left px-5 py-3.5 font-medium">Commande</th>
                <th className="text-left px-5 py-3.5 font-medium">Client</th>
                <th className="text-right px-5 py-3.5 font-medium">Total</th>
                <th className="text-left px-5 py-3.5 font-medium hidden sm:table-cell">Date</th>
                <th className="text-left px-5 py-3.5 font-medium">Statut</th>
                <th className="text-right px-5 py-3.5 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan={6} className="text-center py-12 text-gray-400">Chargement...</td></tr>
              ) : paginated.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-gray-400">
                    <div className="text-3xl mb-2">🛒</div>
                    <p>Aucune commande trouvée</p>
                  </td>
                </tr>
              ) : (
                paginated.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-4 font-mono text-xs text-gray-500 font-medium">
                      #{order.id.slice(0, 8).toUpperCase()}
                    </td>
                    <td className="px-5 py-4 font-medium text-gray-800">{order.clients?.nom ?? '—'}</td>
                    <td className="px-5 py-4 text-right font-semibold text-gray-900">{order.total} DH</td>
                    <td className="px-5 py-4 text-gray-400 text-xs hidden sm:table-cell">
                      {new Date(order.created_at).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${STATUS_STYLES[order.statut]}`}>
                        {STATUS_LABEL[order.statut]}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="p-1.5 text-gray-400 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
                          title="Voir détails"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3.5 border-t border-gray-100 bg-gray-50/50">
            <p className="text-sm text-gray-500">
              {(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, filtered.length)} sur {filtered.length} commandes
            </p>
            <div className="flex items-center gap-1">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">←</button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button key={p} onClick={() => setPage(p)} className={`w-8 h-8 text-sm rounded-lg border transition-colors ${p === page ? 'bg-emerald-700 text-white border-emerald-700' : 'border-gray-200 text-gray-600 hover:bg-gray-100'}`}>{p}</button>
              ))}
              <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">→</button>
            </div>
          </div>
        )}
      </div>

      {/* Order detail modal — read only */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setSelectedOrder(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-5" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-gray-900 text-lg">#{selectedOrder.id.slice(0, 8).toUpperCase()}</h3>
                <p className="text-sm text-gray-400">{new Date(selectedOrder.created_at).toLocaleDateString('fr-FR')}</p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors">✕</button>
            </div>

            <div className="space-y-3">
              <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Informations client</p>
                <p className="font-semibold text-gray-900">{selectedOrder.clients?.nom ?? '—'}</p>
                {selectedOrder.clients?.email && <p className="text-sm text-gray-600">{selectedOrder.clients.email}</p>}
                {selectedOrder.clients?.telephone && <p className="text-sm text-gray-600">{selectedOrder.clients.telephone}</p>}
                {selectedOrder.adresse && <p className="text-sm text-gray-600">📍 {selectedOrder.adresse}</p>}
              </div>

              <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Résumé</p>
                <div className="flex justify-between font-semibold border-t border-gray-200 pt-2 mt-2">
                  <span>Total</span>
                  <span className="text-emerald-700">{selectedOrder.total} DH</span>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Statut</p>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${STATUS_STYLES[selectedOrder.statut]}`}>
                  {STATUS_LABEL[selectedOrder.statut]}
                </span>
                <p className="text-xs text-gray-400 mt-2">Le statut évolue automatiquement selon le traitement de la commande.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
