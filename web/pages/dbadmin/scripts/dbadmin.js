//// Template Replace:
//   hris     : the name of this page's module: (lowercase)
//   dbadmin  : the name of this page :  (lowercase)
//   Dbadmin  : the name of this page :  (Uppercase)

/**
 * @class hris.client.pages.Dbadmin.hrisDbadminSetup
 * @parent hris.client.pages.Dbadmin
 * 
 *  The setup script for the dbadmin Page container. 
 *
 *  The job of this code is to perform all the setup steps on the existing
 *  HTML DOM items now.  Add Events, actions, etc... 
 *
 *  This file will be generated 1x by the RAD tool and then left alone.
 *  It is safe to put all your custom code here.
 */


(function() {


////[appRad] --  setup object definitions here:
var hrisDbadminSetup = function (topic, data) {


    //// Setup Your Page Data/ Operation Here

    $('#list-sidebar').list_sidebar();
    $('#object-details').object_details();
    $('#attribute-set-details').attribute_set_details();
    $('#attribute-details').attribute_details();

/*
 		//// NOTE: all your business logic should be contained in separate 
 		////       Controllers (dbadmin/scripts/*.js ).  This file is 
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
	AD.Comm.Notification.unsubscribe(dbadminSubID);
} // end hrisDbadminSetup()
var dbadminSubID = AD.Comm.Notification.subscribe('ad.hris.dbadmin.setup',hrisDbadminSetup);




$(document).ready(function () {

    //// Do you need to do something on document.ready() before the above
    //// hrisDbadminSetup() script is called?


}); // end ready()

}) ();
