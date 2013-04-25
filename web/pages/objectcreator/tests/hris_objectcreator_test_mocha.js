
	describe('object creator', function(){

		it('should be able to get a list of objects', function(done){
		    hris.Object.findAll({},function(data){
		    	done();
		  	});
		 });
	});
