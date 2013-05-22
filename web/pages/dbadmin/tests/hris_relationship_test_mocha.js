
describe('Client side model: APIRelationship', function() {

    var relationshipID = -1;  // using this to pull specific objects after diferent tests run in sequence
        
    // clear the table before running tests
    before(function(done) {
        
        hris.APIRelationship.findAll({}, function(list) {
            var listDFD = [];
            for (var i=0; i<list.length; i++) {
                // this sounds so sinister
                console.log('destroying Relationship ' + i);
                listDFD.push(list[i].destroy());
            }
            
            $.when.apply($, listDFD)
            .then(function() {
                 console.log('destroy successful');
                 done();
            })
            .fail(function(err) {
                 console.log('destroy failed');
                 console.log(err);
                 done();
            });
        });
        
    });
        

    it('table is initially empty', function(done) {
        
        hris.APIRelationship.findAll({}, function(list) {
            chai.assert.lengthOf(list, 0, 'list should be empty');
            done();
        });
        
    });
     
     
    it('.create() rejects empty values', function(done) {
    
        // attempting to save empty data is an Error
        hris.APIRelationship.create({}, function(object) {
        
            // this should not have been allowed.
            throw "should not have saved empty values";
            done();
    
        }, function(err) {
        
            // error is properly caught
            done();
        });
                    
        
    });
     
     
     
    var testData = {
        objA_id: null,
        objB_id: null,
        relationship_type: "has_many",
        //language_code: "en",
        relationship_label: "test relationship"
    };

    
    // Create test entry
    it('.create()', function(done) {
        
        // Create obj1 and obj2 in parallel.
        // When they are done, then create relationship.
        
        async.auto({
            // Create first object entry
            obj1: function(ok) {
                hris.APIObject.create({
                    object_key: 'testobj1',
                    object_pkey: 'testobj1_id',
                    object_table: 'testobj1'
                })
                .then(function(result) {
                    testData.objA_id = result[0].object_id;
                    ok();
                })
                .fail(function(err) {
                    ok(err);
                });
            },
            // Create second object entry
            obj2: function(ok) {
                hris.APIObject.create({
                    object_key: 'testobj2',
                    object_pkey: 'testobj2_id',
                    object_table: 'testobj2'
                })
                .then(function(result) {
                    testData.objB_id = result[0].object_id;
                    ok();
                })
                .fail(function(err) {
                    ok(err);
                });
            },
            // Create relationship entry for the objects.
            // Should only start once obj1 + obj2 are done.
            rel: ['obj1', 'obj2', function(ok) {
                hris.APIRelationship.create(testData, function(result) {
                    relationshipID = result[0].relationship_id;
                    ok();
                }, function(err) {
                    ok(err);
                });
            }]
        }, function(err, results) {
            // This executes after all the above tasks have completed or failed
            if (err) {
                // One of the steps failed
                console.log(err);
                throw err;
            }
            else {
                // All clear
                done();
            }
        });
        
    });
    
    
    // Look for the entry we just created
    it('.findOne() can find recently added entry', function(done) {
    
        hris.APIRelationship.findOne({ relationship_id: relationshipID })
        .then(function(data) {
            
            //chai.assert.isArray(data);
            //chai.assert.lengthOf(data, 1, 'entry could not be found');

            chai.assert.isObject(data, 'entry could not be found');
            
            // Compare the fetched data with the data used to create the
            // entry in the first place.
            var attrs = {};
            for (var fieldName in testData) {
                if (fieldName == 'relationship_id') continue;
                attrs[fieldName] = data.attr(fieldName);
                chai.assert.equal(data.attr(fieldName), testData[fieldName]);
            }
            
            chai.assert.deepEqual(attrs, testData, 'entry does not have expected data');
            done();
            
        })
        .fail(function(err) {
            throw err;
        });
                    
    });
    
    
    // Delete the object we created
    it('.destroy()', function(done) {
        hris.APIRelationship.destroy({ relationship_id: relationshipID })
        .then(function() {
            done();
        })
        .fail(function(err) {
            throw(err);
        });
    });
    
    
    // Try creating an entry with a missing field
    it('.create() requires all fields for save', function(done) {
    
        var badTestData = {
            //objA_id: 1,
            //objB_id: 2,
            //relationship_type: "type",
            language_code: "en",
            relationship_label: "relationship label"
        };
            
        // attempting to save without an relationship_type is an error
        hris.APIRelationship.create(badTestData, function(relationship) {
            throw new Error(".create() failed to reject bad data");
            done();
        }, function(err) {
            // error is properly caught
            done();
        });
        
    });
     

});
