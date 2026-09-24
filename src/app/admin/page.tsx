'use client';
import React, { useEffect, useState } from 'react';
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
import { createClient } from '@/lib/supabase/client';
import type { CommandeRow, CategorieRow } from '@/lib/supabase/types';

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
  annulee: 'bg-red-50 text-red-700',
};

const DAY_LABELS = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
const MONTH_LABELS = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];

interface CatWithCount extends CategorieRow {
  productCount: number;
}

export default function AdminDashboard() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    ventesJour: 0,
    commandesTotal: 0,
    enAttente: 0,
    clients: 0,
    produitsActifs: 0,
    stockFaible: 0,
  });
  const [weeklyData, setWeeklyData] = useState<{ day: string; sales: number; orders: number }[]>([]);
  const [monthlyData, setMonthlyData] = useState<{ month: string; sales: number }[]>([]);
  const [recentOrders, setRecentOrders] = useState<CommandeRow[]>([]);
  const [categories, setCategories] = useState<CatWithCount[]>([]);

  useEffect(() => {
    (async () => {
      const [
        { count: commandesTotal },
        { count: enAttente },
        { count: clientsCount },
        { count: produitsActifs },
        { data: stockData },
        { data: allCommandes },
        { data: recent },
        { data: cats },
        { data: prods },
      ] = await Promise.all([
        supabase.from('commandes').select('id', { count: 'exact', head: true }),
        supabase.from('commandes').select('id', { count: 'exact', head: true }).eq('statut', 'en_attente'),
        supabase.from('clients').select('id', { count: 'exact', head: true }),
        supabase.from('produits').select('id', { count: 'exact', head: true }).eq('actif', true),
        supabase.from('produits').select('id').gt('stock', 0).lte('stock', 5),
        supabase.from('commandes').select('total, created_at, statut'),
        supabase.from('commandes').select('*, clients(*)').order('created_at', { ascending: false }).limit(5),
        supabase.from('categories').select('*').order('ordre'),
        supabase.from('produits').select('category_id'),
      ]);

      // Today sales
      const today = new Date().toDateString();
      const ventesJour = (allCommandes ?? [])
        .filter((c: { created_at: string }) => new Date(c.created_at).toDateString() === today)
        .reduce((sum: number, c: { total: number }) => sum + Number(c.total), 0);

      // Weekly (last 7 days)
      const weekly: { day: string; sales: number; orders: number }[] = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dayCommandes = (allCommandes ?? []).filter(
          (c: { created_at: string }) => new Date(c.created_at).toDateString() === d.toDateString()
        );
        weekly.push({
          day: DAY_LABELS[d.getDay()],
          sales: dayCommandes.reduce((s: number, c: { total: number }) => s + Number(c.total), 0),
          orders: dayCommandes.length,
        });
      }

      // Monthly (last 7 months)
      const monthly: { month: string; sales: number }[] = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setMonth(d.getMonth() - i);
        const monthCommandes = (allCommandes ?? []).filter((c: { created_at: string }) => {
          const cd = new Date(c.created_at);
          return cd.getMonth() === d.getMonth() && cd.getFullYear() === d.getFullYear();
        });
        monthly.push({
          month: MONTH_LABELS[d.getMonth()],
          sales: monthCommandes.reduce((s: number, c: { total: number }) => s + Number(c.total), 0),
        });
      }

      const counts = new Map<string, number>();
      (prods ?? []).forEach((p: { category_id: string | null }) => {
        if (p.category_id) counts.set(p.category_id, (counts.get(p.category_id) ?? 0) + 1);
      });

      setStats({
        ventesJour,
        commandesTotal: commandesTotal ?? 0,
        enAttente: enAttente ?? 0,
        clients: clientsCount ?? 0,
        produitsActifs: produitsActifs ?? 0,
        stockFaible: stockData?.length ?? 0,
      });
      setWeeklyData(weekly);
      setMonthlyData(monthly);
      setRecentOrders((recent as CommandeRow[]) ?? []);
      setCategories(((cats as CategorieRow[]) ?? []).map((c) => ({ ...c, productCount: counts.get(c.id) ?? 0 })));
      setLoading(false);
    })();
  }, []);

  const STATS = [
    { label: 'Ventes du jour', value: `${stats.ventesJour} DH`, icon: '💰' },
    { label: 'Commandes totales', value: String(stats.commandesTotal), icon: '🛒' },
    { label: 'En attente', value: String(stats.enAttente), icon: '⏳' },
    { label: 'Clients', value: String(stats.clients), icon: '👥' },
    { label: 'Produits actifs', value: String(stats.produitsActifs), icon: '📦' },
    { label: 'Stock faible', value: String(stats.stockFaible), icon: '⚠️' },
  ];

  const weekTotal = weeklyData.reduce((s, d) => s + d.sales, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 bg-emerald-700 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-emerald-800 transition-colors"
        >
          <span>+</span>
          Ajouter un produit
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400">Chargement...</div>
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            {STATS.map((stat) => (
              <div key={stat.label} className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xl">{stat.icon}</span>
                </div>
                <p className="text-xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="font-semibold text-gray-900">Ventes cette semaine</h2>
                  <p className="text-sm text-gray-400">Chiffre d&apos;affaires journalier (DH)</p>
                </div>
                <span className="text-sm font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">
                  {weekTotal} DH
                </span>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={weeklyData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
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

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
                <h2 className="font-semibold text-gray-900">Commandes récentes</h2>
                <Link href="/admin/orders" className="text-sm text-emerald-700 hover:underline font-medium">
                  Voir tout →
                </Link>
              </div>
              {recentOrders.length === 0 ? (
                <div className="text-center py-10 text-gray-400 text-sm">Aucune commande pour le moment</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wide">
                        <th className="text-left px-5 py-3 font-medium">Commande</th>
                        <th className="text-left px-5 py-3 font-medium">Client</th>
                        <th className="text-right px-5 py-3 font-medium">Total</th>
                        <th className="text-left px-5 py-3 font-medium">Statut</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {recentOrders.map((order) => (
                        <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-5 py-3.5 font-mono text-xs text-gray-500">#{order.id.slice(0, 8).toUpperCase()}</td>
                          <td className="px-5 py-3.5 font-medium text-gray-800">{order.clients?.nom ?? '—'}</td>
                          <td className="px-5 py-3.5 text-right font-semibold text-gray-900">{order.total} DH</td>
                          <td className="px-5 py-3.5">
                            <span className={`text-xs font-medium px-2 py-1 rounded-full ${STATUS_STYLES[order.statut] || 'bg-gray-100 text-gray-600'}`}>
                              {STATUS_LABEL[order.statut]}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
                <h2 className="font-semibold text-gray-900">Catégories</h2>
                <Link href="/admin/categories" className="text-sm text-emerald-700 hover:underline font-medium">
                  Gérer →
                </Link>
              </div>
              <ul className="divide-y divide-gray-50">
                {categories.map((cat) => (
                  <li key={cat.id} className="flex items-center justify-between px-5 py-3 hover:bg-gray-50/50 transition-colors">
                    <span className="text-sm font-medium text-gray-700">{cat.nom}</span>
                    <span className="text-xs text-gray-400 font-medium">{cat.productCount} produits</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
