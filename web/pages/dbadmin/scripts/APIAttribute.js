
/**
 * @class hris.server.models.APIAttribute
 * @parent hris.server.models
 * 
 *  This is an object to manage the interaction with the hris.APIAttributes service.
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
				_adResource:'APIAttribute',	// singular
//				_adModel: [ModelName]   // <-- if the data returned is associated with a diff Model obj, provide it's name here:  _adModel:site.Label,
				labelKey:'attribute_column',
				id:'attribute_id'  // the field that is the id of the data
		  };
		  
		  AD.Service.extend("hris.APIAttribute",
    		  attr,
    		  {
    		  // define instance methods here.
    		  });
	  }
})()
