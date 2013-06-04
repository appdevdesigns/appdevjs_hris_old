describe('test objectGrid',function(){
	
	var $html;
	var controller;
	var model;
	var attribute;
	
	before(function(done){
		$html = $('<div></div>').object_grid();
		$(document).append($html);
		controller = $html.controller();
		model = new hris.Object({
			object_key: 'person',
           	object_pkey: 'person_id',
            object_table: 'hris_person'
		});
		model.save(function(object) {
			model = object;
			attrSet = new hris.Attributeset({
				type_id: 1,
				object_id: object.object_id,
				attributeset_table: 'hris_person',
				attributeset_relation: 'many',
				attributeset_uniqueKey: 0,
				attributeset_key: 'passport',
				attributeset_pkey: 'person_id',
				attributeset_label: 'passport information'
			});
			attrSet.save(function(attributeset){
				if ($.isArray(attributeset)) {
                	attributeSetID = attributeset[0].attributeset_id;
                } else {
                	attributeSetID = attributeset.attributeset_id;
                }
				attribute = new hris.Attribute({
					attributeset_id: attributeSetID,
					attribute_column:'passport_number' ,
					attribute_datatype: 'Text',
					attribute_label: 'Passport Number',
					meta: '',
					attribute_question: '',
					attribute_permission: 'Read',
					attribute_uniqueKey: 0
				});
				attribute.save(function(attr){
					done();
				});
			});
		});
	});
	
	after(function(){
		$html.remove();
		delete $html;
		delete controller;
		model.destroy();
		attrSet.destroy();
		attribute.destroy();
	});
	
	it('initialize object in DOM',function(done){
		//verify that the controller was added to DOM
		table = controller.element.find('table');
		chai.assert.lengthOf(table,1,"object not initialized in DOM");
		done();
	});
	
	it('objectcreator object selected',function(done){
		var attributeList = [];
		attributeList.push(attribute);
		AD.Comm.Notification.publish('objectcreator.attributeList.refresh',attributeList);
		AD.Comm.Notification.publish('objectcreator.object.selected',model);
		setTimeout(function(){
			var body = controller.element.find('tr.data');
			chai.assert.lengthOf(body,1,"data was not inserted into table");
			done();
		},5000);
	});
});
