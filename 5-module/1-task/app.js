const Koa = require('koa');
const app = new Koa();

app.use(require('koa-static')('public'));
app.use(require('koa-bodyparser')());

const Router = require('koa-router');
const router = new Router();
const users = new Set();

router.get('/subscribe', async (ctx, next) => {
  const message = await new Promise((resolve, reject) => {
    users.add(resolve);

    ctx.res.on('close', () => {
      if (ctx.res.finished) return;
      ClientRectList.delete(resolve);
      resolve();
    });
  });
  ctx.body = message;
});

router.post('/publish', async (ctx, next) => {
  const message = ctx.request.body.message;
  if (!message) {
    ctx.throw(400, 'message is required');
  }
  for (const user of users) {
    user(message);
  }
  users.clear();
  ctx.body = 'ok';
});

app.use(router.routes());

module.exports = app;
