describe('test attributeSetDetails',function(){
	var $html;
	var object;
	var attributeset;
	var objectId = -1;
	var objectList;
	var controller;
	var hiddenButtons = function(buttons){
		var testResult = true;
		if (buttons.attr('style') !== 'display: none;'){
		//if (!buttons.is(':visible')){
			testResult = false;
		}
		return testResult;
	};
	var emptyList = function(listEntries){
		var testResult = true;
		if (listEntries.length !== 0){
			testResult = false;
		}
		return testResult;
	};
	var deSelectedFields = function(listEntries){
	    var testResult = true;
		for(var i=0;i<listEntries.length;i++){
			var objectItem = $(objectListEntries[i]);
			if (objectItem.attr('class') == 'appdev-list-admin-entry active'){
				testResult = false;
			}
		}
		return testResult;
	};
	
	before(function(done){
    	$html = $('<div></div>');
		$sideBarhtml = $('<div></div>');
		$objectDetails = $('<div></div');
		$(document).append($html);
		$(document).append($sideBarhtml);
		$(document).append($objectDetails);
		$sideBarhtml.list_sidebar();
		$html.attribute_set_details();
		$objectDetails.object_details();
		controller = $html.controller();
		objectList = $html.find('#object-list').dbadmin_list_widget();
		attributeList = $html.find('#attribute-list').dbadmin_list_widget();
		attributeSetList = $html.find('#attribute-set-list').dbadmin_list_widget();
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
					attributeset_table: 'test_attributeset_table',
					attributeset_relation: 'many',
					attributeset_uniqueKey: 0,
					attributeset_key: 'test_attributeset_key',
					attributeset_pkey: 'test_attributeset_pkey',
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
		AD.Comm.Notification.publish('dbadmin.object.item.selected',object);
		//setTimeout(function(){
			//AD.Comm.Notification.publish('dbadmin.attributeset.item.add-new',{});
			var testResult = true;
			var button = $html.find('button.submit');
			var attributeSetPKey = $html.find("input[data-bind='attributeset_pkey']");
			//attributeSetPKey.value('testtable_pkey');
			var attributeSetTable = $html.find("input[data-bind='attributeset_table']");
			//attributeSetTable.value('testtable');
			var attributeSetLabel = $html.find("input[data-bind='attributeset_label']");
			attributeSetLabel.val('testtable_label');
			var attributeSetKey = $html.find("input[data-bind='attributeset_key']");
			attributeSetKey.val('testtable_key');
			var attributeSetTypeId = $html.find("input[data-bind='type_id']");
			attributeSetTypeId.val('testtable_type_id');
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
		//},2000);
	});
	
	it('attributeset add-new',function(done){
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
		chai.assert.isTrue(disabled,'submit button is not disabled');
		done();
	});
});
