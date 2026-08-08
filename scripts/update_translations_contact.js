const fs = require('fs');

const missingKeysEn = {
  "infoTitle": "Contact Information",
  "waDesc": "For quick inquiries and urgent orders",
  "waCta": "Message",
  "pageDesc": "Request a quote for export shipments."
};

const missingKeysAr = {
  "infoTitle": "معلومات الاتصال",
  "waDesc": "للاستفسارات السريعة والطلبات العاجلة",
  "waCta": "راسلنا",
  "pageDesc": "اطلب عرض سعر لشحنات التصدير."
};

const locales = ['en', 'ar', 'fr', 'tr', 'pl'];

locales.forEach(loc => {
  const file = `messages/${loc}.json`;
  if (fs.existsSync(file)) {
    let data = JSON.parse(fs.readFileSync(file, 'utf8'));
    
    if (!data.contact) data.contact = {};
    
    if (loc === 'ar') {
      data.contact = { ...data.contact, ...missingKeysAr };
    } else {
      data.contact = { ...data.contact, ...missingKeysEn };
    }
    
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
    console.log(`Updated ${file}`);
  }
});
