 
describe('hris object', function(){

    var object = new hris.Object({});
    var objectId = 0;

    before(function(done){
        // Create the new object DB table entry for testing
        object = new hris.Object({
            object_key: 'object_test',
            object_pkey: 'test_id',
            object_table: 'hris_object_test'
        });
        object.save(function(){
            objectId = object.getID();
            done();
        });
    });
    
    // Check the object_id value
    it('has a primary key value', function() {
        chai.assert.isNumber(objectId, 'objectId is not a number');
        chai.assert.notEqual(objectId, 0, 'objectId is 0');
    });

/*    
    // Every Object entry represents a DB table. Check if that table was
    // created correctly.
    it('created related DB tables', function(done) {
        AD.Model.Datastore.listTables(AD.Defaults.dbName, function(tableList) {
            chai.assert.include(tableList, 'hris_object_test', "table was not created");
            done();
        });
        
    });
*/
    
    // Check findOne search by ID
    it('hris object findOne', function(done){
        hris.Object.findOne({object_id:objectId}, function(data){
            var findOneId = data.getID();
            chai.expect(findOneId).to.equal(objectId);
            chai.expect(data.attr('object_key')).to.equal('object_test');
            chai.expect(data.attr('object_pkey')).to.equal('test_id');
            chai.expect(data.attr('object_table')).to.equal('hris_object_test');
            done();
        });
    });
    
    // Check findAll search by ID
    it('hris object findAll', function(done){
        hris.Object.findAll({object_id:objectId}, function(list){
            chai.expect(list.length).to.equal(1);
            done();
        });
    });
    
    // Check update
    it('hris object update', function(done) {
        object.attr('object_key', 'object_test1');
        object.save(function() {
            hris.Object.findOne({object_id:objectId}, function(data) {
                chai.expect(data.attr('object_key')).to.equal('object_test1');
                done();
            });
        });
    });
    
    // Check that the entry is gone after destroy
    it('hris object destroy', function(done){
        object.destroy(function(){
            hris.Object.findAll({object_id:objectId},function(list){
                chai.assert.deepEqual(list.length, 0);
                done();
            });
        });
    });
    
});
