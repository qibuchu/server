var jwt = require('jsonwebtoken');
var secret = 'yikeshiguang';

// 生成token
exports.generateToken = function(e) {
    try {
        let payload = { id: e, time: new Date() };
        let token = jwt.sign(payload, secret, { expiresIn: 60 * 60 * 24 * 120 });

        return token;
    } catch (error) {
        // 这里处理错误，可以是记录日志、抛出错误等
        console.error('Error generating token:', error);
        throw error; // 或者返回null，或者进行其他的错误处理
    }
}
//解码
exports.verifyToken = function(e)
{   let payload;
    jwt.verify(e,secret,function(err,result){
        if(err){
            payload=0;
        }else{
            payload=1;
        }
    });

    return payload;
}