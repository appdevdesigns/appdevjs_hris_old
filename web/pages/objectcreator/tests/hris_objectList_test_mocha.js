describe('test objectList',function(){
	
	var $html;
	var controller;
	
	before(function(done){
		$html = $('<div></div>').object_list();
		$(document).append($html);
		controller = $html.controller();
		done();
	});
	
	it('initialize object in DOM',function(done){
		//verify that the controller was added to the DOM
		list = controller.element.find('#object-list');
		chai.assert.lengthOf(list,1,"object not initialized in DOM");
		done();	
	});
});
