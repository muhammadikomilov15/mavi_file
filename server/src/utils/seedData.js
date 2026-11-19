const mongoose = require('mongoose');
const User = require('../models/User');
const Product = require('../models/Product');
const Category = require('../models/Category');
const Coupon = require('../models/Coupon');
const StoreSettings = require('../models/StoreSettings');
const Review = require('../models/Review');

const categories = [
  {
    slug: 'men',
    name: { uz: 'Erkaklar', en: 'Men', ru: 'Мужчины' },
    description: { uz: 'Zamonaviy erkaklar premium kiyimlari', en: 'Modern premium menswear collection', ru: 'Коллекция современной мужской одежды премиум-класса' },
    image: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=800&q=80',
    order: 1
  },
  {
    slug: 'women',
    name: { uz: 'Ayollar', en: 'Women', ru: 'Женщины' },
    description: { uz: 'Nafis va bejirim ayollar kiyimlari', en: 'Refined and elegant womenswear collection', ru: 'Изысканная коллекция женской одежды' },
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80',
    order: 2
  },
  {
    slug: 'coats',
    name: { uz: 'Paltolar', en: 'Coats', ru: 'Пальто' },
    description: { uz: 'Kashmir va sifatli jun paltolar', en: 'Cashmere and tailored wool coats', ru: 'Шерстяные и кашемировые пальто' },
    image: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?auto=format&fit=crop&w=800&q=80',
    order: 3
  },
  {
    slug: 'jackets',
    name: { uz: 'Kurtkalar', en: 'Jackets', ru: 'Куртки' },
    description: { uz: 'Charm va zamonaviy bomber kurtkalar', en: 'Premium leather and structured jackets', ru: 'Кожаные и структурные куртки' },
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80',
    order: 4
  },
  {
    slug: 'dresses',
    name: { uz: 'Ko‘ylaklar', en: 'Dresses', ru: 'Платья' },
    description: { uz: 'Minimalist va oqshom ko‘ylaklari', en: 'Minimalist evening and daytime dresses', ru: 'Минималистичные и вечерние платья' },
    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80',
    order: 5
  },
  {
    slug: 'shirts',
    name: { uz: 'Ko‘ylak va Rubashkalar', en: 'Shirts', ru: 'Рубашки' },
    description: { uz: '100% paxta va zig‘ir matoli rubashkalar', en: 'Pure cotton and crisp linen shirts', ru: 'Хлопковые и льняные рубашки' },
    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80',
    order: 6
  },
  {
    slug: 't-shirts',
    name: { uz: 'Futbolkalar', en: 'T-Shirts', ru: 'Футболки' },
    description: { uz: 'Og‘ir vaznli organik paxta futbolkalar', en: 'Heavyweight organic cotton tees', ru: 'Футболки из органического хлопка' },
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
    order: 7
  },
  {
    slug: 'hoodies',
    name: { uz: 'Xudilar', en: 'Hoodies', ru: 'Худи' },
    description: { uz: 'Oversized premium fason xudilar', en: 'Relaxed and architectural luxury hoodies', ru: 'Оверсайз премиальные худи' },
    image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80',
    order: 8
  },
  {
    slug: 'sweatshirts',
    name: { uz: 'Svitshtlar', en: 'Sweatshirts', ru: 'Свитшоты' },
    description: { uz: 'Qulay va minimalist svitshtlar', en: 'Comfortable minimal French terry sweatshirts', ru: 'Удобные минималистичные свитшоты' },
    image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80',
    order: 9
  },
  {
    slug: 'trousers',
    name: { uz: 'Klassik Shimlar', en: 'Trousers', ru: 'Брюки' },
    description: { uz: 'Qad-qomatga mos tikilgan shimlar', en: 'Tailored wool-blend and pleated trousers', ru: 'Классические и плиссированные брюки' },
    image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=80',
    order: 10
  },
  {
    slug: 'jeans',
    name: { uz: 'Jinsilar', en: 'Jeans', ru: 'Джинсы' },
    description: { uz: 'Klassik va yapon selvedge denim jinsilar', en: 'Classic straight-leg and Japanese selvedge denim', ru: 'Прямые джинсы из японского денима' },
    image: 'https://images.unsplash.com/photo-1542272604-780c96856592?auto=format&fit=crop&w=800&q=80',
    order: 11
  },
  {
    slug: 'shoes',
    name: { uz: 'Poyabzallar', en: 'Shoes', ru: 'Обувь' },
    description: { uz: 'Charm loferlar, krossovkalar va botinkalar', en: 'Fine leather loafers, minimalist sneakers and boots', ru: 'Кожаные лоферы, кеды и ботинки' },
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80',
    order: 12
  },
  {
    slug: 'accessories',
    name: { uz: 'Aksessuarlar', en: 'Accessories', ru: 'Аксессуары' },
    description: { uz: 'Charm kamarlar, hamyonlar va sharflar', en: 'Full-grain leather belts, wallets and scarves', ru: 'Кожаные ремни, кошельки и шарфы' },
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
    order: 13
  }
];

const sampleProducts = [
  {
    sku: 'MAVI-COAT-001',
    name: {
      uz: 'Kashmir Aralashmali Minimalist Palto',
      en: 'Double-Breasted Wool & Cashmere Coat',
      ru: 'Двубортное пальто из шерсти и кашемира'
    },
    description: {
      uz: 'Italiya junidan ishlangan, qat’iy chiziqli va qulay kesimdagi ikki bortli palto. Qish va bahor mavsumi uchun ideal tanlov.',
      en: 'Crafted from Italian virgin wool and soft cashmere blend. Features relaxed tailoring, wide peak lapels, and horn buttons.',
      ru: 'Сшито из итальянской шерсти с добавлением мягкого кашемира. Прямой силуэт, заостренные лацканы и роговые пуговицы.'
    },
    category: 'coats',
    gender: 'men',
    images: [
      'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=1000&q=85'
    ],
    price: 1850000,
    discountPrice: 1590000,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Camel', hex: '#B8A58A' },
      { name: 'Noir Black', hex: '#111111' },
      { name: 'Charcoal Grey', hex: '#444444' }
    ],
    stock: 25,
    isFeatured: true,
    isNewArrival: true,
    isBestSeller: true,
    material: '80% Virgin Wool, 20% Cashmere',
    careInstructions: 'Faqat quruq tozalash (Dry clean only)'
  },
  {
    sku: 'MAVI-DRESS-002',
    name: {
      uz: 'Ipak Matoli Oqshom Slip Ko‘ylagi',
      en: 'Pure Silk Satin Slip Dress',
      ru: 'Шелковое платье-комбинация макси'
    },
    description: {
      uz: '100% tabiiy ipakdan tikilgan, nozik yelkali va erkin tushib turuvchi zamonaviy oqshom ko‘ylagi.',
      en: 'Cut on the bias from 100% mulberry silk satin. Features delicate adjustable straps and a fluid, flattering drape.',
      ru: 'Скроено по косой из 100% натурального шелка малбери. Тонкие регулируемые бретели и струящийся силуэт.'
    },
    category: 'dresses',
    gender: 'women',
    images: [
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=1000&q=85'
    ],
    price: 1450000,
    discountPrice: 1290000,
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [
      { name: 'Champagne Gold', hex: '#D7C3A3' },
      { name: 'Midnight Black', hex: '#111111' },
      { name: 'Emerald', hex: '#1B382B' }
    ],
    stock: 30,
    isFeatured: true,
    isNewArrival: true,
    isBestSeller: false,
    material: '100% Mulberry Silk',
    careInstructions: 'Qo‘lda sovuq suvda yuvish (Gentle hand wash cold)'
  },
  {
    sku: 'MAVI-JACKET-003',
    name: {
      uz: 'Haqiqiy Charm Bomber Kurtka',
      en: 'Supple Lambskin Leather Bomber',
      ru: 'Бомбер из натуральной кожи ягненка'
    },
    description: {
      uz: 'Yumshoq nappa charmidan qo‘lda tayyorlangan, zamonaviy metall fermuarga ega premium bomber kurtka.',
      en: 'Handcrafted from butter-soft lambskin leather with satin lining, silver-finish RiRi hardware, and ribbed merino trims.',
      ru: 'Изготовлен из мягчайшей кожи ягненка на сатиновой подкладке с фурнитурой серебристого оттенка.'
    },
    category: 'jackets',
    gender: 'men',
    images: [
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1520975916090-3105956dac38?auto=format&fit=crop&w=1000&q=85'
    ],
    price: 2600000,
    discountPrice: 0,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Deep Black', hex: '#0B0B0B' },
      { name: 'Espresso Brown', hex: '#3B2F2F' }
    ],
    stock: 14,
    isFeatured: true,
    isNewArrival: false,
    isBestSeller: true,
    material: '100% Genuine Lambskin Nappa Leather',
    careInstructions: 'Professional charm tozalash'
  },
  {
    sku: 'MAVI-SHIRT-004',
    name: {
      uz: 'Oversized Poplin Oq Rubashka',
      en: 'Oversized Organic Cotton Poplin Shirt',
      ru: 'Оверсайз рубашка из органического поплина'
    },
    description: {
      uz: 'Yuqori zichlikdagi paxta poplinidan tikilgan, qulay va universal arxitekturaviy fasonli rubashka.',
      en: 'Tailored from crisp 100% certified organic cotton poplin. Features dropped shoulders, mother-of-pearl buttons, and structured collar.',
      ru: 'Рубашка свободного кроя из плотного хлопка поплин со спущенной линией плеча и перламутровыми пуговицами.'
    },
    category: 'shirts',
    gender: 'women',
    images: [
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1598554747436-c9293d6a588f?auto=format&fit=crop&w=1000&q=85'
    ],
    price: 680000,
    discountPrice: 590000,
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [
      { name: 'Crisp White', hex: '#FFFFFF' },
      { name: 'Sky Stripe Blue', hex: '#9BB8CD' }
    ],
    stock: 45,
    isFeatured: false,
    isNewArrival: true,
    isBestSeller: true,
    material: '100% Organic Cotton',
    careInstructions: '30°C da kir yuvish mashinasida yuvish'
  },
  {
    sku: 'MAVI-TROUSER-005',
    name: {
      uz: 'Plisse Klassik Jun Shim',
      en: 'Wide-Leg Pleated Wool Trousers',
      ru: 'Широкие брюки со складками из шерсти'
    },
    description: {
      uz: 'Baland bel qismli, keng tushuvchi va chuqur plisseli zamonaviy kostyum shimi.',
      en: 'Cut with a high rise and relaxed wide-leg silhouette. Detailed with double front pleats and side tab adjusters.',
      ru: 'Брюки с высокой посадкой, двойными защипами спереди и широкими штанинами. Элегантный силуэт.'
    },
    category: 'trousers',
    gender: 'men',
    images: [
      'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=1000&q=85'
    ],
    price: 950000,
    discountPrice: 820000,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Sand Khaki', hex: '#B8A58A' },
      { name: 'Graphite Black', hex: '#1A1A1A' }
    ],
    stock: 28,
    isFeatured: true,
    isNewArrival: false,
    isBestSeller: true,
    material: '98% Wool, 2% Elastane',
    careInstructions: 'Quruq tozalash tavsiya etiladi'
  },
  {
    sku: 'MAVI-HOODIE-006',
    name: {
      uz: 'Og‘ir Vafli Bichiqli Qora Xudi',
      en: 'Architectural Heavyweight Fleece Hoodie',
      ru: 'Худи плотного плетения оверсайз'
    },
    description: {
      uz: '480 g/m² zichlikdagi organik paxtadan ishlangan, kapyushoni shaklini ushlab turuvchi minimalist xudi.',
      en: 'Crafted from 480gsm custom combed cotton loopback fleece. Structured hood without drawstrings for an uncompromising minimal look.',
      ru: 'Премиальное худи плотностью 480 г/м² из органического хлопка без шнурков в капюшоне для чистого минимализма.'
    },
    category: 'hoodies',
    gender: 'unisex',
    images: [
      'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1000&q=85'
    ],
    price: 790000,
    discountPrice: 0,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Onyx Black', hex: '#111111' },
      { name: 'Off White Melange', hex: '#F0EFEA' }
    ],
    stock: 50,
    isFeatured: false,
    isNewArrival: true,
    isBestSeller: true,
    material: '100% Combed Organic Cotton (480gsm)',
    careInstructions: 'Sovuq suvda yuvish (30°C)'
  },
  {
    sku: 'MAVI-TEE-007',
    name: {
      uz: 'Premium Og‘ir Paxta Futbolka',
      en: 'Luxury Heavyweight Boxy T-Shirt',
      ru: 'Футболка из плотного хлопка прямого кроя'
    },
    description: {
      uz: '280 g/m² zichlikdagi paxta, mustahkam bo‘yin yoqasi va zamonaviy to‘g‘ri kesim.',
      en: '280gsm pure combed cotton tee. Ribbed collar that never sags and clean boxy modern drape.',
      ru: 'Футболка из плотного премиального хлопка 280 г/м² с усиленной горловиной и идеальной посадкой.'
    },
    category: 't-shirts',
    gender: 'unisex',
    images: [
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=85'
    ],
    price: 360000,
    discountPrice: 290000,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Pure White', hex: '#FFFFFF' },
      { name: 'Faded Black', hex: '#262626' },
      { name: 'Sage Green', hex: '#778877' }
    ],
    stock: 80,
    isFeatured: true,
    isNewArrival: true,
    isBestSeller: true,
    material: '100% GOTS Organic Cotton',
    careInstructions: 'Mashinada yuvish'
  },
  {
    sku: 'MAVI-SHOES-008',
    name: {
      uz: 'Italiya Charmi Lofer Poyabzal',
      en: 'Hand-Stitched Italian Leather Loafers',
      ru: 'Лоферы ручной работы из итальянской кожи'
    },
    description: {
      uz: 'Klassik siluetdagi, yumshoq taglik va qo‘lda tikilgan sifatli buzoq charmi lofer.',
      en: 'Constructed from full-grain French calfskin with a Goodyear-welted leather sole and cushioned leather insole.',
      ru: 'Классические лоферы из телячьей кожи высшего сорта с прошивкой Goodyear Welted.'
    },
    category: 'shoes',
    gender: 'men',
    images: [
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1000&q=85'
    ],
    price: 1650000,
    discountPrice: 1450000,
    sizes: ['40', '41', '42', '43', '44'],
    colors: [
      { name: 'Polished Black', hex: '#111111' },
      { name: 'Burgundy Brown', hex: '#581845' }
    ],
    stock: 18,
    isFeatured: true,
    isNewArrival: false,
    isBestSeller: true,
    material: '100% Calfskin Leather',
    careInstructions: 'Charm krem va yumshoq cho‘tka bilan parvarishlash'
  },
  {
    sku: 'MAVI-ACC-009',
    name: {
      uz: 'Minimalist Charm Kamar',
      en: 'Full-Grain Leather Minimalist Belt',
      ru: 'Минималистичный ремень из зернистой кожи'
    },
    description: {
      uz: 'Klassik va zamonaviy uslubga mos, mat po‘lat to‘qali tabiiy qalin charm kamar.',
      en: 'Solid brass brushed buckle with vegetable-tanned Italian leather that patinas beautifully over time.',
      ru: 'Ремень из натуральной кожи растительного дубления с матовой пряжкой.'
    },
    category: 'accessories',
    gender: 'unisex',
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=85'
    ],
    price: 420000,
    discountPrice: 0,
    sizes: ['One Size'],
    colors: [
      { name: 'Classic Black', hex: '#111111' },
      { name: 'Cognac Tan', hex: '#A0522D' }
    ],
    stock: 40,
    isFeatured: false,
    isNewArrival: true,
    isBestSeller: false,
    material: '100% Full Grain Leather',
    careInstructions: 'Quruq joyda saqlash'
  },
  {
    sku: 'MAVI-JEANS-010',
    name: {
      uz: 'Klassik Selvedge Denim Jinsi',
      en: 'Japanese Selvedge Regular Denim Jeans',
      ru: 'Джинсы прямого кроя из японского селвиджа'
    },
    description: {
      uz: '14 unsiya qalinlikdagi toza paxta selvedge denim jinsi. Vaqt o‘tishi bilan noyob fason oladi.',
      en: '14oz rigid raw Japanese selvedge denim. Mid-rise, straight leg fit with copper rivets and button fly.',
      ru: 'Японский необработанный деним плотностью 14 унций. Прямой силуэт, медные заклепки.'
    },
    category: 'jeans',
    gender: 'men',
    images: [
      'https://images.unsplash.com/photo-1542272604-780c96856592?auto=format&fit=crop&w=1000&q=85'
    ],
    price: 1100000,
    discountPrice: 950000,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Raw Indigo', hex: '#1B263B' },
      { name: 'Washed Stone', hex: '#415A77' }
    ],
    stock: 35,
    isFeatured: true,
    isNewArrival: false,
    isBestSeller: true,
    material: '100% Selvedge Cotton Denim (14oz)',
    careInstructions: 'Teskari qilib sovuq suvda yuvish'
  }
];

const sampleCoupons = [
  {
    code: 'MAVI10',
    discountType: 'percentage',
    discountValue: 10,
    minOrderAmount: 300000,
    maxDiscount: 200000,
    expiryDate: new Date('2028-12-31'),
    isActive: true
  },
  {
    code: 'WELCOME',
    discountType: 'fixed',
    discountValue: 50000,
    minOrderAmount: 250000,
    maxDiscount: 50000,
    expiryDate: new Date('2028-12-31'),
    isActive: true
  },
  {
    code: 'VIPPREMIUM',
    discountType: 'percentage',
    discountValue: 15,
    minOrderAmount: 1000000,
    maxDiscount: 500000,
    expiryDate: new Date('2028-12-31'),
    isActive: true
  }
];

const seedIfEmpty = async () => {
  try {
    const productCount = await Product.countDocuments();
    if (productCount > 0) {
      console.log(`[Seed] Database already contains ${productCount} products. Skipping initial seed.`);
      return;
    }

    console.log('[Seed] Database empty. Starting initial seed with premium MAVI catalog...');

    // 1. Clear existing
    await User.deleteMany({});
    await Category.deleteMany({});
    await Product.deleteMany({});
    await Coupon.deleteMany({});
    await StoreSettings.deleteMany({});

    // 2. Create Admin & Customer
    await User.create([
      {
        fullName: 'MAVI Administrator',
        email: 'admin@mavi.uz',
        phone: '+998 90 123 45 67',
        password: 'AdminPassword2026!',
        role: 'admin',
        isActive: true
      },
      {
        fullName: 'Aziz Rakhimov',
        email: 'customer@mavi.uz',
        phone: '+998 90 987 65 43',
        password: 'CustomerPassword2026!',
        role: 'customer',
        isActive: true,
        addresses: [
          {
            fullName: 'Aziz Rakhimov',
            phone: '+998 90 987 65 43',
            region: 'Toshkent shahri',
            district: 'Mirobod tumani',
            address: 'Nukus ko‘chasi, 24-uy, 15-xonadon',
            isDefault: true
          }
        ]
      }
    ]);
    console.log('[Seed] Admin (admin@mavi.uz / AdminPassword2026!) and sample customer created.');

    // 3. Create Categories
    await Category.insertMany(categories);
    console.log(`[Seed] ${categories.length} categories created.`);

    // 4. Create Products
    const createdProducts = await Product.insertMany(sampleProducts);
    console.log(`[Seed] ${sampleProducts.length} premium fashion products created.`);

    // 5. Create Sample Reviews
    if (createdProducts.length > 0) {
      await Review.create([
        {
          product: createdProducts[0]._id,
          name: 'Shahzod Aliyev',
          rating: 5,
          comment: 'Palto sifati ajoyib! Qat’iy va qimmatbaho ko‘rinadi. Massimo Dutti darajasidan ham yaxshiroq.'
        },
        {
          product: createdProducts[0]._id,
          name: 'Elena Volkova',
          rating: 5,
          comment: 'Шикарное пальто. Теплое, идеальный крой. Очень довольна покупкой!'
        },
        {
          product: createdProducts[1]._id,
          name: 'Madina Karimova',
          rating: 5,
          comment: 'Ipak slip ko‘ylak haqiqatdan ham bejirim. Oqshom uchun ideal tanlov bo‘ldi.'
        }
      ]);
    }

    // 6. Create Coupons
    await Coupon.insertMany(sampleCoupons);
    console.log(`[Seed] ${sampleCoupons.length} promo coupons created.`);

    // 7. Store Settings
    await StoreSettings.create({
      storeName: 'MAVI',
      contactPhone: '+998 71 200 00 00',
      contactEmail: 'concierge@mavi.uz',
      contactAddress: 'Amir Temur Avenue 107A, Tashkent, Uzbekistan',
      telegramChannel: 'https://t.me/mavi_boutique',
      instagramUrl: 'https://instagram.com/mavi_boutique',
      deliveryFee: 25000,
      freeDeliveryThreshold: 500000,
      telegramBotToken: process.env.TELEGRAM_BOT_TOKEN || '',
      telegramChatId: process.env.TELEGRAM_CHAT_ID || '-1004335804992',
      telegramEnabled: true
    });
    console.log('[Seed] Store settings initialized.');

    console.log('[Seed] MAVI database initialization completed successfully!');
  } catch (error) {
    console.error('[Seed] Seeding error:', error);
  }
};

module.exports = { seedIfEmpty };
