'use client';
import React, { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { CategorieRow } from '@/lib/supabase/types';

interface CatWithCount extends CategorieRow {
  productCount: number;
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<CatWithCount[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const supabase = createClient();
      const [{ data: cats }, { data: prods }] = await Promise.all([
        supabase.from('categories').select('*').order('ordre'),
        supabase.from('produits').select('category_id'),
      ]);
      const counts = new Map<string, number>();
      (prods ?? []).forEach((p: { category_id: string | null }) => {
        if (p.category_id) counts.set(p.category_id, (counts.get(p.category_id) ?? 0) + 1);
      });
      setCategories(((cats as CategorieRow[]) ?? []).map((c) => ({ ...c, productCount: counts.get(c.id) ?? 0 })));
      setLoading(false);
    })();
  }, []);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Catégories</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          {categories.length} catégories — lecture seule (gérées au niveau du catalogue)
        </p>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400">Chargement...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <div key={cat.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="h-28 overflow-hidden relative">
                {cat.image && (
                  <img src={cat.image} alt={cat.nom} className="w-full h-full object-cover" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-semibold text-gray-900">{cat.nom}</h3>
                  <span className="text-xs text-gray-400">{cat.productCount} produits</span>
                </div>
                <p className="text-xs text-gray-400 font-mono">/categories/{cat.slug}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
