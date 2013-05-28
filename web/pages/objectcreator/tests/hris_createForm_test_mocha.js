describe('createForm test',function(){
	
	var $html;
	var controller;
	
	before(function(done){
		$html = $('<div></div>').create_form();
		$(document).append($html);
		controller = $html.controller();
		done();
	});
	
	it('initialize object in the DOM',function(done){
		form = $html.find('form.form-horizontal');
		
		//verify that the DOM contains the controller
		chai.assert.lengthOf(form,1,"form does not exist");
		done();
	});
	
	it('objectcreator object selected',function(done){
		var model = {
			object_key: 'person',
			object_pkey: 'person_id',
			object_table: 'hris_person'
		};
		AD.Comm.Notification.publish('objectcreator.object.selected',model);
		
		//verify that the model is stored in hris_model
		chai.assert.equal(controller.hris_model,"Person");
		done();
	});
	
	it('objectcreator create click',function(done){
		AD.Comm.Notification.publish('objectcreator.create.click',{});
		
		//verify that the objectcreator form is showing
		chai.assert.equal($html.attr('style'),"display: block;");
		done();
	});
	
	it('objectcreator attributeList refresh',function(done){
		var arrayModels = [];
		var attribute = {
			attribute_column: 'testkey_code',
			attribute_label: 'testkey'
		};
		arrayModels.push(attribute);
		AD.Comm.Notification.publish('objectcreator.attributeList.refresh',arrayModels);
		
		//verify that attribute was added to the form
		var columnLabel = controller.element.find('#testkey_code');
		chai.assert.lengthOf(columnLabel,1,"elements not on form");
		done();
	});
	
	it('objectcreator relationships refresh',function(done){
		var arrayModels = [];
		var relationship ={
			object_pkey: 'primary_key',
			object_key: 'key'
		};
		arrayModels.push(relationship);
		AD.Comm.Notification.publish('objectcreator.relationships.refresh',arrayModels);
		
		//verify that the relationships were added to the form
		var objectKey = controller.element.find('#primary_key');
		chai.assert.lengthOf(objectKey,1,"elements not on form");
		done();
	});
	
});
