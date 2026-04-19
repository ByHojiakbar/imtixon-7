const { categoriesKeyboard, cartKeyboard } = require('../keyboards/keyboards');
const { CartItem } = require('../../database/models/Order');
const Product     = require('../../database/models/Product');

const menuHandler = async (ctx) => {
  const text = ctx.message?.text;
  const user = ctx.dbUser;

  if (!user.isRegistered) {
    return ctx.reply("❗ Iltimos avval /start bering va ro'yxatdan o'ting!");
  }

  if (text === '🛒 Mahsulotlar') {
    return ctx.reply('📦 Qaysi kategoriyani ko\'rmoqchisiz?', categoriesKeyboard);
  }

  if (text === '🧾 Mening xaridlarim') {
    const items = await CartItem.findAll({
      where: { userId: user.telegramId, status: 'active' },
    });

    if (!items.length) {
      return ctx.reply('🛒 Savatchingiz hozircha bo\'sh.\n\nMahsulotlar bo\'limidan buyurtma bering!');
    }

    const productIds = items.map((i) => i.productId);
    const products   = await Product.findAll({ where: { id: productIds } });

    let msg   = '🧾 *Sizning savatchingiz:*\n\n';
    let total = 0;

    for (const item of items) {
      const prod = products.find((p) => p.id === item.productId);
      if (prod) {
        const sub = parseFloat(prod.price) * item.quantity;
        total += sub;
        msg += `• ${prod.name} x${item.quantity} = *${sub.toLocaleString()} so'm*\n`;
      }
    }
    msg += `\n💰 *Jami: ${total.toLocaleString()} so'm*`;

    return ctx.replyWithMarkdown(msg, cartKeyboard(true));
  }
};

module.exports = menuHandler;