describe('createButton test',function(){
	
	var object;
	var model;
	var $html;
	
	before(function(done){
		$html = $('<div></div>').create_button();
		$formHtml = $('<div></div>').create_form();
		$(document).append($html);
		$(document).append($formHtml);
		model = {
			object_key: 'object_test',
			object_pkey: 'test_id',
			object_table: 'hris_object_test'
		};
		hris.Object.create(model,function(object){
			done();
		});
	});
	
	after(function(done){
		$html.remove();
		delete $html;
		delete controller;
      	hris.APIObject.findAll({},function(list){
           var listDFD = [];
           for (var i=0; i<list.length; i++) {
               listDFD.push(list[i].destroy());
           }    
           $.when.apply($, listDFD).then(function() {
		       done();
		    });
		});
	});
	
	it('initializes object in the DOM',function(done){
		var button = $html.find('a.btn');
		
		//verify that the DOM contains the controller
		chai.assert.lengthOf(button,1,"button does not exist");
		done();
	});
	
	it('button created',function(done){
		AD.Comm.Notification.publish('objectcreator.object.selected',model);
		
		//verify that button was create with the right text
		var text = $html.text();
		chai.assert.equal(text, '\nCreate object_test',"button text is wrong");
		done();
	});
	
	it('button clicked',function(done){
		var button = $html.find('.btn');
		$(button).click();
		
		//verify that when the button is clicked that the form shows up
		var style = $formHtml.attr('style');
		chai.assert.equal($formHtml.attr('style'),"display: block;");
		done();
	});
});
