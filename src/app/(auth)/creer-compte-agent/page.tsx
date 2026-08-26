'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { creerCompteAgent } from '@/actions/auth';

export default function CreerCompteAgentPage() {
  const router = useRouter();
  const [message, setMessage] = useState('');
  const [chargement, setChargement] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage('');
    const formData = new FormData(e.currentTarget);

    if (formData.get('password') !== formData.get('confirmation')) {
      setMessage('Les mots de passe ne correspondent pas');
      return;
    }

    setChargement(true);
    const res = await creerCompteAgent(formData);
    setChargement(false);

    if (!res.success) {
      setMessage(res.message || 'Erreur lors de la création du compte');
      return;
    }
    router.push('/login');
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-paper">
      <div className="w-full max-w-sm bg-white border border-[#DCD6C7] rounded-2xl p-8">
        <p className="text-xs uppercase tracking-widest text-[#C6842A] font-semibold mb-1">
          Espace Agent
        </p>
        <h1 className="text-2xl font-bold mb-2">Créer mon compte</h1>
        <p className="text-sm text-[#5B6472] mb-6">
          Utilisez le matricule inscrit sur votre carte de présence pour activer votre accès.
        </p>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-[#5B6472] mb-1">Matricule</label>
            <input name="matricule" required className="w-full border border-[#DCD6C7] rounded-lg px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm text-[#5B6472] mb-1">Mot de passe</label>
            <input name="password" type="password" required className="w-full border border-[#DCD6C7] rounded-lg px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm text-[#5B6472] mb-1">Confirmer le mot de passe</label>
            <input name="confirmation" type="password" required className="w-full border border-[#DCD6C7] rounded-lg px-3 py-2" />
          </div>

          {message && <p className="text-sm text-clay">{message}</p>}

          <button disabled={chargement} className="w-full bg-ink text-paper rounded-lg py-2.5 font-semibold disabled:opacity-50">
            {chargement ? 'Création…' : 'Créer mon compte'}
          </button>
        </form>

        <Link href="/login" className="block mt-4 text-sm text-[#5B6472] hover:text-ink">
          ← Retour à la connexion
        </Link>
      </div>
    </div>
  );
}
