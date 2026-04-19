const { CartItem, Order } = require('../../database/models/Order');
const Product             = require('../../database/models/Product');
const { mainMenuKeyboard } = require('../keyboards/keyboards');

// In-memory session (production uchun Redis tavsiya etiladi)
const sessions = {};

const orderHandler = async (ctx) => {
  const userId = ctx.from.id;
  if (!sessions[userId]) sessions[userId] = {};
  const s = sessions[userId];
  const msg = ctx.message;

  // Lokatsiya
  if (msg?.location) {
    s.latitude  = msg.location.latitude;
    s.longitude = msg.location.longitude;
    s.hasLocation = true;

    if (s.hasPhone) return finalizeOrder(ctx, userId, s);
    return ctx.reply("✅ Lokatsiya qabul qilindi!\n📞 Endi telefon raqamingizni yuboring 👇");
  }

  // Telefon (buyurtma jarayonida)
  if (msg?.contact) {
    s.phone    = msg.contact.phone_number;
    s.hasPhone = true;

    if (s.hasLocation) return finalizeOrder(ctx, userId, s);
    return ctx.reply("✅ Telefon qabul qilindi!\n📍 Endi lokatsiyangizni yuboring 👇");
  }
};

async function finalizeOrder(ctx, userId, s) {
  const items = await CartItem.findAll({ where: { userId, status: 'active' } });
  if (!items.length) return ctx.reply("🛒 Savatchangiz bo'sh!", mainMenuKeyboard);

  const productIds = items.map((i) => i.productId);
  const products   = await Product.findAll({ where: { id: productIds } });

  let total = 0;
  const lines = [];

  for (const item of items) {
    const prod = products.find((p) => p.id === item.productId);
    if (prod) {
      const sub = parseFloat(prod.price) * item.quantity;
      total += sub;
      lines.push(`• ${prod.name} x${item.quantity} = ${sub.toLocaleString()} so'm`);
    }
  }

  await Order.create({
    userId,
    phone:      s.phone || ctx.dbUser?.phone,
    latitude:   s.latitude,
    longitude:  s.longitude,
    totalPrice: total,
    status:     'pending',
  });

  await CartItem.update({ status: 'ordered' }, { where: { userId, status: 'active' } });

  delete sessions[userId];

  await ctx.reply(
    `✅ *Xaridingiz rasmiylashtirildi!*\n\n` +
    `${lines.join('\n')}\n\n` +
    `💰 *Jami: ${total.toLocaleString()} so'm*\n\n` +
    `🚚 Tez orada sizga kuryer aloqaga chiqadi!`,
    { parse_mode: 'Markdown', ...mainMenuKeyboard }
  );
}

module.exports = { orderHandler };