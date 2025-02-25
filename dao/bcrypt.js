var bcrypt = require('bcryptjs');

// 生成hash密码
exports.encryption = function(e) {
  // 生成一个随机的salt
  let salt = bcrypt.genSaltSync(10);

  // 生成hash密码
  let hash = bcrypt.hashSync(e, salt);
  return hash;
};

// 解密（同步方法）
exports.verification = function(e,hash) {
  console.log('明文密码:', e);
  console.log('哈希密码:', hash);

  let verif = bcrypt.compareSync(e,hash);
  console.log('验证结果:', verif);

  return verif;
};

// 解密（异步方法）
exports.verificationAsync = async function(e, hash) {
  try {
    const verif = await bcrypt.compare(e, hash);
    //console.log('验证结果:', verif);
    return verif;
  } catch (err) {
    console.error('验证出错:', err);
    throw err;
  }
};