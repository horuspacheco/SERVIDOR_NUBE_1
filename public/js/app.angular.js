angular.module('agencia', ['ui.router','base64', 'pdf'])
.config(function($stateProvider, $urlRouterProvider){

  $stateProvider
  .state('inicio',{
    url:'/inicio',
    templateUrl:'public/views/inicio.html',
  })

  .state('ventas', {
  	url:'/ventas',
    templateUrl:'public/views/ventas.html',
    controller: 'ventaControl'
  })

  .state('venta', {
  	url:'/ventas/:id',
    templateUrl:'public/views/detalle.html',
    controller: 'detalleCtrl'
  })



  .state('pdf',{

  	url : '/ventas/:id/pdf',
  	templateUrl :"public/views/pdf.html",
  	controller: 'pdfCtrl'

  })


  

  $urlRouterProvider.otherwise('inicio');

})




.service('comun', function($http, $q){


	$http.defaults.headers.post['Access-Control-Allow-Origin'] = '*';
	$http.defaults.headers.post['Access-Control-Allow-Methods'] = 'GET, POST, DELETE, PUT';
	$http.defaults.headers.post['Access-Control-Allow-Credential'] = 'true';


	var comun = {};
	comun.venta = {};
	comun.ventas = [];
	comun.fechaNueva = {};


	comun.getVentas = function(){

		return $http.get('http://localhost:3000/ventas').then(function successCallback(response){


			angular.copy(response.data, comun.ventas)
			comun.ventas.cant_ventas = comun.ventas.length;
		})

		return comun.ventas;

	}





	comun.listarCorreos = function(datos){

		return $http.get('http://locahost:3000/correos/' + datos.fecha, datos).then(function successCallback(response){


			angular.copy(response, comun.ventas)

			return comun.ventas;
		})

	}


	comun.agreeVentas = function(venta){

		return $http.post('http://localhost:3000/ventas',venta).then(function successCallback(response){
				
				
					comun.getVentas();

			})

		return comun.ventas;
	}



	comun.actualizarVenta = function(venta){


		return $http.put('http://localhost:3000/ventas/' + venta._id, venta).then(function successCallback(response){

			var indice = comun.ventas.indexOf(venta);
			comun.ventas[indice] = response;
			comun.getVentas();
			return comun.ventas;

		})


	}


	comun.getVenta = function(idVenta){


		return $http.get('http://localhost:3000/ventas/'+idVenta,idVenta).then(function successCallback(response){

			console.log("Respuesta de getVenta")
			

			angular.copy(response.data, comun.venta);

			return comun.venta;
		})


	}


	comun.calcularNuevaFecha = function(fecha){


		var dia = fecha.getDate();
		var mes = fecha.getMonth() +1;
		var anio =fecha.getFullYear();


			if(dia<=9){

				dia = 0+dia;

			}

			if(mes<=9){

				mes=0+mes;

			}


			comun.fechaNueva=  anio+ '/'+mes+'/' +dia ;
			
			return comun.fechaNueva;


	}





	return comun;

})



.controller('pdfCtrl', function($scope,$http,$q,$state,$stateParams,comun){


	var idVenta = $stateParams.id;

	$scope.venta = {};
	$scope.pdf = 0;
	comun.getVenta(idVenta);
	window.scrollTo(0, 0);
	$scope.venta = comun.venta;


	console.log("VENTA : ");
	console.log($scope.venta.pdf[$scope.pdf].nombreArchivo)
	
	$scope.pdfName = $scope.venta.pdf[$scope.pdf].nombreArchivo;
	$scope.pdfUrl = $scope.venta.pdf[$scope.pdf].rutaDestino;
	$scope.scroll = 0;
	 
	$scope.getNavStyle = function(scroll) {
	    if(scroll > 100) return 'pdf-controls fixed';
	    else return 'pdf-controls fixed';
	}



	$scope.siguientePDF = function(){


		if($scope.pdf < $scope.venta.pdf.length-1){
			$scope.pdf++;
			$scope.pdfName = $scope.venta.pdf[$scope.pdf].nombreArchivo;
			$scope.pdfUrl = $scope.venta.pdf[$scope.pdf].rutaDestino;
			$scope.scroll = 0;
			window.scrollTo(0, 0);

			
		}


		console.log($scope.pdf);
		console.log($scope.venta.pdf[$scope.pdf].rutaDestino)
	}



	$scope.anteriorPDF = function(){


		if($scope.pdf >0){
			$scope.pdf--;
			$scope.pdfName = $scope.venta.pdf[$scope.pdf].nombreArchivo;
			$scope.pdfUrl = $scope.venta.pdf[$scope.pdf].rutaDestino;
			$scope.scroll = 0;
			window.scrollTo(0, 0);

		
		}
		console.log($scope.pdf);
		console.log($scope.venta.pdf[$scope.pdf].rutaDestino)
	}


})




.controller('detalleCtrl', function($scope,$http,$q,$state,$stateParams,comun){


/*
	$scope.pdfName = 'prueba';
  $scope.pdfUrl = './prueba.pdf';
  $scope.scroll = 0;
 
  $scope.getNavStyle = function(scroll) {
    if(scroll > 100) return 'pdf-controls fixed';
    else return 'pdf-controls fixed';
  }
*/

	var idVenta = $stateParams.id;

	$scope.venta = {};

	comun.getVenta(idVenta);


	$scope.venta = comun.venta;


	console.log($scope.venta);



	$scope.descargarPDF = function (venta) {

var pdf = new jsPDF('p', 'pt', 'letter')

var source = $('#descargarPDF')[0];
// we support special element handlers. Register them with jQuery-style
// ID selector for either ID or node name. ("#iAmID", "div", "span" etc.)
// There is no support for any other type of selectors
// (class, of compound) at this time.
var specialElementHandlers = {
    // element with id of "bypass" - jQuery style selector
    '.elemento': function(element, renderer){
        // true = "handled elsewhere, bypass text extraction"
        return true
    }
}

 margins = {
    top: 10,
    bottom: 60,
    left: 40,
    width: 522
  };
  // all coords and widths are in jsPDF instance's declared units
  // 'inches' in this case
pdf.fromHTML(
    source // HTML string or DOM elem ref.
    , margins.left // x coord
    , margins.top // y coord
    , {
        'width': margins.width // max width of content on PDF
        , 'elementHandlers': specialElementHandlers
    },
    function (dispose) {
      // dispose: object with X, Y of the last line add to the PDF
      //          this allow the insertion of new lines after html

      var nombre = venta.rut + "-" + venta.fecha+".pdf";
        pdf.save(nombre);
      },
    margins
  )




     };




})


.controller('ventaControl', function($scope,$http, $q, $state , comun){

	$scope.ventaForm = {};
	$scope.ventaFormAct = {};
	$scope.cliente = {};
	$scope.venta = {};
	$scope.imagenes = {};
	$scope.ventas = [];
	$scope.formBuscar = {}
	$scope.buscar = {}
	$scope.pathsId = [];
	$scope.imagen = "";
	$scope.rutasImg = [];
	$scope.extenionesImg = [];
	$scope.rutasPdf = [];
	$scope.extenionesPdf = [];
	$scope.ventaForm.imagenesId = [];
	$scope.ventaForm.pdf = [];
	$scope.ventaFormAct.imagenesId = [];
	$scope.ventaFormAct.pdf = [];
	$scope.mensajeForm = "";
	$scope.filtrado = {jpg : 'jpg',jpeg:"jpeg",png : "png",pdf : "pdf"}
	$scope.listarCorreos = {};
	$scope.listarForm = {};
	$scope.fechaFiltrado = "";
	$scope.formVentaVacio = {}



	$scope.paises = new Array('Afganistán','Albania' ,'Alemania' ,'Andorra' ,'Angola ','Antigua y Barbuda','Arabia Saudita ','Argelia' ,'Argentina','Armenia' ,'Australia','Austria' ,'Azerbaiyán','Bahamas','Bangladés','Barbados','Baréin','Bélgica' ,'Belice' ,'Benín' ,'Bielorrusia' ,'Birmania' ,'Bolivia' ,'Bosnia-Herzegovina' ,'Botsuana' ,'Brasil' ,'Brunéi' ,'Bulgaria' ,'Burkina Faso' ,'Burundi', 'Bután' ,'Cabo Verde' ,'Camboya' ,'Camerún', 'Canadá', 'Catar','Chad', 'Chile' ,'China', 'Chipre','Colombia' ,'Comoras' ,'Congo' ,'Corea del Norte','Corea del Sur' ,'Costa de Marfil' ,'Costa Rica' ,'Croacia','Cuba' ,'Dinamarca' ,'Dominica','Ecuador',
'Egipto',
'El Salvador',
'Emiratos Árabes Unidos',
'Eritrea',
'Eslovaquia',
'Eslovenia',
'España',
'Estados Unidos',
'Estonia',
'Etiopía',
'Filipinas',
'Finlandia',
'Fiyi',
'Francia',
'Gabón',
'Gambia',
'Georgia',
'Ghana',
'Granada',
'Grecia',
'Guatemala',
'Guinea',
'Guinea Ecuatorial',
'Guinea-Bisáu',
'Guyana',
'Haití',
'Honduras',
'Hungría',
'India',
'Indonesia',
'Irak',
'Irán',
'Irlanda',
'Islandia',
'Islas Marshall',
'Islas Salomón',
'Israel',
'Italia',
'Jamaica',
'Japón',
'Jordania',
'Kazajistán',
'Kenia',
'Kirguistán',
'Kiribati',
'Kosovo',
'Kuwait',
'Laos',
'Lesoto',
'Letonia',
'Líbano',
'Liberia',
'Libia',
'Liechtenstein',
'Lituania',
'Luxemburgo',
'Macedonia',
'Madagascar',
'Malasia',
'Malaui',
'Maldivas',
'Malí',
'Malta',
'Marruecos',
'Mauricio',
'Mauritania',
'México',
'Micronesia',
'Moldavia',
'Mónaco',
'Mongolia',
'Montenegro',
'Mozambique',
'Namibia',
'Nauru',
'Nepal',
'Nicaragua',
'Níger',
'Nigeria',
'Noruega',
'Nueva Zelanda',
'Omán',
'Países Bajos',
'Pakistán',
'Palaos',
'Palestina',
'Panamá',
'Papúa Nueva Guinea',
'Paraguay',
'Perú',
'Polonia',
'Portugal',
'Reino Unido',
'República Centroafricana',
'República Checa',
'República Democrática del Congo',
'República Dominicana',
'Ruanda',
'Rumania',
'Rusia',
'Samoa',
'San Cristóbal y Nieves',
'San Marino',
'San Vicente y las Granadinas',
'Santa Lucía',
'Santo Tomé y Príncipe',
'Senegal',
'Serbia',
'Seychelles',
'Sierra Leona',
'Singapur',
'Siria',
'Somalia',
'Sri Lanka',
'Suazilandia',
'Sudáfrica',
'Sudán',
'Sudán del Sur',
'Suecia',
'Suiza',
'Surinam',
'Tailandia',
'Taiwán',
'Tanzania',
'Tayikistán',
'Timor Oriental',
'Togo',
'Tonga',
'Trinidad y Tobago',
'Túnez',
'Turkmenistán',
'Turquía',
'Tuvalu',
'Ucrania',
'Uganda',
'Uruguay',
'Uzbekistán',
'Vanuatu',
'Vaticano',
'Venezuela',
'Vietnam',
'Yemen',
'Yibuti',
'Zambia',
'Zimbabue')



	$("input[type = 'date']").on('change', function(e){

		console.log("cambio");


	})




	$("#fechaCorreos").on('change', function(){


		comun.calcularNuevaFecha($scope.listarCorreosForm.fecha);

		$scope.listarCorreos.fecha = comun.fechaNueva;


	})



	$("#fechaFiltrar").on('change', function(){


		comun.calcularNuevaFecha($scope.listarForm.fechaFiltrado);

		$scope.listarForm.fecha = comun.fechaNueva;

		console.log($scope.listarForm.fecha)


	})


	$('#modal-form-ventas').on('hidden.bs.modal', function(e){
		$('#modal-form-ventas form input').val('')
		$('#modal-form-ventas form #file-image .custom-file-label').html("0 Imagenes seleccionadas");
		$('#modal-form-ventas form #file-pdf .custom-file-label').html("0 PDFs seleccionadas");

	})



	$('#modal-form-correos').on('hidden.bs.modal', function(e){


		$scope.listarCorreos = {};
		$scope.listarCorreosForm = {};

	})



	comun.getVentas()
	$scope.ventas = comun.ventas;

	console.log($scope.ventas);





$('.custom-file-input').on('change',function(){

	var id = $(this).attr('id');
	console.log(this.files)
	console.log(id);
	var accion = $(this).attr('accion');

	console.log("la accion a realizar es: " + accion);

	var rutas = []; var extensiones = []; var instanciasArchivo = []; 
			for(var i = 0; i<this.files.length; i++){
					var nombre =new Date().getTime()+Math.floor(Math.random() * 999999) * new Date().getTime();
					var ruta = this.files[i].path;
					var extTemp = this.files[i].type.split('/')
					var nombreArchivo = nombre + "." + extTemp[1];

					if(id == "img")
						var rutaDestino = "C:/Users/Default/MiyasTravel/imagenes/"+ nombreArchivo;
					if(id == 'pdf')
						var rutaDestino = "C:/Users/Default/MiyasTravel/pdfs/"+ nombreArchivo;
					instanciasArchivo[i] = {"ruta" : ruta, 
											"rutaDestino" : rutaDestino, 
											"nombreArchivo" : nombreArchivo, 
											'extension' : extTemp[1]
										}



				}


	if(id == "img"){

				if(accion == "cargar")
			
					$scope.ventaForm.imagenesId = instanciasArchivo;
				else
					if(accion == "actualizar")
						$scope.ventaFormAct.imagenesId = instanciasArchivo;

				


				console.log($scope.ventaForm.imagenesId)

		$(this).next('.custom-file-label').html("<b>" + this.files.length +"</b>"+ " Imagenes seleccionadas");
	}else{
		if(id == 'pdf'){

				if(accion == "cargar")
			
					$scope.ventaForm.pdf = instanciasArchivo;
				else
					if(accion == "actualizar")
						$scope.ventaFormAct.pdf = instanciasArchivo;


				console.log($scope.ventaForm.pdf)


			$(this).next('.custom-file-label').html("<b>" + this.files.length +"</b>"+ " PDFs Seleccionados");

		}
	}
  
  
})









	$scope.buscarVenta = function(){

		$scope.buscar = $scope.formBuscar;

	}








	$scope.cargarActualizar = function(venta){

		var nuevo = {};
		angular.copy(venta, nuevo);
		nuevo.imagenesViejas = [];
		nuevo.pdfViejas = [];
		


		angular.copy(venta.imagenesId,nuevo.imagenesViejas);
		angular.copy(venta.pdf,nuevo.pdfViejas);
		nuevo.fecha = new Date(nuevo.fecha)
		nuevo.fechaSalida = new Date(nuevo.fechaSalida)

		angular.copy(nuevo, $scope.ventaFormAct);
		$scope.ventaFormAct = nuevo;
		console.log("Actualizado")
		console.log($scope.ventaFormAct);

		$state.go()

	}




	$scope.actualizarVenta = function(){

		comun.calcularNuevaFecha($scope.ventaFormAct.fecha)
		$scope.ventaFormAct.fecha = comun.fechaNueva;

		comun.calcularNuevaFecha($scope.ventaFormAct.fechaSalida)
		$scope.ventaFormAct.fechaSalida = comun.fechaNueva;

		comun.actualizarVenta($scope.ventaFormAct);
		$scope.ventaFormAct = {};
		$scope.ventas = comun.ventas;

		$scope.mensajeForm = "Registro actualizado correctamente.";
		$('#modal-form-act-ventas').modal('toggle');
		$('#modal-mensaje-success-form').modal('show');

	}



	$scope.agregarVenta = function(){


		console.log($scope.ventaForm)

			comun.calcularNuevaFecha($scope.ventaForm.fecha)

			$scope.ventaForm.fecha = comun.fechaNueva;


			comun.calcularNuevaFecha($scope.ventaForm.fechaSalida)

			$scope.ventaForm.fechaSalida = comun.fechaNueva;
			
			comun.agreeVentas({

				
				rut: $scope.ventaForm.rut,
				nombre: $scope.ventaForm.nombre,
				telefono: $scope.ventaForm.telefono,
				correo: $scope.ventaForm.correo,
				direccion: $scope.ventaForm.direccion,
				fechaSalida : $scope.ventaForm.fechaSalida,
				destino : $scope.ventaForm.destino,
				total: $scope.ventaForm.total,
				abonado: $scope.ventaForm.abonado,
				fecha : $scope.ventaForm.fecha,
				imagenesId: $scope.ventaForm.imagenesId,
				pdf: $scope.ventaForm.pdf,
				vendedor : $scope.ventaForm.vendedor,
				hotel: $scope.ventaForm.hotel,
				desayuno: $scope.ventaForm.desayuno,
				tour: $scope.ventaForm.tour,
				seguro: $scope.ventaForm.seguro,
				observacion: $scope.ventaForm.observacion

			})
			$scope.mensajeForm = "Venta realizada";
			$scope.ventaForm = {};
			$scope.ventas = comun.ventas;
			console.log($scope.ventas);
			$scope.mensajeForm = "Venta realizada correctamente";
			$('#modal-form-ventas').modal('toggle');
			$('#modal-mensaje-success-form').modal('show');



			
	}






	$scope.verVenta = function(venta){

		$scope.venta = {};

		$scope.venta = venta;

	}

})


.directive('uploaderImgModel',  function($parse){


	return {

		restrict : 'A',
		link : function(scope, iElement,iAttrs){

			iElement.on('change', function(e){

				console.log("cambio el campo")

				var rutasImg = []; var extensionesImg = [];
				for(var i = 0; i<iElement[0].files.length; i++){

					rutasImg[i] = iElement[0].files[i].path;
					extensionesImg[i] = iElement[0].files[i].type;

				}

				scope.rutasImg = rutasImg;
				scope.extensionesImg = extensionesImg;


				return scope.rutasImg

			})
			return scope.rutasImg;
		}

	}

})


.directive('uploaderPdfModel',  function($parse){


	return {

		restrict : 'A',
		link : function(scope, iElement,iAttrs){

			iElement.on('change', function(e){

				console.log("cambio el campo")

				var rutasPdf = []; var extensionesPdf = [];
				for(var i = 0; i<iElement[0].files.length; i++){

					rutasPdf[i] = iElement[0].files[i].path;
					extensionesPdf[i] = iElement[0].files[i].type;

				}

				scope.rutasPdf = rutasPdf;
				scope.extensionesPdf = extensionesPdf;


				return scope.rutasPdf

			})
			return scope.rutasPdf;
		}

	}

})
