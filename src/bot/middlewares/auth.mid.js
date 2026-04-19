const User = require('../../database/models/User');

const authMiddleware = async (ctx, next) => {
  const telegramId = ctx.from?.id;
  if (!telegramId) return next();

  let user = await User.findOne({ where: { telegramId } });

  if (!user) {
    user = await User.create({
      telegramId,
      firstName: ctx.from.first_name || '',
      lastName:  ctx.from.last_name  || '',
      username:  ctx.from.username   || '',
      isRegistered: false,
    });
  }

  ctx.dbUser = user;
  return next();
};

module.exports = authMiddleware;