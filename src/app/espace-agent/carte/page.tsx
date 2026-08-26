import { maCarte } from '@/actions/agent';
import { monProfil } from '@/actions/agent';

export default async function MaCartePage() {
  const carte = await maCarte();
  const { agent } = await monProfil();

  return (
    <div className="bg-white border border-[#DCD6C7] rounded-2xl p-5 flex flex-col items-center text-center">
      <h2 className="text-lg font-semibold mb-1">
        {agent.prenom} {agent.nom}
      </h2>
      <p className="text-sm text-[#5B6472] mb-6">Matricule {agent.matricule}</p>

      {carte ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={carte.imageDataUrl} alt="Badge QR de présence" className="w-64 h-64 border border-[#DCD6C7] rounded-xl p-2 bg-paper" />
          <p className="text-xs text-[#5B6472] mt-4">
            Générée le {new Date(carte.genereeLe).toLocaleDateString('fr-FR')}
          </p>
          <p className="text-sm text-[#5B6472] mt-2 max-w-sm">
            Présentez ce QR code au scanner à votre arrivée et à votre départ.
          </p>
        </>
      ) : (
        <p className="text-sm text-clay py-10">
          Aucune carte n'a encore été générée pour vous. Contactez votre administration.
        </p>
      )}
    </div>
  );
}
