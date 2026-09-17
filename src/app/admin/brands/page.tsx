'use client';
import React, { useState } from 'react';
import { BRANDS } from '@/lib/mockData';

export default function AdminBrandsPage() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Marques</h1>
          <p className="text-sm text-gray-500 mt-0.5">{BRANDS?.length} marques</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center gap-2 bg-emerald-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg hover:bg-emerald-800 transition-colors"
        >
          <span>+</span> Ajouter
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wide border-b border-gray-100">
              <th className="text-left px-5 py-3.5 font-medium">Marque</th>
              <th className="text-left px-5 py-3.5 font-medium hidden md:table-cell">Slug</th>
              <th className="text-center px-5 py-3.5 font-medium">Statut</th>
              <th className="text-right px-5 py-3.5 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {BRANDS?.map((brand) => (
              <tr key={brand?.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      <img src={brand?.logo} alt={brand?.name} className="w-full h-full object-cover" />
                    </div>
                    <span className="font-semibold text-gray-900">{brand?.name}</span>
                  </div>
                </td>
                <td className="px-5 py-4 text-gray-400 font-mono text-xs hidden md:table-cell">{brand?.slug}</td>
                <td className="px-5 py-4 text-center">
                  <span className="text-xs font-medium px-2 py-1 rounded-full bg-emerald-50 text-emerald-700">Actif</span>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center justify-end gap-1">
                    <button className="p-1.5 text-gray-400 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors" title="Modifier">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Supprimer">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 space-y-4" onClick={(e) => e?.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-gray-900">Nouvelle marque</h3>
              <button onClick={() => setShowForm(false)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400">✕</button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Nom de la marque</label>
                <input placeholder="Ex: CeraVe" className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Logo</label>
                <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center text-sm text-gray-400 hover:border-emerald-400 transition-colors cursor-pointer">
                  🏷️ Uploader le logo
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
