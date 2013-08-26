describe('test attributeDetails',function(){
	
	var html;
	var controller;
	var object;
	var attributeSet;
	
	before(function(done){
		html = $('<div></div>').attribute_details();
		$(document).append(html);
		controller = html.controller();
		object = new hris.Object({
			object_key: 'object_test',
            object_pkey: 'test_id',
            object_table: 'hris_object_test'
		});
		object.save(function(obj) {
			attributeSet = new hris.Attributeset({
				type_id: 1,
				object_id: obj.object_id,
				attributeset_table: 'hris_object_table',
				attributeset_relation: 'many',
				attributeset_uniqueKey: 0,
				attributeset_key: 'test_attributeset_key',
				attributeset_pkey: 'test_id',
				attributeset_label: 'test attributeset'
			});
			attributeSet.save(function(){
				done();
			});
		});
	});
	
	after(function(done){
		object.destroy();
		attributeSet.destroy();
		hris.Attribute.findAll({},function(list){
			var listDFD = [];
            for (var i=0; i<list.length; i++) {
                listDFD.push(list[i].destroy());
            }
                
            $.when.apply($, listDFD).then(function() {
		    	done();
		    });
		});
		html.remove();
		delete html;
		delete controller;
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
	
	it('on submit',function(done){
		controller.parent = attributeSet;
		AD.Comm.Notification.publish('dbadmin.attribute.item.add-new',{});
		var submitButton = controller.element.find('button.submit');
		attributeLabel = controller.element.find("input[data-bind='attribute_label']");
		attributeLabel.val('label');
		attributePermission = controller.element.find("input[data-bind='attribute_permission']");
		attributePermission.val('READ');
		attributeDatatype = controller.element.find("select[data-bind='attribute_datatype']");
		attributeDatatype.val('TEXT');
		attributeUniqueKey = controller.element.find("input[data-bind='attribute_uniqueKey']");
		attributeUniqueKey.val(0);
		$(submitButton).click();
		setTimeout(function(){
			hris.Attribute.findAll({},function(list){
				for(var i=0;i<list.length;i++){
					attribute = list[i];	
					if (attribute.attr('attribute_label') == 'label'){
						chai.assert.deepEqual(attribute.attr('attribute_permission'),'READ');
						chai.assert.deepEqual(attribute.attr('attribute_uniqueKey'),0);
						chai.assert.deepEqual(attribute.attr('attribute_column'),'test_attributeset_key_');
						done();	
					}
				}
			});
		},1000);
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
	
	it('dbadmin attribute add-new',function(done){
		var attributeSet = new hris.Attributeset({
			attributeset_id:1,
			type_id:1,
			object_id: 1,
			attributeset_table: 'hris_person',
			attributeset_relation: 'one',
			attributeset_uniqueKey: 0,
			attributeset_key: 'key',
			attributeset_pkey: 'person_id'
		});
		controller.parent = attributeSet;
		AD.Comm.Notification.publish('dbadmin.attribute.item.add-new',{});
		
		//check to see that attributeDetails page is visible
		var showing = html.attr('style');
		chai.assert.equal(showing, "display: block;");
		
		//check to see that the submit button is disabled
		button = controller.element.find('button.submit');
		disabled = button.prop('disabled');
		chai.assert.isTrue(disabled,'submit button is not disabled');
		
		//verify that selectedModel equals attributeset model
		selectedModel = controller.selectedModel;
		model = new hris.Attribute({});
		model.attributeset_id = 1;
		model.attribute_column = "key_";
		chai.assert.deepEqual(selectedModel,model);
		
		//verify the title of the page
		legend = controller.element.find('legend');
		legendText = 'New Attribute';
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
