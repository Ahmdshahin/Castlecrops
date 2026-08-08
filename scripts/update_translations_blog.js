const fs = require('fs');

const missingKeysEn = {
  "eyebrow": "NEWS & BLOG",
  "title": "Latest Updates",
  "desc": "Company news, harvest updates, and industry insights."
};

const missingKeysAr = {
  "eyebrow": "الأخبار والمدونة",
  "title": "آخر التحديثات",
  "desc": "أخبار الشركة، تحديثات الحصاد، ورؤى الصناعة."
};

const locales = ['en', 'ar', 'fr', 'tr', 'pl'];

locales.forEach(loc => {
  const file = `messages/${loc}.json`;
  if (fs.existsSync(file)) {
    let data = JSON.parse(fs.readFileSync(file, 'utf8'));
    
    if (!data.blogPage) data.blogPage = {};
    
    if (loc === 'ar') {
      data.blogPage = { ...data.blogPage, ...missingKeysAr };
    } else {
      data.blogPage = { ...data.blogPage, ...missingKeysEn };
    }
    
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
    console.log(`Updated ${file}`);
  }
});
