const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const translations = {
  "premium-medjool-dates": {
    "name": {
      "fr": "Dattes Medjool Premium",
      "pl": "Daktyle Medjool Premium",
      "tr": "Premium Medjool Hurmaları"
    },
    "description": {
      "fr": "Connues comme le \"Roi des Dattes\", nos dattes Medjool sont grandes, moelleuses et ont une riche saveur caramélisée. Parfaites pour la consommation directe ou comme cadeau de choix.",
      "pl": "Znane jako \"Król Daktyli\", nasze daktyle Medjool są duże, miękkie i mają bogaty karmelowy smak. Idealne do bezpośredniego spożycia lub jako prezent premium.",
      "tr": "\"Hurmaların Kralı\" olarak bilinen Medjool hurmalarımız büyük, yumuşak ve zengin karamel benzeri bir tada sahiptir. Doğrudan tüketim veya birinci sınıf hediyeler için mükemmeldir."
    }
  },
  "mabroom-dates": {
    "name": {
      "fr": "Dattes Mabroom",
      "pl": "Daktyle Mabroom",
      "tr": "Mabroom Hurmaları"
    },
    "description": {
      "fr": "Dattes longues et minces avec une texture ferme et moelleuse et une douceur subtile qui laisse une impression durable.",
      "pl": "Długie, smukłe daktyle o twardej, żuwalnej konsystencji i subtelnej słodyczy, która pozostawia niezatarte wrażenie.",
      "tr": "Sert, çiğnenebilir bir dokuya ve kalıcı bir etki bırakan hafif bir tatlılığa sahip uzun, ince hurmalar."
    }
  },
  "kalamata-olives": {
    "name": {
      "fr": "Olives Kalamata",
      "pl": "Oliwki Kalamata",
      "tr": "Kalamata Zeytinleri"
    },
    "description": {
      "fr": "Olives Kalamata sombres, riches et charnues, conservées dans une saumure traditionnelle. Cueillies à la main pour la meilleure qualité.",
      "pl": "Ciemne, bogate i mięsiste oliwki Kalamata zakonserwowane w tradycyjnej solance. Zbierane ręcznie dla najwyższej jakości.",
      "tr": "Geleneksel salamurada korunmuş koyu, zengin ve etli Kalamata zeytinleri. En yüksek kalite için elle toplanmıştır."
    }
  },
  "ajwa-dates": {
    "name": {
      "fr": "Dattes Ajwa",
      "pl": "Daktyle Ajwa",
      "tr": "Acve Hurmaları"
    },
    "description": {
      "fr": "Dattes Ajwa authentiques d'Al-Madinah. Distinctivement sombres et rondes avec une texture fine et une saveur légèrement sucrée.",
      "pl": "Autentyczne daktyle Ajwa z Medyny. Wyróżniają się ciemnym kolorem, okrągłym kształtem, delikatną konsystencją i łagodnie słodkim smakiem.",
      "tr": "Medine'den otantik Acve hurmaları. İnce bir dokuya ve hafif tatlı bir tada sahip, belirgin şekilde koyu ve yuvarlaktır."
    }
  },
  "sukkari-dates": {
    "name": {
      "fr": "Dattes Sukkari",
      "pl": "Daktyle Sukkari",
      "tr": "Sukkari Hurmaları"
    },
    "description": {
      "fr": "Dattes dorées et exceptionnellement sucrées qui fondent dans la bouche. Connues sous le nom de \"la douce\".",
      "pl": "Złociste i wyjątkowo słodkie daktyle, które rozpływają się w ustach. Znane jako \"słodkie\".",
      "tr": "Ağzınızda eriyen altın renkli ve son derece tatlı hurmalar. \"Tatlı olan\" olarak bilinir."
    }
  },
  "deglet-nour-dates": {
    "name": {
      "fr": "Dattes Deglet Nour",
      "pl": "Daktyle Deglet Nour",
      "tr": "Deglet Nour Hurmaları"
    },
    "description": {
      "fr": "Dattes semi-sèches avec une texture ferme et une saveur douce et délicate. Souvent appelée la \"Reine de toutes les dattes\".",
      "pl": "Półsuche daktyle o twardej konsystencji i słodkim, delikatnym smaku. Często nazywane \"Królową wszystkich daktyli\".",
      "tr": "Sert bir dokuya ve tatlı, narin bir tada sahip yarı kuru hurmalar. Genellikle \"Tüm hurmaların Kraliçesi\" olarak anılır."
    }
  },
  "green-picholine-olives": {
    "name": {
      "fr": "Olives Vertes Picholine",
      "pl": "Zielone Oliwki Picholine",
      "tr": "Yeşil Picholine Zeytinleri"
    },
    "description": {
      "fr": "Olives vertes croquantes avec une saveur de noisette. Parfaites pour les apéritifs et les salades.",
      "pl": "Chrupiące zielone oliwki o orzechowym smaku. Idealne na przystawki i do sałatek.",
      "tr": "Fındıksı bir tada sahip çıtır yeşil zeytinler. Mezeler ve salatalar için mükemmeldir."
    }
  },
  "black-manzanilla-olives": {
    "name": {
      "fr": "Olives Noires Manzanilla",
      "pl": "Czarne Oliwki Manzanilla",
      "tr": "Siyah Manzanilla Zeytinleri"
    },
    "description": {
      "fr": "Olives noires lisses et douces, dénoyautées et prêtes à être utilisées dans vos créations culinaires préférées.",
      "pl": "Gładkie i łagodne czarne oliwki, wydrylowane i gotowe do użycia w Twoich ulubionych kreacjach kulinarnych.",
      "tr": "En sevdiğiniz mutfak kreasyonlarında kullanılmaya hazır, pürüzsüz ve hafif siyah zeytinler, çekirdeksiz."
    }
  },
  "extra-virgin-olive-oil": {
    "name": {
      "fr": "Huile d'Olive Extra Vierge",
      "pl": "Oliwa z Oliwek Extra Virgin",
      "tr": "Natürel Sızma Zeytinyağı"
    },
    "description": {
      "fr": "Pressée à froid dans les heures suivant la récolte pour garantir une acidité maximale < 0,8%. Arôme riche et fruité avec une finale poivrée.",
      "pl": "Tłoczona na zimno w ciągu kilku godzin od zbioru, aby zapewnić maksymalną kwasowość < 0,8%. Bogaty, owocowy aromat z pieprznym finiszem.",
      "tr": "Maksimum %0.8 asitliği sağlamak için hasattan sonraki saatler içinde soğuk sıkılır. Biberli bir bitişe sahip zengin, meyveli aroma."
    }
  },
  "stuffed-green-olives": {
    "name": {
      "fr": "Olives Vertes Farcies",
      "pl": "Faszerowane Zielone Oliwki",
      "tr": "Dolgulu Yeşil Zeytinler"
    },
    "description": {
      "fr": "Olives vertes premium généreusement farcies de piment rouge pour un contraste acidulé et doux.",
      "pl": "Premium zielone oliwki hojnie faszerowane czerwoną papryką dla pikantno-słodkiego kontrastu.",
      "tr": "Keskin ve tatlı bir kontrast için kırmızı biberle cömertçe doldurulmuş birinci sınıf yeşil zeytinler."
    }
  },
  "premium-early-harvest-olive-oil": {
    "name": {
      "fr": "Huile d'Olive Premium Récolte Précoce",
      "pl": "Oliwa z Oliwek Wczesnego Zbioru Premium",
      "tr": "Premium Erken Hasat Zeytinyağı"
    },
    "description": {
      "fr": "Fabriquée à partir d'olives vertes non mûres récoltées en début de saison. Exceptionnellement riche en antioxydants avec une saveur robuste et intense.",
      "pl": "Wyprodukowana z niedojrzałych, zielonych oliwek zbieranych na początku sezonu. Wyjątkowo bogata w przeciwutleniacze o intensywnym, mocnym smaku.",
      "tr": "Sezon başında toplanan olgunlaşmamış, yeşil zeytinlerden yapılmıştır. Yoğun, güçlü bir lezzet ile antioksidanlar açısından son derece zengindir."
    }
  },
  "garlic-infused-olive-oil": {
    "name": {
      "fr": "Huile d'Olive Infusée à l'Ail",
      "pl": "Oliwa z Oliwek z Czosnkiem",
      "tr": "Sarımsak Aromalı Zeytinyağı"
    },
    "description": {
      "fr": "Un savoureux mélange d'huile d'olive pure et d'ail rôti. Parfait pour arroser les pâtes, la pizza ou les légumes grillés.",
      "pl": "Pikantna mieszanka czystej oliwy z oliwek i pieczonego czosnku. Idealna do polewania makaronu, pizzy lub grillowanych warzyw.",
      "tr": "Saf zeytinyağı ve kavrulmuş sarımsağın lezzetli bir karışımı. Makarna, pizza veya ızgara sebzelerin üzerine gezdirmek için mükemmeldir."
    }
  },
  "spicy-cracked-green-olives": {
    "name": {
      "fr": "Olives Vertes Concassées Épicées",
      "pl": "Pikantne Zielone Oliwki Rozłupane",
      "tr": "Baharatlı Kırma Yeşil Zeytin"
    },
    "description": {
      "fr": "Olives vertes concassées marinées dans un mélange épicé d'herbes, de piment et d'ail.",
      "pl": "Rozłupane zielone oliwki marynowane w pikantnej mieszance ziół, chili i czosnku.",
      "tr": "Otlar, pul biber ve sarımsaktan oluşan baharatlı bir karışımda marine edilmiş kırma yeşil zeytinler."
    }
  },
  "organic-cold-pressed-olive-oil": {
    "name": {
      "fr": "Huile d'Olive Biologique Pressée à Froid",
      "pl": "Organiczna Oliwa z Oliwek Tłoczona na Zimno",
      "tr": "Organik Soğuk Sıkım Zeytinyağı"
    },
    "description": {
      "fr": "Huile d'olive extra vierge biologique certifiée 100%. Produite sans aucun produit chimique synthétique pour un goût pur et inaltéré.",
      "pl": "W 100% certyfikowana organiczna oliwa z oliwek extra virgin. Wyprodukowana bez żadnych syntetycznych chemikaliów dla czystego, nieskażonego smaku.",
      "tr": "%100 sertifikalı organik natürel sızma zeytinyağı. Saf, katkısız bir tat için hiçbir sentetik kimyasal kullanılmadan üretilmiştir."
    }
  },
  "truffle-infused-olive-oil": {
    "name": {
      "fr": "Huile d'Olive Infusée à la Truffe",
      "pl": "Oliwa z Oliwek z Truflami",
      "tr": "Trüf Mantarı Aromalı Zeytinyağı"
    },
    "description": {
      "fr": "Notre huile d'olive extra vierge premium délicatement infusée de l'arôme terreux et luxueux de truffe blanche.",
      "pl": "Nasza oliwa z oliwek extra virgin premium delikatnie nasycona ziemistym, luksusowym aromatem białych trufli.",
      "tr": "Beyaz trüf mantarının topraksı, lüks aromasıyla özenle demlenmiş birinci sınıf natürel sızma zeytinyağımız."
    }
  }
};

async function run() {
  const { data, error } = await supabase.from('products').select('id, slug, name, description');
  if (error) {
    console.error(error);
    return;
  }
  
  for (const product of data) {
    const translation = translations[product.slug];
    if (translation) {
      const updatedName = { ...product.name, ...translation.name };
      const updatedDesc = { ...product.description, ...translation.description };
      
      const { error: updateError } = await supabase
        .from('products')
        .update({ name: updatedName, description: updatedDesc })
        .eq('id', product.id);
        
      if (updateError) {
        console.error('Error updating ' + product.slug + ':', updateError);
      } else {
        console.log('Successfully translated ' + product.slug);
      }
    }
  }
  console.log('Done!');
}
run();
