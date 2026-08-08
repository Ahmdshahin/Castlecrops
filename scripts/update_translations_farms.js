const fs = require('fs');

const missingKeysEn = {
  "galleryEyebrow": "PHOTO / VIDEO GALLERY",
  "galleryTitle": "Farm imagery + optional video embed",
  "block1Title": "The Heritage of Our Palms",
  "block1Desc": "Nestled in ancient oases, our date palm groves benefit from year-round sunshine and mineral-rich underground aquifers. We cultivate our dates using generations of inherited agricultural wisdom, completely free of artificial pesticides. This meticulous care yields dates of unmatched sweetness, size, and nutritional value.",
  "block2Title": "Sustainable Olive Orchards",
  "block2Desc": "Our olive trees span vast, meticulously maintained orchards rooted in nutrient-dense soil. We employ sustainable irrigation and natural pest control to protect the local ecosystem. Harvested gently by hand, our olives are cold-pressed within hours to preserve their vibrant, peppery flavor and ultra-low acidity.",
  "block3Title": "Purity in Every Drop",
  "block3Desc": "Our state-of-the-art extraction facilities are located directly on the farms, ensuring that olives are cold-pressed within hours of harvesting. This rapid, temperature-controlled process guarantees the lowest possible acidity and locks in the robust, peppery antioxidants that define world-class Extra Virgin Olive Oil."
};

const missingKeysAr = {
  "galleryEyebrow": "معرض الصور والفيديو",
  "galleryTitle": "صور المزرعة + فيديو اختياري",
  "block1Title": "تراث نخيلنا",
  "block1Desc": "تقع مزارع النخيل الخاصة بنا في واحات عريقة، حيث تستفيد من أشعة الشمس على مدار العام والمياه الجوفية الغنية بالمعادن. نزرع تمورنا باستخدام حكمة زراعية متوارثة عبر الأجيال، وخالية تماماً من المبيدات الاصطناعية. هذه العناية الدقيقة تنتج تموراً لا مثيل لها في الحلاوة والحجم والقيمة الغذائية.",
  "block2Title": "بساتين الزيتون المستدامة",
  "block2Desc": "تمتد أشجار الزيتون لدينا في بساتين شاسعة تعتني بها أيادٍ خبيرة في تربة غنية بالعناصر الغذائية. نستخدم أساليب الري المستدامة والمكافحة الطبيعية للآفات لحماية النظام البيئي. تُقطف حبات الزيتون يدوياً بلطف وتُعصر على البارد في غضون ساعات للحفاظ على نكهتها الغنية وحموضتها المنخفضة جداً.",
  "block3Title": "نقاء في كل قطرة",
  "block3Desc": "تقع مرافق الاستخلاص المتطورة لدينا داخل المزارع مباشرة، مما يضمن عصر الزيتون على البارد في غضون ساعات من قطفه. تضمن هذه العملية السريعة والمضبوطة حرارياً الحصول على أقل نسبة حموضة ممكنة، وتحتفظ بمضادات الأكسدة الغنية والنكهة اللاذعة التي تميز زيت الزيتون البكر الممتاز عالمياً."
};

const locales = ['en', 'ar', 'fr', 'tr', 'pl'];

locales.forEach(loc => {
  const file = `messages/${loc}.json`;
  if (fs.existsSync(file)) {
    let data = JSON.parse(fs.readFileSync(file, 'utf8'));
    
    if (!data.farms) data.farms = {};
    
    if (loc === 'ar') {
      data.farms = { ...data.farms, ...missingKeysAr };
    } else {
      data.farms = { ...data.farms, ...missingKeysEn };
    }
    
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
    console.log(`Updated ${file}`);
  }
});
