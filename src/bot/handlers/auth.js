const { mainMenuKeyboard } = require('../keyboards/keyboards');

const authHandler = async (ctx) => {
  const contact = ctx.message?.contact;
  if (!contact) return;

  if (contact.user_id !== ctx.from.id) {
    return ctx.reply("❌ Iltimos faqat o'z kontaktingizni yuboring!");
  }

  const user = ctx.dbUser;
  await user.update({ phone: contact.phone_number, isRegistered: true });

  return ctx.reply(
    `✅ Ro'yxatdan muvaffaqiyatli o'tdingiz!\n\n` +
    `🎉 Xush kelibsiz, ${ctx.from.first_name}!\n\n` +
    `Quyidagi menyudan tanlang 👇`,
    mainMenuKeyboard
  );
};

module.exports = authHandler;