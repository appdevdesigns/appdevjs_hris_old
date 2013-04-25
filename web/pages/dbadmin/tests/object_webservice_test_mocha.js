
	describe('Web Service: Object', function(){
	
	
	   var objID = -1;  // using this to pull specific objects after diferent tests run in sequence
	   
        // make sure Object's table is empty before running tests
        before(function(done) {
                
            console.log('beforeEach called...');
            hris.APIObject.findAll({},function(list){

                var listDFD = [];
                for (var i=0; i<list.length; i++) {
                    listDFD.push(list[i].destroy());
                }
                
                $.when.apply($, listDFD).then(function() {
                     console.log('done called...');
		    	     done();
		    	});
		  	});
		  	
        });
            
            
		 it('Object Table is Empty', function(done){
		    
		    hris.APIObject.findAll({},function(list){
		    	chai.assert.equal(list.length,0, 'list should be empty.');
		    	done();
		  	});
		  	
		 })
		 
		 
		 it('Object.save() prevent empty values', function(done){

            // attempting to save empty data is an Error
		    hris.APIObject.create({}, function(object) {
		    
                // this should not have been allowed.
                chai.assert.isTrue(false, 'should not have saved empty values');    
                done();
            },function(err) {
            
                // error is properly caught
                chai.assert.isTrue(true, 'prevented  saving empty values');
                done();
            });
                        
		  	
		 });
		 
		 
		 
		 it('Object.save() object_key required', function(done){


            // attempting to save without an object_key is an Error
		    hris.APIObject.create({ object_pkey:'pkey', object_table:'table'}, function(object) {
		    
                // this should not have been allowed.
                chai.assert.isTrue(false, 'should not have saved without an object_key');    
                done();
            },function(err) {
            
                // error is properly caught
                chai.assert.isTrue(true, 'prevented  missing object_key values');
                done();
            });
                        
		  	
		 });
		 
		 
		 
		 it('Object.save() object_key only works', function(done){


            // attempting to save empty data is an Error
		    hris.APIObject.create({ object_key:'testperson' }, function(object) {
		    
console.log(object);
                objID = object.object_id;
                if ($.isArray(object)) objID = object[0].object_id;
                
                // this should not have been allowed.
                chai.assert.isTrue(true, 'allow bject_key only save()');    
                done();
            },function(err) {
            
                // error is properly caught
                chai.assert.isTrue(false, 'should have allowed object_key only save()');
                done();
            });
                        
		  	
		 });
		 
		 
		 
		 // 
		 it('Object.save() object_key only saves should auto generate the pkey and table', function(done){


            // attempting to save empty data is an Error
		    hris.APIObject.findOne({ id:objID}, function(object) {
		    
                var attrs = {};
                var testKeyOnly= {
                    object_id: objID,
                    object_key:'testperson',
                    object_pkey:'testperson_id',
                    object_table:'hris_testperson'
                }
                
                for (var t in testKeyOnly) {
                    attrs[t] = object.attr(t);
                }
                
                // this should not have been allowed.
                chai.assert.deepEqual(attrs, testKeyOnly, ' pkey and table have expected initial values');    
                done();
                
            },function(err) {
            
                // error is properly caught
                chai.assert.isTrue(false, 'couldnt find recently added entry by id:'+objID);
                done();
            });
                        
		  	
		 });
	})