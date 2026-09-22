import { PrismaClient, ReportStatus } from "@prisma/client";
import { hashPassword } from "../src/lib/auth";
import { buildReportNumber, buildTrackingCode } from "../src/lib/reportMeta";

const prisma = new PrismaClient();

async function main() {
  // --- Users (internal) ---
  const adminPassword = await hashPassword("admin123");
  const petugasPassword = await hashPassword("petugas123");

  const admin = await prisma.user.upsert({
    where: { username: "admin" },
    update: {},
    create: {
      name: "Administrator",
      username: "admin",
      password: adminPassword,
      role: "ADMIN",
    },
  });

  await prisma.user.upsert({
    where: { username: "petugas01" },
    update: {},
    create: {
      name: "Petugas Sekampung",
      username: "petugas01",
      password: petugasPassword,
      role: "PETUGAS",
    },
  });

  // --- Categories ---
  const categories = [
    { name: "Infrastruktur", description: "Jalan, jembatan, drainase, penerangan jalan." },
    { name: "Kebersihan", description: "Sampah, lingkungan, sanitasi." },
    { name: "Administrasi", description: "KTP, KK, surat keterangan, perizinan." },
    { name: "Keamanan", description: "Keamanan lingkungan, ketertiban umum." },
    { name: "Kesehatan", description: "Puskesmas, posyandu, layanan kesehatan." },
    { name: "Pendidikan", description: "Sekolah, PAUD, sarana pendidikan." },
  ];
  for (const c of categories) {
    await prisma.category.upsert({
      where: { name: c.name },
      update: { description: c.description },
      create: c,
    });
  }

  // --- Contoh laporan (demo tracking) ---
  const existing = await prisma.report.count();
  if (existing === 0) {
    const infra = await prisma.category.findUniqueOrThrow({
      where: { name: "Infrastruktur" },
    });
    const now = new Date();
    const report = await prisma.report.create({
      data: {
        reportNumber: buildReportNumber(now, 1),
        trackingCode: buildTrackingCode(),
        categoryId: infra.id,
        title: "Jalan berlubang di Jl. Raya Sekampung",
        description:
          "Terdapat lubang cukup besar di tengah jalan yang membahayakan pengendara, terutama saat malam hari.",
        location: "Jl. Raya Sekampung No. 100",
        incidentDate: now,
        reporterName: "Warga Contoh",
        reporterContact: "0812-0000-0000",
        status: ReportStatus.DIPROSES,
      },
    });
    await prisma.comment.create({
      data: {
        reportId: report.id,
        userId: admin.id,
        message: "Laporan sedang ditindaklanjuti oleh petugas lapangan.",
      },
    });
    await prisma.statusHistory.createMany({
      data: [
        { reportId: report.id, userId: admin.id, status: ReportStatus.DIAJUKAN },
        {
          reportId: report.id,
          userId: admin.id,
          status: ReportStatus.DIVERIFIKASI,
          note: "Laporan valid, diteruskan ke bidang terkait.",
        },
        {
          reportId: report.id,
          userId: admin.id,
          status: ReportStatus.DIPROSES,
          note: "Petugas lapangan sedang menangani.",
        },
      ],
    });
    console.log(`Contoh laporan: ${report.reportNumber} / ${report.trackingCode}`);
  }

  console.log("Seed selesai. Login: admin/admin123, petugas01/petugas123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
