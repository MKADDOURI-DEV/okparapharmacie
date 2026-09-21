'use client';
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type { ProduitRow } from '@/lib/supabase/types';
import ProductForm from '../../ProductForm';

export default function AdminEditProductPage() {
  const params = useParams();
  const [product, setProduct] = useState<ProduitRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    (async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('produits')
        .select('*')
        .eq('id', params.id as string)
        .maybeSingle();
      if (error || !data) {
        setNotFound(true);
      } else {
        setProduct(data as ProduitRow);
      }
      setLoading(false);
    })();
  }, [params.id]);

  if (loading) {
    return <div className="text-center py-12 text-gray-400">Chargement...</div>;
  }
  if (notFound || !product) {
    return <div className="text-center py-12 text-gray-400">Produit introuvable</div>;
  }

  return <ProductForm initialProduct={product} />;
}
