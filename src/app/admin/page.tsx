'use client';
import React from 'react';
import Link from 'next/link';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';
import { PRODUCTS, CATEGORIES } from '@/lib/mockData';

const salesData = [
  { day: 'Lun', sales: 3200, orders: 12 },
  { day: 'Mar', sales: 4800, orders: 18 },
  { day: 'Mer', sales: 3900, orders: 15 },
  { day: 'Jeu', sales: 6200, orders: 24 },
  { day: 'Ven', sales: 7800, orders: 31 },
  { day: 'Sam', sales: 9400, orders: 38 },
  { day: 'Dim', sales: 5600, orders: 22 },
];

const monthlyData = [
  { month: 'Mar', sales: 42000 },
  { month: 'Avr', sales: 58000 },
  { month: 'Mai', sales: 51000 },
  { month: 'Jun', sales: 67000 },
  { month: 'Jul', sales: 74000 },
  { month: 'Aoû', sales: 89000 },
  { month: 'Sep', sales: 95000 },
];

const RECENT_ORDERS = [
  { id: '#ORD-1042', customer: 'Fatima Zahra B.', city: 'Casablanca', total: 318, status: 'Livré', date: '02 Sep 2026' },
  { id: '#ORD-1041', customer: 'Imane K.', city: 'Rabat', total: 175, status: 'En cours', date: '02 Sep 2026' },
  { id: '#ORD-1040', customer: 'Nadia M.', city: 'Marrakech', total: 490, status: 'Confirmé', date: '01 Sep 2026' },
  { id: '#ORD-1039', customer: 'Khadija A.', city: 'Fès', total: 265, status: 'En attente', date: '01 Sep 2026' },
  { id: '#ORD-1038', customer: 'Sara L.', city: 'Tanger', total: 129, status: 'Expédié', date: '31 Aoû 2026' },
];

const STATUS_STYLES: Record<string, string> = {
  'Livré': 'bg-emerald-50 text-emerald-700',
  'En cours': 'bg-blue-50 text-blue-700',
  'Confirmé': 'bg-violet-50 text-violet-700',
  'En attente': 'bg-amber-50 text-amber-700',
  'Expédié': 'bg-sky-50 text-sky-700',
  'Annulé': 'bg-red-50 text-red-700',
};

const STATS = [
  { label: 'Ventes du jour', value: '9 400 DH', change: '+18%', up: true, icon: '💰' },
  { label: 'Commandes totales', value: '1 042', change: '+12%', up: true, icon: '🛒' },
  { label: 'En attente', value: '5', change: '-2', up: false, icon: '⏳' },
  { label: 'Clients', value: '384', change: '+24', up: true, icon: '👥' },
  { label: 'Produits actifs', value: String(PRODUCTS.length), change: '+3', up: true, icon: '📦' },
  { label: 'Stock faible', value: '4', change: '+1', up: false, icon: '⚠️' },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>
          <p className="text-sm text-gray-500 mt-0.5">Mercredi, 2 Septembre 2026</p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 bg-emerald-700 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-emerald-800 transition-colors"
        >
          <span>+</span>
          Ajouter un produit
        </Link>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {STATS.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xl">{stat.icon}</span>
              <span
                className={`text-xs font-semibold px-1.5 py-0.5 rounded-full ${
                  stat.up ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'
                }`}
              >
                {stat.change}
              </span>
            </div>
            <p className="text-xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Weekly sales area chart */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-semibold text-gray-900">Ventes cette semaine</h2>
              <p className="text-sm text-gray-400">Chiffre d&apos;affaires journalier (DH)</p>
            </div>
            <span className="text-sm font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">
              40 900 DH
            </span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={salesData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#047857" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#047857" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '12px' }}
                formatter={(v: number) => [`${v} DH`, 'Ventes']}
              />
              <Area type="monotone" dataKey="sales" stroke="#047857" strokeWidth={2} fill="url(#salesGrad)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly bar chart */}
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <div className="mb-5">
            <h2 className="font-semibold text-gray-900">Ventes mensuelles</h2>
            <p className="text-sm text-gray-400">7 derniers mois (DH)</p>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={monthlyData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '12px' }}
                formatter={(v: number) => [`${v.toLocaleString()} DH`, 'Ventes']}
              />
              <Bar dataKey="sales" fill="#047857" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recent orders */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
            <h2 className="font-semibold text-gray-900">Commandes récentes</h2>
            <Link href="/admin/orders" className="text-sm text-emerald-700 hover:underline font-medium">
              Voir tout →
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wide">
                  <th className="text-left px-5 py-3 font-medium">Commande</th>
                  <th className="text-left px-5 py-3 font-medium">Client</th>
                  <th className="text-left px-5 py-3 font-medium hidden md:table-cell">Ville</th>
                  <th className="text-right px-5 py-3 font-medium">Total</th>
                  <th className="text-left px-5 py-3 font-medium">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {RECENT_ORDERS.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-3.5 font-mono text-xs text-gray-500">{order.id}</td>
                    <td className="px-5 py-3.5 font-medium text-gray-800">{order.customer}</td>
                    <td className="px-5 py-3.5 text-gray-500 hidden md:table-cell">{order.city}</td>
                    <td className="px-5 py-3.5 text-right font-semibold text-gray-900">{order.total} DH</td>
                    <td className="px-5 py-3.5">
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${STATUS_STYLES[order.status] || 'bg-gray-100 text-gray-600'}`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Categories summary */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
            <h2 className="font-semibold text-gray-900">Catégories</h2>
            <Link href="/admin/categories" className="text-sm text-emerald-700 hover:underline font-medium">
              Gérer →
            </Link>
          </div>
          <ul className="divide-y divide-gray-50">
            {CATEGORIES.map((cat) => (
              <li key={cat.id} className="flex items-center justify-between px-5 py-3 hover:bg-gray-50/50 transition-colors">
                <div className="flex items-center gap-2.5">
                  <span className="text-base">{cat.icon}</span>
                  <span className="text-sm font-medium text-gray-700">{cat.name}</span>
                </div>
                <span className="text-xs text-gray-400 font-medium">{cat.productCount} produits</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
