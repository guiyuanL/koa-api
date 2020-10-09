const Router = require('koa-router');
const router = new Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const enbcrypt = require('../../utils').enbcrypt;
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const passport = require('koa-passport');

// 引入User
const User = require('../../models/User');

// 引入验证
const validateRegisterInput = require('../../validator/register');
const validateLoginInput = require('../../validator/login');

// test
/**
 * @route GET api/user/test
 * @desc 测试接口地址
 * @access 接口是公开的
 */
router.get('/test', ctx => {
  ctx.status = 200;
  ctx.body = {
    msg: 'user works...'
  }
});

/**
 * @route POST api/user/register
 * @desc 注册接口地址
 * @access 接口是公开的
 */
router.post('/register', async ctx => {
  // console.log(ctx.request.body);
  const { errors, isValid } = validateRegisterInput(ctx.request.body);
  // 判断是否认证通过
  if (!isValid) {
    ctx.status = 400;
    ctx.body = errors;
    return;
  }
  // 存储到数据库
  const findResult = await User.find({ email: ctx.request.body.email });
  if (findResult.length > 0) {
    ctx.status = 500;
    ctx.body = {
      email: '邮箱已被占用'
    };
  } else {
    const avatar = gravatar.url(ctx.request.body.email, { s: '200', r: 'pg', d: 'mm' });
    // 没查到
    const newUser = new User({
      name: ctx.request.body.name,
      password: enbcrypt(ctx.request.body.password),  // 加密
      email: ctx.request.body.email,
      avatar
    });

    await newUser
      .save()
      .then(user => {
        ctx.body = user;
      }).catch(err => {
        console.log(err);
      });
    // 返回json数据
    ctx.body = newUser;
  }
});

/**
 * @route POST api/user/login
 * @desc 登录接口地址
 * @access 接口是公开的
 */
router.post('/login', async ctx => {
  const { errors, isValid } = validateLoginInput(ctx.request.body);
  if (!isValid) {
    ctx.status = 400;
    ctx.body = errors;
    return;
  }

  // 查询
  const findResult = await User.find({ email: ctx.request.body.email });
  const user = findResult[0];
  const password = ctx.request.body.password;

  if (findResult.length === 0) {
    ctx.status === 404;
    ctx.body = {
      email: '用户不存在'
    };
  } else {
    // 验证密码是否正确 
    const result = await bcrypt.compareSync(password, user.password);
    // 验证通过
    if (result) {
      // 返回token
      const payload = { id: user.id, name: user.name, avatar: user.avatar };
      const token = jwt.sign(payload, keys.secretOrKey, { expiresIn: 60 * 60 });

      ctx.status = 200,
        ctx.body = {
          success: true,
          token: 'Bearer ' + token
        }
    } else {
      ctx.status = 400;
      ctx.body = {
        password: '密码错误!'
      }
    }
  }
});

/**
 * @route GET api/user/current
 * @desc 用户信息接口地址  返回用户信息
 * @access 接口是私密的
 * router.get('/current', 'token验证', async ctx => {});
 */
router.get('/current', passport.authenticate('jwt', { session: false }), async ctx => {
  ctx.body = {
    id: ctx.state.user.id,
    name: ctx.state.user.name,
    email: ctx.state.user.email,
    avatar: ctx.state.user.avatar,
    date: ctx.state.user.date
  };
})

module.exports = router.routes();
