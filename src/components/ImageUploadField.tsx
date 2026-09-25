'use client';
import React, { useRef, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

interface ImageUploadFieldProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
}

export default function ImageUploadField({ label, value, onChange }: ImageUploadFieldProps) {
  const supabase = createClient();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (files: FileList | null) => {
    const file = files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const ext = file.name.split('.').pop();
      const path = `${crypto.randomUUID()}.${ext}`;
      const { error: uploadError } = await supabase.storage.from('produits-images').upload(path, file);
      if (uploadError) throw uploadError;
      const { data } = supabase.storage.from('produits-images').getPublicUrl(path);
      onChange(data.publicUrl);
    } catch (err: any) {
      setError("Erreur lors de l'upload: " + err.message);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
      {error && <p className="text-xs text-red-600 mb-1.5">{error}</p>}

      {value ? (
        <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-gray-100 group">
          <img src={value} alt="" className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            title="Retirer"
          >
            ✕
          </button>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center w-24 h-24 border-2 border-dashed border-gray-200 rounded-lg cursor-pointer hover:border-emerald-400 transition-colors">
          <input
            ref={inputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif"
            onChange={(e) => handleUpload(e.target.files)}
            className="hidden"
          />
          {uploading ? (
            <span className="text-xs text-gray-400">Envoi...</span>
          ) : (
            <>
              <span className="text-xl">📷</span>
              <span className="text-[10px] text-gray-400 mt-1">Uploader</span>
            </>
          )}
        </label>
      )}
    </div>
  );
}
