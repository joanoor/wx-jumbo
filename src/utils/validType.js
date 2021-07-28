const pattern = {
  email: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  url: new RegExp('^(?!mailto:)(?:(?:http|https|ftp)://|//)(?:\\S+(?::\\S*)?@)?(?:(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))|localhost)(?::\\d{2,5})?(?:(/|\\?|#)[^\\s]*)?$', 'i'),
  cn: /^[\u2E80-\uFE4F]+$/,
  enName: /^[\da-zA-Z\s]{2,}$/,
  cnName: /^[\u2E80-\uFE4F]{2,6}(?:·[\u2E80-\uFE4F]{2,6})*$/,
  userName: /^[\da-zA-Z\u2E80-\uFE4F \s]{2,}$/,
  carId: /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$/,
  mobile: /^1[3456789]\d{9}$/,
  address: /^[\da-zA-Z\u2E80-\uFE4F \s-]{4,400}$/,
  date: /((^((1[8-9]\d{2})|([2-9]\d{3}))([-\/\._])(10|12|0?[13578])([-\/\._])(3[01]|[12][0-9]|0?[1-9])$)|(^((1[8-9]\d{2})|([2-9]\d{3}))([-\/\._])(11|0?[469])([-\/\._])(30|[12][0-9]|0?[1-9])$)|(^((1[8-9]\d{2})|([2-9]\d{3}))([-\/\._])(0?2)([-\/\._])(2[0-8]|1[0-9]|0?[1-9])$)|(^([2468][048]00)([-\/\._])(0?2)([-\/\._])(29)$)|(^([3579][26]00)([-\/\._])(0?2)([-\/\._])(29)$)|(^([1][89][0][48])([-\/\._])(0?2)([-\/\._])(29)$)|(^([2-9][0-9][0][48])([-\/\._])(0?2)([-\/\._])(29)$)|(^([1][89][2468][048])([-\/\._])(0?2)([-\/\._])(29)$)|(^([2-9][0-9][2468][048])([-\/\._])(0?2)([-\/\._])(29)$)|(^([1][89][13579][26])([-\/\._])(0?2)([-\/\._])(29)$)|(^([2-9][0-9][13579][26])([-\/\._])(0?2)([-\/\._])(29)$))/,
  numVcode: /^[0-9]{4,8}$/,
  vcode: /^[a-zA-Z0-9]{4,8}$/,
  code: /^[a-zA-Z0-9]{4,}$/,
  hkMc: /^[WC][0-9]{8}$/,
  taiWan: /^T[0-9]{8}$/,
  passport: /^1[45][0-9]{7}|([E|e]\d{8})|([P|p|S|s]\d{7})|([S|s|G|g]\d{8})|([Gg|Tt|Ss|Ll|Qq|Dd|Aa|Ff]\d{8})|([H|h|M|m]\d{8，10})$/,
  num: /^[1-9][0-9]*$/,
  decimal: /^(-)?\d+(\.\d)?$/,             // 小数或负数，小数后面一位
  money: /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/,
  id: /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/,
  twCome: /^(\d{8}|[a-zA-Z]\d{7})$/,      // 台湾居民来往大陆通行证(台胞证) 
  hmHid: /^8[123]0000\d{12}$/,            // 港澳台居民居住证 
}

// 定义字符串的trim方法
if (String.prototype.trim === void 0) {
  String.prototype.trim = function () {
    return this.replace(/(^\s*)|(\s*$)/g, '')
  }
}

/**
 * 判断是否为空
 * @date 2020-07-08
 * @param {any} value 
 * @returns {any}
 */
const required = value => {
  if (Array.isArray(value)) {
    return value.length > 0
  } else if (typeof value === 'object') {
    return Object.keys(value).length > 0
  }
  return !!(value || value === 0)
}

/**
 * 身份证规则检测
 * @param { String } value
 * @returns { Boolean }
 */
const id = value => {
  return typeof (value) === 'string' && pattern.id.test(value.trim())
}

/**
 * 检测是否为中文
 * @date 2020-07-08
 * @param { String } value
 * @returns { Boolean }
 */
const cn = value => {
  return typeof (value) === 'string' && pattern.cn.test(value.trim())
}

/**
 * 手机号码检测
 * @date 2020-07-08
 * @param { String } value
 * @returns { Boolean }
 */
const mobile = value => {
  return typeof (value) === 'string' && pattern.mobile.test(value.trim())
}

/**
 * 邮箱检测
 * @date 2020-07-08
 * @param { String } value
 * @returns { Boolean }
 */
const email = value => {
  return typeof (value) === 'string' && pattern.email.test(value.trim())
}

/**
 * URL检测
 * @date 2020-07-08
 * @param { String } value
 * @returns { Boolean }
 */
const url = value => {
  return typeof (value) === 'string' && pattern.url.test(value.trim())
}

/**
 * 车牌检测
 * @date 2020-07-08
 * @param { String } value
 * @returns { Boolean }
 */
const carId = value => {
  return typeof (value) === 'string' && pattern.carId.test(value.trim())
}

/**
 * 中文名检测
 * @date 2020-07-08
 * @param { String } value
 * @returns { Boolean }
 */
const cnName = value => {
  return typeof (value) === 'string' && pattern.cnName.test(value.trim())
}

/**
 * 英文名检测
 * @date 2020-07-08
 * @param { String } value
 * @returns { Boolean }
 */
const enName = value => {
  return typeof (value) === 'string' && pattern.enName.test(value.trim())
}

/**
 * 用户名检测
 * @date 2020-07-08
 * @param { String } value
 * @returns { Boolean }
 */
const userName = value => {
  return typeof (value) === 'string' && pattern.userName.test(value.trim())
}

/**
 * 地址检测
 * @date 2020-07-08
 * @param { String } value
 * @returns { Boolean }
 */
const address = value => {
  return typeof (value) === 'string' && pattern.address.test(value.trim())
}

/**
 * 日期检测
 * @date 2020-07-08
 * @param { String } value
 * @returns { Boolean }
 */
const date = value => {
  return typeof (value) === 'string' && pattern.date.test(value.trim())
}

/**
 * 数字验证码检测
 * @date 2020-07-08
 * @param { String } value
 * @returns { Boolean }
 */
const numVcode = value => {
  return typeof (value) === 'string' && pattern.numVcode.test(value.trim())
}

/**
 * 其它验证码检测
 * @date 2020-07-08
 * @param { String } value
 * @returns { Boolean }
 */
const vcode = value => {
  return typeof (value) === 'string' && pattern.vcode.test(value.trim())
}

/**
 * 编码检测
 * @date 2020-07-08
 * @param { String } value
 * @returns { Boolean }
 */
const code = value => {
  return typeof (value) === 'string' && pattern.code.test(value.trim())
}

/**
 * 港澳通行证检测
 * @date 2020-07-08
 * @param { String } value
 * @returns { Boolean }
 */
const hkMc = value => {
  return typeof (value) === 'string' && pattern.hkMc.test(value.trim())
}

/**
 * 台湾通行证检测
 * @date 2020-07-08
 * @param { String } value
 * @returns { Boolean }
 */
const taiWan = value => {
  return typeof (value) === 'string' && pattern.taiWan.test(value.trim())
}

/**
 * 护照检测
 * @date 2020-07-08
 * @param { String } value
 * @returns { Boolean }
 */
const passport = value => {
  return typeof (value) === 'string' && pattern.passport.test(value.trim())
}

/**
 * 整数检测
 * @date 2020-07-08
 * @param { String } value
 * @returns { Boolean }
 */
const num = value => {
  return typeof (value) === 'string' && pattern.num.test(value.trim())
}

/**
 * 小数或负数，小数后面一位检测
 * @date 2020-07-08
 * @param { String } value
 * @returns { Boolean }
 */
const decimal = value => {
  return typeof (value) === 'string' && pattern.decimal.test(value.trim())
}

/**
 * 金额检测
 * @date 2020-07-08
 * @param { String } value
 * @returns { Boolean }
 */
const money = value => {
  return typeof (value) === 'string' && pattern.money.test(value.trim())
}

/**
 * 台胞证检测
 * @date 2020-07-08
 * @param { String } value
 * @returns { Boolean }
 */
const twCome = value => {
  return typeof (value) === 'string' && pattern.twCome.test(value.trim())
}

/**
 * 港澳台居民居住证
 * @date 2020-07-08
 * @param { String } value
 * @returns { Boolean }
 */
const hmHid = value => {
  return typeof (value) === 'string' && pattern.hmHid.test(value.trim())
}

module.exports = {
  required,
  id,
  cn,
  mobile,
  email,
  url,
  carId,
  cnName,
  enName,
  userName,
  address,
  date,
  numVcode,
  vcode,
  code,
  hkMc,
  taiWan,
  passport,
  num,
  decimal,
  money,
  twCome,
  hmHid
}
