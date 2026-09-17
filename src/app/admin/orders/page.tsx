'use client';
import React, { useState } from 'react';

const ORDERS = [
  { id: '#ORD-1042', customer: 'Fatima Zahra B.', phone: '+212 6 12 34 56 78', city: 'Casablanca', total: 318, status: 'Livré', date: '02 Sep 2026', items: 2 },
  { id: '#ORD-1041', customer: 'Imane K.', phone: '+212 6 98 76 54 32', city: 'Rabat', total: 175, status: 'En cours', date: '02 Sep 2026', items: 1 },
  { id: '#ORD-1040', customer: 'Nadia M.', phone: '+212 6 55 44 33 22', city: 'Marrakech', total: 490, status: 'Confirmé', date: '01 Sep 2026', items: 3 },
  { id: '#ORD-1039', customer: 'Khadija A.', phone: '+212 6 11 22 33 44', city: 'Fès', total: 265, status: 'En attente', date: '01 Sep 2026', items: 1 },
  { id: '#ORD-1038', customer: 'Sara L.', phone: '+212 6 77 88 99 00', city: 'Tanger', total: 129, status: 'Expédié', date: '31 Aoû 2026', items: 1 },
  { id: '#ORD-1037', customer: 'Amina R.', phone: '+212 6 44 55 66 77', city: 'Agadir', total: 560, status: 'Livré', date: '30 Aoû 2026', items: 4 },
  { id: '#ORD-1036', customer: 'Zineb H.', phone: '+212 6 33 22 11 00', city: 'Casablanca', total: 245, status: 'Annulé', date: '29 Aoû 2026', items: 2 },
  { id: '#ORD-1035', customer: 'Meryem O.', phone: '+212 6 66 77 88 99', city: 'Meknès', total: 189, status: 'Livré', date: '28 Aoû 2026', items: 1 },
  { id: '#ORD-1034', customer: 'Houda B.', phone: '+212 6 22 33 44 55', city: 'Oujda', total: 320, status: 'En cours', date: '27 Aoû 2026', items: 2 },
  { id: '#ORD-1033', customer: 'Laila M.', phone: '+212 6 99 00 11 22', city: 'Rabat', total: 95, status: 'Livré', date: '26 Aoû 2026', items: 1 },
];

const ALL_STATUSES = ['Tous', 'En attente', 'Confirmé', 'En cours', 'Expédié', 'Livré', 'Annulé'];

const STATUS_STYLES: Record<string, string> = {
  'Livré': 'bg-emerald-50 text-emerald-700',
  'En cours': 'bg-blue-50 text-blue-700',
  'Confirmé': 'bg-violet-50 text-violet-700',
  'En attente': 'bg-amber-50 text-amber-700',
  'Expédié': 'bg-sky-50 text-sky-700',
  'Annulé': 'bg-red-50 text-red-600',
};

const ORDER_SUMMARY_STATS = [
  { label: 'Total commandes', value: '1 042', icon: '🛒', color: 'bg-blue-50 text-blue-700' },
  { label: 'En attente', value: '5', icon: '⏳', color: 'bg-amber-50 text-amber-700' },
  { label: 'Expédiées', value: '28', icon: '🚚', color: 'bg-sky-50 text-sky-700' },
  { label: 'Livrées', value: '984', icon: '✅', color: 'bg-emerald-50 text-emerald-700' },
];

export default function AdminOrdersPage() {
  const [statusFilter, setStatusFilter] = useState('Tous');
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<typeof ORDERS[0] | null>(null);
  const [page, setPage] = useState(1);
  const PER_PAGE = 8;

  const filtered = ORDERS.filter((o) => {
    const matchStatus = statusFilter === 'Tous' || o.status === statusFilter;
    const matchSearch =
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.customer.toLowerCase().includes(search.toLowerCase()) ||
      o.city.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Commandes</h1>
        <p className="text-sm text-gray-500 mt-0.5">Gestion et suivi des commandes clients</p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {ORDER_SUMMARY_STATS.map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg ${s.color}`}>
              {s.icon}
            </div>
            <div>
              <p className="text-lg font-bold text-gray-900">{s.value}</p>
              <p className="text-xs text-gray-500">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Rechercher par ID, client, ville..."
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
                  statusFilter === s
                    ? 'bg-emerald-700 text-white border-emerald-700' :'border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wide border-b border-gray-100">
                <th className="text-left px-5 py-3.5 font-medium">Commande</th>
                <th className="text-left px-5 py-3.5 font-medium">Client</th>
                <th className="text-left px-5 py-3.5 font-medium hidden md:table-cell">Ville</th>
                <th className="text-center px-5 py-3.5 font-medium hidden lg:table-cell">Articles</th>
                <th className="text-right px-5 py-3.5 font-medium">Total</th>
                <th className="text-left px-5 py-3.5 font-medium hidden sm:table-cell">Date</th>
                <th className="text-left px-5 py-3.5 font-medium">Statut</th>
                <th className="text-right px-5 py-3.5 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-gray-400">
                    <div className="text-3xl mb-2">🛒</div>
                    <p>Aucune commande trouvée</p>
                  </td>
                </tr>
              ) : (
                paginated.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-4 font-mono text-xs text-gray-500 font-medium">{order.id}</td>
                    <td className="px-5 py-4 font-medium text-gray-800">{order.customer}</td>
                    <td className="px-5 py-4 text-gray-500 hidden md:table-cell">{order.city}</td>
                    <td className="px-5 py-4 text-center text-gray-500 hidden lg:table-cell">{order.items}</td>
                    <td className="px-5 py-4 text-right font-semibold text-gray-900">{order.total} DH</td>
                    <td className="px-5 py-4 text-gray-400 text-xs hidden sm:table-cell">{order.date}</td>
                    <td className="px-5 py-4">
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${STATUS_STYLES[order.status] || 'bg-gray-100 text-gray-600'}`}>
                        {order.status}
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

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3.5 border-t border-gray-100 bg-gray-50/50">
            <p className="text-sm text-gray-500">
              {(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, filtered.length)} sur {filtered.length} commandes
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                ←
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-8 h-8 text-sm rounded-lg border transition-colors ${
                    p === page
                      ? 'bg-emerald-700 text-white border-emerald-700' :'border-gray-200 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                →
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Order detail modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setSelectedOrder(null)}>
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-gray-900 text-lg">{selectedOrder.id}</h3>
                <p className="text-sm text-gray-400">{selectedOrder.date}</p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Informations client</p>
                <p className="font-semibold text-gray-900">{selectedOrder.customer}</p>
                <p className="text-sm text-gray-600">{selectedOrder.phone}</p>
                <p className="text-sm text-gray-600">📍 {selectedOrder.city}</p>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Résumé</p>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Articles</span>
                  <span className="font-medium">{selectedOrder.items}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Livraison</span>
                  <span className="font-medium">30 DH</span>
                </div>
                <div className="flex justify-between font-semibold border-t border-gray-200 pt-2 mt-2">
                  <span>Total</span>
                  <span className="text-emerald-700">{selectedOrder.total} DH</span>
                </div>
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Changer le statut</p>
              <div className="flex flex-wrap gap-2">
                {ALL_STATUSES.filter((s) => s !== 'Tous').map((s) => (
                  <button
                    key={s}
                    className={`text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors ${
                      selectedOrder.status === s
                        ? 'bg-emerald-700 text-white border-emerald-700' :'border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
