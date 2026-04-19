const { Markup }   = require('telegraf');
const Product      = require('../../database/models/Product');
const { CartItem } = require('../../database/models/Order');
const {
  categoriesKeyboard,
  productDetailKeyboard,
  cartKeyboard,
  drinkSuggestionKeyboard,
  locationPhoneKeyboard,
  mainMenuKeyboard,
} = require('../keyboards/keyboards');

// ── Kategoriya mahsulotlari ────────────────────────────────────────────────
async function showCategory(ctx, category) {
  const products = await Product.findAll({ where: { category, isAvailable: true } });

  if (!products.length) {
    return ctx.answerCbQuery("Bu kategoriyada mahsulot yo'q");
  }

  const emoji = category === 'ichimliklar' ? '🥤' : category === 'sabzavotlar' ? '🥦' : '🍬';
  const buttons = products.map((p) => [
    Markup.button.callback(
      `${p.name} — ${parseFloat(p.price).toLocaleString()} so'm`,
      `prod_${p.id}`
    ),
  ]);
  buttons.push([Markup.button.callback('🔙 Orqaga', 'back_cat')]);

  await ctx.editMessageText(
    `${emoji} *${category.charAt(0).toUpperCase() + category.slice(1)}* bo'limi:\n\nBirini tanlang 👇`,
    { parse_mode: 'Markdown', reply_markup: { inline_keyboard: buttons } }
  );
}

// ── Mahsulot detail ────────────────────────────────────────────────────────
async function showProduct(ctx, productId, userId) {
  const product = await Product.findByPk(productId);
  if (!product) return ctx.answerCbQuery('Mahsulot topilmadi');

  const cartItem = await CartItem.findOne({
    where: { userId, productId, status: 'active' },
  });
  const qty = cartItem ? cartItem.quantity : 0;

  const caption =
    `🏷 *${product.name}*\n\n` +
    `💰 Narxi: *${parseFloat(product.price).toLocaleString()} so'm*\n\n` +
    `📝 *Tarkibi:*\n${product.composition || "Ma'lumot yo'q"}\n\n` +
    `ℹ️ ${product.description || ''}`;

  const keyboard = productDetailKeyboard(product.id, qty);

  if (product.imageUrl) {
    try {
      await ctx.deleteMessage();
      await ctx.replyWithPhoto(product.imageUrl, {
        caption,
        parse_mode: 'Markdown',
        reply_markup: keyboard.reply_markup,
      });
    } catch {
      await ctx.editMessageText(caption, {
        parse_mode: 'Markdown',
        reply_markup: keyboard.reply_markup,
      });
    }
  } else {
    await ctx.editMessageText(caption, {
      parse_mode: 'Markdown',
      reply_markup: keyboard.reply_markup,
    });
  }
}

// ── Asosiy callback handler ────────────────────────────────────────────────
const callbackHandler = async (ctx) => {
  const data   = ctx.callbackQuery?.data;
  const userId = ctx.from.id;
  if (!data) return;

  // Kategoriya
  if (data.startsWith('cat_')) {
    return showCategory(ctx, data.replace('cat_', ''));
  }

  // Mahsulot
  if (data.startsWith('prod_')) {
    return showProduct(ctx, parseInt(data.replace('prod_', '')), userId);
  }

  // ➕ plus
  if (data.startsWith('plus_')) {
    const productId = parseInt(data.replace('plus_', ''));
    let item = await CartItem.findOne({ where: { userId, productId, status: 'active' } });
    if (item) {
      await item.increment('quantity');
    } else {
      item = await CartItem.create({ userId, productId, quantity: 1 });
    }
    await ctx.answerCbQuery("✅ Savatchaga qo'shildi");
    return showProduct(ctx, productId, userId);
  }

  // ➖ minus
  if (data.startsWith('minus_')) {
    const productId = parseInt(data.replace('minus_', ''));
    const item = await CartItem.findOne({ where: { userId, productId, status: 'active' } });
    if (item) {
      if (item.quantity <= 1) {
        await item.destroy();
        await ctx.answerCbQuery("🗑 Savatchadan o'chirildi");
      } else {
        await item.decrement('quantity');
        await ctx.answerCbQuery('➖ Kamaytirildi');
      }
    }
    return showProduct(ctx, productId, userId);
  }

  // 🛍 Xaridni davom ettirish — savatcha ko'rinishi
  if (data.startsWith('cart_view_')) {
    const items = await CartItem.findAll({ where: { userId, status: 'active' } });
    if (!items.length) return ctx.answerCbQuery("🛒 Savatchangiz bo'sh!");

    const productIds = items.map((i) => i.productId);
    const products   = await Product.findAll({ where: { id: productIds } });

    let txt   = '🧾 *Sizning savatchingiz:*\n\n';
    let total = 0;
    for (const item of items) {
      const prod = products.find((p) => p.id === item.productId);
      if (prod) {
        const sub = parseFloat(prod.price) * item.quantity;
        total += sub;
        txt += `• ${prod.name} x${item.quantity} = *${sub.toLocaleString()} so'm*\n`;
      }
    }
    txt += `\n💰 *Jami: ${total.toLocaleString()} so'm*`;

    await ctx.answerCbQuery();
    return ctx.editMessageText(txt, {
      parse_mode: 'Markdown',
      reply_markup: cartKeyboard(true).reply_markup,
    });
  }

  // ✅ Rasmiylashtirish — ichimlik tekshiruvi
  if (data === 'checkout') {
    const items      = await CartItem.findAll({ where: { userId, status: 'active' } });
    const productIds = items.map((i) => i.productId);
    const products   = await Product.findAll({ where: { id: productIds } });
    const hasDrink   = products.some((p) => p.category === 'ichimliklar');

    await ctx.answerCbQuery();

    if (!hasDrink) {
      return ctx.editMessageText(
        `🥤 Balki ichimlik ham olarsiz?\n\nSavatingizda hali ichimlik yo'q. Ko'rmoqchimisiz?`,
        { reply_markup: drinkSuggestionKeyboard.reply_markup }
      );
    }

    // Ichimlik bor — lokatsiya so'rash
    await ctx.deleteMessage();
    return ctx.reply(
      '📍 Lokatsiyangizni va 📞 telefon raqamingizni yuboring 👇',
      locationPhoneKeyboard
    );
  }

  // Ha — ichimliklar bo'limini ko'rsin
  if (data === 'suggest_yes') {
    await ctx.answerCbQuery();
    return showCategory(ctx, 'ichimliklar');
  }

  // Yo'q — lokatsiya so'rash
  if (data === 'suggest_no') {
    await ctx.answerCbQuery();
    await ctx.deleteMessage();
    return ctx.reply(
      '📍 Lokatsiyangizni va 📞 telefon raqamingizni yuboring 👇',
      locationPhoneKeyboard
    );
  }

  // 🔙 Orqaga — kategoriyalar
  if (data === 'back_cat') {
    await ctx.answerCbQuery();
    return ctx.editMessageText(
      "📦 Qaysi kategoriyani ko'rmoqchisiz?",
      { reply_markup: categoriesKeyboard.reply_markup }
    );
  }

  // 🔙 Asosiy menyu
  if (data === 'back_main') {
    await ctx.answerCbQuery();
    await ctx.deleteMessage();
    return ctx.reply('🏠 Asosiy menyu', mainMenuKeyboard);
  }
};

module.exports = callbackHandler;