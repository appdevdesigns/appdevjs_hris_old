describe('test attributeDetails',function(){
	
	var html;
	var controller;
	
	before(function(done){
		html = $('<div></div>').attribute_details();
		$(document).append(html);
		controller = html.controller();
		done();
	});
	
	it('initialize object in DOM',function(done){
		form = controller.element.find('form.form-horizontal');
		
		//verify that controller is loaded into DOM
		chai.assert.lengthOf(form,1,"object not initialized in DOM ");
		done();
	});
	
	it('isValid',function(done){
		value = controller.isValid();
		
		//verify that isValid routine returned true
		chai.assert.isTrue(value,'isValid did not return true');
		done();
	});
	
	it('dbadmin attribute selected',function(done){
		model = new hris.Attribute({
			attribute_id: 1,
			attributeset_id: 2,
			attribute_column: 'testkey_code',
			attribute_datatype: 'TEXT',
			meta: 'Meta data',
			attribute_permission: 'Read',
			attribute_uniqueKey: 0
		});
		AD.Comm.Notification.publish('dbadmin.attribute.item.selected',model);
		
		//check to see that attributeDetails page is visible
		var showing = html.attr('style');
		chai.assert.equal(showing, "display: block;");
		
		//check to see that the submit button is disabled
		button = controller.element.find('button.submit');
		disabled = button.prop('disabled');
		chai.assert.isTrue(disabled,'submit button is not disabled');
		
		//verify that selectedModel equals attributeset model
		selectedModel = controller.selectedModel;
		chai.assert.equal(selectedModel,model);
		
		//verify the title of the page
		legend = controller.element.find('legend');
		legendText = 'Attribute Details';
		chai.assert.equal(legend.text(),legendText);
		done();
	});
	
	it('input change',function(done){
		controller.element.find('select').change();
		
		//verify that submit button is not disabled
		button = controller.element.find('button.submit');
		disabled = button.prop('disabled');
		chai.assert.isFalse(disabled,'the submit button is disabled');
		done();
	});
	
	it('select change',function(done){
		select = controller.element.find('select');
		select.val('LOOKUP');
		controller.element.find('select').change();
		
		//verify that attribute-meta-div shows up for value LOOKUP
		attributeMetaDiv = controller.element.find('.attribute-meta-div');
		showing = attributeMetaDiv.attr('style');
		chai.assert.equal(showing,"display: block;");
		
		select = controller.element.find('select');
		select.val('TEXT');
		controller.element.find('select').change();
		
		//verify that attribute-meta-div does not show up for value TEXT
		attributeMetaDiv = controller.element.find('.attribute-meta-div');
		showing = attributeMetaDiv.attr('style');
		chai.assert.equal(showing,"display: none;");
		done();
	});
	
	it('dbadmin object selected',function(done){
		AD.Comm.Notification.publish('dbadmin.object.item.selected',{});
		
		//verify that the attributeDetails form is not showing
		showing = html.attr('style');
		chai.assert.equal(showing,"display: none;");
		done();
	});
	
	it('dbadmin attributeset selected',function(done){
		AD.Comm.Notification.publish('dbadmin.attributeset.item.selected',{});
		
		//verify that the attributeDetails form is not showing
		showing = html.attr('style');
		chai.assert.equal(showing,"display: none;");
		done();
	});
	
	it('dbadmin object add-new',function(done){
		AD.Comm.Notification.publish('dbadmin.object.item.add-new',{});
		
		//verify that the attributeDetails form is not showing
		showing = html.attr('style');
		chai.assert.equal(showing,"display: none;");
		done();
	});
	
	it('dbadmin attributeset add-new',function(done){
		AD.Comm.Notification.publish('dbadmin.attributeset.item.add-new',{});
		
		//verify that the attributeDetails form is not showing
		showing = html.attr('style');
		chai.assert.equal(showing,"display: none;");
		done();
	});
	
	it('dbadmin attribute deleted',function(done){
		AD.Comm.Notification.publish('dbadmin.attribute.item.deleted',{});
		
		//verify that the attributeDetails form is not showing
		showing = html.attr('style');
		chai.assert.equal(showing,"display: none;");
		done();
	});
});
