import NavbarAdmin from "@/src/components/Admin/NavbarAdmin";
import Dashboard from "@/src/components/Admin/Dashboard";
import Laporan from "@/src/components/Admin/Laporan";
import Management from "@/src/components/Admin/Management";
import { SessionProvider } from "@/src/components/Admin/Session";

export default function AdminPage() {
  return <SessionProvider><main className="min-h-screen bg-[#F5F7FB] text-slate-800">
    <NavbarAdmin />
    <div className="mx-auto max-w-[1440px] space-y-6 px-6 py-8">
      <Dashboard /><Laporan /><Management />
    </div>
  </main></SessionProvider>;
}
