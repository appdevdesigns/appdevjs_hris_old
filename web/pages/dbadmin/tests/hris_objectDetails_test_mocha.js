describe('test objectDetails',function(){
	var html;
	var objectHtml;
	var object;
	var attributeset;
	var objectId = -1;
	var objectList;
	var controller;

	
	before(function(done){
		html = $('<div></div>').object_details();
		$(document).append(html);
		controller = html.controller();
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
		//verify that controller is created in DOM
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
		
		//verify that the objectDetails form is showing
		var objectKey = html.find('#object-object_key');
		if (objectKey.attr('data-bind') == 'object_key'){
			testResult = true;
		}
		chai.assert.isTrue(testResult, 'dbadmin object screen is showing');
		done();
	});
		
	it('dbadmin objectDetails hide/attributeSetDetails show',function(done){ 
		AD.Comm.Notification.publish('dbadmin.attributeset.item.selected',object);
		
		//verify that objectDetails is hidden
		var showing = html.attr('style');
		chai.assert.equal(showing,"display: none;");
		done();
	});

		
	it('dbadmin objectDetails hide/attributeDetails show',function(done){ 
		AD.Comm.Notification.publish('dbadmin.attribute.item.selected',object);
		
		//verify that objectDetails is hidden
		var showing = html.attr('style');
		chai.assert.equal(showing,"display: none;");
		done();
	});
		
	it('dbadmin objectDetails hide/attributeSet add-new',function(done){ 
		AD.Comm.Notification.publish('dbadmin.attributeset.item.add-new',object);
		
		//verify that objectDetails is hidden
		var showing = html.attr('style');
		chai.assert.equal(showing,"display: none;");
		done();
	});
	
	it('dbadmin object selected',function(done){
		AD.Comm.Notification.publish('dbadmin.object.item.selected',object);
		
		//check to see that objectDetails page is visible
		var showing = html.attr('style');
		chai.assert.equal(showing, "display: block;");
		
		//check to see that the submit button is disabled
		button = controller.element.find('button.submit');
		disabled = button.prop('disabled');
		chai.assert.isTrue(disabled,'submit button is not disabled');
		
		//verify that selectedModel equals attributeset model
		selectedModel = controller.selectedModel;
		chai.assert.equal(selectedModel,object);
		
		//verify the title of the page
		legend = controller.element.find('legend');
		legendText = 'Object Details';
		chai.assert.equal(legend.text(),legendText);
		done();
	});
	
	it('dbadmin object add-new',function(done){
		AD.Comm.Notification.publish('dbadmin.object.item.add-new',{});
		
		//check to see that objectDetails page is visible
		var showing = html.attr('style');
		chai.assert.equal(showing, "display: block;");
		
		//check to see that the submit button is disabled
		button = controller.element.find('button.submit');
		disabled = button.prop('disabled');
		chai.assert.isTrue(disabled,'submit button is not disabled');
		
		//verify that selectedModel equals attributeset model
		selectedModel = controller.selectedModel;
		chai.assert.deepEqual(selectedModel,new hris.APIObject());
		
		//verify the title of the page
		legend = controller.element.find('legend');
		legendText = 'New Object';
		chai.assert.equal(legend.text(),legendText);
		done();
	});
			
	it('dbadmin objectDetails hide/attribute add-new',function(done){ 
		AD.Comm.Notification.publish('dbadmin.attribute.item.add-new',object);
		
		//verify that objectDetails is hidden
		var showing = html.attr('style');
		chai.assert.equal(showing,"display: none;");
		done();
	});
	
	it('input change',function(done){
		controller.element.find('#object-object_key').change();
		
		//check to see if submit button is disabled
		button = controller.element.find('button.submit');
		disabled = button.prop('disabled');
		chai.assert.isFalse(disabled,'submit button is disabled');
		done();
	});
	
	it('#object-object_key change',function(done){
		controller.element.find('#object-object_table').val('');
		controller.element.find('#object-object_pkey').val('');
		controller.element.find('#object-object_key').val('person');
		controller.element.find('#object-object_key').change();
		
		var objectTable = controller.element.find('#object-object_table').val();
		var objectPKey = controller.element.find('#object-object_pkey').val();
		chai.assert.equal(objectTable,"hris_person");
		chai.assert.equal(objectPKey,"person_id");
		done();
	});
	
	it('add-relationship click',function(done){
		AD.Comm.Notification.publish('dbadmin.object.item.selected',object);
		var aLink = controller.element.find('a.add-relationship');
		$(aLink[0]).click();
		var tr = controller.element.find('tr.api_relationship');
		chai.assert.lengthOf(tr,1,"tr row not added for relationship");
		done();
	});
	
	it('rel-delete-btn click',function(done){
		var deleteButton = controller.element.find('a.rel-delete-btn');
		$(deleteButton).click();
		
		//check to see if submit button is disabled
		button = controller.element.find('button.submit');
		disabled = button.prop('disabled');
		chai.assert.isFalse(disabled,'submit button is disabled');
		
		//verify that the row is marked to be deleted
		deleteRow = controller.element.find('tr.rel-delete-row');
		chai.assert.lengthOf(deleteRow,1,"tr row not marked for deletion");
		done();
	});
	
	it('rel-objB-key click',function(done){
		var aLink = controller.element.find('a.rel-objB-key');
		$(aLink).click();
		done();
	});
	
	it('rel-show-advanced click',function(done){
		var showAdvanced = controller.element.find('i.rel-show-advanced');
		$(showAdvanced).click();
		columnName = controller.element.find('div.rel-column-name');
		chai.assert.lengthOf(columnName,1,"div row for advanced features not showing");
		done();
	});
	
});
