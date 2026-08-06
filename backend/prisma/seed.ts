import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("admin123", 10);

  await prisma.user.upsert({
    where: { email: "admin@desabawu.id" },
    update: {},
    create: {
      name: "Administrator",
      email: "admin@desabawu.id",
      password: passwordHash,
      isActive: true,
    },
  });

  const visi = {
    title: "Visi",
    content:
      "Terwujudnya Pemerintahan desa yang Akuntabilitas, Sumber daya manusia berkualitas dan pemerataan pembangunan",
  };
  await prisma.page.upsert({
    where: { pageKey: "HOME_VISI" },
    update: visi,
    create: { pageKey: "HOME_VISI", ...visi },
  });

  const misi = {
    title: "Misi",
    content:
      "1. Menyelenggarakan Pemerintahan yang transparan, akuntabilitas, partisipatif dan responsive.\n2.	Meningkatkan dan memberdayakan pertanian, pendidikan, dan berbagai kegiatan masyarakat.\n3.	Membangun sarana dan prasarana transportasi guna kelancaran kegiatan ekonomi produktif.\n4.	Meningkatkan dan melestarikan kelembagaan yang ada di desa, baik pertanian, kesehatan, sosial, keagamaan dan kegiatan lain yang ada di desa. ",
  };
  await prisma.page.upsert({
    where: { pageKey: "HOME_MISI" },
    update: misi,
    create: { pageKey: "HOME_MISI", ...misi },
  });

  const sejarah = {
    title: "Sejarah Desa Bawu",
    content: "Sejarah Desa Bawu.",
  };
  await prisma.page.upsert({
    where: { pageKey: "SEJARAH" },
    update: sejarah,
    create: { pageKey: "SEJARAH", ...sejarah },
  });

  console.log("Seed completed. Admin login: admin@desabawu.id / admin123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
