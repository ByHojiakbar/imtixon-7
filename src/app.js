require('dotenv').config();
const { Telegraf } = require('telegraf');
const sequelize    = require('./database/config');

const User            = require('./database/models/User');
const Product         = require('./database/models/Product');
const { CartItem, Order } = require('./database/models/Order');

const authMiddleware  = require('./bot/middlewares/auth.mid');
const startCommand    = require('./bot/commands/start');
const authHandler     = require('./bot/handlers/auth');
const menuHandler     = require('./bot/handlers/menu');
const callbackHandler = require('./bot/handlers/index');
const { orderHandler } = require('./bot/handlers/order');

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.use(authMiddleware);

bot.start(startCommand);

bot.on('contact', async (ctx) => {
  if (!ctx.dbUser.isRegistered) return authHandler(ctx);
  return orderHandler(ctx);
});

bot.on('location', orderHandler);
bot.on('text', menuHandler);
bot.on('callback_query', callbackHandler);

(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database ulandi!');
    await sequelize.sync({ alter: true });
    console.log('✅ Jadvallar tayyor!');
    await bot.launch();
    console.log('🤖 Bot ishga tushdi!');
  } catch (err) {
    console.error('❌ Xatolik:', err);
    process.exit(1);
  }
})();

process.once('SIGINT',  () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));