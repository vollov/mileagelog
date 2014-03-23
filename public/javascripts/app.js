(function($){
	//alert("OK!");
}(jQuery));

var app = {
	listMileage: function(id){
		alert("list mileage with vid=" + id);
	},
	
	deleteVehicle: function(id){
		$.delete('/milage/'+id, {},
				function(data){
				$("#vehicles").text(data);
				});
		alert("delete vehicle with vid=" + id);
	},
}

