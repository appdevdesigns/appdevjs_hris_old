describe('createForm test',function(){
	
	var object;
	var model;
	var $html;
	var controller;
	var arrayModels = [];
	
	before(function(done){
		$html = $('<div></div>').create_form();
		$(document).append($html);
		controller = $html.controller();
		model = {
			object_key: 'person',
			object_pkey: 'person_id',
			object_table: 'hris_person'
		};
		hris.Object.create(model,function(object){
			done();
		});
	});
	
	it('initialize object in the DOM',function(done){
		form = $html.find('form.form-horizontal');
		chai.assert.lengthOf(form,1,"form does not exist");
		done();
	});
	
	it('objectcreator object selected',function(done){
		AD.Comm.Notification.publish('objectcreator.object.selected',model);
		chai.assert.equal(controller.hris_model,"Person");
		done();
	});
	
	it('objectcreator create click',function(done){
		AD.Comm.Notification.publish('objectcreator.create.click',{});
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
		var objectKey = controller.element.find('#primary_key');
		chai.assert.lengthOf(objectKey,1,"elements not on form");
		done();
	});
	
});
