import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import MenuAgent from '@/components/MenuAgent';
import Horloge from '@/components/Horloge';

export default async function EspaceAgentLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/login');
  if ((session.user as any)?.role !== 'AGENT') redirect('/');

  return (
    <div className="min-h-screen bg-paper">
      <header className="bg-ink text-paper px-6 py-4 flex items-center justify-between border-b-2 border-amber">
        <div>
          <p className="text-xs uppercase tracking-widest text-amber font-semibold">Pointage numérique</p>
          <h1 className="text-xl font-bold">Espace Agent</h1>
        </div>
        <Horloge />
      </header>

      <MenuAgent />

      <main className="p-6 max-w-4xl mx-auto">{children}</main>
    </div>
  );
}
