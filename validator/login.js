const Validator = require('validator');
const isEmpty = require('./isEmpty');
const mongoose = require('mongoose');
const { context } = require('../app');
const User = mongoose.model('users');

module.exports = function validateLoginInput(data) {
  let errors = {};

  data.email = !isEmpty(data.email) ? data.email : '';
  data.password = !isEmpty(data.password) ? data.password : '';

  if (Validator.isEmpty(data.email)) {
    errors.email = '邮箱不能为空！';
  }
  if (!Validator.isEmail(data.email)) {
    errors.email = '请输入正确的邮箱！';
  }
  if (Validator.isEmpty(data.password)) {
    errors.password = '密码不能为空！';
  }
  if (!Validator.isLength(data.password, { min: 2, max: 16 })) {
    errors.password = '密码长度不能小于2位且不能大于16位';
  }

  // const findResult = User.find({ email: data.email });
  // if (findResult.length === 0 || findResult[0].password !== data.password) {
  //   errors.password = '密码不正确!';
  // }

  return {
    errors,
    isValid: isEmpty(errors)
  };
}