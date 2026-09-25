'use client';
import React, { useEffect, useState } from 'react';
import Providers from '@/components/Providers';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import { createClient } from '@/lib/supabase/client';
import type { ServiceRow, SiteSettingsRow } from '@/lib/supabase/types';

const DEFAULT_CONTACT = { telephone: '+212600000000', whatsapp: '+212600000000' };

export default function ServicesPage() {
  const [services, setServices] = useState<ServiceRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [contact, setContact] = useState(DEFAULT_CONTACT);

  useEffect(() => {
    const supabase = createClient();
    Promise.all([
      supabase.from('services').select('*').eq('actif', true).order('created_at', { ascending: false }),
      supabase.from('site_settings').select('telephone, whatsapp').eq('id', 1).maybeSingle(),
    ]).then(([servicesRes, settingsRes]) => {
      setServices((servicesRes.data as ServiceRow[]) ?? []);
      const s = settingsRes.data as Pick<SiteSettingsRow, 'telephone' | 'whatsapp'> | null;
      if (s) {
        setContact({
          telephone: s.telephone || DEFAULT_CONTACT.telephone,
          whatsapp: s.whatsapp || DEFAULT_CONTACT.whatsapp,
        });
      }
      setLoading(false);
    });
  }, []);

  const waLink = (service: ServiceRow) => {
    const msg = encodeURIComponent(
      `Bonjour OK Parapharmacie! Je souhaite réserver le service "${service.nom}" (${service.prix} DH). Merci de me proposer un créneau disponible.`
    );
    return `https://wa.me/${contact.whatsapp.replace(/[^0-9]/g, '')}?text=${msg}`;
  };
  const telLink = `tel:${contact.telephone.replace(/\s/g, '')}`;

  return (
    <Providers>
      <CartDrawer />
      <Header />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="inline-block text-xs font-semibold tracking-wide text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full mb-3">
            SERVICES & SOINS
          </span>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            Nos soins et services en pharmacie
          </h1>
          <p className="text-gray-500">
            Réservez votre créneau par téléphone ou WhatsApp — notre équipe vous confirme la disponibilité.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-16 text-gray-400">Chargement...</div>
        ) : services.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <div className="text-4xl mb-3">🧴</div>
            <p>Aucun service disponible pour le moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <div key={service.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
                <div className="h-40 bg-gray-100 overflow-hidden">
                  {service.image ? (
                    <img src={service.image} alt={service.nom} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl text-gray-300">🧴</div>
                  )}
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <h2 className="font-display font-semibold text-lg text-gray-900 mb-1">{service.nom}</h2>
                  {service.description && (
                    <p className="text-sm text-gray-500 mb-3 line-clamp-3">{service.description}</p>
                  )}
                  <div className="flex items-center gap-3 text-xs text-gray-400 mb-4">
                    {service.duree_minutes && (
                      <span className="flex items-center gap-1">⏱ {service.duree_minutes} min</span>
                    )}
                  </div>
                  {service.info_complementaire && (
                    <p className="text-xs text-gray-400 mb-4 italic">{service.info_complementaire}</p>
                  )}
                  <div className="mt-auto space-y-3">
                    <p className="text-2xl font-bold text-emerald-700">{service.prix} DH</p>
                    <div className="flex gap-2">
                      <a
                        href={telLink}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 bg-emerald-700 text-white text-sm font-medium px-3 py-2.5 rounded-xl hover:bg-emerald-800 transition-colors"
                      >
                        📞 Appeler
                      </a>
                      <a
                        href={waLink(service)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 inline-flex items-center justify-center gap-1.5 bg-[#25D366] text-white text-sm font-medium px-3 py-2.5 rounded-xl hover:opacity-90 transition-opacity"
                      >
                        💬 WhatsApp
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </Providers>
  );
}
