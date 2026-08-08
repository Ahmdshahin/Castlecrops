const fs = require('fs');

const missingKeysEn = {
  "aboutPage": {
    "certEyebrow": "CERTIFICATIONS",
    "certTitle": "Full Detail",
    "certDesc": "Certified to the highest global standards.",
    "pending": "Pending"
  }
};

const missingKeysAr = {
  "aboutPage": {
    "certEyebrow": "شهادات الجودة",
    "certTitle": "التفاصيل الكاملة",
    "certDesc": "معتمدة بأعلى المعايير العالمية.",
    "pending": "قيد الانتظار"
  }
};

const locales = ['en', 'ar', 'fr', 'tr', 'pl'];

locales.forEach(loc => {
  const file = `messages/${loc}.json`;
  if (fs.existsSync(file)) {
    let data = JSON.parse(fs.readFileSync(file, 'utf8'));
    
    if (loc === 'ar') {
      data.aboutPage = { ...data.aboutPage, ...missingKeysAr.aboutPage };
    } else {
      data.aboutPage = { ...data.aboutPage, ...missingKeysEn.aboutPage };
    }
    
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
    console.log(`Updated ${file}`);
  }
});
