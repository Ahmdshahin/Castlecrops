const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
  console.log("Seeding database...");

  // Seed Products
  const products = [
    // --- DATES ---
    {
      slug: 'premium-medjool-dates',
      category: 'dates',
      name: { en: 'Premium Medjool Dates', ar: 'تمور المجهول الفاخرة' },
      description: { 
        en: 'Known as the "King of Dates", our Medjool dates are large, soft, and have a rich caramel-like flavor. Perfect for direct consumption or premium gifting.', 
        ar: 'تُعرف باسم "ملك التمور"، تمور المجهول لدينا كبيرة وناعمة ولها نكهة غنية تشبه الكراميل. مثالية للاستهلاك المباشر أو الإهداء الفاخر.' 
      },
      image_url: '/images/products/branded_dates.jpg',
      packaging_options: ['500g Box', '1kg Box', '5kg Bulk'],
      is_featured: true,
      sort_order: 1
    },
    {
      slug: 'ajwa-dates',
      category: 'dates',
      name: { en: 'Ajwa Dates', ar: 'تمور العجوة' },
      description: { 
        en: 'Authentic Ajwa dates from Al-Madinah. Distinctively dark and round with a fine texture and mildly sweet flavor.', 
        ar: 'تمور العجوة الأصيلة من المدينة المنورة. تتميز بلونها الداكن وشكلها الدائري وقوامها الناعم ونكهتها المعتدلة الحلاوة.' 
      },
      image_url: '/images/products/ajwa_dates.jpg',
      packaging_options: ['400g Tin', '800g Box'],
      is_featured: false,
      sort_order: 2
    },
    {
      slug: 'sukkari-dates',
      category: 'dates',
      name: { en: 'Sukkari Dates', ar: 'تمور السكري' },
      description: { 
        en: 'Golden and exceptionally sweet dates that melt in your mouth. Known as the "sweet one".', 
        ar: 'تمور ذهبية وحلوة بشكل استثنائي تذوب في الفم. تُعرف بـ "السكري" لحلاوتها.' 
      },
      image_url: '/images/products/sukkari_dates.jpg',
      packaging_options: ['1kg Box', '3kg Carton'],
      is_featured: false,
      sort_order: 3
    },
    {
      slug: 'deglet-nour-dates',
      category: 'dates',
      name: { en: 'Deglet Nour Dates', ar: 'تمور دقلة نور' },
      description: { 
        en: 'Semi-dry dates with a firm texture and a sweet, delicate flavor. Often referred to as the "Queen of all dates".', 
        ar: 'تمور شبه جافة ذات قوام متماسك ونكهة حلوة ورقيقة. يشار إليها غالبًا باسم "ملكة كل التمور".' 
      },
      image_url: '/images/products/deglet_nour_dates.jpg',
      packaging_options: ['500g Pack', '1kg Branch', '5kg Bulk'],
      is_featured: false,
      sort_order: 4
    },
    {
      slug: 'mabroom-dates',
      category: 'dates',
      name: { en: 'Mabroom Dates', ar: 'تمور المبروم' },
      description: { 
        en: 'Long, slender dates with a firm, chewy texture and a subtle sweetness that leaves a lasting impression.', 
        ar: 'تمور طويلة ونحيفة ذات قوام متماسك ومضغي وحلاوة خفيفة تترك انطباعًا دائمًا.' 
      },
      image_url: '/images/products/mabroom_dates.jpg',
      packaging_options: ['1kg Box', '5kg Carton'],
      is_featured: false,
      sort_order: 5
    },

    // --- OLIVES ---
    {
      slug: 'kalamata-olives',
      category: 'olives',
      name: { en: 'Kalamata Olives', ar: 'زيتون كالاماتا' },
      description: { 
        en: 'Dark, rich, and meaty Kalamata olives preserved in a traditional brine. Hand-picked for the highest quality.', 
        ar: 'زيتون كالاماتا الداكن والغني واللحمي محفوظ في محلول ملحي تقليدي. تم قطفه يدويًا لضمان أعلى جودة.' 
      },
      image_url: '/images/products/branded_pickled_olives.jpg',
      packaging_options: ['250g Jar', '1kg Tin', '10kg Pail'],
      is_featured: true,
      sort_order: 6
    },
    {
      slug: 'green-picholine-olives',
      category: 'olives',
      name: { en: 'Green Picholine Olives', ar: 'زيتون بيشولين الأخضر' },
      description: { 
        en: 'Crisp and crunchy green olives with a nutty flavor. Perfect for appetizers and salads.', 
        ar: 'زيتون أخضر هش ومقرمش بنكهة الجوز. مثالي للمقبلات والسلطات.' 
      },
      image_url: '/images/products/green_picholine_olives.jpg',
      packaging_options: ['300g Jar', '2kg Tin'],
      is_featured: false,
      sort_order: 7
    },
    {
      slug: 'black-manzanilla-olives',
      category: 'olives',
      name: { en: 'Black Manzanilla Olives', ar: 'زيتون مانزانيلا الأسود' },
      description: { 
        en: 'Smooth and mild black olives, pitted and ready to be used in your favorite culinary creations.', 
        ar: 'زيتون أسود ناعم وخفيف، منزوع النوى وجاهز للاستخدام في إبداعاتك في الطهي.' 
      },
      image_url: '/images/products/black_manzanilla_olives.jpg',
      packaging_options: ['250g Tin', '5kg Pail'],
      is_featured: false,
      sort_order: 8
    },
    {
      slug: 'stuffed-green-olives',
      category: 'olives',
      name: { en: 'Stuffed Green Olives', ar: 'زيتون أخضر محشي' },
      description: { 
        en: 'Premium green olives generously stuffed with red pimento for a tangy and sweet contrast.', 
        ar: 'زيتون أخضر فاخر محشو بسخاء بالفلفل الأحمر المخلل للحصول على تباين منعش وحلو.' 
      },
      image_url: '/images/products/stuffed_green_olives.jpg',
      packaging_options: ['350g Jar', '1kg Jar'],
      is_featured: false,
      sort_order: 9
    },
    {
      slug: 'spicy-cracked-green-olives',
      category: 'olives',
      name: { en: 'Spicy Cracked Green Olives', ar: 'زيتون أخضر مكسر حار' },
      description: { 
        en: 'Cracked green olives marinated in a spicy blend of herbs, chili, and garlic.', 
        ar: 'زيتون أخضر مكسر متبل بمزيج حار من الأعشاب والفلفل الحار والثوم.' 
      },
      image_url: '/images/products/spicy_cracked_green_olives.jpg',
      packaging_options: ['500g Jar', '2kg Tin'],
      is_featured: false,
      sort_order: 10
    },

    // --- OLIVE OIL ---
    {
      slug: 'extra-virgin-olive-oil',
      category: 'olive_oil',
      name: { en: 'Extra Virgin Olive Oil', ar: 'زيت زيتون بكر ممتاز' },
      description: { 
        en: 'Cold-pressed within hours of harvest to ensure maximum acidity < 0.8%. Rich, fruity aroma with a peppery finish.', 
        ar: 'معصور على البارد في غضون ساعات من الحصاد لضمان أقصى حموضة <0.8٪. رائحة فواكه غنية مع لمسة فلفل.' 
      },
      image_url: '/images/products/branded_olive_oil.jpg',
      packaging_options: ['500ml Glass', '1L Tin', '5L Tin'],
      is_featured: true,
      sort_order: 11
    },
    {
      slug: 'organic-cold-pressed-olive-oil',
      category: 'olive_oil',
      name: { en: 'Organic Cold-Pressed Olive Oil', ar: 'زيت زيتون عضوي معصور على البارد' },
      description: { 
        en: '100% certified organic extra virgin olive oil. Produced without any synthetic chemicals for a pure, unadulterated taste.', 
        ar: 'زيت زيتون بكر ممتاز عضوي معتمد 100٪. يتم إنتاجه بدون أي مواد كيميائية اصطناعية للحصول على طعم نقي وخالص.' 
      },
      image_url: '/images/products/organic_cold_pressed_olive_oil.jpg',
      packaging_options: ['500ml Glass', '750ml Glass'],
      is_featured: false,
      sort_order: 12
    },
    {
      slug: 'premium-early-harvest-olive-oil',
      category: 'olive_oil',
      name: { en: 'Premium Early Harvest Olive Oil', ar: 'زيت زيتون فاخر قطفة أولى' },
      description: { 
        en: 'Made from unripe, green olives collected at the start of the season. Exceptionally high in antioxidants with an intense robust flavor.', 
        ar: 'مصنوع من الزيتون الأخضر غير الناضج الذي يتم جمعه في بداية الموسم. غني بشكل استثنائي بمضادات الأكسدة بنكهة قوية ومكثفة.' 
      },
      image_url: '/images/products/premium_early_harvest_olive_oil.jpg',
      packaging_options: ['250ml Glass', '500ml Glass'],
      is_featured: false,
      sort_order: 13
    },
    {
      slug: 'truffle-infused-olive-oil',
      category: 'olive_oil',
      name: { en: 'Truffle Infused Olive Oil', ar: 'زيت زيتون بنكهة الكمأة' },
      description: { 
        en: 'Our premium extra virgin olive oil delicately infused with the earthy, luxurious aroma of white truffles.', 
        ar: 'زيت الزيتون البكر الممتاز الفاخر لدينا ممزوج برقة مع رائحة الكمأة البيضاء الترابية الفاخرة.' 
      },
      image_url: '/images/products/olive_oil.jpg', // Fallback to existing beautiful olive oil image
      packaging_options: ['100ml Glass', '250ml Glass'],
      is_featured: false,
      sort_order: 14
    },
    {
      slug: 'garlic-infused-olive-oil',
      category: 'olive_oil',
      name: { en: 'Garlic Infused Olive Oil', ar: 'زيت زيتون بنكهة الثوم' },
      description: { 
        en: 'A savory blend of pure olive oil and roasted garlic. Perfect for drizzling over pasta, pizza, or grilled vegetables.', 
        ar: 'مزيج لذيذ من زيت الزيتون النقي والثوم المحمص. مثالي للرش فوق المعكرونة أو البيتزا أو الخضار المشوية.' 
      },
      image_url: '/images/products/olive_oil_1785661522507.jpg', // Fallback to existing beautiful olive oil image
      packaging_options: ['250ml Glass', '500ml Glass'],
      is_featured: false,
      sort_order: 15
    }
  ];

  for (const p of products) {
    const { error } = await supabase.from('products').upsert(p, { onConflict: 'slug' });
    if (error) console.error("Error inserting product:", error);
    else console.log(`Inserted product: ${p.slug}`);
  }

  // Seed Blog Posts
  const blogPosts = [
    {
      slug: 'the-art-of-date-harvesting',
      title: { en: 'The Art of Date Harvesting', ar: 'فن حصاد التمور' },
      excerpt: { 
        en: 'Discover how we preserve generations of tradition while employing modern sustainable farming techniques in our date palm groves.', 
        ar: 'اكتشف كيف نحافظ على التقاليد المتوارثة عبر الأجيال مع توظيف تقنيات الزراعة المستدامة الحديثة في بساتين النخيل الخاصة بنا.' 
      },
      body: { 
        en: '# The Harvest Season\n\nEvery year as autumn approaches, the date palms reach their peak... \n\nWe hand-pick our dates to ensure they aren\'t bruised.', 
        ar: '# موسم الحصاد\n\nكل عام مع اقتراب الخريف، تصل أشجار النخيل إلى ذروتها... \n\nنحن نقطف التمور يدويًا لضمان عدم إصابتها بأذى.' 
      },
      status: 'published',
      published_at: new Date().toISOString()
    },
    {
      slug: 'why-extra-virgin-matters',
      title: { en: 'Why "Extra Virgin" Matters', ar: 'لماذا "البكر الممتاز" مهم' },
      excerpt: { 
        en: 'Not all olive oils are created equal. Learn what makes Extra Virgin Olive Oil the gold standard for health and taste.', 
        ar: 'ليست كل زيوت الزيتون متساوية. تعرف على ما يجعل زيت الزيتون البكر الممتاز المعيار الذهبي للصحة والذوق.' 
      },
      body: { 
        en: '# The Golden Rules\n\nAcidity is the key metric. Extra virgin must be under 0.8%...', 
        ar: '# القواعد الذهبية\n\nالحموضة هي المقياس الرئيسي. يجب أن يكون البكر الممتاز أقل من 0.8٪...' 
      },
      status: 'published',
      published_at: new Date().toISOString()
    }
  ];

  for (const b of blogPosts) {
    const { error } = await supabase.from('blog_posts').upsert(b, { onConflict: 'slug' });
    if (error) console.error("Error inserting blog post:", error);
    else console.log(`Inserted blog post: ${b.slug}`);
  }

  // Seed RFQs
  const rfqs = [
    {
      name: 'John Doe',
      company: 'Global Import Co.',
      phone: '+1 555-1234',
      email: 'john@globalimport.com',
      product: 'premium-medjool-dates',
      quantity: '5 Pallets',
      message: 'Looking for a regular supplier for Medjool dates into Europe.',
      locale: 'en',
      status: 'new'
    },
    {
      name: 'Amir Al-Maktoum',
      company: 'Emirates Dist.',
      phone: '+971 50 123 4567',
      email: 'amir@emiratesdist.com',
      product: 'extra-virgin-olive-oil',
      quantity: '1000 Liters',
      message: 'نحن مهتمون بشراء كميات كبيرة من زيت الزيتون.',
      locale: 'ar',
      status: 'new'
    }
  ];

  for (const rfq of rfqs) {
    const { error } = await supabase.from('rfq_submissions').insert(rfq);
    if (error) console.error("Error inserting RFQ:", error);
    else console.log(`Inserted RFQ for ${rfq.name}`);
  }

  console.log("Seeding complete!");
}

seed();
