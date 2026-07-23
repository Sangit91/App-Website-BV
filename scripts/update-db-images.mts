import { getPrisma } from '../server/db/prisma';

const doctorImages: Record<string, string> = {
  'dr-tri': '/images/doctors/dr-tri.jpg',
  'dr-mai': '/images/doctors/dr-mai.jpg',
  'dr-hai': '/images/doctors/dr-hai.jpg',
  'dr-hong': '/images/doctors/dr-hong.jpg',
};

const newsImages: Record<string, string> = {
  'news-1': '/images/news/news-1.jpg',
  'news-2': '/images/news/news-2.jpg',
  'news-3': '/images/news/news-3.jpg',
  'tender-1': '/images/news/tender-1.jpg',
  'tender-2': '/images/news/tender-2.jpg',
  'tender-3': '/images/news/tender-3.jpg',
  'tender-4': '/images/news/tender-4.jpg',
};

async function main() {
  const prisma = getPrisma();

  console.log('Updating doctor images...');
  for (const [id, image] of Object.entries(doctorImages)) {
    const updated = await prisma.doctor.updateMany({
      where: { id },
      data: { image },
    });
    console.log(`  Doctor ${id}: ${updated.count} row(s) -> ${image}`);
  }

  console.log('\nUpdating news images...');
  for (const [id, image] of Object.entries(newsImages)) {
    const updated = await prisma.news.updateMany({
      where: { id },
      data: { image },
    });
    console.log(`  News ${id}: ${updated.count} row(s) -> ${image}`);
  }

  console.log('\n✅ All DB image paths updated!');
  await prisma.$disconnect();
}

main().catch(console.error);