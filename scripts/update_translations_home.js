const fs = require('fs');

const missingKeysEn = {
  "home": {
    "productsDesc": "Available in bulk and consumer packaging.",
    "datesDesc": "Hand-picked from the finest palms, offering rich flavor and perfect texture.",
    "oliveOilDesc": "100% natural, extracted directly from pristine olives.",
    "olivesDesc": "Cured to perfection, retaining their firm bite and deep flavor.",
    "viewCatalog": "View Full Catalog",
    "blogEyebrow": "LATEST NEWS",
    "blogTitle": "From The Blog",
    "blogDesc": "Insights, stories, and updates from Castle Crops.",
    "noArticles": "No articles yet",
    "readArticle": "Read Article",
    "viewAllArticles": "View All Articles",
    "marketsDesc": "Exporting to multiple continents with full compliance.",
    "marketsCol1Title": "Global Export",
    "marketsCol1Desc": "We supply wholesale distributors, food manufacturers, and premium retail brands across multiple continents.",
    "eu": "European Union",
    "na": "North America",
    "me": "Middle East & GCC",
    "ap": "Asia Pacific",
    "marketsCol2Title": "Quality Assured",
    "marketsCol2Desc": "Fully compliant with international food safety and import regulations.",
    "contactDesc": "Request a quote for export shipments.",
    "goToContact": "Go to Contact Page"
  }
};

const missingKeysAr = {
  "home": {
    "productsDesc": "متوفرة بكميات تجارية وعبوات استهلاكية.",
    "datesDesc": "مقطوفة يدوياً من أجود النخيل، تقدم نكهة غنية وقوام مثالي.",
    "oliveOilDesc": "طبيعي 100%، مستخلص مباشرة من زيتون نقي.",
    "olivesDesc": "معالج بإتقان، يحتفظ بقوامه المتماسك ونكهته العميقة.",
    "viewCatalog": "عرض الكتالوج الكامل",
    "blogEyebrow": "أحدث الأخبار",
    "blogTitle": "من المدونة",
    "blogDesc": "رؤى وقصص وتحديثات من كاسل كروبس.",
    "noArticles": "لا توجد مقالات بعد",
    "readArticle": "اقرأ المقال",
    "viewAllArticles": "عرض جميع المقالات",
    "marketsDesc": "نصدر لقارات متعددة بتوافق كامل.",
    "marketsCol1Title": "تصدير عالمي",
    "marketsCol1Desc": "نحن نورد لموزعي الجملة ومصنعي الأغذية والعلامات التجارية لقطاع التجزئة المتميز عبر قارات متعددة.",
    "eu": "الاتحاد الأوروبي",
    "na": "أمريكا الشمالية",
    "me": "الشرق الأوسط ودول الخليج",
    "ap": "آسيا والمحيط الهادئ",
    "marketsCol2Title": "جودة مضمونة",
    "marketsCol2Desc": "متوافق تماماً مع لوائح استيراد وسلامة الغذاء الدولية.",
    "contactDesc": "اطلب عرض سعر لشحنات التصدير.",
    "goToContact": "الذهاب لصفحة الاتصال"
  }
};

const locales = ['en', 'ar', 'fr', 'tr', 'pl'];

locales.forEach(loc => {
  const file = `messages/${loc}.json`;
  if (fs.existsSync(file)) {
    let data = JSON.parse(fs.readFileSync(file, 'utf8'));
    
    if (loc === 'ar') {
      data.home = { ...data.home, ...missingKeysAr.home };
    } else {
      data.home = { ...data.home, ...missingKeysEn.home };
    }
    
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
    console.log(`Updated ${file}`);
  }
});
