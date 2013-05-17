
	describe('Web Service: Attribute', function(){
	
	
	   var attributeSetID = -1;  // using this to pull specific objects after diferent tests run in sequence
	   var attributeID = -1;
	   var object;
	   var attributeset;
	   
        // make sure Attributeset's table is empty before running tests
        before(function(done) {
                
            console.log('beforeEach called...');
            hris.APIAttribute.findAll({},function(list){

                var listDFD = [];
                for (var i=0; i<list.length; i++) {
                    listDFD.push(list[i].destroy());
                }
                
                $.when.apply($, listDFD).then(function() {
                     console.log('done called...');
					 var obj = {
					 	object_key: 'object_test',
            			object_pkey: 'test_id',
            			object_table: 'hris_object_test'
					 };
					 hris.Object.create(obj, function(object) {
					 	var attrSet = {
							type_id: 1,
							object_id: object.object_id,
							attributeset_table: 'test_attributeset_table',
							attributeset_relation: 'many',
							attributeset_uniqueKey: 0,
							attributeset_key: 'test_attributeset_key',
							attributeset_pkey: 'test_attributeset_pkey',
							attributeset_label: 'test attributeset'
						};
						hris.Attributeset.create(attrSet,function(attributeset){
							if ($.isArray(attributeset)) {
                				attributeSetID = attributeset[0].attributeset_id;
                			} else {
                				attributeSetID = attributeset.attributeset_id;
                			}
							done();
						});
					 });
		    	});
		  	});
		  	
        });
        
		after(function(done) {
                
            console.log('after called...');
            hris.Object.findAll({},function(list){

                var listDFD = [];
                for (var i=0; i<list.length; i++) {
                    listDFD.push(list[i].destroy());
                }
                
                $.when.apply($, listDFD).then(function() {
                     console.log('done called...');
					 hris.Attributeset.findAll({},function(list){
						var listattrSetDFD = [];
                		for (var i=0; i<list.length; i++) {
                    		listattrSetDFD.push(list[i].destroy());
                		}
                
                		$.when.apply($, listattrSetDFD).then(function() {
                     		console.log('done called...');
							hris.Attribute.findAll({},function(list){
								var listAttrDFD = [];
                				for (var i=0; i<list.length; i++) {
                    				listAttrDFD.push(list[i].destroy());
                				}
                
                				$.when.apply($, listAttrDFD).then(function() {
                     				console.log('done called...');
		    	     				done();
		    					});
		  					});
		    			});
		  			});
		    	});
		  	});
		  	
        });
            
		 it('Attribute Table is Empty', function(done){
		    
		    hris.APIAttribute.findAll({},function(list){
		    	chai.assert.equal(list.length,0, 'list should be empty.');
		    	done();
		  	});
		  	
		 });

		 
		 it('Attribute.save() require all fields for save', function(done){


			var attr = {
					attributeset_id: attributeSetID,
					attribute_column:'testkey_code' ,
					attribute_datatype: 'Text',
					meta: 'meta data',
					attribute_permission: 'Read',
					attribute_uniqueKey: 0
			};
            // attempting to save without an object_key is an Error
		    hris.APIAttribute.create(attr, function(attribute) {
		    
                if ($.isArray(attribute)) {
                	attributeID = attribute[0].attribute_id;
                } else {
                	attributeID = attribute.attribute_id;
                }
		    
                chai.assert.isTrue(true, 'should save attribute ');    
                done();
            },function(err) {
            
				console.log(err);
                // error is properly caught
                chai.assert.isTrue(false, 'did not save attribute ');
                done();
            });
                        
		  	
		 });
		 
		 
		 
		 // 
		 it('Attribute.findOne() can find recently added entry', function(done){


            // attempting to save empty data is an Error
		    hris.APIAttribute.findOne({ attribute_id:attributeID}, function(data) {
		    
                var attrs = {};
                var testKeyOnly= {
                    attribute_id: attributeID,
					attributeset_id: attributeSetID,
					attribute_column:'testkey_code' ,
					attribute_datatype: 'Text',
					meta: 'meta data',
					attribute_permission: 'Read',
					attribute_uniqueKey: 0
                }
                
                for (var t in testKeyOnly) {
                    attrs[t] = data.attr(t);
                }
                
                // this should not have been allowed.
                chai.assert.deepEqual(attrs, testKeyOnly, ' attribute has expected initial values');    
                done();
                
            },function(err) {
            
                // error is properly caught
                chai.assert.isTrue(false, 'couldnt find recently added entry by id:'+attributeSetID);
                done();
            });
                        
		  	
		 });
	})