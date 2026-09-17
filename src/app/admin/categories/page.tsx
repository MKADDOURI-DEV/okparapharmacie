'use client';
import React, { useState } from 'react';
import { CATEGORIES } from '@/lib/mockData';

export default function AdminCategoriesPage() {
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('');

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Catégories</h1>
          <p className="text-sm text-gray-500 mt-0.5">{CATEGORIES?.length} catégories</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center gap-2 bg-emerald-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg hover:bg-emerald-800 transition-colors"
        >
          <span>+</span> Ajouter
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {CATEGORIES?.map((cat) => (
          <div key={cat?.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden group">
            <div className="h-28 overflow-hidden relative">
              <img src={cat?.image} alt={cat?.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              <span className="absolute bottom-2 left-3 text-2xl">{cat?.icon}</span>
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-semibold text-gray-900">{cat?.name}</h3>
                <span className="text-xs text-gray-400">{cat?.productCount} produits</span>
              </div>
              <p className="text-xs text-gray-400 font-mono mb-3">/categories/{cat?.slug}</p>
              <div className="flex gap-2">
                <button className="flex-1 text-xs font-medium py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">
                  Modifier
                </button>
                <button className="flex-1 text-xs font-medium py-1.5 rounded-lg border border-red-100 text-red-500 hover:bg-red-50 transition-colors">
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 space-y-4" onClick={(e) => e?.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-gray-900">Nouvelle catégorie</h3>
              <button onClick={() => setShowForm(false)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400">✕</button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Nom</label>
                <input value={name} onChange={(e) => setName(e?.target?.value)} placeholder="Ex: Soins Visage" className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Icône (emoji)</label>
                <input value={icon} onChange={(e) => setIcon(e?.target?.value)} placeholder="Ex: ✨" className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Image</label>
                <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center text-sm text-gray-400 hover:border-emerald-400 transition-colors cursor-pointer">
                  📷 Cliquer pour uploader
                </div>
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setShowForm(false)} className="flex-1 py-2.5 text-sm font-medium border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">Annuler</button>
              <button onClick={() => setShowForm(false)} className="flex-1 py-2.5 text-sm font-medium bg-emerald-700 text-white rounded-lg hover:bg-emerald-800 transition-colors">Enregistrer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
