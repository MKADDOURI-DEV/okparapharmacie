'use client';
import React, { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function AdminProfilePage() {
  const supabase = createClient();
  const [currentEmail, setCurrentEmail] = useState('');

  const [newEmail, setNewEmail] = useState('');
  const [emailSaving, setEmailSaving] = useState(false);
  const [emailMsg, setEmailMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwdSaving, setPwdSaving] = useState(false);
  const [pwdMsg, setPwdMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setCurrentEmail(data.user?.email ?? '');
      setNewEmail(data.user?.email ?? '');
    });
  }, []);

  const handleEmailSave = async () => {
    setEmailMsg(null);
    if (!newEmail || newEmail === currentEmail) return;
    setEmailSaving(true);
    const { error } = await supabase.auth.updateUser({ email: newEmail });
    setEmailSaving(false);
    if (error) {
      setEmailMsg({ type: 'err', text: error.message });
      return;
    }
    setEmailMsg({
      type: 'ok',
      text: 'Un email de confirmation a été envoyé à la nouvelle adresse. Le changement prendra effet après confirmation.',
    });
  };

  const handlePasswordSave = async () => {
    setPwdMsg(null);
    if (newPassword.length < 8) {
      setPwdMsg({ type: 'err', text: 'Le mot de passe doit contenir au moins 8 caractères.' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwdMsg({ type: 'err', text: 'Les mots de passe ne correspondent pas.' });
      return;
    }
    setPwdSaving(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setPwdSaving(false);
    if (error) {
      setPwdMsg({ type: 'err', text: error.message });
      return;
    }
    setPwdMsg({ type: 'ok', text: 'Mot de passe mis à jour avec succès.' });
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Mon profil</h1>
        <p className="text-sm text-gray-500 mt-0.5">Gérez vos identifiants de connexion admin</p>
      </div>

      {/* Email */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
        <h2 className="font-semibold text-gray-900 flex items-center gap-2"><span>📧</span> Adresse email</h2>
        <p className="text-xs text-gray-400">Email actuel : <span className="font-medium text-gray-600">{currentEmail}</span></p>
        {emailMsg && (
          <div className={`text-sm px-3 py-2.5 rounded-lg ${emailMsg.type === 'ok' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'}`}>
            {emailMsg.text}
          </div>
        )}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Nouvel email</label>
          <input
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
        </div>
        <button
          onClick={handleEmailSave}
          disabled={emailSaving || !newEmail || newEmail === currentEmail}
          className="px-5 py-2.5 text-sm font-medium bg-emerald-700 text-white rounded-lg hover:bg-emerald-800 disabled:opacity-50 transition-colors"
        >
          {emailSaving ? 'Envoi...' : "Changer l'email"}
        </button>
      </div>

      {/* Password */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
        <h2 className="font-semibold text-gray-900 flex items-center gap-2"><span>🔒</span> Mot de passe</h2>
        {pwdMsg && (
          <div className={`text-sm px-3 py-2.5 rounded-lg ${pwdMsg.type === 'ok' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'}`}>
            {pwdMsg.text}
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Nouveau mot de passe</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="8 caractères minimum"
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Confirmer le mot de passe</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>
        </div>
        <button
          onClick={handlePasswordSave}
          disabled={pwdSaving || !newPassword}
          className="px-5 py-2.5 text-sm font-medium bg-emerald-700 text-white rounded-lg hover:bg-emerald-800 disabled:opacity-50 transition-colors"
        >
          {pwdSaving ? 'Enregistrement...' : 'Changer le mot de passe'}
        </button>
      </div>
    </div>
  );
}
