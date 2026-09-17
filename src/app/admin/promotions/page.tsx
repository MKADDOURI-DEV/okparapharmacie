'use client';
import React, { useState } from 'react';

const PROMOS = [
  { id: '1', name: 'Soldes Été 2026', type: 'Pourcentage', value: 20, products: 12, start: '01 Jul 2026', end: '31 Aoû 2026', active: false },
  { id: '2', name: 'Rentrée Beauté', type: 'Pourcentage', value: 15, products: 8, start: '01 Sep 2026', end: '30 Sep 2026', active: true },
  { id: '3', name: 'Flash Solaire', type: 'Fixe', value: 30, products: 5, start: '15 Aoû 2026', end: '15 Sep 2026', active: true },
];

export default function AdminPromotionsPage() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Promotions</h1>
          <p className="text-sm text-gray-500 mt-0.5">{PROMOS?.length} promotions</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center gap-2 bg-emerald-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg hover:bg-emerald-800 transition-colors"
        >
          <span>+</span> Créer une promotion
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {PROMOS?.map((promo) => (
          <div key={promo?.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-gray-900">{promo?.name}</h3>
                <p className="text-xs text-gray-400 mt-0.5">{promo?.start} → {promo?.end}</p>
              </div>
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${promo?.active ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                {promo?.active ? 'Active' : 'Terminée'}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-emerald-700">
                  -{promo?.value}{promo?.type === 'Pourcentage' ? '%' : ' DH'}
                </p>
                <p className="text-xs text-gray-400">{promo?.type}</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{promo?.products}</p>
                <p className="text-xs text-gray-400">Produits</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="flex-1 text-xs font-medium py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">Modifier</button>
              <button className="flex-1 text-xs font-medium py-1.5 rounded-lg border border-red-100 text-red-500 hover:bg-red-50 transition-colors">Supprimer</button>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-4" onClick={(e) => e?.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-gray-900">Nouvelle promotion</h3>
              <button onClick={() => setShowForm(false)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400">✕</button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Nom de la promotion</label>
                <input placeholder="Ex: Soldes Automne" className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Type</label>
                  <select className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white">
                    <option>Pourcentage</option>
                    <option>Fixe (DH)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Valeur</label>
                  <input type="number" placeholder="20" className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Date début</label>
                  <input type="date" className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Date fin</label>
                  <input type="date" className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" />
                </div>
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setShowForm(false)} className="flex-1 py-2.5 text-sm font-medium border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">Annuler</button>
              <button onClick={() => setShowForm(false)} className="flex-1 py-2.5 text-sm font-medium bg-emerald-700 text-white rounded-lg hover:bg-emerald-800 transition-colors">Créer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
