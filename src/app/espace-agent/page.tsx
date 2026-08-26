import Link from 'next/link';
import { monProfil, monEffectifMensuel } from '@/actions/agent';

const statutLabel: Record<string, string> = {
  PAS_ENCORE: 'Arrivée pointée — départ pas encore enregistré',
  PRESENT: 'Présent (arrivée et départ pointés)',
  ABSENT: 'Absent'
};

export default async function AccueilAgentPage() {
  const { agent, presenceDuJour } = await monProfil();
  const maintenant = new Date();
  const { joursOuvrables, nbPresences, nbAbsences } = await monEffectifMensuel(
    maintenant.getFullYear(),
    maintenant.getMonth()
  );
  const mois = maintenant.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });

  return (
    <div className="space-y-6">
      <div className="bg-white border border-[#DCD6C7] rounded-2xl p-5">
        <h2 className="text-lg font-semibold mb-1">
          Bonjour {agent.prenom} {agent.nom}
        </h2>
        <p className="text-sm text-[#5B6472] mb-4">
          {agent.fonction} · {agent.departement} · Matricule {agent.matricule}
        </p>

        <div className="rounded-xl bg-paper border border-[#DCD6C7] p-4">
          <p className="text-xs uppercase tracking-widest text-[#5B6472] mb-1">Aujourd'hui</p>
          {presenceDuJour ? (
            <>
              <p className="font-semibold">{statutLabel[presenceDuJour.statut]}</p>
              {presenceDuJour.heureArrivee && (
                <p className="text-sm text-[#5B6472]">
                  Arrivée : {new Date(presenceDuJour.heureArrivee).toLocaleTimeString('fr-FR')}
                </p>
              )}
              {presenceDuJour.heureDepart && (
                <p className="text-sm text-[#5B6472]">
                  Départ : {new Date(presenceDuJour.heureDepart).toLocaleTimeString('fr-FR')}
                </p>
              )}
            </>
          ) : (
            <p className="font-semibold text-clay">Aucun pointage enregistré aujourd'hui</p>
          )}
        </div>
      </div>

      <div className="bg-white border border-[#DCD6C7] rounded-2xl p-5">
        <h3 className="font-bold mb-3 capitalize">Résumé du mois — {mois}</h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="rounded-xl bg-paper border border-[#DCD6C7] p-4">
            <p className="text-2xl font-bold">{joursOuvrables}</p>
            <p className="text-xs text-[#5B6472] mt-1">Jours ouvrables</p>
          </div>
          <div className="rounded-xl bg-paper border border-[#DCD6C7] p-4">
            <p className="text-2xl font-bold text-green">{nbPresences}</p>
            <p className="text-xs text-[#5B6472] mt-1">Présences</p>
          </div>
          <div className="rounded-xl bg-paper border border-[#DCD6C7] p-4">
            <p className="text-2xl font-bold text-clay">{nbAbsences}</p>
            <p className="text-xs text-[#5B6472] mt-1">Absences</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link href="/espace-agent/presences" className="bg-white border border-[#DCD6C7] rounded-2xl p-5 hover:border-ink transition">
          <h3 className="font-bold mb-1">Mes présences</h3>
          <p className="text-sm text-[#5B6472]">Historique complet de mes pointages.</p>
        </Link>
        <Link href="/espace-agent/rapport" className="bg-white border border-[#DCD6C7] rounded-2xl p-5 hover:border-ink transition">
          <h3 className="font-bold mb-1">Mon rapport</h3>
          <p className="text-sm text-[#5B6472]">Effectif mensuel : présences et absences.</p>
        </Link>
        <Link href="/espace-agent/carte" className="bg-white border border-[#DCD6C7] rounded-2xl p-5 hover:border-ink transition">
          <h3 className="font-bold mb-1">Ma carte</h3>
          <p className="text-sm text-[#5B6472]">Consulter mon badge QR de présence.</p>
        </Link>
      </div>
    </div>
  );
}
