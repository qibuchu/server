//引入解析req.body插件
var bodyParser = require('body-parser');

var jwt = require('./dao/jwt');
const port = 3000;
const express = require('express');
const app = express();
const cors = require('cors');
//socket.io
var server = app.listen(8082);
var io = require('socket.io')(server);
require('./dao/socket')(io);

//设置允许跨域访问该服务.
app.use(cors({ origin: 'http://localhost:5173' }));

//设置允许跨域访问该服务。
app.all('*', function(req, res, next) {
  //允许访问ip *为所有
  res.header("Access-Control-Allow-Origin", 'http://localhost:5173');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, OPTIONS");
  res.header("X-Powered-By", ' 3.2.1')
  //这段仅仅为了方便返回json而已
  res.header("Content-Type", "application/json; charset=utf-8");
  if(req.method == 'OPTIONS') {
  //让options请求快速返回
  res. sendStatus (200);
  } else {
            next();
          }
  });

//解析前端数据
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}) );
app. use(bodyParser. json({limit: '50mb'}) );
app.use('/user',express.static('user'))
app.use('/group',express.static('group'))
//获取静态路径
app.use(express.static(__dirname + '/data'));

// // token判断
// app.use(function(req,res,next){
//   if(typeof(req.body.token)!='undefined'){
//     //处理token匹配
//     let token = req.body.token;
//     let tokenMatch = jwt.verifyToken(token);
//     console.log(token)
//     // if(tokenMatch== 1){
//     //   //通过认证
//     //   next();
//     // }else{
//     //   //验证不通过
//     //   res.send({status:300});
//     // }
//     next();
//   }
//   // else{
//   //   next();
//   // }
// })


//token判断
app.use(function(req,res,next){
  //console.log(req.body)
  if(typeof(req.body.token)!='undefined'){
    //处理token匹配
    let token = req.body.token;
    //console.log(token,"token")
    let tokenMatch = jwt.verifyToken(token);
    //console.log(token)
    if(tokenMatch== 1){
      //通过认证
      next();
    }else{
      //验证不通过
      console.log('token不匹配')
      res.send({status:300,massage:'token不匹配'});
    }
  }else{
    next();
   }
})

//引入路由
require('./router/index')(app);
require('./router/files')(app);

//404页面
app.use(function(req,res,next){
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
})

//出现错误处理
app.use(function(err,req,res,next){
    res.status(err.status || 500)
    res.send(err.message);
})

app.listen(port, () => {
  console.log(`您已启动端口： ${port}`)
})

