
// This is the Resource Definition
var log = AD.Util.Log;
var logDump = AD.Util.LogDump;
var error = AD.Util.Error;
var errorDump = AD.Util.ErrorDump;
var $ = AD.jQuery;

var Attribute = new AD.Resource('hris', 'Attribute');
module.exports = Attribute;



//.publicLinks() : return an object representing the url definition for this resource
/*
Attribute.publicLinks = function () {
    return  {
        findAll: { method:'GET',    uri:'/[app]/[resource]',        params:{}, type:'resource' },
        findOne: { method:'GET',    uri:'/[app]/[resource]/[id]',   params:{}, type:'resource' },
        create:  { method:'POST',   uri:'/[app]/[resource]',        params:{}, type:'action' },
        update:  { method:'PUT',    uri:'/[app]/[resource]/[id]',   params:{}, type:'action' },
        destroy: { method:'DELETE', uri:'/[app]/[resource]/[id]',   params:{}, type:'action' },
    }
}
*/



// .model  : which model are you associated with
//Attribute.model = AD.Model.List['hris.Attribute'];



// .find() : the operation that performs your .model.findAll(params)
//           store your results in : res.aRAD.result = [];
//Attribute.find = function (req, res, next) { next();}



var existingEntry = function(params) {
    var dfd = $.Deferred();

    var found = Attribute.model.findOne(params);
    $.when(found)
        .then(function(obj){
            if (obj) dfd.resolve(obj);
            else dfd.resolve(false);
        })
        .fail(function(err) {
            dfd.reject(err);
        });
    return dfd;
}


var noColumnConflicts = function(params) {
    var dfd = $.Deferred();

console.log('noColConfl:');
console.log(params);

    if (params._forced) {

        // if they used the _forced flag, then skip this check
        dfd.resolve(true);

    } else {
        var column = {attribute_column: params.attribute_column};

        var found = Attribute.model.findAll(column);
        $.when(found)
            .then(function(list){

                if (list.length > 0) dfd.reject('col.conflict');
                else dfd.resolve(true);
            })
            .fail(function(err) {
                dfd.reject(err);
            });
    }

    return dfd;
}


var notPkeyFormat = function(params) {
    // prevent any
    var dfd = $.Deferred();

    if (params._forced) {

        // if they used the _forced flag, then skip this check
        dfd.resolve(true);

    } else {

        var column = params.attribute_column.split('_');
        if ((column[column.length-1]) == 'id') dfd.reject('pkey.format');
        else dfd.resolve(true);
    }
    return dfd;
}



//.create() : the operation that performs your .model.create(params)
//            store your results in : res.aRAD.result = {id:newID}
Attribute.createNext = Attribute.create;
Attribute.create = function (req, res, next) {

    var params = req.aRAD.params;

    // if we have an entry with the same params as this,
    // skip creation and reuse that one...
    var existing = existingEntry(params);
    var columnCheck = noColumnConflicts(params);
    var pkeyCheck = notPkeyFormat(params);

    $.when(existing, columnCheck, pkeyCheck).then(function(obj, columnsOK, pkeyOK ) {
        if (!obj) {

            Attribute.createNext(req,res,next);

        } else {

            log(req, '     existing attribute with matching values:');
            log(req, '     id:'+obj[Attribute.model.id]);

            var rID = {};
            rID[Attribute.model.id] = obj[Attribute.model.id];
            res.aRAD.results = rID;
            next();
        }
    }).fail(function( errKey ){

        switch(errKey) {
            case 'col.conflict':
                var msg = 'conflicting attribute_column value';
                var code = AD.Const.HTTP.ERROR_CONFLICT;
                break;

            case 'pkey.format':
                var msg = 'attribute_column not allowed to end in _id';
                var code = AD.Const.HTTP.ERROR_CONFLICT;
                break;
        }
        log(req, '     '+msg);
        log(req, '      ->:'+params.attribute_column);
        var err = { errorID:1, errorMSG: msg };
        AD.Comm.Service.sendError(req, res, err, code);
    });
}



//.update() : the operation that performs your .model.update(id, params)
//          store any results in : res.aRAD.result = {};
//Attribute.update = function (req, res, next) { next();}



//.destroy() : the operation that performs your .model.destroy(id, params)
//Attribute.destroy = function (req, res, next) { next();}




///// Additional Actions:
var db = AD.Model.Datastore;

//.onCreated() : is called each time an instance of Attribute.model is created
//Attribute.onCreated = function (ev, modelInstance) {}
Attribute.onCreated = function(ev, attribute) {

    // attribute is the newly created instance

    // data only contains the { id:xx }
    var AttributeSet = AD.Model.List['hris.Attributeset'];
    var Object = AD.Model.List['hris.Object'];

    //var externalData = {
    //       id: attribute.attribute_id,
    //        attributeset_id:attribute.attributeset_id,
    //        isActive: ((viewer.viewer_isActive == 1)||(viewer.viewer_isActive == '1'))
    //}

    var attributeSetId = attribute.attributeset_id;
    var attributeColumn = attribute.attribute_column;
    var attributeDataType = attribute.attribute_datatype;

    AttributeSet.findOne({id:attributeSetId}, function(attributeSet){
        Object.findOne({id:attributeSet.object_id}, function(object){

             var sql = 'ALTER TABLE '+AD.Defaults.dbName+'.'+ object.object_table + ' ADD ';
             sql += attributeColumn;
             sql += ' '+ attributeDataType;

             db.runSQL(sql,[], function(err, results, fields){
                 if (err) {
                     console.log(err);
                 }
//               AD.Comm.Notification.publish('hris.'+attributeColumn+'.created', data);
             });

        });
    });
}


//.onUpdated() : is called each time an instance of Attribute.model is created
//Attribute.onUpdated = function (ev, modelInstance) {}


//.onDestroyed() : is called each time an instance of Attribute.model is created
//Attribute.onDestroyed = function (ev, modelInstance) {}


