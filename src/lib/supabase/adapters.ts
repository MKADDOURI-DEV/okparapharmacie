import { createClient } from '@/lib/supabase/client';
import type { Product, Category, Brand } from '@/lib/mockData';
import type { ProduitRow, CategorieRow, MarqueRow } from '@/lib/supabase/types';

const PLACEHOLDER_IMAGE =
  'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop';

export function produitToProduct(row: ProduitRow): Product {
  const price = row.prix_promo ?? row.prix;
  const oldPrice = row.prix_promo ? row.prix : undefined;
  const discount = oldPrice ? Math.round(((oldPrice - price) / oldPrice) * 100) : undefined;
  const isNew =
    new Date(row.created_at).getTime() > Date.now() - 30 * 24 * 60 * 60 * 1000;

  return {
    id: row.id,
    name: row.nom,
    brand: row.marques?.nom ?? '',
    category: row.categories?.nom ?? '',
    slug: row.slug,
    price,
    oldPrice,
    discount,
    rating: 0,
    reviewCount: 0,
    image: row.images?.[0] ?? PLACEHOLDER_IMAGE,
    images: row.images?.length ? row.images : [PLACEHOLDER_IMAGE],
    inStock: row.stock > 0,
    isNew,
    isBestseller: false,
    isFeatured: false,
    description: row.description ?? undefined,
  };
}

export function categorieToCategory(row: CategorieRow, productCount = 0): Category {
  return {
    id: row.id,
    name: row.nom,
    slug: row.slug,
    image: row.image ?? PLACEHOLDER_IMAGE,
    productCount,
    icon: '✨',
  };
}

export function marqueToBrand(row: MarqueRow): Brand {
  return {
    id: row.id,
    name: row.nom,
    logo: row.logo ?? PLACEHOLDER_IMAGE,
    slug: row.slug,
  };
}

export async function fetchActiveProducts(): Promise<Product[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from('produits')
    .select('*, categories(*), marques(*)')
    .eq('actif', true)
    .order('created_at', { ascending: false });
  return ((data as ProduitRow[]) ?? []).map(produitToProduct);
}

export async function fetchProductBySlug(slug: string): Promise<Product | null> {
  const supabase = createClient();
  const { data } = await supabase
    .from('produits')
    .select('*, categories(*), marques(*)')
    .eq('slug', slug)
    .eq('actif', true)
    .maybeSingle();
  return data ? produitToProduct(data as ProduitRow) : null;
}

export async function fetchCategories(): Promise<Category[]> {
  const supabase = createClient();
  const [{ data: cats }, { data: prods }] = await Promise.all([
    supabase.from('categories').select('*').order('ordre'),
    supabase.from('produits').select('category_id').eq('actif', true),
  ]);
  const counts = new Map<string, number>();
  (prods ?? []).forEach((p: { category_id: string | null }) => {
    if (p.category_id) counts.set(p.category_id, (counts.get(p.category_id) ?? 0) + 1);
  });
  return ((cats as CategorieRow[]) ?? []).map((c) => categorieToCategory(c, counts.get(c.id) ?? 0));
}

export async function fetchBrands(): Promise<Brand[]> {
  const supabase = createClient();
  const { data } = await supabase.from('marques').select('*').order('nom');
  return ((data as MarqueRow[]) ?? []).map(marqueToBrand);
}
