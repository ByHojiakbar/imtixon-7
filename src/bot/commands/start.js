const { contactKeyboard, mainMenuKeyboard } = require('../keyboards/keyboards');

const startCommand = async (ctx) => {
  const user = ctx.dbUser;

  if (!user.isRegistered) {
    return ctx.reply(
      `👋 Salom, ${ctx.from.first_name}!\n\n` +
      `Bizning do'konimizga xush kelibsiz! 🛍\n\n` +
      `Davom etish uchun kontaktingizni yuboring 👇`,
      contactKeyboard
    );
  }

  return ctx.reply('🏠 Asosiy menyu\n\nNimani xohlaysiz?', mainMenuKeyboard);
};

module.exports = startCommand;