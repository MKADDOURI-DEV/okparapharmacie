'use client';
import React, { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { MarqueRow } from '@/lib/supabase/types';

export default function AdminBrandsPage() {
  const [brands, setBrands] = useState<MarqueRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const supabase = createClient();
      const { data } = await supabase.from('marques').select('*').order('nom');
      setBrands((data as MarqueRow[]) ?? []);
      setLoading(false);
    })();
  }, []);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Marques</h1>
        <p className="text-sm text-gray-500 mt-0.5">{brands.length} marques — lecture seule</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wide border-b border-gray-100">
              <th className="text-left px-5 py-3.5 font-medium">Marque</th>
              <th className="text-left px-5 py-3.5 font-medium hidden md:table-cell">Slug</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              <tr><td colSpan={2} className="text-center py-12 text-gray-400">Chargement...</td></tr>
            ) : (
              brands.map((brand) => (
                <tr key={brand.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 flex items-center justify-center text-gray-300">
                        {brand.logo ? <img src={brand.logo} alt={brand.nom} className="w-full h-full object-cover" /> : '🏷️'}
                      </div>
                      <span className="font-semibold text-gray-900">{brand.nom}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-gray-400 font-mono text-xs hidden md:table-cell">{brand.slug}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
