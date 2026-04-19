require('dotenv').config();
const sequelize = require('./config');
const Product   = require('./models/Product');

const products = [
  //  Ichimliklar 
  {
    name: 'Pepsi 0.5L',
    category: 'ichimliklar',
    price: 8000,
    description: 'Salqin va yangilovchi gazlangan ichimlik.',
    composition: "Suv, shakar, karamel bo'yoq, ortofosfor kislota, kofein",
    imageUrl: null,
  },
  {
    name: 'Coca-Cola 0.5L',
    category: 'ichimliklar',
    price: 9000,
    description: 'Klassik gazlangan ichimlik.',
    composition: "Suv, shakar, karamel, CO2, tabiiy ta'mlar, kofein",
    imageUrl: null,
  },
  {
    name: 'Fanta 0.5L',
    category: 'ichimliklar',
    price: 8500,
    description: "Apelsin ta'mli mevali ichimlik.",
    composition: 'Suv, shakar, apelsin sharbati, CO2, limon kislota',
    imageUrl: null,
  },
  {
    name: '7UP 0.5L',
    category: 'ichimliklar',
    price: 8000,
    description: "Limon-laym ta'mli salqin ichimlik.",
    composition: 'Suv, shakar, limon kislota, tabiiy limon-laym aromi',
    imageUrl: null,
  },

  //  Sabzavotlar 
  {
    name: 'Pomidor 1 kg',
    category: 'sabzavotlar',
    price: 12000,
    description: 'Yangi, qizil va shirin pomidor.',
    composition: 'C vitamini, lyukopin, kaliy, folat kislota',
    imageUrl: null,
  },
  {
    name: 'Bodring 1 kg',
    category: 'sabzavotlar',
    price: 8000,
    description: 'Yangi va toza bodring.',
    composition: 'K vitamini, C vitamini, magniy, suv',
    imageUrl: null,
  },
  {
    name: 'Sabzi 1 kg',
    category: 'sabzavotlar',
    price: 6000,
    description: 'Shirin va foydali sabzi.',
    composition: 'Beta-karotin, A vitamini, kletchatka',
    imageUrl: null,
  },
  {
    name: 'Kartoshka 1 kg',
    category: 'sabzavotlar',
    price: 7000,
    description: "Ko'p ishlatiladigan asosiy sabzavot.",
    composition: 'Kraxmal, C vitamini, kaliy, B6 vitamini',
    imageUrl: null,
  },
  {
    name: 'Piyoz 1 kg',
    category: 'sabzavotlar',
    price: 5000,
    description: "Har qanday taomga mos keluvchi o'tkir piyoz.",
    composition: 'Quercetin, C vitamini, B6 vitamini, folat',
    imageUrl: null,
  },

  //  Shirinliklar 
  {
    name: 'Snickers 50g',
    category: 'shirinliklar',
    price: 7000,
    description: "Shokolad, karamel va yer yong'oq.",
    composition: "Shakar, yer yong'oq, karamel, shokolad, sut",
    imageUrl: null,
  },
  {
    name: 'Kit Kat 45g',
    category: 'shirinliklar',
    price: 6500,
    description: "G'ıchirlovchi vafli va shokolad.",
    composition: 'Shakar, un, kakao moyi, sut, vanilin',
    imageUrl: null,
  },
  {
    name: 'Oreo Original',
    category: 'shirinliklar',
    price: 10000,
    description: 'Klassik qora-oq pechenie.',
    composition: "Un, shakar, kakao, o'simlik moyi, vanilin",
    imageUrl: null,
  },
  {
    name: 'Twix 50g',
    category: 'shirinliklar',
    price: 7500,
    description: 'Karamel va pechenie ustida shokolad.',
    composition: 'Shakar, un, karamel, shokolad, sut moyi',
    imageUrl: null,
  },
];

(async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });

    // Avval tozalash (ixtiyoriy)
    await Product.destroy({ where: {} });
    console.log("🗑  Eski mahsulotlar o'chirildi");

    await Product.bulkCreate(products);
    console.log(`✅ ${products.length} ta mahsulot qo'shildi!`);

    process.exit(0);
  } catch (err) {
    console.error('❌ Xatolik:', err.message);
    process.exit(1);
  }
})();