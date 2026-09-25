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

export interface PromotionRow {
  id: string;
  code: string;
  type: 'pourcentage' | 'montant_fixe';
  valeur: number;
  date_debut: string;
  date_fin: string;
  actif: boolean;
  created_at: string;
}

export interface CommandeRow {
  id: string;
  client_id: string | null;
  statut: 'en_attente' | 'confirmee' | 'en_cours' | 'expediee' | 'livree' | 'annulee';
  total: number;
  adresse: string | null;
  created_at: string;
  clients?: ClientRow | null;
}

export interface ClientRow {
  id: string;
  user_id: string | null;
  nom: string;
  email: string;
  telephone: string | null;
  adresse: string | null;
  created_at: string;
}

export interface SiteSettingsRow {
  id: number;
  nom_boutique: string;
  email: string | null;
  telephone: string | null;
  whatsapp: string | null;
  adresse: string | null;
  instagram_url: string | null;
  frais_livraison: number;
  livraison_gratuite_a_partir: number;
  devise: string;
  hero_title: string;
  hero_subtitle: string;
  cta_text: string;
  sections: {
    featured?: boolean;
    bestsellers?: boolean;
    promo_banner?: boolean;
    brands?: boolean;
    testimonials?: boolean;
    newsletter?: boolean;
  };
  updated_at: string;
}

export interface ServiceRow {
  id: string;
  nom: string;
  slug: string;
  description: string | null;
  image: string | null;
  duree_minutes: number | null;
  prix: number;
  actif: boolean;
  info_complementaire: string | null;
  created_at: string;
  updated_at: string;
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
