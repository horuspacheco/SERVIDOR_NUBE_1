var mongoose = require('mongoose')
var Schema = mongoose.Schema

var ventaSchema = new Schema({

	rut : String,
	nombre : String,
	telefono : String,
	correo : String,
	direccion : String,
	fechaSalida : String,
	destino : String,
	total : Number,
	abonado : Number,
	fecha : String,
	imagenesId : Array,
	pdf : Array,
	vendedor : String,
	hotel : Boolean,
	desayuno : Boolean,
	tour: Boolean,
	seguro : Boolean,
	observacion : String


})

mongoose.model("Ventas", ventaSchema);