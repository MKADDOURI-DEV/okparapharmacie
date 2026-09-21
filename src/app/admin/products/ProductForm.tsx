'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { slugify, type CategorieRow, type MarqueRow, type ProduitRow } from '@/lib/supabase/types';

interface ProductFormProps {
  initialProduct?: ProduitRow;
}

export default function ProductForm({ initialProduct }: ProductFormProps) {
  const router = useRouter();
  const supabase = createClient();
  const isEdit = !!initialProduct;

  const [categories, setCategories] = useState<CategorieRow[]>([]);
  const [marques, setMarques] = useState<MarqueRow[]>([]);

  const [nom, setNom] = useState(initialProduct?.nom ?? '');
  const [slug, setSlug] = useState(initialProduct?.slug ?? '');
  const [slugTouched, setSlugTouched] = useState(isEdit);
  const [description, setDescription] = useState(initialProduct?.description ?? '');
  const [prix, setPrix] = useState(initialProduct?.prix?.toString() ?? '');
  const [prixPromo, setPrixPromo] = useState(initialProduct?.prix_promo?.toString() ?? '');
  const [stock, setStock] = useState(initialProduct?.stock?.toString() ?? '0');
  const [categoryId, setCategoryId] = useState(initialProduct?.category_id ?? '');
  const [marqueId, setMarqueId] = useState(initialProduct?.marque_id ?? '');
  const [actif, setActif] = useState(initialProduct?.actif ?? true);
  const [images, setImages] = useState<string[]>(initialProduct?.images ?? []);

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    (async () => {
      const [{ data: cats }, { data: brs }] = await Promise.all([
        supabase.from('categories').select('*').order('ordre'),
        supabase.from('marques').select('*').order('nom'),
      ]);
      setCategories(cats ?? []);
      setMarques(brs ?? []);
    })();
  }, []);

  const handleNomChange = (value: string) => {
    setNom(value);
    if (!slugTouched) setSlug(slugify(value));
  };

  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    setError(null);
    try {
      const uploaded: string[] = [];
      for (const file of Array.from(files)) {
        const ext = file.name.split('.').pop();
        const path = `${crypto.randomUUID()}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from('produits-images')
          .upload(path, file);
        if (uploadError) throw uploadError;
        const { data } = supabase.storage.from('produits-images').getPublicUrl(path);
        uploaded.push(data.publicUrl);
      }
      setImages((prev) => [...prev, ...uploaded]);
    } catch (err: any) {
      setError("Erreur lors de l'upload: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (url: string) => {
    setImages((prev) => prev.filter((i) => i !== url));
  };

  const handleSave = async () => {
    setError(null);
    if (!nom || !slug || !prix || !categoryId || !marqueId) {
      setError('Merci de remplir les champs obligatoires (*)');
      return;
    }
    setSaving(true);

    const payload = {
      nom,
      slug,
      description: description || null,
      prix: parseFloat(prix),
      prix_promo: prixPromo ? parseFloat(prixPromo) : null,
      stock: parseInt(stock, 10) || 0,
      category_id: categoryId,
      marque_id: marqueId,
      images,
      actif,
      updated_at: new Date().toISOString(),
    };

    const { error: saveError } = isEdit
      ? await supabase.from('produits').update(payload).eq('id', initialProduct!.id)
      : await supabase.from('produits').insert(payload);

    setSaving(false);

    if (saveError) {
      setError('Erreur: ' + saveError.message);
      return;
    }

    setSaved(true);
    setTimeout(() => {
      router.push('/admin/products');
      router.refresh();
    }, 800);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-3">
        <a href="/admin/products" className="text-gray-400 hover:text-gray-600 transition-colors">
          ← Produits
        </a>
        <span className="text-gray-300">/</span>
        <h1 className="text-2xl font-bold text-gray-900">
          {isEdit ? 'Modifier le produit' : 'Ajouter un produit'}
        </h1>
      </div>

      {error && (
        <div className="text-sm bg-red-50 text-red-600 px-4 py-3 rounded-lg">{error}</div>
      )}

      {/* Basic info */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
        <h2 className="font-semibold text-gray-900">Informations générales</h2>
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Nom du produit *</label>
            <input
              value={nom}
              onChange={(e) => handleNomChange(e.target.value)}
              placeholder="Ex: Nettoyant Hydratant CeraVe 473ml"
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Slug URL *</label>
            <input
              value={slug}
              onChange={(e) => { setSlug(slugify(e.target.value)); setSlugTouched(true); }}
              placeholder="cerave-nettoyant-hydratant"
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Catégorie *</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white"
              >
                <option value="">Sélectionner...</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.nom}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Marque *</label>
              <select
                value={marqueId}
                onChange={(e) => setMarqueId(e.target.value)}
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white"
              >
                <option value="">Sélectionner...</option>
                {marques.map((b) => (
                  <option key={b.id} value={b.id}>{b.nom}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description détaillée du produit..."
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 resize-none"
            />
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
        <h2 className="font-semibold text-gray-900">Prix & Stock</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Prix (DH) *</label>
            <input
              type="number" step="0.01"
              value={prix}
              onChange={(e) => setPrix(e.target.value)}
              placeholder="129"
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Prix promo (DH)</label>
            <input
              type="number" step="0.01"
              value={prixPromo}
              onChange={(e) => setPrixPromo(e.target.value)}
              placeholder="99"
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Stock *</label>
            <input
              type="number"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              placeholder="50"
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>
        </div>
      </div>

      {/* Images */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
        <h2 className="font-semibold text-gray-900">Images du produit</h2>
        {images.length > 0 && (
          <div className="grid grid-cols-4 gap-3">
            {images.map((url) => (
              <div key={url} className="relative group aspect-square rounded-lg overflow-hidden bg-gray-100">
                <img src={url} alt="" className="w-full h-full object-cover" />
                <button
                  onClick={() => removeImage(url)}
                  className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/60 text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
        <label className="block border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-emerald-400 transition-colors cursor-pointer">
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif"
            multiple
            onChange={(e) => handleUpload(e.target.files)}
            className="hidden"
          />
          <div className="text-3xl mb-2">📷</div>
          <p className="text-sm font-medium text-gray-600">
            {uploading ? 'Upload en cours...' : 'Cliquer pour uploader'}
          </p>
          <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP jusqu&apos;à 5MB — plusieurs images acceptées</p>
        </label>
      </div>

      {/* Status */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <label className="flex items-center gap-2 cursor-pointer w-fit">
          <input
            type="checkbox"
            checked={actif}
            onChange={(e) => setActif(e.target.checked)}
            className="w-4 h-4 accent-emerald-700"
          />
          <span className="text-sm text-gray-700 font-medium">Produit actif (visible sur le site)</span>
        </label>
      </div>

      <div className="flex justify-end gap-3">
        <a href="/admin/products" className="px-5 py-2.5 text-sm font-medium border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
          Annuler
        </a>
        <button
          onClick={handleSave}
          disabled={saving || uploading}
          className={`px-6 py-2.5 text-sm font-medium rounded-lg transition-all disabled:opacity-50 ${
            saved ? 'bg-emerald-100 text-emerald-700' : 'bg-emerald-700 text-white hover:bg-emerald-800'
          }`}
        >
          {saved ? '✓ Produit enregistré' : saving ? 'Enregistrement...' : 'Enregistrer le produit'}
        </button>
      </div>
    </div>
  );
}
