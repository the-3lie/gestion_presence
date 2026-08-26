'use client';

import { useEffect, useState } from 'react';
import { mesPresences } from '@/actions/agent';

const statutLabel: Record<string, string> = {
  PAS_ENCORE: 'En cours',
  PRESENT: 'Présent',
  ABSENT: 'Absent'
};

export default function MesPresencesPage() {
  const [presences, setPresences] = useState<any[]>([]);
  const [du, setDu] = useState('');
  const [au, setAu] = useState('');
  const [chargement, setChargement] = useState(true);

  async function rechercher() {
    setChargement(true);
    setPresences(await mesPresences({ du, au }));
    setChargement(false);
  }

  useEffect(() => {
    rechercher();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="bg-white border border-[#DCD6C7] rounded-2xl p-5">
      <div className="flex flex-wrap gap-3 items-end mb-4">
        <div>
          <label className="block text-xs text-[#5B6472] mb-1">Période du</label>
          <input type="date" value={du} onChange={(e) => setDu(e.target.value)} className="border border-[#DCD6C7] rounded-lg px-3 py-2" />
        </div>
        <div>
          <label className="block text-xs text-[#5B6472] mb-1">Au</label>
          <input type="date" value={au} onChange={(e) => setAu(e.target.value)} className="border border-[#DCD6C7] rounded-lg px-3 py-2" />
        </div>
        <button onClick={rechercher} className="px-4 py-2 rounded-lg bg-ink text-paper font-semibold">
          Filtrer
        </button>
      </div>

      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-xs uppercase text-[#5B6472] border-b-2 border-ink">
            <th className="py-2">Date</th>
            <th>Heure d'arrivée</th>
            <th>Heure de départ</th>
            <th>Statut</th>
          </tr>
        </thead>
        <tbody>
          {presences.map((p) => (
            <tr key={p.id} className="border-b border-[#DCD6C7]">
              <td className="py-2">{new Date(p.date).toLocaleDateString('fr-FR')}</td>
              <td>{p.heureArrivee ? new Date(p.heureArrivee).toLocaleTimeString('fr-FR') : '—'}</td>
              <td>{p.heureDepart ? new Date(p.heureDepart).toLocaleTimeString('fr-FR') : '—'}</td>
              <td>{statutLabel[p.statut]}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {!chargement && presences.length === 0 && (
        <p className="text-center text-sm text-[#5B6472] py-10">Aucun pointage trouvé sur cette période.</p>
      )}
    </div>
  );
}
