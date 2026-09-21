export interface CategorieRow {
  id: string;
  nom: string;
  slug: string;
  description: string | null;
  image: string | null;
  ordre: number;
  created_at: string;
}

export interface MarqueRow {
  id: string;
  nom: string;
  slug: string;
  logo: string | null;
  created_at: string;
}

export interface ProduitRow {
  id: string;
  nom: string;
  slug: string;
  description: string | null;
  prix: number;
  prix_promo: number | null;
  stock: number;
  category_id: string | null;
  marque_id: string | null;
  images: string[];
  actif: boolean;
  created_at: string;
  updated_at: string;
  categories?: CategorieRow | null;
  marques?: MarqueRow | null;
}

export function slugify(text: string): string {
  return text
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
