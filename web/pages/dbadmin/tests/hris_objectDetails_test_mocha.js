describe('test objectDetails',function(){
	var html = '';
	var objectHtml;
	var object;
	var attributeset;
	var objectId = -1;
	var objectList;

	
	before(function(done){
		html = $('<div></div>').object_details();
		objectHtml = $(document).append(html);
		object = new hris.Object({
            object_key: 'object_test',
            object_pkey: 'test_id',
            object_table: 'hris_object_test'
        });
        object.save();
		done();
	});
	
	after(function(){
		object.destroy();
	});
	
	it('initialize the DOM',function(done){
		var form = html.find('form.form-horizontal');
		chai.assert.lengthOf(form,1,"DOM wasn't loaded with form");
		done();
	});
				
	it('submit form',function(done){
		var testResult = true;
		var object = new Object();
		var button = html.find('button.submit');
		var objectKey = html.find('#object-object_key');
		objectKey.val('testtable');
		var objectTable = html.find('#object-object_table');
		objectTable.val('hris_testtable');
		var objectPrimaryKey = html.find('#object-object_pkey');
		objectPrimaryKey.val('hris_testtable_id');
		button.click();
		hris.Object.findAll({},function(list){
			for (var i=0;i<list.length;i++){
				var objectKey = list[i].attr('object_key');
				if (objectKey == 'testtable'){
					object = list[i];
					chai.assert.deepEqual('testtable',object.attr('object_key'));
					chai.assert.deepEqual('hris_testtable',object.attr('object_table'));
					chai.assert.deepEqual('hris_testtable_id',object.attr('object_pkey'));
				}
			}
			done();
		});
	});
	
	it('dbadmin object selected/show',function(done){
		var testResult = false;
		AD.Comm.Notification.publish('dbadmin.object.item.selected',object);
		var objectKey = html.find('#object-object_key');
		if (objectKey.attr('data-bind') == 'object_key'){
			testResult = true;
		}
		chai.assert.isTrue(testResult, 'dbadmin object screen is showing');
		done();
	});

	
	it('dbadmin object add-new',function(done){
		var data = {};
		AD.Comm.Notification.publish('dbadmin.object.item.add-new',data);
		var objectKey = html.find('#object-object_key');
		objectKey.val('testtable');
		var objectTable = html.find('#object-object_table');
		objectTable.val('hris_testtable');
		var objectPrimaryKey = html.find('#object-object_pkey');
		objectPrimaryKey.val('hris_testtable_id');
		var toggleButton = html.find('button.dropdown-toggle');
		toggleButton.click();
		setTimeout(function(){
			var relationshipLink = objectHtml.find('li.add-relationship');
			relationshipLink.click();
			done();
		},5000);
	});
	
	
});
