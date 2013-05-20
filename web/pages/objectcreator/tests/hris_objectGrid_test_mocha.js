describe('test objectGrid',function(){
	
	var $html;
	var controller;
	
	before(function(done){
		$html = $('<div></div>').object_grid();
		$(document).append($html);
		controller = $html.controller();
		done();
	});
	
	it('initialize object in DOM',function(done){
		//verify that the controller was added to DOM
		table = controller.element.find('table');
		chai.assert.lengthOf(table,1,"object not initialized in DOM");
		done();
	});
	
	it('objectcreator object selected',function(done){
		model = {
			object_key: 'passport',
			object_pkey: 'passport_id',
			object_table: 'hris_passport'
		};
		AD.Comm.Notification.publish('objectcreator.object.selected',model);
		setTimeout(function(){
			done();
		},5000);
	});
});
