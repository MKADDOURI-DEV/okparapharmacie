'use client';
import React, { useState } from 'react';
import { CATEGORIES, BRANDS } from '@/lib/mockData';

export default function AdminNewProductPage() {
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-3">
        <a href="/admin/products" className="text-gray-400 hover:text-gray-600 transition-colors">
          ← Produits
        </a>
        <span className="text-gray-300">/</span>
        <h1 className="text-2xl font-bold text-gray-900">Ajouter un produit</h1>
      </div>

      {/* Basic info */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
        <h2 className="font-semibold text-gray-900">Informations générales</h2>
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Nom du produit *</label>
            <input placeholder="Ex: Nettoyant Hydratant CeraVe 473ml" className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">SKU</label>
              <input placeholder="Ex: CRV-001-473ML" className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Slug URL</label>
              <input placeholder="cerave-nettoyant-hydratant" className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Catégorie *</label>
              <select className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white">
                <option value="">Sélectionner...</option>
                {CATEGORIES?.map((c) => <option key={c?.id} value={c?.name}>{c?.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Marque *</label>
              <select className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white">
                <option value="">Sélectionner...</option>
                {BRANDS?.map((b) => <option key={b?.id} value={b?.name}>{b?.name}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
            <textarea rows={4} placeholder="Description détaillée du produit..." className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 resize-none" />
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
        <h2 className="font-semibold text-gray-900">Prix & Stock</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Prix (DH) *</label>
            <input type="number" placeholder="129" className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Ancien prix (DH)</label>
            <input type="number" placeholder="165" className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Stock *</label>
            <input type="number" placeholder="50" className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Alerte stock min.</label>
            <input type="number" placeholder="5" className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" />
          </div>
        </div>
      </div>

      {/* Images */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
        <h2 className="font-semibold text-gray-900">Images du produit</h2>
        <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-emerald-400 transition-colors cursor-pointer">
          <div className="text-3xl mb-2">📷</div>
          <p className="text-sm font-medium text-gray-600">Glisser-déposer ou cliquer pour uploader</p>
          <p className="text-xs text-gray-400 mt-1">PNG, JPG jusqu&apos;à 5MB — plusieurs images acceptées</p>
        </div>
      </div>

      {/* Details */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
        <h2 className="font-semibold text-gray-900">Détails produit</h2>
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Ingrédients / Composition</label>
            <textarea rows={3} placeholder="Liste des ingrédients..." className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 resize-none" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Mode d&apos;emploi</label>
            <textarea rows={3} placeholder="Instructions d'utilisation..." className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 resize-none" />
          </div>
        </div>
      </div>

      {/* Flags */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
        <h2 className="font-semibold text-gray-900">Options d&apos;affichage</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Actif', key: 'active' },
            { label: 'Produit vedette', key: 'featured' },
            { label: 'Meilleure vente', key: 'bestseller' },
            { label: 'Nouveauté', key: 'new' },
          ]?.map((flag) => (
            <label key={flag?.key} className="flex items-center gap-2 cursor-pointer p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
              <input type="checkbox" defaultChecked={flag?.key === 'active'} className="w-4 h-4 accent-emerald-700" />
              <span className="text-sm text-gray-700">{flag?.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <a href="/admin/products" className="px-5 py-2.5 text-sm font-medium border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
          Annuler
        </a>
        <button
          onClick={handleSave}
          className={`px-6 py-2.5 text-sm font-medium rounded-lg transition-all ${
            saved
              ? 'bg-emerald-100 text-emerald-700' :'bg-emerald-700 text-white hover:bg-emerald-800'
          }`}
        >
          {saved ? '✓ Produit enregistré' : 'Enregistrer le produit'}
        </button>
      </div>
    </div>
  );
}
