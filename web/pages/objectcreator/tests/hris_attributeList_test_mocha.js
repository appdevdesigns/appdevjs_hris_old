describe('attributeList test',function(){
	
	var object;
	var model;
	var $html;
	var controller;
	var attributeSetID = -1;
	var attrSet;
	var attribute;
	var $objectGrid;
	
	before(function(done){
		$html = $('<div></div>').attribute_list();
		$objectGrid = $('<div></div>').object_grid();
		$(document).append($html);
		$(document).append($objectGrid);
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
	
	after(function(done){
		model.destroy();
		attrSet.destroy();
		attribute.destroy();
		$html.remove();
		delete $html;
		delete controller;
		done();
	});
	
	it('initialize controller in DOM',function(done){
		listAttributes = controller.listAttributes;
		list = [];
		chai.assert.deepEqual(listAttributes,list);
		done();
	});
	
	it('objectcreator object selected',function(done){
		AD.Comm.Notification.publish('objectcreator.object.selected',model);
		var text = controller.element.text();
		var otherText = controller.element.html();
		var entries = controller.element.find('li.appdev-list-admin-entry');
		setTimeout(function(){
			var listAttrs = controller.listAttributes;
			chai.assert.lengthOf(entries,1,'list item count is wrong');
			done();
		},2000);
	});

});
