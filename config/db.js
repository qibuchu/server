var mongoose = require('mongoose');

var db = mongoose.createConnection('mongodb://localhost:27017/yike');

db.on('error',console.error.bind(console,'connection error:'));
db.once('open',function(){
    console.info('连接数据库yike成功！')
});

module.exports = db;