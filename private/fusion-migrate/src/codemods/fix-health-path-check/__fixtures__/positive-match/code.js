export default (ctx, next) => {
  if (!ctx.element && ctx.url === '/health') {
    ctx.status = 200;
    ctx.body = 'OK';
  }
  return next();
};
