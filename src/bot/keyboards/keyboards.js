const { Markup } = require('telegraf');

// Ro'yxatdan o'tish uchun kontakt tugmasi
const contactKeyboard = Markup.keyboard([
  [Markup.button.contactRequest('📱 Kontaktimni yuborish')],
]).resize().oneTime();

// Asosiy menyu
const mainMenuKeyboard = Markup.keyboard([
  ['🛒 Mahsulotlar', '🧾 Mening xaridlarim'],
]).resize();

// Kategoriyalar
const categoriesKeyboard = Markup.inlineKeyboard([
  [Markup.button.callback('🥤 Ichimliklar',  'cat_ichimliklar')],
  [Markup.button.callback('🥦 Sabzavotlar',  'cat_sabzavotlar')],
  [Markup.button.callback('🍬 Shirinliklar', 'cat_shirinliklar')],
]);

// Mahsulot detail: +1 / -1 / savatcha
function productDetailKeyboard(productId, qty = 0) {
  return Markup.inlineKeyboard([
    [
      Markup.button.callback('➖',        `minus_${productId}`),
      Markup.button.callback(`🛒 ${qty}`, `qty_${productId}`),
      Markup.button.callback('➕',        `plus_${productId}`),
    ],
    [Markup.button.callback('🛍 Xaridni davom ettirish', `cart_view_${productId}`)],
    [Markup.button.callback('🔙 Orqaga', 'back_cat')],
  ]);
}

// Savatcha ko'rinishi
function cartKeyboard(hasItems) {
  const rows = [];
  if (hasItems) {
    rows.push([Markup.button.callback('✅ Rasmiylashtirish', 'checkout')]);
  }
  rows.push([Markup.button.callback('🔙 Asosiy menyu', 'back_main')]);
  return Markup.inlineKeyboard(rows);
}

// Ichimlik taklifi
const drinkSuggestionKeyboard = Markup.inlineKeyboard([
  [
    Markup.button.callback("✅ Ha",  'suggest_yes'),
    Markup.button.callback("❌ Yo'q", 'suggest_no'),
  ],
]);

// Lokatsiya + telefon yuborish
const locationPhoneKeyboard = Markup.keyboard([
  [Markup.button.locationRequest('📍 Lokatsiyamni yuborish')],
  [Markup.button.contactRequest('📞 Telefon raqamimni yuborish')],
]).resize();

module.exports = {
  contactKeyboard,
  mainMenuKeyboard,
  categoriesKeyboard,
  productDetailKeyboard,
  cartKeyboard,
  drinkSuggestionKeyboard,
  locationPhoneKeyboard,
};