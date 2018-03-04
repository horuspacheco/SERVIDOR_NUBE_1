var express = require('express')
var path = require('path')
var app_express = express()
var coockieParser = require('cookie-parser')
var bodyParser = require('body-parser')
var mongoose = require('mongoose')
var port = process.env.PORT || 3000;
require('./models/venta')

mongoose.Promise = global.Promise
mongoose.connect('mongodb://localhost:27017/agencia')
console.log("Conexion a la base de datos")


var routerIndex = require('./routes/index')
app_express.set('views', path.join(__dirname, 'views'))
app_express.set('view engine', 'ejs')


app_express.use(bodyParser.json())
app_express.use(bodyParser.urlencoded({extended : false}))
app_express.use(coockieParser())
app_express.use(express.static(path.join(__dirname,"public")))






app_express.use(function(req,res,next){

  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Method", "*")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")

  next()

})


app_express.use("/", routerIndex);


app_express.listen(port, function(){
  console.log("Servidor Iniciado en el puerto "+port);
})

