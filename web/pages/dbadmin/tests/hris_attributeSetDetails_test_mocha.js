describe('test attributeSetDetails',function(){
	var $html;
	var object;
	var attributeset;
	var objectId = -1;
	var controller;
	
	before(function(done){
    	$html = $('<div></div>');
		$html.attribute_set_details();
		$(document).append($html);
		controller = $html.controller();
		object = new hris.Object({
			    	object_key: 'object_test',
            		object_pkey: 'test_id',
            		object_table: 'hris_object_test'
				});
        object.save(function(model){
			object = model;
            objectId = object.getID();
            attributeset = new hris.Attributeset({
					type_id: 1,
					object_id: objectId,
					attributeset_table: 'hris_object_test',
					attributeset_relation: 'many',
					attributeset_uniqueKey: 0,
					attributeset_key: 'test_attributeset_key',
					attributeset_pkey: 'test_id',
					attributeset_label: 'test attributeset'
			});
			attributeset.save(function(){
				done();
			});
		});
	});
	
	after(function(){
		object.destroy();
		attributeset.destroy();
	});
	
	it('initialize object in DOM',function(done){
		//verify that DOM has controller created
		form = controller.element.find('form.form-horizontal');
		chai.assert.lengthOf(form,1,"object not initialized in DOM");
		done();
	});
				
	it('submit form',function(done){
		controller.parent = object;
		AD.Comm.Notification.publish('dbadmin.attributeset.item.add-new',{});
		var button = controller.element.find('button.submit');
		var attributeSetLabel = controller.element.find("input[data-bind='attributeset_label']");
		attributeSetLabel.val('testtable_label');
		var attributeSetKey = controller.element.find("input[data-bind='attributeset_key']");
		attributeSetKey.val('test_attributeset_key');
		var attributeSetTypeId = controller.element.find("input[data-bind='type_id']");
		attributeSetTypeId.val(1);
		$(button).click();
		hris.Attributeset.findAll({},function(list){
			for (var i=0;i<list.length;i++){
				var attributeSet = list[i];
				if (attributeSet.attr('attributeset_table') == 'hris_object_test'){
					chai.assert.deepEqual('test_attributeset_key',attributeSet.attr('attributeset_key'));
					chai.assert.deepEqual('test_id',attributeSet.attr('attributeset_pkey'));
					chai.assert.deepEqual(1,attributeSet.attr('type_id'));
					done();				
				}
			}
		});
	});
	
	it('attributeset add-new',function(done){
		controller.parent = object;
		AD.Comm.Notification.publish('dbadmin.attributeset.item.add-new',{});
		
		//verify that attributeSetDetails is not hidden
		var showing = $html.attr('style');
		chai.assert.equal(showing,"display: block;");
				
		//check to see that the submit button is disabled
		button = controller.element.find('button.submit');
		disabled = button.prop('disabled');
		chai.assert.isTrue(disabled,'submit button is not disabled');
		
		//verify that selectedModel equals attributeset model
		var selectedModel = controller.selectedModel;
		var newModel = new hris.Attributeset();
		newModel.object_id = object.object_id;
		newModel.attributeset_table = object.object_table;
		newModel.attributeset_pkey = object.object_pkey;
		chai.assert.deepEqual(selectedModel,newModel);
		
		//verify the title of the page
		legend = controller.element.find('legend');
		legendText = 'New Attribute Set';
		chai.assert.equal(legend.text(),legendText);
		done();
	});
	
	it('isValid',function(done){
		value = controller.isValid();
		
		//verify isValid() returns true
		chai.assert.isTrue(value,'isValid() did not return true');
		done();
	});
	
	it('dbadmin attributeSetDetails hide/objectDetails show',function(done){ 
		AD.Comm.Notification.publish('dbadmin.object.item.selected',object);
		
		//verify that attributeSetDetails is hidden
		var showing = $html.attr('style');
		chai.assert.equal(showing,"display: none;");
		done();
	});
	
	it('dbadmin attributeSetDetails hide/attributeDetails show',function(done){ 
		AD.Comm.Notification.publish('dbadmin.attribute.item.selected',object);
		
		//verify that attributeSetDetails is hidden
		var showing = $html.attr('style');
		chai.assert.equal(showing,"display: none;");
		done();
	});
	
	it('dbadmin attributeSetDetails hide/object add new',function(done){ 
		AD.Comm.Notification.publish('dbadmin.object.item.add-new',object);
		
		//verify that attributeSetDetails is hidden
		var showing = $html.attr('style');
		chai.assert.equal(showing,"display: none;");
		done();
	});
	
	it('dbadmin attributeSetDetails hide/attribute add new',function(done){ 
		AD.Comm.Notification.publish('dbadmin.attribute.item.add-new',object);
		
		//verify that attributeSetDetails is hidden
		var showing = $html.attr('style');
		chai.assert.equal(showing,"display: none;");
		done();
	});
	
	it('dbadmin attributeSetDetails hide/attributeSet deleted',function(done){ 
		AD.Comm.Notification.publish('dbadmin.attributeset.item.deleted',object);
		
		//verify that attributeSetDetails is hidden
		var showing = $html.attr('style');
		chai.assert.equal(showing,"display: none;");
		done();
	});
		
	it('dbadmin attributeSetDetails selected',function(done){
		AD.Comm.Notification.publish('dbadmin.attributeset.item.selected',attributeset);
		
		//check to see that attributeSetDetails page is visible
		var showing = $html.attr('style');
		chai.assert.equal(showing, "display: block;");
		
		//check to see that the submit button is disabled
		button = controller.element.find('button.submit');
		disabled = button.prop('disabled');
		chai.assert.isTrue(disabled,'submit button is not disabled');
		
		//verify that selectedModel equals attributeset model
		selectedModel = controller.selectedModel;
		chai.assert.equal(selectedModel,attributeset);
		
		//verify the title of the page
		legend = controller.element.find('legend');
		legendText = 'Attribute Set Details';
		chai.assert.equal(legend.text(),legendText);
		done();
	});
	
	it('input change',function(done){
		controller.element.find('select').change();
		
		//check to see if submit button is disabled
		button = controller.element.find('button.submit');
		disabled = button.prop('disabled');
		chai.assert.isFalse(disabled,'submit button is disabled');
		done();
	});
});
