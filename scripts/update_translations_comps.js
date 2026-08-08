const fs = require('fs');

const missingNavEn = { "brand": "CASTLE CROPS" };
const missingNavAr = { "brand": "كاسل كروبس" };

const missingFormEn = {
  "productSelect": "-- Select Product --",
  "optDates": "Premium Dates",
  "optOlives": "Olives",
  "optOil": "Extra Virgin Olive Oil"
};

const missingFormAr = {
  "productSelect": "-- اختر المنتج --",
  "optDates": "تمور فاخرة",
  "optOlives": "زيتون",
  "optOil": "زيت زيتون بكر ممتاز"
};

const locales = ['en', 'ar', 'fr', 'tr', 'pl'];

locales.forEach(loc => {
  const file = `messages/${loc}.json`;
  if (fs.existsSync(file)) {
    let data = JSON.parse(fs.readFileSync(file, 'utf8'));
    
    if (!data.nav) data.nav = {};
    if (!data.contact) data.contact = {};
    if (!data.contact.form) data.contact.form = {};
    
    if (loc === 'ar') {
      data.nav = { ...data.nav, ...missingNavAr };
      data.contact.form = { ...data.contact.form, ...missingFormAr };
    } else {
      data.nav = { ...data.nav, ...missingNavEn };
      data.contact.form = { ...data.contact.form, ...missingFormEn };
    }
    
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
    console.log(`Updated ${file}`);
  }
});
