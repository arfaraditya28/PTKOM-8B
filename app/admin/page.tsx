import AdminNavbar from "@/src/components/Admin/NavbarAdmin";
import Dashboard from "@/src/components/Admin/Dashboard";
import Layanan from "@/src/components/Admin/Layanan";
import Laporan from "@/src/components/Admin/Laporan";

const reports = [
  {
    id: "ADU-1024",
    title: "Jalan berlubang di Desa Donomulyo",
    category: "Infrastruktur",
    date: "19 Okt 2026",
    status: "Menunggu",
  },
  {
    id: "ADU-1023",
    title: "Tumpukan sampah di saluran irigasi",
    category: "Lingkungan",
    date: "18 Okt 2026",
    status: "Diproses",
  },
  {
    id: "ADU-1022",
    title: "Lampu jalan tidak menyala",
    category: "Fasilitas Umum",
    date: "18 Okt 2026",
    status: "Diproses",
  },
  {
    id: "ADU-1021",
    title: "Perbaikan jalan lingkungan",
    category: "Infrastruktur",
    date: "17 Okt 2026",
    status: "Selesai",
  },
];

function SectionTitle({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div>
      <h2 className="text-base font-bold text-slate-800">{title}</h2>
      {description && (
        <p className="mt-1 text-xs text-slate-500">{description}</p>
      )}
    </div>
  );
}

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-[#F5F7FB] text-slate-800">
      
    {/* NAVBAR HORIZONTAL */}
    <AdminNavbar />

    {/* KONTEN DASHBOARD */}
    <div className="mx-auto w-full max-w-[1440px] space-y-6 px-6 py-8 md:px-10 md:py-10 lg:px-12">
        <Dashboard />


        {/* Layanan */}
        <div className="mt-6">
          <Layanan />
        </div>

        {/* Tabel laporan */}
        <Laporan />
        
      </div>
    </main>
  );
}
