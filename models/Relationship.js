////
//// Relationship
////
//// This model is the interface to the hris2_relationship table.


(function () {
  // Pull AppDev from the global scope on NodeJS and browser and load the AppDev CommonJS module on Titanium
  var AD = (typeof AppDev === "undefined" ? (typeof global === "undefined" ? require('AppDev') : global.AD) : AppDev);
  var $ = AD.jQuery;

  // On Titanium and NodeJS, the full model definition is needed
  var extendedDefinition = typeof Titanium !== 'undefined' || typeof process !== 'undefined';

  var attr = {
    // Shared model attributes
    _adModule:'hris',
    _adModel:'Relationship',
    id:'relationship_id',
    labelKey:'relationship_type',
    _isMultilingual:false,
    //connectionType:'server', // optional field
    cache:false,
    existing: function(params) {

      var dfd = $.Deferred();

      var found = this.findAll({objA_id: params.objA_id,
                                objB_id: params.objB_id,
                                relationship_type: params.relationship_type});

      $.when(found).then(function(relationships) {
         dfd.resolve((typeof relationships[0] == 'undefined') ? null : relationships[0]);
      });

      return dfd;
    }
  };

  if (extendedDefinition) {
    // Extended model attributes
    AD.jQuery.extend(attr, {
      type:'single',  // 'single' | 'multilingual'
      //            dbName:AD.Defaults.dbName,
      dbTable:'hris2_relationship',
      modelFields: {
        relationship_id:"int(11) unsigned",
        objA_id:"int(11) unsigned",
        objB_id:"int(11) unsigned",
        relationship_type:"varchar(25)"

      },
      primaryKey:'relationship_id'
    });
  }


  var Model = AD.Model.extend("hris.Relationship",
    attr,
    {
      // define instance methods here.
    }
  );

  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    // This is a CommonJS module, so return the model
    module.exports = Model;
  }
})();
