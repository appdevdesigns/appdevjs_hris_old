
/**
 * @class hris.server.models.APIAttributeset
 * @parent hris.server.models
 * 
 *  This is an object to manage the interaction with the hris.APIAttributesets service.
 */


(function () {
	  var onServer = false;
	  if (typeof exports !== 'undefined') {
	  // exports are defined on the server side node modules
	      onServer = true;
	  } 
	  

	  if (!onServer) {

		  var attr = {
		      // Client Definitions
				_adModule:'hris',
				_adResource:'APIAttributeset',	// singular
//				_adModel: [ModelName]   // <-- if the data returned is associated with a diff Model obj, provide it's name here:  _adModel:site.Label,
				labelKey:'attributeset_key',
				id:'attributeset_id'  // the field that is the id of the data
		  };
		  
		  AD.Service.extend("hris.APIAttributeset",
    		  attr,
    		  {
    		  // define instance methods here.
    		  });
	  }
})()
