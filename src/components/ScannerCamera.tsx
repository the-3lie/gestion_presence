'use client';

import { useRef, useState } from 'react';
import jsQR from 'jsqr';
import { enregistrerScan } from '@/actions/presences';

const COOLDOWN_MS = 8000;

export default function ScannerCamera() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const loopRef = useRef<number | null>(null);
  const dernierScanRef = useRef<{ code: string; ts: number } | null>(null);

  const [actif, setActif] = useState(false);
  const [resultat, setResultat] = useState<{ ok: boolean; titre: string; sous: string } | null>(null);

  async function demarrer() {
    try {
      if (!canvasRef.current) canvasRef.current = document.createElement('canvas');
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setActif(true);
      boucle();
    } catch {
      setResultat({ ok: false, titre: 'Caméra indisponible', sous: 'Autorisez l’accès caméra ou utilisez le pointage manuel' });
    }
  }

  function arreter() {
    if (loopRef.current) cancelAnimationFrame(loopRef.current);
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setActif(false);
  }

  function boucle() {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (video && canvas && video.readyState === video.HAVE_ENOUGH_DATA) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const image = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(image.data, image.width, image.height, { inversionAttempts: 'dontInvert' });
      if (code?.data) {
        traiterCode(code.data.trim());
      }
    }
    loopRef.current = requestAnimationFrame(boucle);
  }

  async function traiterCode(code: string) {
    const now = Date.now();
    const dernier = dernierScanRef.current;
    if (dernier && dernier.code === code && now - dernier.ts < COOLDOWN_MS) return;
    dernierScanRef.current = { code, ts: now };

    const res = await enregistrerScan(code);
    if (res.success) {
      const heure = new Date(res.heure).toLocaleTimeString('fr-FR');
      setResultat({
        ok: true,
        titre: res.agentNom,
        sous: `${res.type === 'ARRIVEE' ? 'Arrivée' : 'Départ'} enregistrée à ${heure}`
      });
    } else {
      setResultat({ ok: false, titre: 'Badge non reconnu', sous: res.message || '' });
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
      <div className="bg-ink rounded-2xl p-4">
        <p className="text-xs uppercase tracking-widest text-amber font-semibold px-2 pb-2">Caméra</p>
        <div className="relative aspect-[4/3] bg-black rounded-xl overflow-hidden">
          <video ref={videoRef} muted playsInline className="w-full h-full object-cover" />
          {!actif && (
            <div className="absolute inset-0 flex items-center justify-center text-center text-sm text-white/60 px-6">
              Appuyez sur « Démarrer la caméra » pour activer le scanner
            </div>
          )}
        </div>
        <div className="flex gap-2 pt-3">
          {!actif ? (
            <button onClick={demarrer} className="flex-1 bg-white text-ink rounded-lg py-2.5 font-semibold">
              Démarrer la caméra
            </button>
          ) : (
            <button onClick={arreter} className="flex-1 bg-clay text-white rounded-lg py-2.5 font-semibold">
              Arrêter
            </button>
          )}
        </div>
      </div>

      <div>
        <div className={`rounded-xl p-4 flex items-center gap-3 ${resultat?.ok ? 'bg-[#E7F1EA]' : 'bg-[#EDE9DE]'}`}>
          <div className={`w-2.5 h-2.5 rounded-full ${resultat?.ok ? 'bg-green' : 'bg-[#DCD6C7]'}`} />
          <div>
            <p className="font-bold text-sm">{resultat?.titre || 'En attente…'}</p>
            <p className="text-xs text-[#5B6472]">{resultat?.sous || 'Présentez un badge devant la caméra'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
