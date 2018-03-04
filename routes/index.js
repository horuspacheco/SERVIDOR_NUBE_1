var express = require('express');
var routerIndex = express.Router();
var path = require('path');
var fileSystem = require('fs')
var fs = require('fs-extra');
var mongoose= require('mongoose')

var Ventas = mongoose.model('Ventas');


routerIndex.get('/', function(req,res,next){

	res.render('index')

})


routerIndex.get('/ventas', function(req,res,next){


	Ventas.find(function(err,ventas){

		if(err){return next(err)}

		res.json(ventas);


	}).sort({fecha : -1})

})






routerIndex.post('/ventas', function(req,res,next){

		
		var venta = new Ventas(req.body)

		var rutas = [];




		venta.save(function(err,venta){
			if(err){return next(err)}

			for(var i=0;i<venta.imagenesId.length;i++){
				fs.copy(venta.imagenesId[i].ruta,venta.imagenesId[i].rutaDestino);
			}

			for(var i=0;i<venta.pdf.length;i++){
				fs.copy(venta.pdf[i].ruta,venta.pdf[i].rutaDestino);
			}


			res.json(venta);
		})


})




routerIndex.get('/ventas/:id', function(req,res,next){


	Ventas.findById(req.params.id, function(err,venta){

		if(err) throw err;
		console.log(venta);
		res.json(venta);


	})


})


routerIndex.get('/correos/:fecha', function(res,res,next){

	Ventas.find({fechaSalida:req.params.fecha},function(err,ventas){


		if(err) throw err;

		res.json(ventas);


	})


})


routerIndex.put('/ventas/:id', function(req,res,next){



	Ventas.findById(req.params.id,  function(err,venta){



		console.log(venta)


		venta.rut = req.body.rut ;
		venta.nombre = req.body.nombre ;
		venta.telefono = req.body.telefono ;
		venta.correo = req.body.correo ;
		venta.direccion = req.body.direccion ;
		venta.fechaSalida = req.body.fechaSalida;
		venta.destino = req.body.destino;
		venta.total = req.body.total ;
		venta.abonado = req.body.abonado ;
		venta.fecha = req.body.fecha ;
		venta.imagenesId = req.body.imagenesId ;
		venta.pdf = req.body.pdf ;
		venta.vendedor = req.body.vendedor ;
		venta.hotel = req.body.hotel ;
		venta.desayuno = req.body.desayuno ;
		venta.tour = req.body.tour ;
		venta.seguro = req.body.seguro ;
		venta.observacion = req.body.observacion ;


	venta.save(function(err, venta){

			//if(err) res.send(err);

			if(venta.imagenesId.length>0){


				if(req.body.imagenesViejas.length>0){
					fs.stat('C:/Users/Default/MiyasTravel', function(err,stat){
						for(var i=0;i<req.body.imagenesViejas.length-1;i++){
							if(err == null){
    							fs.remove(req.body.imagenesViejas[i].rutaDestino, err => {
							  		//if (err) return console.error(err)
									  console.log(req.body.imagenesViejas[i].rutaDestino + " Eliminado")
								})
	 						 }else{
	 						 }
						}
						})
				}
				for(var i=0;i<venta.imagenesId.length;i++){
					fs.copy(venta.imagenesId[i].ruta,venta.imagenesId[i].rutaDestino);
				}
			}




            if(venta.pdf.length>0){
				if(req.body.pdfViejas.length>0){
					fs.stat('C:/Users/Default/MiyasTravel', function(err,stat){
						for(var i=0;i<req.body.pdfViejas.length-1;i++){
							if(err == null){
    							fs.remove(req.body.pdfViejas[i].rutaDestino, err => {
							  		//if (err) return console.error(err)
									  console.log(req.body.pdfViejas[i].rutaDestino + " Eliminado")
								})
	 						 }
						}

						})
				
				}
				for(var i=0;i<venta.pdf.length;i++){
					fs.copy(venta.pdf[i].ruta,venta.pdf[i].rutaDestino);
				}
			}
			res.json(venta);

		})

		


	})


})



module.exports = routerIndex
