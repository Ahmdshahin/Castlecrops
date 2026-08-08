import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const postsTranslations = {
  "5d4aee02-9243-475e-8a3e-35577e9789a7": {
    title: {
      fr: "La merveille de la fermentation : Les olives, du Coran à la santé intestinale",
      pl: "Cud fermentacji: Oliwki, od Koranu do zdrowia jelit",
      tr: "Fermantasyon Mucizesi: Kuran'dan Bağırsak Sağlığına Zeytin"
    },
    excerpt: {
      fr: "Par le figuier et l'olivier. Découvrez la signification divine de l'olive et son impact incroyable sur le microbiome humain.",
      pl: "Na figę i oliwkę. Odkryj boskie znaczenie owocu oliwki i jego niesamowity wpływ na ludzki mikrobiom.",
      tr: "İncire ve zeytine andolsun. Zeytin meyvesinin ilahi önemini ve insan mikrobiyomu üzerindeki inanılmaz etkisini keşfedin."
    },
    body: {
      fr: "# Le Serment Divin\n\nLe Coran ouvre littéralement un chapitre entier en jurant par ce fruit : \"Par le figuier et l'olivier\" (Sourate At-Tin). Ce serment divin élève le fruit de l'olivier à un statut d'importance suprême, exhortant l'humanité à réfléchir à son immense valeur et à ses propriétés holistiques.\n\n# La Connexion au Microbiome\n\nLes olives crues sont intensément amères, mais l'ancien processus naturel de saumurage et de fermentation les transforme en un concentré de nutriments. La biologie moderne révèle que ce processus de fermentation naturelle cultive des bactéries bénéfiques appelées Lactobacillus. La consommation d'olives correctement marinées introduit ces puissants probiotiques dans le système digestif, renforçant le microbiome intestinal, améliorant l'absorption des nutriments et stimulant considérablement le système immunitaire. Le serment divin par l'olivier met en évidence une vérité profonde sur la santé humaine que la science commence à peine à cartographier pleinement.",
      pl: "# Boska Przysięga\n\nKoran dosłownie otwiera cały rozdział przysięgając na ten owoc: \"Na figę i oliwkę\" (Sura At-Tin). Ta boska przysięga podnosi owoc oliwki do statusu najwyższej wagi, zachęcając ludzkość do refleksji nad jego ogromną wartością i holistycznymi właściwościami.\n\n# Połączenie z Mikrobiomem\n\nSurowe oliwki są intensywnie gorzkie, ale starożytny, naturalny proces dojrzewania i fermentacji w solance przekształca je w potężne źródło składników odżywczych. Współczesna biologia ujawnia, że ten naturalny proces fermentacji kultywuje pożyteczne bakterie Lactobacillus. Spożywanie odpowiednio marynowanych oliwek wprowadza te silne probiotyki do układu trawiennego, wzmacniając mikrobiom jelitowy, poprawiając wchłanianie składników odżywczych i drastycznie pobudzając układ odpornościowy. Boska przysięga na oliwkę podkreśla głęboką prawdę o ludzkim zdrowiu, którą nauka dopiero zaczyna w pełni odkrywać.",
      tr: "# İlahi Yemin\n\nKuran tam bir bölüme kelimenin tam anlamıyla bu meyveye yemin ederek başlar: \"İncire ve zeytine andolsun\" (Tin Suresi). Bu ilahi yemin, zeytin meyvesini en yüksek öneme sahip bir statüye yükseltir ve insanlığı onun muazzam değerini ve bütünsel özelliklerini düşünmeye teşvik eder.\n\n# Mikrobiyom Bağlantısı\n\nÇiğ zeytinler çok acıdır, ancak tuzlu suda salamura etme ve fermantasyonun eski, doğal süreci onları besinsel bir güç merkezine dönüştürür. Modern biyoloji, bu doğal fermantasyon sürecinin faydalı Lactobacillus bakterilerini yetiştirdiğini ortaya koymaktadır. Uygun şekilde salamura edilmiş zeytinleri tüketmek, bu güçlü probiyotikleri sindirim sistemine sokarak bağırsak mikrobiyomunu güçlendirir, besin emilimini artırır ve bağışıklık sistemini büyük ölçüde destekler. Zeytin üzerine edilen ilahi yemin, bilimin henüz tam olarak haritasını çıkarmaya başladığı insan sağlığı hakkındaki derin bir gerçeği vurgulamaktadır."
    }
  },
  "3361829c-d54b-442c-8438-34d4aa9d3092": {
    title: {
      fr: "L'édulcorant naturel : Pourquoi les dattes sont l'avenir de la pâtisserie saine",
      pl: "Naturalny Słodzik: Dlaczego Daktyle są Przyszłością Zdrowych Wypieków",
      tr: "Doğal Tatlandırıcı: Hurmalar Neden Sağlıklı Fırıncılığın Geleceğidir?"
    },
    excerpt: {
      fr: "Apprenez à sublimer vos pâtisseries en remplaçant les sucres raffinés par la douceur riche et caramélisée des dattes naturelles.",
      pl: "Dowiedz się, jak ulepszyć swoje wypieki, zastępując rafinowane cukry bogatą, karmelową słodyczą naturalnych daktyli.",
      tr: "Rafine şekerleri doğal hurmaların zengin, karamel benzeri tatlılığıyla değiştirerek fırıncılığınızı nasıl yükselteceğinizi öğrenin."
    },
    body: {
      fr: "# Une Alternative Plus Saine\n\nAlors que le monde s'éloigne des sucres blancs raffinés, les boulangers soucieux de leur santé se tournent vers le bonbon original de la nature : la datte. Contrairement aux sucres transformés, les dattes offrent une douceur complexe et caramélisée accompagnée d'une importante charge nutritionnelle de fibres alimentaires, de vitamines et de minéraux.\n\n# Polyvalence Culinaire\n\nLa pâte de dattes et le sirop de dattes sont incroyablement polyvalents. Ils ajoutent de l'humidité, une couleur riche et de la profondeur de saveur aux gâteaux, biscuits et barres énergétiques sans les pics de glycémie associés aux édulcorants artificiels. Incorporer des dattes dans vos recettes n'est pas seulement un choix sain, c'est une profonde amélioration culinaire qui ajoute une texture luxueuse à vos pâtisseries.",
      pl: "# Zdrowsza Alternatywa\n\nW miarę jak świat odchodzi od rafinowanych białych cukrów, dbający o zdrowie piekarze zwracają się ku oryginalnym słodyczom natury: daktylom. W przeciwieństwie do przetworzonych cukrów, daktyle zapewniają złożoną, karmelową słodycz w połączeniu ze znacznym ładunkiem odżywczym błonnika, witamin i minerałów.\n\n# Kulinarna Wszechstronność\n\nPasta daktylowa i syrop daktylowy są niezwykle wszechstronne. Dodają wilgoci, bogatego koloru i głębi smaku ciastom, ciasteczkom i batonom energetycznym, nie powodując skoków poziomu cukru we krwi związanych ze sztucznymi słodzikami. Włączenie daktyli do przepisów to nie tylko zdrowy wybór - to głębokie kulinarne ulepszenie, które dodaje luksusowej tekstury twoim wypiekom.",
      tr: "# Daha Sağlıklı Bir Alternatif\n\nDünya rafine beyaz şekerlerden uzaklaştıkça, sağlık bilincine sahip fırıncılar doğanın orijinal şekerine yöneliyor: hurma. İşlenmiş şekerlerin aksine hurmalar, diyet lifi, vitaminler ve minerallerin önemli bir besin yükü eşliğinde karamel benzeri karmaşık bir tatlılık sağlar.\n\n# Mutfakta Çok Yönlülük\n\nHurma ezmesi ve hurma şurubu inanılmaz derecede çok yönlüdür. Keklere, kurabiyelere ve enerji barlarına, yapay tatlandırıcılarla ilişkili kan şekeri artışları olmadan nem, zengin renk ve lezzet derinliği katarlar. Tariflerinize hurma eklemek sadece sağlıklı bir seçim değildir; unlu mamullerinize lüks bir doku katan derin bir mutfak yükseltmesidir."
    }
  },
  "116d28c4-d29d-47b9-aaf2-5e687e9ed0ea": {
    title: {
      fr: "Le miracle des dattes : Science et foi entrelacées",
      pl: "Cud Daktyli: Nauka i Wiara Splecione",
      tr: "Hurma Mucizesi: Bilim ve İnanç İç İçe"
    },
    excerpt: {
      fr: "Explorez comment le statut vénéré des dattes dans la tradition islamique s'aligne parfaitement avec la science nutritionnelle moderne.",
      pl: "Odkryj, jak czczony status daktyli w tradycji islamskiej doskonale współgra z nowoczesną nauką o żywieniu.",
      tr: "Hurmaların İslam geleneğindeki saygın statüsünün modern beslenme bilimiyle nasıl mükemmel bir uyum içinde olduğunu keşfedin."
    },
    body: {
      fr: "# Une Prescription Divine\n\nLes dattes occupent une position profondément sacrée dans la tradition islamique. Mentionnées plus de 20 fois dans le Saint Coran, notamment dans la sourate Maryam où Marie reçut l'ordre de manger des dattes pendant l'accouchement. Le prophète Mahomet (PSL) a également établi la Sunna de rompre le jeûne avec des dattes.\n\n# La Validation Scientifique\n\nLa science moderne a récemment découvert pourquoi ce fruit est si fortement recommandé. Les dattes regorgent de sucres naturels facilement digestibles (glucose et fructose) qui reconstituent instantanément les niveaux d'énergie après des heures de jeûne. De plus, leur teneur élevée en fibres régule la digestion, empêchant les pics de glycémie, tandis que leur concentration dense en potassium soutient la santé cardiaque et la fonction musculaire. En effet, la science confirme maintenant ce que la foi enseigne depuis des siècles.",
      pl: "# Boska Recepta\n\nDaktyle zajmują głęboko świętą pozycję w tradycji islamskiej. Wspomniane ponad 20 razy w Świętym Koranie, w szczególności w Surze Maryam, gdzie polecono Marii jedzenie daktyli podczas porodu. Prorok Mahomet (PZN) również ustanowił Sunnę przerywania postu daktylami.\n\n# Naukowe Potwierdzenie\n\nWspółczesna nauka niedawno odkryła, dlaczego ten owoc jest tak wysoce polecany. Daktyle są pełne łatwo przyswajalnych naturalnych cukrów (glukozy i fruktozy), które natychmiast uzupełniają poziom energii po godzinach postu. Ponadto wysoka zawartość błonnika reguluje trawienie, zapobiegając skokom cukru we krwi, a gęste stężenie potasu wspiera zdrowie serca i funkcjonowanie mięśni. Rzeczywiście, nauka potwierdza dziś to, czego wiara naucza od wieków.",
      tr: "# İlahi Bir Reçete\n\nHurmalar, İslam geleneğinde son derece kutsal bir konuma sahiptir. Kuran'da 20'den fazla kez bahsedilir; özellikle Meryem Suresi'nde Meryem'e doğum sırasında hurma yemesi emredilmiştir. Muhammed (SAV) Peygamber de orucu hurma ile açma Sünnetini oluşturmuştur.\n\n# Bilimsel Doğrulama\n\nModern bilim, bu meyvenin neden bu kadar çok tavsiye edildiğini son zamanlarda ortaya çıkardı. Hurmalar, saatlerce süren açlıktan sonra enerji seviyelerini anında yenileyen, kolayca sindirilebilen doğal şekerlerle (glikoz ve fruktoz) doludur. Ayrıca, yüksek lif içeriği sindirimi düzenleyerek kan şekeri artışlarını önlerken, yoğun potasyum konsantrasyonu kalp sağlığını ve kas fonksiyonunu destekler. Gerçekten de bilim artık inancın yüzyıllardır öğrettiklerini doğrulamaktadır."
    }
  },
  "ec59a1a3-df26-41b3-92cc-898d55363447": {
    title: {
      fr: "L'Or Liquide : Le secret de longévité méditerranéen",
      pl: "Płynne Złoto: Śródziemnomorski Sekret Długowieczności",
      tr: "Sıvı Altın: Akdeniz'in Uzun Ömür Sırrı"
    },
    excerpt: {
      fr: "Découvrez la science derrière la raison pour laquelle l'huile d'olive extra vierge est largement considérée comme la graisse la plus saine au monde.",
      pl: "Poznaj naukowe podstawy tego, dlaczego oliwa z oliwek Extra Virgin jest powszechnie uważana za najzdrowszy tłuszcz na ziemi.",
      tr: "Sızma Zeytinyağının neden dünyanın en sağlıklı yağı olarak kabul edildiğinin arkasındaki bilimi keşfedin."
    },
    body: {
      fr: "# Le Cœur du Régime\n\nDepuis des décennies, les scientifiques étudient le régime méditerranéen pour comprendre pourquoi les populations de cette région jouissent d'une vie remarquablement longue et saine. Le consensus indéniable pointe vers \"l'Or Liquide\" : l'Huile d'Olive Extra Vierge (HOEV). En tant que source principale de matières grasses dans ce régime, l'HOEV remplace les acides gras trans nocifs et les graisses saturées par des alternatives qui protègent le cœur.\n\n# La Puissance de l'Acide Oléique\n\nL'acide gras prédominant dans l'huile d'olive est l'acide oléique, une graisse monoinsaturée qui constitue jusqu'à 73 % de l'huile. L'acide oléique réduit considérablement l'inflammation et s'est même avéré avoir des effets bénéfiques sur les gènes liés au cancer. Lorsque vous versez une généreuse rasade d'HOEV Castle Crops sur votre salade, vous n'améliorez pas seulement la saveur : vous investissez dans votre santé cellulaire et votre longévité.",
      pl: "# Serce Diety\n\nOd dziesięcioleci naukowcy badają dietę śródziemnomorską, aby zrozumieć, dlaczego populacje w tym regionie cieszą się niezwykle długim, zdrowym życiem. Niezaprzeczalny konsensus wskazuje na \"Płynne Złoto\": Oliwę z Oliwek Extra Virgin (EVOO). Będąc głównym źródłem tłuszczu w tej diecie, EVOO zastępuje szkodliwe tłuszcze trans i tłuszcze nasycone alternatywami chroniącymi serce.\n\n# Moc Kwasu Oleinowego\n\nDominującym kwasem tłuszczowym w oliwie z oliwek jest kwas oleinowy, jednonienasycony tłuszcz, który stanowi do 73% oleju. Kwas oleinowy drastycznie zmniejsza stan zapalny, a nawet wykazano, że ma korzystny wpływ na geny związane z rakiem. Kiedy wylewasz solidną porcję EVOO Castle Crops na sałatkę, nie tylko poprawiasz smak - inwestujesz w swoje zdrowie komórkowe i długowieczność.",
      tr: "# Diyetin Kalbi\n\nOn yıllar boyunca bilim insanları, bu bölgedeki nüfusların neden oldukça uzun ve sağlıklı bir yaşam sürdüğünü anlamak için Akdeniz diyetini incelediler. İnkar edilemez fikir birliği \"Sıvı Altın\"a işaret ediyor: Sızma Zeytinyağı (EVOO). Bu diyetteki birincil yağ kaynağı olan EVOO, zararlı trans yağları ve doymuş yağları kalbi koruyan alternatiflerle değiştirir.\n\n# Oleik Asidin Gücü\n\nZeytinyağındaki baskın yağ asidi, yağın %73'üne kadarını oluşturan tekli doymamış bir yağ olan oleik asittir. Oleik asit iltihabı büyük ölçüde azaltır ve hatta kanserle bağlantılı genler üzerinde faydalı etkileri olduğu gösterilmiştir. Salatanıza bol miktarda Castle Crops EVOO döktüğünüzde sadece lezzeti artırmakla kalmıyor, hücresel sağlığınıza ve uzun ömürlülüğünüze yatırım yapmış oluyorsunuz."
    }
  },
  "898e5e53-a7b6-4795-a7d9-f72398c3f602": {
    title: {
      fr: "L'Arbre Béni : L'huile d'olive dans la religion et la science moderne",
      pl: "Błogosławione Drzewo: Oliwa z oliwek w religii i współczesnej nauce",
      tr: "Mübarek Ağaç: Dinde ve Modern Bilimde Zeytinyağı"
    },
    excerpt: {
      fr: "De \"l'Arbre Béni\" de la sourate An-Nur au régime méditerranéen, découvrez les avantages holistiques de l'huile d'olive extra vierge.",
      pl: "Od \"Błogosławionego Drzewa\" w Surze An-Nur po dietę śródziemnomorską, odkryj holistyczne korzyści płynące z oliwy z oliwek z pierwszego tłoczenia.",
      tr: "Nur Suresi'ndeki \"Mübarek Ağaç\"tan Akdeniz diyetine, Sızma Zeytinyağının bütünsel faydalarını keşfedin."
    },
    body: {
      fr: "# La Lumière des Cieux\n\nDans la sourate An-Nur, Allah décrit Sa lumière en utilisant la métaphore de l'huile d'un « arbre béni, l'olivier, qui n'est ni de l'Orient ni de l'Occident, dont l'huile semble éclairer sans même que le feu la touche. » L'olivier est profondément vénéré comme source de pureté, de lumière et de guérison dans les textes religieux.\n\n# L'Élixir de Vie\n\nScientifiquement, l'huile d'olive extra vierge est la pierre angulaire du régime méditerranéen, excellent pour le cœur. Elle est extraordinairement riche en graisses monoinsaturées, en particulier en acide oléique, qui réduit l'inflammation et protège contre les maladies cardiaques. De plus, elle contient un antioxydant puissant appelé *oléocanthal*, dont les scientifiques ont découvert qu'il imite les effets des médicaments anti-inflammatoires comme l'ibuprofène. La bénédiction spirituelle de l'olive se reflète vivement dans ses profonds bienfaits biologiques.",
      pl: "# Światło Niebios\n\nW Surze An-Nur, Allah opisuje Swoje światło, używając metafory oliwy z „błogosławionego drzewa oliwnego, ani ze wschodu, ani z zachodu, którego oliwa niemalże świeci, choćby jej ogień nie dotknął”. Oliwka jest głęboko czczona jako źródło czystości, światła i uzdrowienia w tekstach religijnych.\n\n# Eliksir Życia\n\nZ naukowego punktu widzenia, oliwa z oliwek najwyższej jakości z pierwszego tłoczenia jest podstawą zdrowej dla serca diety śródziemnomorskiej. Jest niezwykle bogata w jednonienasycone kwasy tłuszczowe, a zwłaszcza w kwas oleinowy, który łagodzi stany zapalne i chroni przed chorobami serca. Co więcej, zawiera silny przeciwutleniacz o nazwie *oleokantal*, o którym naukowcy odkryli, że naśladuje działanie leków przeciwzapalnych, takich jak ibuprofen. Duchowe błogosławieństwo oliwki żywo odzwierciedla się w jej głębokich korzyściach biologicznych.",
      tr: "# Göklerin Nuru\n\nNur Suresi'nde Allah, nurunu \"ne doğuya ne de batıya ait olan mübarek bir zeytin ağacından çıkan, kendisine ateş dokunmasa bile neredeyse ışık verecek olan yağ\" metaforunu kullanarak tarif eder. Zeytin, dini metinlerde saflık, ışık ve şifa kaynağı olarak derinden saygı görür.\n\n# Hayat İksiri\n\nBilimsel olarak Sızma Zeytinyağı, kalp sağlığını destekleyen Akdeniz diyetinin temel taşıdır. İltihabı azaltan ve kalp hastalıklarına karşı koruyan tekli doymamış yağlar, özellikle de oleik asit bakımından olağanüstü zengindir. Ayrıca, bilim insanlarının ibuprofen gibi iltihap önleyici ilaçların etkilerini taklit ettiğini bulduğu *oleokantal* adı verilen güçlü bir antioksidan içerir. Zeytinin ruhani bereketi, derin biyolojik faydalarında canlı bir şekilde kendini göstermektedir."
    }
  },
  "cd9120e8-71e3-46e7-9af6-4c69d84d2ce9": {
    title: {
      fr: "Pourquoi l'Extra Vierge est essentiel",
      pl: "Dlaczego \"Extra Virgin\" ma znaczenie",
      tr: "Neden \"Sızma\" Önemlidir"
    },
    excerpt: {
      fr: "Toutes les huiles d'olive ne se valent pas. Découvrez ce qui fait de l'huile d'olive extra vierge la référence absolue en matière de santé et de goût.",
      pl: "Nie wszystkie oliwy z oliwek są takie same. Dowiedz się, co sprawia, że oliwa z oliwek Extra Virgin jest złotym standardem zdrowia i smaku.",
      tr: "Tüm zeytinyağları eşit üretilmez. Sızma Zeytinyağını sağlık ve tat açısından altın standart yapan şeyin ne olduğunu öğrenin."
    },
    body: {
      fr: "# Les Règles d'Or\n\nL'acidité est la mesure clé. L'extra vierge doit avoir une acidité inférieure à 0,8 %, indiquant que l'huile a été pressée à partir d'olives de haute qualité sans aucun défaut. C'est l'essence même de l'olive dans sa forme la plus pure.\n\n# Au-delà de l'Étiquette\n\nPour vraiment apprécier l'Extra Vierge, vous devez comprendre son profil antioxydant. Plus l'acidité est faible, plus les composés phytochimiques précieux sont conservés. L'HOEV de Castle Crops garantit non seulement un goût supérieur, mais aussi les pleins bienfaits pour la santé associés au régime méditerranéen.",
      pl: "# Złote Zasady\n\nKwasowość jest kluczowym wskaźnikiem. Oliwa Extra virgin musi mieć kwasowość poniżej 0,8%, co wskazuje, że została wyciśnięta z wysokiej jakości oliwek bez żadnych defektów. To esencja oliwki w najczystszej postaci.\n\n# Poza Etykietą\n\nAby w pełni docenić Extra Virgin, musisz zrozumieć jej profil przeciwutleniający. Im niższa kwasowość, tym więcej zachowanych jest cennych fitochemikaliów. Oliwa EVOO od Castle Crops zapewnia nie tylko doskonały smak, ale także pełne korzyści zdrowotne związane z dietą śródziemnomorską.",
      tr: "# Altın Kurallar\n\nAsitlik temel ölçüttür. Sızma zeytinyağının asitlik oranı %0,8'in altında olmalıdır; bu, yağın hiçbir kusuru olmayan yüksek kaliteli zeytinlerden sıkıldığını gösterir. Zeytinin en saf halindeki özüdür.\n\n# Etiketin Ötesinde\n\nSızma zeytinyağını gerçekten takdir etmek için antioksidan profilini anlamanız gerekir. Asitlik ne kadar düşükse, o kadar değerli fitokimyasallar korunur. Castle Crops EVOO, sadece üstün tat değil, aynı zamanda Akdeniz diyetiyle ilişkili tam sağlık yararlarını da garanti eder."
    }
  },
  "15ad35c6-5e59-4d4d-a8c1-cd64d8c5411f": {
    title: {
      fr: "De l'oasis à la table : Le voyage de la datte Medjool",
      pl: "Z oazy na stół: Podróż daktyla Medjool",
      tr: "Vahadan Sofraya: Medjool Hurmasının Yolculuğu"
    },
    excerpt: {
      fr: "Découvrez le voyage minutieux de nos dattes Medjool, des oasis gorgées de soleil à votre table à manger.",
      pl: "Odkryj skrupulatną podróż naszych daktyli Medjool, od zalanych słońcem oaz po Twój stół.",
      tr: "Güneşin kavurduğu vahalardan sofranıza, Medjool hurmalarımızın titiz yolculuğunu keşfedin."
    },
    body: {
      fr: "# Les Origines de l'Oasis\n\nNos dattes Medjool commencent leur voyage dans les anciennes oasis gorgées de soleil où le climat est parfaitement équilibré pour la culture des palmiers. Le secret de leur taille et de leur douceur inégalées réside dans les aquifères souterrains riches en minéraux qui nourrissent les racines toute l'année.\n\n# Un Contrôle Qualité Intransigeant\n\nChaque datte est récoltée à la main au moment précis de sa maturité parfaite. Elles sont ensuite soigneusement triées par taille, texture et couleur dans nos installations de pointe. Ce contrôle de qualité rigoureux garantit que seules les dattes absolues, sans imperfections, se retrouvent dans nos emballages de luxe, arrivant sur votre table comme un véritable mets délicat.",
      pl: "# Korzenie w Oazie\n\nNasze daktyle Medjool rozpoczynają swoją podróż w starożytnych, skąpanych w słońcu oazach, gdzie klimat jest idealnie zrównoważony dla uprawy palm. Sekretem ich niezrównanego rozmiaru i słodyczy są bogate w minerały podziemne warstwy wodonośne, które odżywiają korzenie przez cały rok.\n\n# Bezkompromisowa Kontrola Jakości\n\nKażdy daktyl jest zbierany ręcznie w dokładnie określonym momencie idealnej dojrzałości. Następnie są one starannie sortowane według rozmiaru, tekstury i koloru w naszych nowoczesnych obiektach. Ta rygorystyczna kontrola jakości gwarantuje, że do naszych luksusowych opakowań trafiają tylko absolutnie najlepsze, nieskazitelne daktyle, które trafiają na Twój stół jako prawdziwy przysmak.",
      tr: "# Vaha Kökenleri\n\nMedjool hurmalarımız, iklimin palmiye yetiştiriciliği için mükemmel dengelendiği eski, güneşli vahalarda yolculuğuna başlar. Eşsiz boyutlarının ve tatlılıklarının sırrı, kökleri yıl boyunca besleyen mineral bakımından zengin yeraltı akiferlerinde yatmaktadır.\n\n# Tavizsiz Kalite Kontrolü\n\nHer bir hurma, tam olarak ideal olgunluk anında elle hasat edilir. Daha sonra son teknoloji tesislerimizde boyuta, dokuya ve renge göre dikkatlice ayrılırlar. Bu titiz kalite kontrolü, yalnızca kesinlikle en iyi, kusursuz hurmaların lüks ambalajlarımıza girmesini ve sofranıza gerçek bir lezzet olarak ulaşmasını sağlar."
    }
  },
  "345193c1-a6fe-4a8c-bc97-8d5435006ab3": {
    title: {
      fr: "La saumure parfaite : L'art de conserver les olives Kalamata",
      pl: "Idealna solanka: Sztuka konserwowania oliwek Kalamata",
      tr: "Mükemmel Salamura: Kalamata Zeytinlerini Koruma Sanatı"
    },
    excerpt: {
      fr: "Entrez dans le monde traditionnel du traitement des olives, où le temps, le sel marin et la patience créent la bouchée salée parfaite.",
      pl: "Wejdź do tradycyjnego świata dojrzewania oliwek, w którym czas, sól morska i cierpliwość tworzą idealną, pikantną przekąskę.",
      tr: "Zamanın, deniz tuzunun ve sabrın mükemmel lezzetli ısırığı yarattığı zeytin kürlemenin geleneksel dünyasına adım atın."
    },
    body: {
      fr: "# Une Question de Patience\n\nDirectement cueillie de l'arbre, une olive Kalamata est beaucoup trop amère pour être mangée en raison d'un composé appelé oleuropéine. La magie opère pendant le processus de saumurage. Chez Castle Crops, nous évitons les traitements chimiques industriels, optant plutôt pour la méthode lente et traditionnelle du saumurage naturel. Cela nécessite d'immerger les olives violet foncé, cueillies à la main, dans un mélange d'eau pure et de sel marin pendant plusieurs mois.\n\n# La Transformation des Saveurs\n\nPendant ce lent sommeil, une fermentation naturelle a lieu. L'amertume est doucement extraite, laissant place à un profil aromatique umami complexe, acidulé et riche tout en conservant une texture ferme et charnue. Un filet de vinaigre de vin de première qualité et un filet d'huile d'olive extra vierge complètent la conservation, scellant un goût de pur luxe méditerranéen.",
      pl: "# Kwestia Cierpliwości\n\nProsto z drzewa oliwka Kalamata jest zbyt gorzka do zjedzenia z powodu związku zwanego oleuropeiną. Magia dzieje się podczas procesu dojrzewania. W Castle Crops unikamy przemysłowych obróbek chemicznych ługiem, decydując się zamiast tego na powolną, tradycyjną metodę naturalnego peklowania w solance. Wymaga to zanurzenia ręcznie zebranych, ciemnofioletowych oliwek w mieszance czystej wody i soli morskiej na kilka miesięcy.\n\n# Transformacja Smaku\n\nPodczas tego powolnego snu zachodzi naturalna fermentacja. Gorycz jest delikatnie wyciągana, zastępowana przez złożony, pikantny i bogaty profil smakowy umami przy jednoczesnym zachowaniu jędrnej, mięsistej konsystencji. Odrobina najwyższej jakości octu winnego i polewa z oliwy z oliwek extra virgin dopełniają proces konserwacji, zachowując smak czystego śródziemnomorskiego luksusu.",
      tr: "# Bir Sabır Meselesi\n\nDoğrudan ağaçtan koparılan bir Kalamata zeytini, oleuropein adı verilen bir bileşik nedeniyle yenemeyecek kadar acıdır. Büyü, kürleme işlemi sırasında gerçekleşir. Castle Crops'ta biz endüstriyel kimyasal kostik tedavilerinden kaçınıyor, bunun yerine doğal salamura ile kürlemenin yavaş, geleneksel yöntemini tercih ediyoruz. Bu, elle toplanan koyu mor zeytinlerin birkaç ay boyunca saf su ve deniz tuzu karışımına daldırılmasını gerektirir.\n\n# Lezzet Dönüşümü\n\nBu yavaş uyku sırasında doğal bir fermantasyon gerçekleşir. Acılık yavaşça alınır ve yerini sıkı, etli bir dokuyu korurken karmaşık, keskin ve zengin bir umami lezzet profili alır. Bir miktar birinci sınıf şarap sirkesi ve sızma zeytinyağı sosu, saf Akdeniz lüksünün tadını mühürleyerek koruma sürecini tamamlar."
    }
  },
  "244dee80-dae1-4576-8149-ccaf4e173d45": {
    title: {
      fr: "Un accord parfait : sublimer votre plateau de charcuterie avec des olives de qualité supérieure",
      pl: "Idealne Połączenie: Jak ulepszyć deskę wędlin za pomocą oliwek premium",
      tr: "Eşleştirme Mükemmelliği: Şarküteri Tabağınızı Premium Zeytinlerle Yükseltmek"
    },
    excerpt: {
      fr: "Apprenez à marier parfaitement nos olives marinées artisanales avec des fromages artisanaux et des charcuteries pour votre prochaine réception.",
      pl: "Dowiedz się, jak idealnie połączyć nasze rzemieślnicze marynowane oliwki z rzemieślniczymi serami i wędlinami na kolejne spotkanie.",
      tr: "Bir sonraki toplantınız için zanaatkar salamura zeytinlerimizi zanaatkar peynirler ve kurutulmuş etlerle nasıl mükemmel bir şekilde eşleştireceğinizi öğrenin."
    },
    body: {
      fr: "# La Pièce Maîtresse de la Réception\n\nUn plateau de charcuterie magnifiquement conçu est la marque d'une réception élégante. Bien que les fromages et les viandes occupent souvent le devant de la scène, c'est l'éclat acide et saumuré d'une olive marinée de qualité supérieure qui traverse parfaitement la richesse et nettoie le palais. Les olives Castle Crops sont grandes, fermes et intensément savoureuses, ce qui en fait la pièce maîtresse par excellence.\n\n# Les Accords Parfaits\n\nAssociez nos olives Kalamata sombres et fruitées avec une feta vieillie, friable et piquante ou un fromage bleu audacieux. Leur saveur robuste résiste parfaitement aux saveurs intenses. Pour un contraste visuel saisissant, servez-les avec des olives vert vif farcies aux amandes ou à l'ail. Arrosez légèrement le plateau entier avec notre huile d'olive extra vierge et servez avec du pain artisanal chaud pour créer une expérience culinaire de luxe vraiment inoubliable pour vos invités.",
      pl: "# Centralny Punkt Przyjęcia\n\nPięknie przygotowana deska wędlin to wizytówka eleganckiego gospodarza. Chociaż sery i wędliny często zajmują centralne miejsce, to właśnie kwaskowaty, słony smak oliwki marynowanej premium idealnie przełamuje bogactwo potraw i oczyszcza podniebienie. Oliwki Castle Crops są duże, jędrne i niezwykle aromatyczne, co czyni je ostatecznym punktem centralnym.\n\n# Idealne Dopasowania\n\nPołącz nasze ciemne, owocowe oliwki Kalamata z ostrym, kruchym starzonym serem feta lub wyrazistym niebieskim serem. Ich mocny smak doskonale komponuje się z intensywnymi aromatami. Aby uzyskać uderzający kontrast wizualny, podawaj je z jaskrawozielonymi oliwkami nadziewanymi migdałami lub czosnkiem. Skrop całą deskę lekko naszą oliwą z oliwek z pierwszego tłoczenia i podawaj z ciepłym, rzemieślniczym chlebem, aby stworzyć prawdziwie niezapomniane luksusowe doznania kulinarne dla swoich gości.",
      tr: "# Eğlencenin Merkezi\n\nGüzel hazırlanmış bir şarküteri tabağı, zarif bir ev sahipliğinin ayırt edici özelliğidir. Peynirler ve etler genellikle merkezde yer alsa da, zenginliği mükemmel bir şekilde kesen ve damağı temizleyen, birinci sınıf bir salamura zeytininin asidik, tuzlu patlamasıdır. Castle Crops zeytinleri iri, sert ve yoğun lezzetlidir ve onları nihai merkez parçası yapar.\n\n# Mükemmel Uyumlar\n\nKoyu, meyvemsi Kalamata zeytinlerimizi keskin, ufalanan eski beyaz peynir veya iddialı bir mavi peynirle eşleştirin. Sağlam lezzetleri yoğun lezzetlere karşı mükemmel bir şekilde durur. Çarpıcı bir görsel kontrast için onlara badem veya sarımsakla doldurulmuş parlak yeşil zeytinlerle servis yapın. Misafirleriniz için gerçekten unutulmaz bir lüks mutfak deneyimi yaratmak üzere tüm tahtanın üzerine sızma zeytinyağımızdan hafifçe gezdirin ve sıcak, esnaf yapımı ekmekle servis yapın."
    }
  },
  "295ba6c3-bcdb-4533-a6d7-277a05d3456c": {
    title: {
      fr: "Décoder l'huile d'olive : Comment déguster l'extra vierge comme un pro",
      pl: "Rozszyfrowanie oliwy z oliwek: Jak degustować Extra Virgin jak profesjonalista",
      tr: "Zeytinyağını Çözmek: Sızma Zeytinyağını Bir Profesyonel Gibi Nasıl Tadabilirsiniz"
    },
    excerpt: {
      fr: "Maîtrisez l'art de la dégustation de l'huile d'olive. Apprenez à identifier les notes fruitées, amères et poivrées de la véritable qualité supérieure.",
      pl: "Opanuj sztukę degustacji oliwy z oliwek. Naucz się rozpoznawać owocowe, gorzkie i pieprzne nuty prawdziwej jakości premium.",
      tr: "Zeytinyağı tadımı sanatında ustalaşın. Gerçek birinci sınıf kalitenin meyveli, acı ve biberli notalarını tanımlamayı öğrenin."
    },
    body: {
      fr: "# Le Rituel de Dégustation\n\nLa dégustation d'huile d'olive de première qualité s'apparente à la dégustation de vin. Pour évaluer une huile comme un sommelier professionnel, versez-en une petite quantité dans un verre et réchauffez-la légèrement entre vos mains pour libérer les arômes volatils. Prenez une profonde inspiration. L'huile d'olive extra vierge de haute qualité doit avoir une odeur vibrante de fraîcheur, rappelant l'herbe verte, les artichauts ou les pommes vertes.\n\n# Les Trois Piliers de la Qualité\n\nLorsque vous la sirotez (en l'aspirant légèrement pour aérer l'huile), recherchez trois caractéristiques distinctes : Le Fruité, L'Amertume et le Piquant. Une légère amertume sur la langue indique que des olives fraîches et saines ont été utilisées. Plus important encore, un picotement poivré au fond de la gorge (le piquant) est la marque de fabrique de *l'oléocanthal*, un puissant antioxydant anti-inflammatoire. Si votre huile vous fait légèrement tousser, vous tenez une bouteille de perfection liquide.",
      pl: "# Rytuał Degustacji\n\nDegustacja oliwy z oliwek premium jest podobna do degustacji wina. Aby ocenić oliwę jak profesjonalny sommelier, wlej niewielką ilość do kieliszka i lekko podgrzej w dłoniach, aby uwolnić lotne aromaty. Weź głęboki wdech. Wysokiej jakości oliwa z oliwek Extra Virgin powinna pachnieć żywą świeżością, przypominając zieloną trawę, karczochy lub zielone jabłka.\n\n# Trzy Filary Jakości\n\nPodczas popijania (lekko siorbiąc, aby napowietrzyć oliwę), szukaj trzech wyraźnych cech: Owocowości, Goryczy i Pikantności. Lekka gorycz na języku wskazuje, że użyto świeżych, zdrowych oliwek. Co najważniejsze, pieprzne uczucie z tyłu gardła (pikantność) jest znakiem rozpoznawczym *oleokantalu*, silnego przeciwutleniacza o działaniu przeciwzapalnym. Jeśli po oliwie lekko zakaszlesz, masz w rękach butelkę płynnej doskonałości.",
      tr: "# Tadım Ritüeli\n\nBirinci sınıf zeytinyağı tadımı, şarap tadımına benzer. Profesyonel bir tadımcı gibi bir yağı değerlendirmek için bardağa küçük bir miktar dökün ve uçucu aromaları serbest bırakmak için ellerinizde hafifçe ısıtın. Derin bir nefes alın. Yüksek kaliteli Sızma Zeytinyağı, yeşil çimen, enginar veya yeşil elmaları anımsatan canlı ve taze bir kokuya sahip olmalıdır.\n\n# Kalitenin Üç Temel Direği\n\nYudumlarken (yağı havalandırmak için hafifçe höpürdeterek) üç farklı özellik arayın: Meyvemsilik, Acılık ve Keskinlik. Dilde hafif bir acılık, taze ve sağlıklı zeytinlerin kullanıldığını gösterir. En önemlisi, boğazınızın arkasındaki biberli takılma (keskinlik), güçlü bir iltihap önleyici antioksidan olan *oleokantal*'in ayırt edici özelliğidir. Yağınız sizi hafifçe öksürtüyorsa, sıvı mükemmellik içeren bir şişe tutuyorsunuz demektir."
    }
  },
  "9531ae62-98b4-4e4c-ad5d-26bd2d14275e": {
    title: {
      fr: "Un goût de tradition : Cuisiner avec de l'huile d'olive extra vierge",
      pl: "Smak tradycji: Gotowanie z oliwą z oliwek Extra Virgin",
      tr: "Geleneklerin Tadı: Sızma Zeytinyağı ile Yemek Pişirmek"
    },
    excerpt: {
      fr: "Dissipez les mythes sur la cuisson à l'huile d'olive et apprenez à insuffler le luxe méditerranéen dans vos repas quotidiens.",
      pl: "Obal mity na temat gotowania na oliwie z oliwek i dowiedz się, jak wzbogacić swoje codzienne posiłki o śródziemnomorski luksus.",
      tr: "Zeytinyağı ile yemek pişirme hakkındaki mitleri ortadan kaldırın ve günlük yemeklerinize Akdeniz lüksünü nasıl aşılayacağınızı öğrenin."
    },
    body: {
      fr: "# Briser le Mythe du Point de Fumée\n\nPendant des années, un mythe culinaire persistant suggérait qu'il ne fallait jamais cuisiner avec de l'Huile d'Olive Extra Vierge (HOEV) parce que son point de fumée est trop bas. La science culinaire moderne a complètement démystifié cela. Une HOEV authentique et de haute qualité comme celle de Castle Crops possède en réalité un point de fumée très stable (environ 200°C / 400°F) en raison de son immense concentration en antioxydants et de sa faible acidité. Cela la rend parfaitement sûre – et incroyablement saine – pour sauter, rôtir et même frire légèrement.\n\n# Élever les Plats de Tous les Jours\n\nCuisiner avec une HOEV de première qualité n'ajoute pas seulement des avantages pour la santé ; cela transforme le profil aromatique de vos aliments. La chaleur libère les composés aromatiques de l'huile, infusant les légumes, les viandes et les fruits de mer d'une richesse fruitée délicate. Cependant, pour vraiment apprécier ses notes de finition poivrées et robustes, nous recommandons toujours d'arroser votre plat avec une cuillerée d'HOEV crue Castle Crops juste avant de servir.",
      pl: "# Obalanie Mitu Punktu Dymienia\n\nPrzez lata powszechny mit kulinarny sugerował, że nigdy nie należy gotować na Oliwie z Oliwek Extra Virgin (EVOO), ponieważ jej punkt dymienia jest zbyt niski. Współczesna nauka kulinarna całkowicie to obaliła. Wysokiej jakości, autentyczna EVOO od Castle Crops ma w rzeczywistości wysoce stabilny punkt dymienia (około 200°C) ze względu na ogromne stężenie przeciwutleniaczy i niską kwasowość. Sprawia to, że jest ona całkowicie bezpieczna — i niezwykle zdrowa — do smażenia, pieczenia, a nawet lekkiego smażenia w głębokim tłuszczu.\n\n# Udoskonalanie Codziennych Dań\n\nGotowanie na najwyższej jakości EVOO nie tylko dodaje korzyści zdrowotnych; przekształca profil smakowy twoich potraw. Ciepło uwalnia związki aromatyczne oliwy, napełniając warzywa, mięsa i owoce morza delikatnym, owocowym bogactwem. Aby jednak w pełni docenić jej pieprzne, solidne nuty końcowe, zawsze zalecamy skropienie potrawy łyżką surowej EVOO Castle Crops tuż przed podaniem.",
      tr: "# Dumanlanma Noktası Efsanesini Yıkmak\n\nYıllarca ısrarcı bir mutfak efsanesi, Sızma Zeytinyağı (EVOO) ile asla yemek pişirmemeniz gerektiğini, çünkü dumanlanma noktasının çok düşük olduğunu öne sürdü. Modern mutfak bilimi bunu tamamen çürüttü. Castle Crops gibi yüksek kaliteli, otantik EVOO, muazzam antioksidan konsantrasyonu ve düşük asitliği nedeniyle aslında oldukça stabil bir dumanlanma noktasına (yaklaşık 200°C / 400°F) sahiptir. Bu, onu sotelemek, kızartmak ve hatta hafif kızartma için tamamen güvenli ve inanılmaz derecede sağlıklı hale getirir.\n\n# Günlük Yemekleri Yükseltmek\n\nBirinci sınıf EVOO ile yemek pişirmek sadece sağlık yararları eklemekle kalmaz; yemeğinizin lezzet profilini dönüştürür. Isı, yağın aromatik bileşiklerinin kilidini açar, sebzeleri, etleri ve deniz ürünlerini narin, meyvemsi bir zenginlikle demler. Bununla birlikte, biberli ve sağlam bitiş notalarını gerçekten takdir etmek için, servis yapmadan hemen önce tabağınıza her zaman taze bir kaşık çiğ Castle Crops EVOO gezdirmenizi öneririz."
    }
  },
  "2fa48dd5-4813-4a2a-83b3-7bb71825ce3a": {
    title: {
      fr: "Pression à Froid vs. Raffiné : Comprendre la Pureté de l'Huile d'Olive",
      pl: "Tłoczone na Zimno vs. Rafinowane: Zrozumienie Czystości Oliwy z Oliwek",
      tr: "Soğuk Sıkım ve Rafine: Zeytinyağının Saflığını Anlamak"
    },
    excerpt: {
      fr: "Toutes les huiles ne se valent pas. Comprenez la différence vitale entre l'HOEV pressée à froid et les alternatives raffinées chimiquement.",
      pl: "Nie wszystkie oleje są sobie równe. Zrozum istotną różnicę między tłoczoną na zimno EVOO a rafinowanymi chemicznie alternatywami.",
      tr: "Tüm yağlar eşit değildir. Soğuk sıkım EVOO ile kimyasal olarak rafine edilmiş alternatifler arasındaki hayati farkı anlayın."
    },
    body: {
      fr: "# La Signification de \"Pression à Froid\"\n\nLe terme « pression à froid » n'est pas seulement un mot à la mode ; c'est une méthode d'extraction mécanique stricte. Lorsque Castle Crops produit de l'Huile d'Olive Extra Vierge, les olives sont broyées et pressées uniquement par des moyens mécaniques, avec une température strictement maintenue en dessous de 27°C (80°F). L'application de chaleur permettrait d'obtenir plus d'huile, mais détruit instantanément les arômes délicats, les saveurs et les précieux antioxydants.\n\n# Le Danger des Huiles Raffinées\n\nEn revanche, les huiles d'olive raffinées (souvent étiquetées simplement « Huile d'Olive » ou « Huile d'Olive Pure ») sont extraites à l'aide d'une chaleur élevée et de solvants chimiques pour masquer le goût des olives défectueuses et trop mûres. Ce processus violent dépouille l'huile de toute sa valeur nutritionnelle, laissant derrière elle une graisse vide et sans saveur. Exigez toujours une Huile d'Olive Extra Vierge pressée à froid pour vous assurer de consommer un produit d'une pureté et d'une vitalité absolues.",
      pl: "# Znaczenie słowa \"Tłoczone na Zimno\"\n\nTermin „Tłoczone na Zimno” to nie tylko chwyt marketingowy; to rygorystyczna, mechaniczna metoda ekstrakcji. Kiedy Castle Crops produkuje Oliwę z Oliwek Extra Virgin, oliwki są miażdżone i tłoczone wyłącznie metodami mechanicznymi, a temperatura jest ściśle utrzymywana poniżej 27°C. Zastosowanie ciepła dałoby więcej oliwy, ale natychmiast niszczy delikatne aromaty, smaki i cenne przeciwutleniacze.\n\n# Niebezpieczeństwo Rafinowanych Oliw\n\nW przeciwieństwie do tego, rafinowane oliwy z oliwek (często określane po prostu jako „Oliwa z Oliwek” lub „Czysta Oliwa z Oliwek”) są ekstrahowane przy użyciu wysokiej temperatury i rozpuszczalników chemicznych w celu zamaskowania smaku wadliwych, przejrzałych oliwek. Ten brutalny proces pozbawia olej wszelkich wartości odżywczych, pozostawiając bezsmakowy, pusty tłuszcz. Zawsze domagaj się tłoczonej na zimno Oliwy z Oliwek Extra Virgin, aby mieć pewność, że spożywasz produkt o absolutnej czystości i witalności.",
      tr: "# \"Soğuk Sıkım\"ın Anlamı\n\n\"Soğuk Sıkım\" terimi sadece bir pazarlama sözcüğü değildir; sıkı bir mekanik ekstraksiyon yöntemidir. Castle Crops Sızma Zeytinyağı üretirken, zeytinler yalnızca mekanik yollarla ezilir ve sıkılır, sıcaklık kesinlikle 27°C'nin (80°F) altında tutulur. Isı uygulamak daha fazla yağ verebilir, ancak hassas aromaları, tatları ve değerli antioksidanları anında yok eder.\n\n# Rafine Yağların Tehlikesi\n\nBuna karşılık, rafine zeytinyağları (genellikle sadece \"Zeytinyağı\" veya \"Saf Zeytinyağı\" olarak etiketlenir), kusurlu, aşırı olgunlaşmış zeytinlerin tadını maskelemek için yüksek ısı ve kimyasal çözücüler kullanılarak çıkarılır. Bu şiddetli süreç, yağı tüm besin değerinden arındırarak geride tatsız, boş bir yağ bırakır. Mutlak saflıkta ve canlılıkta bir ürün tükettiğinizden emin olmak için her zaman Soğuk Sıkım Sızma Zeytinyağı talep edin."
    }
  },
  "c29d81f5-60a3-46ab-9fdc-035497f2d3f7": {
    title: {
      fr: "Agriculture durable : Comment nous protégeons le sol pour les générations futures",
      pl: "Zrównoważone Rolnictwo: Jak chronimy glebę dla przyszłych pokoleń",
      tr: "Sürdürülebilir Tarım: Gelecek Nesiller İçin Toprağı Nasıl Koruyoruz"
    },
    excerpt: {
      fr: "Découvrez notre engagement envers les pratiques agricoles régénératrices qui enrichissent la terre plutôt que de l'épuiser.",
      pl: "Odkryj nasze zaangażowanie w regeneracyjne praktyki rolnicze, które wzbogacają ziemię, a nie ją wyjaławiają.",
      tr: "Toprağı tüketmek yerine zenginleştiren yenileyici tarım uygulamalarına olan bağlılığımızı keşfedin."
    },
    body: {
      fr: "# L'Agriculture avec une Conscience\n\nLes produits agricoles de luxe ne peuvent exister sans un sol sain et prospère. Chez Castle Crops, nous nous considérons non seulement comme des agriculteurs, mais comme des gardiens de la terre. Nous avons mis en œuvre de manière stricte des pratiques agricoles durables et régénératrices dans tous nos vergers d'oliviers et nos palmeraies pour garantir que la terre reste fertile pour les générations futures.\n\n# L'Approche Écosystémique\n\nAu lieu de nous appuyer sur des engrais synthétiques agressifs qui dégradent le microbiome du sol, nous utilisons le compostage organique et les cultures de couverture pour fixer naturellement l'azote dans la terre. La conservation de l'eau est primordiale ; nos systèmes d'irrigation goutte-à-goutte avancés fournissent des quantités exactes d'hydratation directement aux racines, minimisant le gaspillage. En travaillant en harmonie avec l'écosystème local, nous produisons des cultures qui ne sont pas seulement plus pures et plus savoureuses, mais aussi respectueuses de l'environnement.",
      pl: "# Rolnictwo z Sumieniem\n\nLuksusowe produkty rolnicze nie mogą istnieć bez zdrowej, żyznej gleby. W Castle Crops postrzegamy siebie nie tylko jako rolników, ale jako szafarzy ziemi. Rygorystycznie wdrażamy zrównoważone, regeneracyjne praktyki rolnicze we wszystkich naszych gajach oliwnych i palm daktylowych, aby zapewnić, że ziemia pozostanie żyzna dla przyszłych pokoleń.\n\n# Podejście Ekosystemowe\n\nZamiast polegać na ostrych nawozach syntetycznych, które degradują mikrobiom gleby, wykorzystujemy kompostowanie organiczne i uprawy okrywowe, aby naturalnie wiązać azot w ziemi. Ochrona wody jest najważniejsza; nasze zaawansowane systemy nawadniania kropelkowego dostarczają dokładne ilości wilgoci bezpośrednio do korzeni, minimalizując straty. Pracując w harmonii z lokalnym ekosystemem, produkujemy uprawy, które są nie tylko czystsze i smaczniejsze, ale także odpowiedzialne za środowisko.",
      tr: "# Vicdanlı Tarım\n\nLüks tarım ürünleri sağlıklı ve gelişen bir toprak olmadan var olamaz. Castle Crops'ta kendimizi sadece çiftçi olarak değil, arazinin kahyaları olarak görüyoruz. Toprağın gelecek nesiller için verimli kalmasını sağlamak adına tüm zeytin bahçelerimizde ve hurma ormanlarımızda sürdürülebilir, yenileyici tarım uygulamalarını sıkı bir şekilde uyguladık.\n\n# Ekosistem Yaklaşımı\n\nToprak mikrobiyomunu bozan sert sentetik gübrelere güvenmek yerine, nitrojeni toprağa doğal olarak sabitlemek için organik kompostlama ve örtü bitkileri kullanıyoruz. Su tasarrufu her şeyden önemlidir; gelişmiş damlama sulama sistemlerimiz, israfı en aza indirerek doğrudan köklere kesin miktarlarda sıvı iletir. Yerel ekosistemle uyum içinde çalışarak, yalnızca daha saf ve daha lezzetli değil, aynı zamanda çevreye karşı sorumlu mahsuller üretiyoruz."
    }
  }
};

async function run() {
  console.log("Fetching current posts...");
  const { data: posts, error: fetchError } = await supabase.from('blog_posts').select('id, title, excerpt, body');
  if (fetchError) {
    console.error("Fetch error:", fetchError);
    return;
  }

  let updatedCount = 0;
  for (const post of posts) {
    const translations = postsTranslations[post.id];
    if (translations) {
      const newTitle = { ...post.title, ...translations.title };
      const newExcerpt = { ...post.excerpt, ...translations.excerpt };
      const newBody = { ...post.body, ...translations.body };
      
      const { error: updateError } = await supabase
        .from('blog_posts')
        .update({ title: newTitle, excerpt: newExcerpt, body: newBody })
        .eq('id', post.id);
        
      if (updateError) {
        console.error("Update error for post", post.id, updateError);
      } else {
        updatedCount++;
      }
    }
  }
  
  console.log(`Successfully updated ${updatedCount} posts with Fr, Pl, and Tr translations.`);
}

run();
