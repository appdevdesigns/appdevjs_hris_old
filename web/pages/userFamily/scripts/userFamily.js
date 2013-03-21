//// Template Replace:
//   hris     : the name of this page's module: (lowercase)
//   userFamily  : the name of this page :  (lowercase)
//   UserFamily  : the name of this page :  (Uppercase)

/**
 * @class hris.client.pages.UserFamily.hrisUserFamilySetup
 * @parent hris.client.pages.UserFamily
 * 
 *  The setup script for the userFamily Page container. 
 *
 *  The job of this code is to perform all the setup steps on the existing
 *  HTML DOM items now.  Add Events, actions, etc... 
 *
 *  This file will be generated 1x by the RAD tool and then left alone.
 *  It is safe to put all your custom code here.
 */


(function() {


////[appRad] --  setup object definitions here:
var hrisUserFamilySetup = function (topic, data) {


    //// Setup Your Page Data/ Operation Here
    $('#personList').person_list();
    $('#personSummary').person_summary();


    $('#attributeSetList').attribute_set_list();
/*
 		//// NOTE: all your business logic should be contained in separate 
 		////       Controllers (userFamily/scripts/*.js ).  This file is 
 		////       simply to apply your controllers to the web page.  Keep it 
 		////       simple here.
 		
		//// Setup Your Page Data/ Operation Here
	    $('#ModuleWorkAreaPanel').module_work_area_panel();
	    $('#PageWorkAreaPanel').page_work_area_panel();
	    $('#ModelWorkAreaPanel').model_work_area_panel();
	    
	    
	    var listModules = appRAD.Modules.listManager({});
	    $('#listModules').module_list_widget({
	    	title:'[appRad.portal.titleModuleList]', // this is the multilingual label key
	        dataManager:listModules,
	        height:'250',
	        pageSize:5,
	        buttons:{
	        	add:true,
	//        	delete:true,
	//        	edit:true,
	        	refresh:true
	        }
	    
	    });
*/
	
	// unsubscribe me so this doesn't get called again ... 
	AD.Comm.Notification.unsubscribe(userFamilySubID);
} // end hrisUserFamilySetup()
var userFamilySubID = AD.Comm.Notification.subscribe('ad.hris.userFamily.setup',hrisUserFamilySetup);




$(document).ready(function () {

    //// Do you need to do something on document.ready() before the above
    //// hrisUserFamilySetup() script is called?


}); // end ready()

}) ();
