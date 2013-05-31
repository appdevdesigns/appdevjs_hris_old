describe('userAttributes test',function(){
	
	var $html;
	var controller;
	var object;
	var model;
	var attributeSetID = -1;
	var attrSet;
	var attribute;
	var person;
	
	before(function(done){
		person = new hris.Person({});
		model = new hris.Object({
			object_key: 'person',
           	object_pkey: 'person_id',
            object_table: 'hris_person'
		});
		model.save(function(object) {
			model = object;
			$html = $('<div></div>').data("ad-model", model);
			$html.data("ad-person",person);
			$html.user_attributes();
			$(document).append($html);
			controller = $html.controller();
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
		var attributeSetDetail = controller.element.find('#attributeSetDetail');
		chai.assert.lengthOf(attributeSetDetail,1,"controller is not initialized in the DOM");
		var userAttributeRow = controller.element.find('div.userAttributeRow');
		chai.assert.lengthOf(userAttributeRow,1,"userAttribute row is not initialized in the DOM");
		done();
	});
	
	it('userFamily.userDetails.saved',function(done){
		AD.Comm.Notification.publish('userFamily.userDetails.saved',person);
		var userAttributeRow = controller.element.find('div.userAttributeRow');
		chai.assert.lengthOf(userAttributeRow,1,"userAttribute row is not initialized in the DOM");
		done();
	});
});
