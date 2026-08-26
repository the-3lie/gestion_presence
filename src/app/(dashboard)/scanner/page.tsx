'use client';

import { useEffect, useState } from 'react';
import ScannerCamera from '@/components/ScannerCamera';
import { rechercherAgents } from '@/actions/personnel';
import { enregistrerScan } from '@/actions/presences';

export default function ScannerPage() {
  const [agents, setAgents] = useState<any[]>([]);
  const [choix, setChoix] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    rechercherAgents('').then(setAgents);
  }, []);

  async function pointageManuel() {
    const agent = agents.find((a) => a.id === choix);
    if (!agent || !agent.qrToken) {
      setMessage("Cet agent n'a pas encore de badge généré (module Cartes Présence).");
      return;
    }
    const res = await enregistrerScan(agent.qrToken);
    setMessage(res.success ? `Pointage enregistré pour ${res.agentNom}.` : res.message || 'Erreur');
  }

  return (
    <div className="space-y-6">
      <ScannerCamera />

      <div className="bg-white border border-[#DCD6C7] rounded-2xl p-5 max-w-md">
        <h3 className="font-bold text-sm text-[#5B6472] mb-3">Pointage manuel</h3>
        <select
          value={choix}
          onChange={(e) => setChoix(e.target.value)}
          className="w-full border border-[#DCD6C7] rounded-lg px-3 py-2 mb-3"
        >
          <option value="">— Choisir un agent —</option>
          {agents.map((a) => (
            <option key={a.id} value={a.id}>
              {a.prenom} {a.nom} ({a.matricule})
            </option>
          ))}
        </select>
        <button onClick={pointageManuel} className="w-full border border-[#DCD6C7] rounded-lg py-2.5 font-semibold hover:border-ink">
          Enregistrer le pointage
        </button>
        {message && <p className="text-sm text-[#5B6472] mt-3">{message}</p>}
        <p className="text-xs text-[#5B6472] mt-2">À utiliser si la caméra n'est pas disponible sur cet appareil.</p>
      </div>
    </div>
  );
}
