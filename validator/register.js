const Validator = require('validator');
const isEmpty = require('./isEmpty');

module.exports = function validateRegisterInput(data) {
  let errors = {};

  data.name = !isEmpty(data.name) ? data.name : '';
  data.email = !isEmpty(data.email) ? data.email : '';
  data.password = !isEmpty(data.password) ? data.password : '';
  data.password2 = !isEmpty(data.password2) ? data.password2 : '';

  if (Validator.isEmpty(data.name)) {
    errors.name = '名字不能为空！';
  }
  if (!Validator.isLength(data.name, { min: 2, max: 16 })) {
    errors.name = '名字长度不能小于2位且不能大于16位';
  }
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
  if (Validator.isEmpty(data.password2)) {
    errors.password2 = 'password2密码不能为空！';
  }
  if (!Validator.equals(data.password2, data.password)) {
    errors.password2 = '两次输入的密码不同！';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
}