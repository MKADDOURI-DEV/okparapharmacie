'use client';
import React, { useState } from 'react';

const CUSTOMERS = [
  { id: '1', name: 'Fatima Zahra B.', email: 'fatima@example.com', phone: '+212 6 12 34 56 78', city: 'Casablanca', orders: 8, spent: 2340, joined: 'Jan 2026', active: true },
  { id: '2', name: 'Imane K.', email: 'imane@example.com', phone: '+212 6 98 76 54 32', city: 'Rabat', orders: 5, spent: 1180, joined: 'Mar 2026', active: true },
  { id: '3', name: 'Nadia M.', email: 'nadia@example.com', phone: '+212 6 55 44 33 22', city: 'Marrakech', orders: 12, spent: 4560, joined: 'Fév 2026', active: true },
  { id: '4', name: 'Khadija A.', email: 'khadija@example.com', phone: '+212 6 11 22 33 44', city: 'Fès', orders: 3, spent: 720, joined: 'Avr 2026', active: true },
  { id: '5', name: 'Sara L.', email: 'sara@example.com', phone: '+212 6 77 88 99 00', city: 'Tanger', orders: 1, spent: 129, joined: 'Aoû 2026', active: true },
  { id: '6', name: 'Amina R.', email: 'amina@example.com', phone: '+212 6 44 55 66 77', city: 'Agadir', orders: 7, spent: 2890, joined: 'Mai 2026', active: false },
];

export default function AdminCustomersPage() {
  const [search, setSearch] = useState('');

  const filtered = CUSTOMERS?.filter(
    (c) =>
      c?.name?.toLowerCase()?.includes(search?.toLowerCase()) ||
      c?.email?.toLowerCase()?.includes(search?.toLowerCase()) ||
      c?.city?.toLowerCase()?.includes(search?.toLowerCase())
  );

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Clients</h1>
        <p className="text-sm text-gray-500 mt-0.5">{CUSTOMERS?.length} clients inscrits</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
        <div className="relative max-w-sm">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Rechercher un client..."
            value={search}
            onChange={(e) => setSearch(e?.target?.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wide border-b border-gray-100">
                <th className="text-left px-5 py-3.5 font-medium">Client</th>
                <th className="text-left px-5 py-3.5 font-medium hidden md:table-cell">Ville</th>
                <th className="text-center px-5 py-3.5 font-medium hidden lg:table-cell">Commandes</th>
                <th className="text-right px-5 py-3.5 font-medium hidden lg:table-cell">Total dépensé</th>
                <th className="text-left px-5 py-3.5 font-medium hidden xl:table-cell">Inscrit</th>
                <th className="text-center px-5 py-3.5 font-medium">Statut</th>
                <th className="text-right px-5 py-3.5 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered?.map((c) => (
                <tr key={c?.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-xs flex-shrink-0">
                        {c?.name?.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{c?.name}</p>
                        <p className="text-xs text-gray-400">{c?.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-gray-500 hidden md:table-cell">{c?.city}</td>
                  <td className="px-5 py-4 text-center text-gray-700 font-medium hidden lg:table-cell">{c?.orders}</td>
                  <td className="px-5 py-4 text-right font-semibold text-gray-900 hidden lg:table-cell">{c?.spent} DH</td>
                  <td className="px-5 py-4 text-gray-400 text-xs hidden xl:table-cell">{c?.joined}</td>
                  <td className="px-5 py-4 text-center">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${c?.active ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                      {c?.active ? 'Actif' : 'Inactif'}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <button className="p-1.5 text-gray-400 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors" title="Voir">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
