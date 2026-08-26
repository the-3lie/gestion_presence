'use client';

import { useEffect, useState } from 'react';
import { monEffectifMensuel } from '@/actions/agent';

export default function MonRapportPage() {
  const [mois, setMois] = useState(() => new Date().toISOString().slice(0, 7));
  const [effectif, setEffectif] = useState<{ joursOuvrables: number; nbPresences: number; nbAbsences: number } | null>(null);

  async function calculer() {
    const [annee, m] = mois.split('-').map(Number);
    setEffectif(await monEffectifMensuel(annee, m - 1));
  }

  useEffect(() => {
    calculer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="bg-white border border-[#DCD6C7] rounded-2xl p-5">
      <div className="flex flex-wrap gap-3 items-end justify-between mb-6">
        <div>
          <label className="block text-xs text-[#5B6472] mb-1">Mois</label>
          <input type="month" value={mois} onChange={(e) => setMois(e.target.value)} className="border border-[#DCD6C7] rounded-lg px-3 py-2" />
        </div>
        <button onClick={calculer} className="px-4 py-2 rounded-lg bg-ink text-paper font-semibold">
          Calculer
        </button>
      </div>

      {effectif && (
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="rounded-xl bg-paper border border-[#DCD6C7] p-4">
            <p className="text-2xl font-bold">{effectif.joursOuvrables}</p>
            <p className="text-xs text-[#5B6472] mt-1">Jours ouvrables</p>
          </div>
          <div className="rounded-xl bg-paper border border-[#DCD6C7] p-4">
            <p className="text-2xl font-bold text-green">{effectif.nbPresences}</p>
            <p className="text-xs text-[#5B6472] mt-1">Présences</p>
          </div>
          <div className="rounded-xl bg-paper border border-[#DCD6C7] p-4">
            <p className="text-2xl font-bold text-clay">{effectif.nbAbsences}</p>
            <p className="text-xs text-[#5B6472] mt-1">Absences</p>
          </div>
        </div>
      )}
    </div>
  );
}
