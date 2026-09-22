'use client';
import React, { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { PromotionRow } from '@/lib/supabase/types';

function computeStatus(promo: PromotionRow): 'a_venir' | 'actif' | 'termine' {
  const now = new Date();
  const start = new Date(promo.date_debut);
  const end = new Date(promo.date_fin);
  if (now < start) return 'a_venir';
  if (now > end) return 'termine';
  return 'actif';
}

const STATUS_LABEL: Record<string, string> = {
  a_venir: 'À venir',
  actif: 'Actif',
  termine: 'Terminée',
};

const STATUS_STYLE: Record<string, string> = {
  a_venir: 'bg-blue-50 text-blue-700',
  actif: 'bg-emerald-50 text-emerald-700',
  termine: 'bg-gray-100 text-gray-500',
};

export default function AdminPromotionsPage() {
  const [promos, setPromos] = useState<PromotionRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const supabase = createClient();
      const { data } = await supabase.from('promotions').select('*').order('date_debut', { ascending: false });
      setPromos((data as PromotionRow[]) ?? []);
      setLoading(false);
    })();
  }, []);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Promotions</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          {promos.length} promotions — lecture seule, statut automatique selon les dates
        </p>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400">Chargement...</div>
      ) : promos.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-12 text-center text-gray-400">
          <div className="text-3xl mb-2">🏷️</div>
          Aucune promotion pour le moment
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {promos.map((promo) => {
            const status = computeStatus(promo);
            return (
              <div key={promo.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900 font-mono">{promo.code}</h3>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {new Date(promo.date_debut).toLocaleDateString('fr-FR')} → {new Date(promo.date_fin).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${STATUS_STYLE[status]}`}>
                    {STATUS_LABEL[status]}
                  </span>
                </div>
                <div>
                  <p className="text-2xl font-bold text-emerald-700">
                    -{promo.valeur}{promo.type === 'pourcentage' ? '%' : ' DH'}
                  </p>
                  <p className="text-xs text-gray-400">
                    {promo.type === 'pourcentage' ? 'Réduction en pourcentage' : 'Montant fixe'}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
