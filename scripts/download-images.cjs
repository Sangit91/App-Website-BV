const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    const protocol = url.startsWith('https') ? https : http;
    protocol.get(url, (response) => {
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        download(response.headers.location, dest).then(resolve).catch(reject);
        return;
      }
      if (response.statusCode !== 200) {
        reject(new Error(`HTTP ${response.statusCode}: ${url}`));
        return;
      }
      response.pipe(file);
      file.on('finish', () => { file.close(); resolve(); });
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

async function updateDbImages() {
  const { getPrisma } = require('../server/db/prisma');

  const doctorImages = {
    'dr-tri': '/images/doctors/dr-tri.jpg',
    'dr-mai': '/images/doctors/dr-mai.jpg',
    'dr-hai': '/images/doctors/dr-hai.jpg',
    'dr-hong': '/images/doctors/dr-hong.jpg',
  };

  const newsImages = {
    'news-1': '/images/news/news-1.jpg',
    'news-2': '/images/news/news-2.jpg',
    'news-3': '/images/news/news-3.jpg',
    'tender-1': '/images/news/tender-1.jpg',
    'tender-2': '/images/news/tender-2.jpg',
    'tender-3': '/images/news/tender-3.jpg',
    'tender-4': '/images/news/tender-4.jpg',
  };

  const prisma = getPrisma();

  try {
    for (const [id, image] of Object.entries(doctorImages)) {
      const updated = await prisma.doctor.updateMany({
        where: { id },
        data: { image },
      });
      console.log(`Doctor ${id}: ${updated.count} updated -> ${image}`);
    }

    for (const [id, image] of Object.entries(newsImages)) {
      const updated = await prisma.news.updateMany({
        where: { id },
        data: { image },
      });
      console.log(`News ${id}: ${updated.count} updated -> ${image}`);
    }

    console.log('\nAll DB image paths updated!');
  } finally {
    await prisma.$disconnect();
  }
}

async function main() {
  const imgDir = path.join(__dirname, '..', 'public', 'images');

  const images = [
    { url: 'https://images.pexels.com/photos/3714743/pexels-photo-3714743.jpeg?auto=compress&cs=tinysrgb&w=600', dest: 'doctors/dr-tri.jpg' },
    { url: 'https://images.pexels.com/photos/4158293/pexels-photo-4158293.jpeg?auto=compress&cs=tinysrgb&w=600', dest: 'doctors/dr-mai.jpg' },
    { url: 'https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=600', dest: 'doctors/dr-hai.jpg' },
    { url: 'https://images.pexels.com/photos/3825189/pexels-photo-3825189.jpeg?auto=compress&cs=tinysrgb&w=600', dest: 'doctors/dr-hong.jpg' },
    { url: 'https://images.pexels.com/photos/4386476/pexels-photo-4386476.jpeg?auto=compress&cs=tinysrgb&w=800', dest: 'news/news-1.jpg' },
    { url: 'https://images.pexels.com/photos/6625841/pexels-photo-6625841.jpeg?auto=compress&cs=tinysrgb&w=800', dest: 'news/news-2.jpg' },
    { url: 'https://images.pexels.com/photos/7088487/pexels-photo-7088487.jpeg?auto=compress&cs=tinysrgb&w=800', dest: 'news/news-3.jpg' },
    { url: 'https://images.pexels.com/photos/60504/security-protection-anti-virus-software-60504.jpeg?auto=compress&cs=tinysrgb&w=800', dest: 'news/tender-1.jpg' },
    { url: 'https://images.pexels.com/photos/4225880/pexels-photo-4225880.jpeg?auto=compress&cs=tinysrgb&w=800', dest: 'news/tender-2.jpg' },
    { url: 'https://images.pexels.com/photos/2280571/pexels-photo-2280571.jpeg?auto=compress&cs=tinysrgb&w=800', dest: 'news/tender-3.jpg' },
    { url: 'https://images.pexels.com/photos/3652103/pexels-photo-3652103.jpeg?auto=compress&cs=tinysrgb&w=800', dest: 'news/tender-4.jpg' },
  ];

  for (const img of images) {
    const dir = path.join(imgDir, path.dirname(img.dest));
    const file = path.join(imgDir, img.dest);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    if (fs.existsSync(file)) {
      console.log(`Skip (exists): ${img.dest}`);
      continue;
    }
    try {
      console.log(`Download: ${img.dest}`);
      await download(img.url, file);
      console.log(`  -> ${file}`);
    } catch (err) {
      console.error(`  FAILED: ${err.message}`);
    }
  }
  console.log('Image download done.\n');

  console.log('Updating DB image paths...');
  await updateDbImages();
}

main().catch(console.error);