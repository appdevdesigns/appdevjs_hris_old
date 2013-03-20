
/**
 * @class hris.server.subscriptions.Attribute
 * @parent hris.server.subscriptions
 * 
 * A subscriptions that respond to different Attribute events in the system.
 * 
 */
var log = AD.Util.Log;
var logDump = AD.Util.LogDump;
var db = AD.Model.Datastore;
var $ = AD.jQuery;



var hrisAttribute = new AD.App.Service({});
module.exports = hrisAttribute;


var hrisHub = null;   // Module's Notification Center (note: be sure not to use this until setup() is called)



//-----------------------------------------------------------------------------
hrisAttribute.setup = function() {
    // setup any handlers, subscriptions, etc... that need to have passed in 
    // private resources from the Module:
    //  this.hub = the module's Notification Hub
    //  this.listModels = the list of Model objects in the current Module
    // 
    
    hrisHub = this.module.hub;  // <-- should have a reference to our Module
     
    console.log('started hrisAttribute hub');  
    
    
    /**
     * @function hris.Attribute.created
     * 
     * This service will make sure the DB table associated with this Attribute is 
     * physically updated with the new column.
     * 
     * @param {string} event the notification key this matched
     * @param {obj} data the primary key id of the newly created attribute { id:1 }
     */
    //  data: { id:# }
    var newAttribute = function(event, data) {

    	console.log('newAttribute');
        // data only contains the { id:xx } but we want to provide a guid
        // to modules as well, so we manually look it up:
        var Attribute = AD.Model.List['hris.Attribute'];
        var AttributeSet = AD.Model.List['hris.Attributeset'];
        
        Attribute.findOne({id:data.id}, function(attribute) {
            
            //var externalData = { 
            //       id: attribute.attribute_id,
            //        attributeset_id:attribute.attributeset_id,
            //        isActive: ((viewer.viewer_isActive == 1)||(viewer.viewer_isActive == '1'))
            //}
        	
        	var attributeSetId = attribute.attributeset_id;
        	var attributeColumn = attribute.attribute_column;
        	var attributeDataType = attribute.attribute_datatype;
            
            AttributeSet.findOne({id:attributeSetId}, function(attributeSet){
            	 var sql = 'ALTER TABLE '+ attributeSet.attributeSet_table + ' ADD ';
                 sql += attributeColumn;
                 sql += ' '+ attributeDataType;
                 db.runSQL(sql,[], function(err, results, fields){
                	 if (err) {
                         console.log(err);      
                     } 
//                	 AD.Comm.Notification.publish('hris.'+attributeColumn+'.created', data);
                 });
            }); 
        });
         
    }
    hrisHub.subscribe('hris.Attribute.created', newAttribute);

    
    // Here we expose a 'site.user.destroyed' event to any installed module:
    //  data: { id:#, guid:'string' }
    var deleteAttribute = function(event, data) {

    	Attribute.findOne({id:data.id}, function(attribute) {
        	
        	var attributeSetId = attribute.attributeset_id;
        	var attributeColumn = attribute.attribute_column;
        	var attributeDataType = attribute.attribute_datatype;
            
            AttributeSet.findOne({id:attributeSetId}, function(attributeSet){
            	 var sql = 'ALTER TABLE '+ attributeSet.attributeSet_table + ' DROP COLUMN ';
                 sql += attributeColumn;
                 db.runSQL(sql,[], function(err, results, fields){
                	 if (err) {
                        console.log(err);              
                     }
                     AD.Comm.Notification.publish('hris.'+attributeColumn+'.destroyed', data); 
                 });
            });
        });
    }
    hrisHub.subscribe('hris.Attribute.destroyed', deleteAttribute);
    
    var updateAttribute = function(event, data) {

    	Attribute.findOne({id:data.id}, function(attribute) {
        	
        	var attributeSetId = attribute.attributeset_id;
        	var attributeColumn = attribute.attribute_column;
        	var attributeDataType = attribute.attribute_datatype;
            
            AttributeSet.findOne({id:attributeSetId}, function(attributeSet){
            	 var sql = 'ALTER TABLE '+ attributeSet.attributeSet_table + ' DROP COLUMN ';
                 sql += attributeColumn;
                 db.runSQL(sql,[], function(err, results, fields){
                	 if (err) {
                         console.log(err);             
                     }
                 });
                 var sql = 'ALTER TABLE '+ attributeSet.attributeSet_table + ' ADD ';
                 sql += attributeColumn;
                 sql += ' '+ attributeDataType;
                 db.runSQL(sql,[], function(err, results, fields){
                	 if (err) {
                         console.log(err);        
                     }
                	 AD.Comm.Notification.publish('hris.'+attributeColumn+'.destroyed', data); 
                 });
            }); 
        }); 
    }
    hrisHub.subscribe('hris.Attribute.updated', updateAttribute)
    

} // end setup()




