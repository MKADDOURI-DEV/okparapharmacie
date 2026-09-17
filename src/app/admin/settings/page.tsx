'use client';
import React, { useState } from 'react';

export default function AdminSettingsPage() {
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Paramètres</h1>
        <p className="text-sm text-gray-500 mt-0.5">Configuration générale de la boutique</p>
      </div>

      {/* Store info */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
        <h2 className="font-semibold text-gray-900 flex items-center gap-2"><span>🏪</span> Informations boutique</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { label: 'Nom de la boutique', value: 'OK Parapharmacie', type: 'text' },
            { label: 'Email', value: 'contact@okparapharmacie.ma', type: 'email' },
            { label: 'Téléphone', value: '+212 5 22 00 00 00', type: 'tel' },
            { label: 'WhatsApp', value: '+212 6 00 00 00 00', type: 'tel' },
            { label: 'Adresse', value: 'Casablanca, Maroc', type: 'text' },
            { label: 'Instagram URL', value: 'https://www.instagram.com/ok.parapharmacie/', type: 'url' },
          ]?.map((field) => (
            <div key={field?.label}>
              <label className="block text-xs font-medium text-gray-600 mb-1">{field?.label}</label>
              <input
                type={field?.type}
                defaultValue={field?.value}
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Delivery */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
        <h2 className="font-semibold text-gray-900 flex items-center gap-2"><span>🚚</span> Livraison</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Frais de livraison (DH)</label>
            <input type="number" defaultValue="30" className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Livraison gratuite à partir de (DH)</label>
            <input type="number" defaultValue="500" className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" />
          </div>
        </div>
      </div>

      {/* Currency & Status */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
        <h2 className="font-semibold text-gray-900 flex items-center gap-2"><span>⚙️</span> Général</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Devise</label>
            <select className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white">
              <option>MAD / DH</option>
              <option>EUR</option>
              <option>USD</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Statut de la boutique</label>
            <select className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white">
              <option>Ouverte</option>
              <option>Maintenance</option>
              <option>Fermée</option>
            </select>
          </div>
        </div>
      </div>

      {/* Logo & Favicon */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
        <h2 className="font-semibold text-gray-900 flex items-center gap-2"><span>🎨</span> Identité visuelle</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Logo</label>
            <div className="border-2 border-dashed border-gray-200 rounded-lg p-5 text-center text-sm text-gray-400 hover:border-emerald-400 transition-colors cursor-pointer">
              🖼️ Uploader le logo
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Favicon</label>
            <div className="border-2 border-dashed border-gray-200 rounded-lg p-5 text-center text-sm text-gray-400 hover:border-emerald-400 transition-colors cursor-pointer">
              🔖 Uploader le favicon
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className={`px-6 py-2.5 text-sm font-medium rounded-lg transition-all ${
            saved
              ? 'bg-emerald-100 text-emerald-700' :'bg-emerald-700 text-white hover:bg-emerald-800'
          }`}
        >
          {saved ? '✓ Enregistré' : 'Enregistrer les modifications'}
        </button>
      </div>
    </div>
  );
}
