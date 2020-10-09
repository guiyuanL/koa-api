const Koa = require('koa');
const Router = require('koa-router');
const mongoose = require('mongoose');
const bodyParser = require('koa-bodyparser');
const passport = require('koa-passport');


// 实例化koa
const app = new Koa();
const router = new Router();

app.use(bodyParser());

// 验证
app.use(passport.initialize());
app.use(passport.session());
// 为了避免app.js代码量太大，回调到config文件夹中 passport.js中
require('./config/passport')(passport);

// 引入 users.js
const users = require('./router/api/users')

// 路由
router.get('/', async ctx => {
  ctx.body = {
    msg: 'Hello Koa Interfaces'
  };
})

// config
const db = require('./config/keys').mongoURI

// 连接数据库
mongoose.connect(db, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log('Mongodb Connected ...');
  }).catch((err) => {
    console.log(err);
  })

// 配置路由跳转
router.use('/api/user', users)

// 配置路由
app.use(router.routes()).use(router.allowedMethods());

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`server started on ${port}`);
})


module.exports = app