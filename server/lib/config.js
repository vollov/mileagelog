module.exports = function(){
	switch(process.env.NODE_ENV){
		case 'test':
			return {db_name: 'mileage_test'};
		case 'prod':
			return {db_name: 'mileage_prod'};
		case 'debug':
			return {db_name: 'mileage_prod'};
		default:
			return {db_name: 'mileage_prod'};
	}
};